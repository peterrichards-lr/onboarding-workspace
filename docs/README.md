# Onboarding using Liferay Objects and an Object Action

A example of how an onboarding use case, for example customer registration, can be implemented using [Liferay Objects](../client-extensions//customer-onboarding-batch-objects/) and an [Object Action](../client-extensions//customer-onboarding-node/).

This example has been implemented as a customer onboarding process but it could be adapted for other types of onboarding, e.g. supplier onboarding.

## Installation

- For Liferay PaaS, either add the client extension projects to your PaaS repo and let the CI / CD process build and deploy the client extension zip files to the osgi/client-extensions folder or add the client extension zip files to the liferay/configs/common/deploy folder.
- To deploy the Object action, open a shell terminal from the liferay service folder and run `lcp deploy --extension client-extensions/customer-onboarding-node/dist/customer-onboarding-node.zip` and follow the prompts to deploy it to the appropriate PaaS environment.

## Configuration

The majority of the environment variables will be configured correctly based on the values in the [LCP.json](../client-extensions/customer-onboarding-node/LCP.json).

However, there are a few that need to be configured once the OAuth2 profiles have been created through the deployment of the zip files.

- Login to your Liferay instance and obtain the Client ID and Client Secret for the *Customer Onboarding Node OAuth Application Headless Server* profile. These values need to be used when setting **CUSTOMER_ONBOARDING_CLIENT_ID** and **CUSTOMER_ONBOARDING_CLIENT_SECRET** environment variables on the *customeronboardingnode* service.

Assign the *CO01 Registration Reviewer* role to the user who should review the registration.

- In order for you to receive the email notifications, you need to configure the mail settings, see [Liferay Learn](https://learn.liferay.com/w/dxp/system-administration/configuring-liferay/virtual-instances/email-settings) for more information. [mailtrap](https://mailtrap.io) provides a good alternative to a traditional mail server.

If you are testing everything locally, you will need to edit the OAuth2 Profiles and change the Website URL from *ustomeronboardingnode:3001* to *localhost:3001*

## Usage

- Create a form based on the **Customer Registration** object. Do not map the Registration Status field.
- Make sure the Guest role has the Add Object Entry permission.
- Make sure the mail server is setup, to receive the email to set the customer's user password.
- Use the *Test Connectivity* action against the Customer Registration entry to confirm Liferay can communicate with the microservice.
- Use the *Clean Enties* action against the Customer Registration entry to delete the account and other associated entities, so you can rerun the use case with the same customer information.

### Use case

- Within a private / incognito window, complete the customer registration
- Create a from entry.
- Use the notification to view the customer registration entry.
- Change the Registration Status to Pending, Approved or Rejected. Pending is only there to support the idea that offline checks may be necessary.
- Changing the Approved status will trigger the Object Action to create the user account.
- Use the email notifications, to set the user password.
- Login using the new account and show it has all the entities, such as account, organisation, etc.

## License

[MIT](LICENSE)