import config from '../config.js';

const enableDebug = ("true" === config['enableDebug']?.toLowerCase());

function logRequest(req) {
  if (enableDebug) {
    const json = req.body;
    console.debug(`JWT: ${JSON.stringify(req.jwt, null, '\t')}`);
    console.debug(`User ${req.jwt.username} is authorized`);
    console.debug(`User scopes: ${req.jwt.scope}`);
    console.debug(`json: ${JSON.stringify(json, null, '\t')}`);
  }
}

function logObj(...params) {
  if (enableDebug) {
    if (params.length == 0) return;
    else if (params.length == 1)
      console.debug(JSON.stringify(params[0], null, '\t'));
    else if (params.length >= 2) {
      console.debug(params[0], JSON.stringify(params[1], null, '\t'));
    }
  }
}

function logToken(...params) {
  if (enableDebug) {
    const tokenCharCount = 10;
    if (params.length == 0) return;
    else if (params.length == 1) {
      const token = params[0];
      console.debug(
        `${token.substring(0,tokenCharCount + 7)} ... ${token.substring(token.length - tokenCharCount)}`
      );
    } else if (params.length >= 2) {
      const token = params[1];
      console.debug(
        params[0],
        `${token.substring(0, tokenCharCount + 7)} ... ${token.substring(token.length - tokenCharCount)}`
      );
    }
  }
}

function debug(...params) {
  if (enableDebug) console.debug(params);
}

function info(...params) {
  console.info(params);
}

function error(...params) {
  console.info(params);
}

export const logger = {
  logRequest,
  logObj,
  logToken,
  debug,
  info,
  error,
};
