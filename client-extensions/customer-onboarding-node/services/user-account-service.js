import { _get, _post, _delete } from '../util/liferayHeadlessHelper.js';
import { logger } from '../util/logger.js';
import config from '../util//configTreePath.js';

const domains = config['com.liferay.lxc.dxp.domains'];

const lxcDXPMainDomain = config['com.liferay.lxc.dxp.mainDomain'];
const lxcDXPServerProtocol = config['com.liferay.lxc.dxp.server.protocol'];

const liferayEndpoint = `${lxcDXPServerProtocol}://${lxcDXPMainDomain}`;
const headlessAdminUserEndpoint = 'o/headless-admin-user/v1.0';

async function doesUserAccountExist(emailAddress, bearerToken) {
  const url = encodeURI(
    `${liferayEndpoint}/${headlessAdminUserEndpoint}/user-accounts/by-email-address/${emailAddress}`
  );

  try {
    const userAccount = await _get(url, bearerToken);
    const { status } = userAccount;

    return status?.toLowerCase() === 'active';
  } catch (error) {
    return false;
  }
}

async function getUserAccountByEmailAddress(emailAddress, bearerToken) {
  const url = encodeURI(
    `${liferayEndpoint}/${headlessAdminUserEndpoint}/user-accounts/by-email-address/${emailAddress}`
  );

  try {
    return await _get(url, bearerToken);
  } catch (error) {
    error = error instanceof Promise ? await error : error;
    logger.logObj('Unable to get user account', error);
    return undefined;
  }
}

function generateAlternativeName(length) {
  let name = '';
  const characters = 'abcdefghijklmnopqrstuvwxyz';
  const charactersLength = characters.length;
  let counter = 0;
  while (counter < length) {
    name += characters.charAt(Math.floor(Math.random() * charactersLength));
    counter += 1;
  }
  return name;
}

async function createUserAccount(
  emailAddress,
  title,
  otherTitle,
  forename,
  surname,
  jobTitle,
  bearerToken,
  autoGenerateAlternativeName = false,
  accountBriefs = [],
  organizationBriefs = [],
  siteBriefs = [],
  userGroupBriefs = []
) {
  const url = encodeURI(
    `${liferayEndpoint}/${headlessAdminUserEndpoint}/user-accounts`
  );

  title = title?.toLowerCase() === 'other' ? otherTitle : title;
  forename = forename?.trim();
  surname = surname?.trim();
  emailAddress = emailAddress?.trim();
  jobTitle = jobTitle?.trim();

  const alternateName = autoGenerateAlternativeName
    ? generateAlternativeName(10)
    : `${forename?.toLowerCase()}.${surname?.toLowerCase()}`;

  const userAccount = {
    honorificPrefix: title,
    givenName: forename,
    familyName: surname,
    emailAddress: emailAddress,
    jobTitle: jobTitle,
    alternateName,
    accountBriefs,
    organizationBriefs,
    siteBriefs,
    userGroupBriefs,
  };

  try {
    return await _post(url, userAccount, bearerToken);
  } catch (error) {
    error = error instanceof Promise ? await error : error;
    logger.logObj('Unable to create user account', error);
    return undefined;
  }
}

async function deleteUserAccount(userId, bearerToken) {
  const url = encodeURI(
    `${liferayEndpoint}/${headlessAdminUserEndpoint}/user-accounts/${userId}`
  );

  try {
    return await _delete(url, undefined, bearerToken);
  } catch (error) {
    error = error instanceof Promise ? await error : error;
    logger.logObj('Unable to delete user account', error);
    return undefined;
  }
}

async function getMyUserAccount(bearerToken) {
  const url = encodeURI(
    `${liferayEndpoint}/${headlessAdminUserEndpoint}/my-user-account`
  );

  try {
    return await _get(url, bearerToken);
  } catch (error) {
    error = error instanceof Promise ? await error : error;
    logger.logObj('Unable to get my user account', error);
    return undefined;
  }
}

export {
  doesUserAccountExist,
  getUserAccountByEmailAddress,
  createUserAccount,
  deleteUserAccount,
  getMyUserAccount,
};
