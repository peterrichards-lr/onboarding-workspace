import { _patch } from '../util/liferayHeadlessHelper.js';
import { logger } from '../util/logger.js';
import config from '../util//configTreePath.js';

const domains = config['com.liferay.lxc.dxp.domains'];

const lxcDXPMainDomain = config['com.liferay.lxc.dxp.mainDomain'];
const lxcDXPServerProtocol = config['com.liferay.lxc.dxp.server.protocol'];

const liferayEndpoint = `${lxcDXPServerProtocol}://${lxcDXPMainDomain}`;
const headlessCustomerRegistrationsEndpoint = 'o/c/co01customerregistrations';

export async function updateRegistrationStatus(customerRegistratonId, success, bearerToken) {
   const url = encodeURI(
      `${liferayEndpoint}/${headlessCustomerRegistrationsEndpoint}/${customerRegistratonId}`
    );

    const registration = {
      "registrationStatus": success ? "successful" : "unsuccessful"
    }

    try {
      return await _patch(url, registration, bearerToken);
    } catch (error) {
      error = error instanceof Promise ? await error : error;
      logger.logObj('Unable to patch the customer registration', error);
      return undefined;
    }
}