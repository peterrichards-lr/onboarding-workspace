import { _get, _post, _delete } from '../util/liferayHeadlessHelper.js';
import { logger } from '../util/logger.js';
import config from '../util//configTreePath.js';

const domains = config['com.liferay.lxc.dxp.domains'];

const lxcDXPMainDomain = config['com.liferay.lxc.dxp.mainDomain'];
const lxcDXPServerProtocol = config['com.liferay.lxc.dxp.server.protocol'];

const liferayEndpoint = `${lxcDXPServerProtocol}://${lxcDXPMainDomain}`;
const headlessAdminUserEndpoint = 'o/headless-admin-user/v1.0';

async function doesUserGroupExist(accountName, bearerToken) {
  const url = encodeURI(
    `${liferayEndpoint}/${headlessAdminUserEndpoint}/user-groups?filter=name eq '${accountName}'`
  );

  try {
    const paginationResponse = await _get(url, bearerToken);
    const { totalCount } = paginationResponse;

    if (totalCount === 0) return false;
    if (totalCount === 1) return true;
    if (totalCount > 1) throw new Error(`Unexpected row count: ${totalCount}`); // This should not happen
  } catch (error) {
    error = error instanceof Promise ? await error : error;
    logger.logObj('Unable to determine if user group exists', error);
    return false;
  }
}

async function getUserGroupByName(accountName, bearerToken) {
  const url = encodeURI(
    `${liferayEndpoint}/${headlessAdminUserEndpoint}/user-groups?filter=name eq '${accountName}'`
  );

  try {
    const paginationResponse = await _get(url, bearerToken);
    const { totalCount, items } = paginationResponse;

    if (totalCount === 0) return undefined;
    if (totalCount === 1) return items[0];
    if (totalCount > 1) throw new Error(`Unexpected row count: ${totalCount}`); // This should not happen
  } catch (error) {
    error = error instanceof Promise ? await error : error;
    logger.logObj('Unable to get user group', error);
    return undefined;
  }
}

async function createUserGroup(name, bearerToken) {
  const url = encodeURI(
    `${liferayEndpoint}/${headlessAdminUserEndpoint}/user-groups`
  );

  const userGroup = {
    name,
  };

  try {
    return await _post(url, userGroup, bearerToken);
  } catch (error) {
    error = error instanceof Promise ? await error : error;
    logger.logObj('Unable to creae user group', error);
    return undefined;
  }
}

async function assignUserToUserGroup(userGroupId, userId, bearerToken) {
  const url = encodeURI(
    `${liferayEndpoint}/${headlessAdminUserEndpoint}/user-groups/${userGroupId}/user-group-users`
  );

  const userGroupUsers = [userId];

  try {
    return await _post(url, userGroupUsers, bearerToken);
  } catch (error) {
    error = error instanceof Promise ? await error : error;
    logger.logObj('Unable to assign user to user group', error);
    return undefined;
  }
}

async function deleteUserGroupBatch(userGroupIds, bearerToken, cb) {
  const url = encodeURI(
    `${liferayEndpoint}/${headlessAdminUserEndpoint}/user-groups/batch${cb ? '?callbackURL=' + cb : ''}`
  );

  const userGroupBatch = userGroupIds.map((id) => ({
    id: `${id}`,
  }));

  logger.logObj('userGroupBatch', userGroupBatch);

  try {
    return await _delete(url, userGroupBatch, bearerToken);
  } catch (error) {
    error = error instanceof Promise ? await error : error;
    logger.logObj('Unable to delete user group batch', error);
    return undefined;
  }
}

export {
  doesUserGroupExist,
  getUserGroupByName,
  createUserGroup,
  assignUserToUserGroup,
  deleteUserGroupBatch,
};
