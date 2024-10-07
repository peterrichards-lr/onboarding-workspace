import { _delete, _get, _post } from '../util/liferayHeadlessHelper.js';
import { logger } from '../util/logger.js';
import config from '../util/configTreePath.js';

const domains = config['com.liferay.lxc.dxp.domains'];

const lxcDXPMainDomain = config['com.liferay.lxc.dxp.mainDomain'];
const lxcDXPServerProtocol = config['com.liferay.lxc.dxp.server.protocol'];

const liferayEndpoint = `${lxcDXPServerProtocol}://${lxcDXPMainDomain}`;
const headlessAdminUserEndpoint = 'o/headless-admin-user/v1.0';

async function doesOrganizationExist(organizationName, bearerToken) {
  const url = encodeURI(
    `${liferayEndpoint}/${headlessAdminUserEndpoint}/organizations?filter=name eq '${organizationName}'`
  );

  try {
    const paginationResponse = await _get(url, bearerToken);
    const { totalCount } = paginationResponse;

    if (totalCount === 0) return false;
    if (totalCount === 1) return true;
    if (totalCount > 1) throw new Error(`Unexpected row count: ${totalCount}`); // This should not happen
  } catch (error) {
    error = error instanceof Promise ? await error : error;
    logger.logObj('Unable to determine if organization exists', error);
    return false;
  }
}

async function getOrganizationByName(organizationName, bearerToken) {
  const url = encodeURI(
    `${liferayEndpoint}/${headlessAdminUserEndpoint}/organizations?filter=name eq '${organizationName}'`
  );

  try {
    const paginationResponse = await _get(url, bearerToken);
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

async function assignUserToOrganization(organizationId, emailAddress, bearerToken) {
  const url = encodeURI(
    `${liferayEndpoint}/${headlessAdminUserEndpoint}/organizations/${organizationId}/user-accounts/by-email-address/${emailAddress}`
  );

  const body = {
  }

  try {
    return await _post(url, body, bearerToken);
  } catch (error) {
    error = error instanceof Promise ? await error : error;
    logger.logObj('Unable to assign user to organization', error);
    return undefined;
  }
}

async function createOrganization(name, bearerToken) {
  const url = encodeURI(
    `${liferayEndpoint}/${headlessAdminUserEndpoint}/organizations`
  );

  const organzation = {
    name,
  }

  try {
    return await _post(url, organzation, bearerToken);
  } catch (error) {
    error = error instanceof Promise ? await error : error;
    logger.logObj('Unable to create organization', error);
    return undefined;
  }
}

async function deleteOrganizationAccounts(organizationId, accounts, bearerToken) {
  const url = encodeURI(
    `${liferayEndpoint}/${headlessAdminUserEndpoint}/organizations/${organizationId}/accounts`
  );

  try {
    return await _delete(url, accounts, bearerToken);
  } catch (error) {
    error = error instanceof Promise ? await error : error;
    logger.logObj('Unable to delete organization accounts', error);
    return undefined;
  }
}

async function deleteOrganization(organizationId, bearerToken) {
  const url = encodeURI(
    `${liferayEndpoint}/${headlessAdminUserEndpoint}/organizations/${organizationId}/accounts`
  );

  try {
    return await _delete(url, undefined, bearerToken);
  } catch (error) {
    error = error instanceof Promise ? await error : error;
    logger.logObj('Unable to delete organization', error);
    return undefined;
  }
}


async function deleteOrganizationBatch(organizationIds, bearerToken, cb) {
  const url = encodeURI(
    `${liferayEndpoint}/${headlessAdminUserEndpoint}/organizations/batch${cb ? '?callbackURL=' + cb : ''}`
  );

  const organizationBatch = organizationIds.map((id) => (
    {
      id: `${id}`
    }
  ));

  logger.logObj('organizationBatch', organizationBatch);

  try {
    return await _delete(url, organizationBatch, bearerToken);
  } catch (error) {
    error = error instanceof Promise ? await error : error;
    logger.logObj('Unable to delete organization batch', error);
    return undefined;
  }
}

export { doesOrganizationExist, getOrganizationByName, createOrganization, assignUserToOrganization, deleteOrganizationAccounts, deleteOrganization, deleteOrganizationBatch };
