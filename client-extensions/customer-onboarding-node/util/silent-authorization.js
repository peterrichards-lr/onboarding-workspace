import config from './configTreePath.js';
import { logger } from '../util/logger.js';
import cache from 'memory-cache';
import fetch from 'node-fetch';

const applicationExternalReferenceCode =
  'customer-onboarding-node-oauth-application-headless-server';

const lxcDXPMainDomain = config['com.liferay.lxc.dxp.mainDomain'];
const lxcDXPServerProtocol = config['com.liferay.lxc.dxp.server.protocol'];
const tokenUri = config[`${applicationExternalReferenceCode}.oauth2.token.uri`];

const clientId =
  config[
    `${applicationExternalReferenceCode}.oauth2.headless.server.client.id`
  ];
const clientSecret =
  config[
    `${applicationExternalReferenceCode}.oauth2.headless.server.client.secret`
  ];

const tokenEndpoint = `${lxcDXPServerProtocol}://${lxcDXPMainDomain}${tokenUri}`;

export async function getServerToken(cacheKey = 'server_token') {
  const cachedData = cache.get(cacheKey);

  if (cachedData) return cachedData;

  const params = new URLSearchParams({
    client_id: clientId,
    client_secret: clientSecret,
    grant_type: 'client_credentials',
  });

  const config = {
    method: 'POST',
    body: params,
  };

  const response = await fetch(tokenEndpoint, config).then((response) => {
    if (response.ok) {
      if (response.status === 204) return undefined;
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

  const token = response.access_token;
  const expires_in = response.expires_in;

  cache.put(
    cacheKey,
    token,
    (parseInt(expires_in, 10) - 5) * 1000
  );

  return token;
}
