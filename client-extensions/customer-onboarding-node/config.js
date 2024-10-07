/**
 * SPDX-FileCopyrightText: (c) 2000 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

export default {
	'configTreePaths': [
		process.env.LIFERAY_ROUTES_CLIENT_EXTENSION,
		process.env.LIFERAY_ROUTES_DXP,
	],
	'customer-onboarding-node-oauth-application-headless-server.oauth2.redirect.uris': "/o/oauth2/redirect",
	'customer-onboarding-node-oauth-application-headless-server.oauth2.headless.server.client.secret': process.env.CUSTOMER_ONBOARDING_CLIENT_SECRET,
	'customer-onboarding-node-oauth-application-headless-server.oauth2.headless.server.audience': process.env.CUSTOMER_ONBOARDING_AUDIENCE,
	'customer-onboarding-node-oauth-application-headless-server.oauth2.authorization.uri': '/o/oauth2/authorize',
	'customer-onboarding-node-oauth-application-headless-server.oauth2.headless.server.client.id': process.env.CUSTOMER_ONBOARDING_CLIENT_ID,
	'customer-onboarding-node-oauth-application-headless-server.oauth2.jwks.uri': '/o/oauth2/jwks',
	'customer-onboarding-node-oauth-application-headless-server.oauth2.headless.server.scopes': 'c_customerregistration.everything\nLiferay.Headless.Admin.Workflow.everything\nLiferay.Headless.Admin.User.everything.read',
	'customer-onboarding-node-oauth-application-headless-server.oauth2.token.uri': '/o/oauth2/token',
	'customer-onboarding-node-oauth-application-headless-server.oauth2.introspection.uri': '/o/oauth2/introspect',
	'com.liferay.lxc.dxp.domains': process.env.COM_LIFERAY_LXC_DXP_DOMAINS,
	'com.liferay.lxc.dxp.mainDomain': process.env.COM_LIFERAY_LXC_DXP_MAIN_DOMAIN,
	'com.liferay.lxc.dxp.server.protocol': process.env.COM_LIFERAY_LXC_DXP_SERVER_PROTOCOL,
	'unsuccessfulEmailAddresses': process.env.UNSUCCESSFUL_EMAIL_ADDRESSES,
	'configTreePath': '/etc/liferay/lxc',
	'liferay.oauth.application.external.reference.codes':
		'customer-onboarding-node-oauth-application-user-agent,customer-onboarding-node-oauth-application-headless-server',
	'readyPath': '/ready',
	'server.port': 3001,
	'enableDebug': process.env.ENABLE_DEBUG,
	'continueOnExists': process.env.CONTINUE_ON_EXISTS
};