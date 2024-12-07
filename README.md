# Forge Hello World

This project contains a Forge app written in Javascript that displays `Hello World!` in a Jira issue panel.

See [developer.atlassian.com/platform/forge/](https://developer.atlassian.com/platform/forge) for documentation and tutorials explaining Forge.

## Requirements

See [Set up Forge](https://developer.atlassian.com/platform/forge/set-up-forge/) for instructions to get set up.

## Quick start

- Modify your app frontend by editing the `src/frontend/index.jsx` file.

- Modify your app backend by editing the `src/resolvers/index.js` file to define resolver functions. See [Forge resolvers](https://developer.atlassian.com/platform/forge/runtime-reference/custom-ui-resolver/) for documentation on resolver functions.

- Build and deploy your app by running:

```shell
forge lint --fix
forge deploy

## Webhook Feature

This app now supports listening to Jira issue webhook events, allowing it to respond in real-time to changes in Jira issues. This feature enables automated workflows, notifications, and enhanced interactivity for users.

### Configuration

1. **Webhook Subscription**: The app is configured to subscribe to Jira webhook events such as issue creation, updates, and deletions. This is set up in the `manifest.yml` file.

2. **Event Handlers**: Event handlers are implemented in the `src/webhookHandlers.js` file. These handlers parse the event payloads and execute corresponding actions.

3. **Permissions**: Ensure that the app has the necessary permissions by checking the `manifest.yml` file. The required scopes include `read:jira-work` and `manage:jira-webhook`.

### Testing

```

- Install your app in an Atlassian site by running:

```shell
forge install --upgrade
```

- Develop your app by running `forge tunnel` to proxy invocations locally:

```shell
forge tunnel
```

### Notes

- Use the `forge deploy` command when you want to persist code changes.
- Use the `forge install` command when you want to install the app on a new site.
- Once the app is installed on a site, the site picks up the new app changes you deploy without needing to rerun the install command.

## Support

See [Get help](https://developer.atlassian.com/platform/forge/get-help/) for how to get help and provide feedback.
