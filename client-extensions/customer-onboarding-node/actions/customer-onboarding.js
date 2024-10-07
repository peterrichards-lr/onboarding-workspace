import express from 'express';
import { logger } from '../util/logger.js';
import {
  doesUserAccountExist,
  createUserAccount,
} from '../services/user-account-service.js';
import {
  doesAccountExist,
  createAccount,
  getAccountByName,
  getAccountRoleByName,
  assignUserToAccount,
  assignOrganizationToAccount,
  assignAccountRoleToUser,
} from '../services/account-services.js';
import {
  doesOrganizationExist,
  createOrganization,
  getOrganizationByName,
  assignUserToOrganization,
} from '../services/organization-service.js';
import {
  createUserGroup,
  doesUserGroupExist,
  getUserGroupByName,
  assignUserToUserGroup,
} from '../services/user-group-service.js';
import { updateRegistrationStatus } from '../services/customer-registration-service.js';
import { getServerToken } from '../util/silent-authorization.js';
import config from '../config.js';

const router = express.Router();

const continueOnExists = 'true' === config['continueOnExists']?.toLowerCase();
const unsuccessfulEmailAddresses =
  config['unsuccessfulEmailAddresses']
    ?.split(',')
    .map((emailAddress) => emailAddress?.trim()) || [];

async function retrieveOrCreateAccount(companyName, bearerToken) {
  const exists = await doesAccountExist(companyName, bearerToken);
  if (exists) {
    const msg = `${companyName} account exists`;
    logger.info(msg);

    if (!continueOnExists) throw new Error(msg);
  }

  const account = exists
    ? await getAccountByName(companyName, bearerToken)
    : await createAccount(companyName, bearerToken);
  logger.logObj('account', account);

  return {
    created: !exists,
    account,
  };
}

async function retrieveOrCreateOrganization(companyName, bearerToken) {
  const exists = await doesOrganizationExist(companyName, bearerToken);
  if (exists) {
    const msg = `${companyName} organization exists`;
    logger.info(msg);

    if (!continueOnExists) throw new Error(msg);
  }

  const organization = exists
    ? await getOrganizationByName(companyName, bearerToken)
    : await createOrganization(companyName, bearerToken);
  logger.logObj('organization', organization);

  return {
    created: !exists,
    organization,
  };
}

async function retrieveOrCreateUserGroup(companyName, bearerToken) {
  const exists = await doesUserGroupExist(companyName, bearerToken);
  if (exists) {
    const msg = `${companyName} user group exists`;
    logger.info(msg);

    if (!continueOnExists) throw new Error(msg);
  }

  const userGroup = exists
    ? await getUserGroupByName(companyName, bearerToken)
    : await createUserGroup(companyName, bearerToken);
  logger.logObj('userGroup', userGroup);

  return {
    created: !exists,
    userGroup,
  };
}

async function createUser(
  emailAddress,
  titlePrefix,
  otherTitle,
  forename,
  surname,
  jobTitle,
  bearerToken
) {
  const exists = await doesUserAccountExist(emailAddress, bearerToken);
  if (exists) {
    const msg = `User with ${emailAddress} exists`;
    logger.info(msg);

    if (!continueOnExists) throw new Error(msg);
  }

  let user = undefined;
  if (exists === false) {
    user = await createUserAccount(
      emailAddress,
      titlePrefix,
      otherTitle,
      forename,
      surname,
      jobTitle,
      bearerToken,
      false
    );
    logger.logObj('user', user);
  }
  return user;
}

async function addUserToAccount(
  accountId,
  userId,
  userEmailAddress,
  accountRoleName,
  bearerToken
) {
  const accontRole = await getAccountRoleByName(
    accountId,
    accountRoleName,
    bearerToken
  );
  logger.logObj('accountRole', accontRole);
  const accountRoleId = accontRole.id;

  if (accountRoleId > 0) {
    await assignAccountRoleToUser(
      accountId,
      accountRoleId,
      userId,
      bearerToken
    );
  }

  await assignUserToAccount(accountId, userEmailAddress, bearerToken);
}

router.post('/', async (req, res) => {
  logger.logRequest(req);
  const json = req.body;
  const { objectEntryId } = json.objectEntry;

  let headlessServerToken;
  try {
    headlessServerToken = `Bearer ${await getServerToken()}`;
  } catch (error) {
    res.status(501).send(error);
  }

  try {
    logger.logToken('Headless server token', headlessServerToken);

    const values = json.objectEntry.values;
    const { emailAddress, companyName } = values;

    if (unsuccessfulEmailAddresses.indexOf(emailAddress) >= 0)
      throw new Error(`${emailAddress} is in the unsuccessful list`);

    // Create Entities
    const accountOutcome = await retrieveOrCreateAccount(
      companyName,
      headlessServerToken
    );

    const organizationOutcome = await retrieveOrCreateOrganization(
      companyName,
      headlessServerToken
    );
    const userGroupOutcome = await retrieveOrCreateUserGroup(
      companyName,
      headlessServerToken
    );

    const accountId = accountOutcome?.account?.id;
    const organizationId = organizationOutcome?.organization?.id;
    const userGroupId = userGroupOutcome?.userGroup?.id;

    logger.debug('accountId', accountId);
    logger.debug('OorganizationId', organizationId);
    logger.debug('userGroupId', userGroupId);

    const { titlePrefix, otherTitle, forename, surname, jobTitle } = values;
    const user = await createUser(
      emailAddress,
      titlePrefix,
      otherTitle,
      forename,
      surname,
      jobTitle,
      headlessServerToken
    );

    // Link entities
    if (user) {
      const userId = user.id;
      logger.debug('userId', userId);

      const { jobRole } = values;
      await addUserToAccount(
        accountId,
        userId,
        emailAddress,
        jobRole,
        headlessServerToken
      );

      await assignUserToOrganization(
        organizationId,
        emailAddress,
        headlessServerToken
      );

      await assignUserToUserGroup(userGroupId, userId, headlessServerToken);

      // Do not create the association unless one of the entities is new
      if (accountOutcome.created || organizationOutcome.created) {
        await assignOrganizationToAccount(
          accountId,
          organizationId,
          headlessServerToken
        );
      }
    } else {
      new Error(`Failed to create user account for ${emailAddress}`);
    }

    await updateRegistrationStatus(objectEntryId, true, headlessServerToken);
    logger.info('Successfully created entities');
    
    res.status(200).send(json);
  } catch (error) {
    logger.error(`Unexpected error: ${error}`);
    await updateRegistrationStatus(objectEntryId, false, headlessServerToken);
    res.status(500).send(error);
  }
});

export default router;
