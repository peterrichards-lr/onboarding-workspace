import fetch from 'node-fetch';
import { logger } from '../util/logger.js';

async function _get(url, bearerToken) {
  const config = {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      Authorization: bearerToken,
    },
  };

  return fetch(url, config).then((response) => {
    if (response.ok) {
      return response.json();
    }
    if (response.status === 404) {
      return Promise.reject(response.json());
    }
    logger.error(
      `Unexpected response: ${JSON.stringify(response, null, '\t')}`
    );
    return Promise.reject(response.json());
  });
}

async function _post(url, body, bearerToken) {
  const config = {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: bearerToken,
    },
    body: JSON.stringify(body)
  };

  return fetch(url, config).then((response) => {
    if (response.ok) {
      if (response.status === 204)
        return undefined;
      return response.json();
    }
    logger.debug(`response status: ${response.status}`);
    if (response.status === 404) {
      return Promise.reject();
    }
    logger.error(
      `Unexpected response: ${JSON.stringify(response, null, '\t')}`
    );
    return Promise.reject();
  });
}

async function _patch(url, body, bearerToken) {
  const config = {
    method: 'PATCH',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: bearerToken,
    },
    body: JSON.stringify(body)
  };

  return fetch(url, config).then((response) => {
    if (response.ok) {
      if (response.status === 204)
        return undefined;
      return response.json();
    }
    logger.debug(`response status: ${response.status}`);
    if (response.status === 404) {
      return Promise.reject(response.json());
    }
    logger.error(
      `Unexpected response: ${JSON.stringify(response, null, '\t')}`
    );
    return Promise.reject(response.json());
  });
}

async function _delete(url, body, bearerToken) {
  const config = {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      Authorization: bearerToken,
    },
    body: JSON.stringify(body)
  };

  return fetch(url, config).then((response) => {
    if (response.ok) {
      if (response.status === 204)
        return undefined;
      return response.json();
    }
    logger.debug(`response status: ${response.status}`);
    if (response.status === 404) {
      return Promise.reject(response.json());
    }
    logger.error(
      `Unexpected response: ${JSON.stringify(response, null, '\t')}`
    );
    return Promise.reject(response.json());
  });
}

export { _get, _post, _patch, _delete };
