import express from 'express';
import { logger } from '../util/logger.js';
import { getServerToken } from '../util/silent-authorization.js';

import {
  deleteUserAccount,
  getUserAccountByEmailAddress,
} from '../services/user-account-service.js';
import { deleteOrganizationBatch } from '../services/organization-service.js';
import { deleteAccountBatch } from '../services/account-services.js';
import { deleteUserGroupBatch } from '../services/user-group-service.js';

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    logger.logRequest(req);
    const json = req.body;

    const headlessServerToken = `Bearer ${await getServerToken()}`;
    logger.logToken('Headless server token', headlessServerToken);

    const values = json.objectEntry.values;
    const { emailAddress } = values;

    logger.debug('Email address', emailAddress);
    const user = await getUserAccountByEmailAddress(
      emailAddress,
      headlessServerToken
    );
    logger.logObj('user', user);

    if (user) {
      logger.info(`Deleting ${user.id} [${emailAddress}]`);

      await deleteUserAccount(user.id, headlessServerToken);

      const { accountBriefs, organizationBriefs, userGroupBriefs } = user;

      logger.logObj('accountBriefs', accountBriefs);
      logger.logObj('organizationBriefs', organizationBriefs);
      logger.logObj('userGroupBriefs', userGroupBriefs);

      const accountIds = accountBriefs.map((a) => a.id);
      const organizationIds = organizationBriefs.map((o) => o.id);
      // The user group briefs contain the wrong ID, this will be raised as a bug. However, the right ID is normally the number prior to the ID.
      const userGroupIds = userGroupBriefs.map((ug) => ug.id - 1);

      logger.logObj('accountIds', accountIds);
      logger.logObj('organizationIds', organizationIds);
      logger.logObj('userGroupIds', userGroupIds);

      if (accountIds.length > 0)
        await deleteAccountBatch(accountIds, headlessServerToken);
      if (organizationIds.length > 0)
        await deleteOrganizationBatch(organizationIds, headlessServerToken);
      if (userGroupIds.length > 0)
        await deleteUserGroupBatch(userGroupIds, headlessServerToken);

      logger.info('Successfully cleaned entities');

      res.status(200).send(json);
    } else {
      logger.info(`No user found with ${emailAddress}`)
      res.status(404).send(json);
    }
  } catch (error) {
    logger.error(`Unexpected error: ${error}`);
    res.status(500).send(error);
  }
});

export default router;
