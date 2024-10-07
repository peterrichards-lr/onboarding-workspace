/**
 * SPDX-FileCopyrightText: (c) 2000 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import express from 'express';

import config from './util/configTreePath.js';
import {
	corsWithReady,
	liferayJWT,
} from './util/liferay-oauth2-resource-server.js';
import {logger} from './util/logger.js';
import customerOnboardingActions from './actions/customer-onboarding.js';
import customerCleanupActions from './actions/customer-cleanup.js';
import connectivityTest from './actions/connectivity-test.js';

const serverPort = config['server.port'];
const app = express();

logger.logObj('config', config);

app.use(express.json());
app.use(corsWithReady);
app.use(liferayJWT);

app.get(config.readyPath, (req, res) => {
	res.send('READY');
});

app.use('/customer-onboarding', customerOnboardingActions);
app.use('/customer-cleanup', customerCleanupActions);
app.use('/connectivity-test', connectivityTest);

app.listen(serverPort, () => {
	logger.info(`App listening on ${serverPort}`);
});

export default app;