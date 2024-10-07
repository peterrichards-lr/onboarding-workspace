import { _get, _post, _delete } from '../util/liferayHeadlessHelper.js';
import { logger } from '../util/logger.js';
import config from '../util//configTreePath.js';

const domains = config['com.liferay.lxc.dxp.domains'];

const lxcDXPMainDomain = config['com.liferay.lxc.dxp.mainDomain'];
const lxcDXPServerProtocol = config['com.liferay.lxc.dxp.server.protocol'];

const liferayEndpoint = `${lxcDXPServerProtocol}://${lxcDXPMainDomain}`;
const headlessAdminUserEndpoint = 'o/headless-admin-user/v1.0';

async function doesAccountExist(accountName, bearerToken) {
  const url = encodeURI(
    `${liferayEndpoint}/${headlessAdminUserEndpoint}/accounts?filter=name eq '${accountName}'`
  );

  try {
    const paginationResponse = await _get(url, bearerToken);
    const { totalCount } = paginationResponse;

    if (totalCount === 0) return false;
    if (totalCount === 1) return true;
    if (totalCount > 1) throw new Error(`Unexpected row count: ${totalCount}`); // This should not happen
  } catch (error) {
    error = error instanceof Promise ? await error : error;
    logger.logObj('Unable to determine if account exists', error);
    return false;
  }
}

async function getAccountRoleByName(accountId, roleName, bearerToken) {
  const url = encodeURI(
    `${liferayEndpoint}/${headlessAdminUserEndpoint}/accounts/${accountId}/account-roles?filter=name eq '${roleName}'`
  );

  try {
    const paginationResponse = await _get(url, bearerToken);
    const { totalCount, items } = paginationResponse;

    if (totalCount === 0) return undefined;
    if (totalCount === 1) return items[0];
    if (totalCount > 1) throw new Error(`Unexpected row count: ${totalCount}`); // This should not happen
  } catch (error) {
    error = error instanceof Promise ? await error : error;
    logger.logObj('Unable to get account role', error);
    return undefined;
  }
}

async function createAccount(name, bearerToken) {
  const url = encodeURI(
    `${liferayEndpoint}/${headlessAdminUserEndpoint}/accounts`
  );

  const account = {
    name,
  };

  try {
    return await _post(url, account, bearerToken);
  } catch (error) {
    error = error instanceof Promise ? await error : error;
    logger.logObj('Unable to create account', error);
    return undefined;
  }
}

async function getAccountByName(accountName, bearerToken) {
  const url = encodeURI(
    `${liferayEndpoint}/${headlessAdminUserEndpoint}/accounts?filter=name eq '${accountName}'`
  );

  try {
    const paginationResponse = await get(url, bearerToken);
    const { totalCount, items } = paginationResponse;

    if (totalCount === 0) return undefined;
    if (totalCount === 1) return items[0];
    if (totalCount > 1) throw new Error(`Unexpected row count: ${totalCount}`); // This should not happen
  } catch (error) {
    error = error instanceof Promise ? await error : error;
    logger.logObj('Unable to get account', error);
    return undefined;
  }
}

async function assignAccountRoleToUser(
  accountId,
  accountRoleId,
  userId,
  bearerToken
) {
  const url = encodeURI(
    `${liferayEndpoint}/${headlessAdminUserEndpoint}/accounts/${accountId}/account-roles/${accountRoleId}/user-accounts/${userId}`
  );

  const body = {};

  try {
    return await _post(url, body, bearerToken);
  } catch (error) {
    error = error instanceof Promise ? await error : error;
    logger.logObj('Unable to assign account role to user', error);
    return undefined;
  }
}

async function assignUserToAccount(accountId, emailAddress, bearerToken) {
  const url = encodeURI(
    `${liferayEndpoint}/${headlessAdminUserEndpoint}/accounts/${accountId}/user-accounts/by-email-address/${emailAddress}`
  );

  const body = {};

  try {
    return await _post(url, body, bearerToken);
  } catch (error) {
    error = error instanceof Promise ? await error : error;
    logger.logObj('Unable to assign user to account', error);
    return undefined;
  }
}

async function assignOrganizationToAccount(
  accountId,
  organizationId,
  bearerToken
) {
  const url = encodeURI(
    `${liferayEndpoint}/${headlessAdminUserEndpoint}/accounts/${accountId}/organizations/${organizationId}`
  );

  const body = {};

  try {
    return await _post(url, body, bearerToken);
  } catch (error) {
    error = error instanceof Promise ? await error : error;
    logger.logObj('Unable to assign organization to account', error);
    return undefined;
  }
}

async function deleteAccount(accountId, bearerToken) {
  const url = encodeURI(
    `${liferayEndpoint}/${headlessAdminUserEndpoint}/accounts/${accountId}`
  );

  try {
    return await _delete(url, undefined, bearerToken);
  } catch (error) {
    error = error instanceof Promise ? await error : error;
    logger.logObj('Unable to delete account', error);
    return undefined;
  }
}

async function deleteAccountBatch(accountIds, bearerToken, cb) {
  const url = encodeURI(
    `${liferayEndpoint}/${headlessAdminUserEndpoint}/accounts/batch${cb ? '?callbackURL=' + cb : ''}`
  );

  const accountsBatch = accountIds.map((id) => (
    {
      id: `${id}`
    }
  ));

  logger.logObj('accountsBatch:', accountsBatch);

  try {
    return await _delete(url, accountsBatch, bearerToken);
  } catch (error) {
    error = error instanceof Promise ? await error : error;
    logger.logObj('Unable to delete account batch', error);
    return undefined;
  }
}

export {
  doesAccountExist,
  getAccountByName,
  createAccount,
  getAccountRoleByName,
  assignAccountRoleToUser,
  assignUserToAccount,
  assignOrganizationToAccount,
  deleteAccount,
  deleteAccountBatch
};
