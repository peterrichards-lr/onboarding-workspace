import express from 'express';
import { logger } from '../util/logger.js';
import { getServerToken } from '../util/silent-authorization.js';
import { getMyUserAccount } from '../services/user-account-service.js';

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    logger.logRequest(req);
    const json = req.body;

    let myUserAccount;

    const userAgentToken = req.headers.authorization;
    logger.logToken('User agent token', userAgentToken);
    myUserAccount = await getMyUserAccount(userAgentToken);
    logger.logObj('myUserAccount (user agent)', myUserAccount);

    const headlessServerToken = `Bearer ${await getServerToken()}`;
    logger.logToken('Headless server token', headlessServerToken);
    myUserAccount = await getMyUserAccount(headlessServerToken);
    logger.logObj('myUserAccount (headless server)', myUserAccount);

    logger.info('Successfully connected');

    res.status(200).send(json);
  } catch (error) {
    logger.error(`Unexpected error: ${error}`);
    res.status(500).send(error);
  }
});

export default router;
