# Forge Hello World

See [developer.atlassian.com/platform/forge/](https://developer.atlassian.com/platform/forge) for documentation and tutorials explaining Forge.

## Requirements

See [Set up Forge](https://developer.atlassian.com/platform/forge/set-up-forge/) for instructions to get set up.

## Quick start

- Modify your app frontend by editing the `src/frontend/index.jsx` file.

- Modify your app backend by editing the `src/resolvers/index.js` file to define resolver functions. See [Forge resolvers](https://developer.atlassian.com/platform/forge/runtime-reference/custom-ui-resolver/) for documentation on resolver functions.

In summary, you can run this command to deploy and install the app in the first terminal:

```shell
forge lint --fix -e development
forge deploy -e development
forge install -e development -s gitauto.atlassian.net --upgrade --confirm-scopes --non-interactive
forge tunnel -e development
```

- See more about [forge lint](https://developer.atlassian.com/platform/forge/cli-reference/lint/)
- See more about [forge deploy](https://developer.atlassian.com/platform/forge/cli-reference/deploy/)
- See more about [forge install](https://developer.atlassian.com/platform/forge/cli-reference/install/)
- See more about [forge tunnel](https://developer.atlassian.com/platform/forge/cli-reference/tunnel/)

And run this command in the second terminal to see the logs in forge cloud. See [Forge logs](https://developer.atlassian.com/platform/forge/cli-reference/logs/) for more information.

```shell
forge logs -e development
# or
forge logs -e development --grouped
```

- Use the `forge deploy` command when you want to persist code changes.
- Use the `forge install` command when you want to install the app on a new site.
- Once the app is installed on a site, the site picks up the new app changes you deploy without needing to rerun the install command.

## Environment Variables

For development, you can do the following:

```shell
forge variables list -e development
forge variables set --environment development --encrypt SUPABASE_URL <value>
forge variables set --environment development --encrypt SUPABASE_API_KEY <value>
```

For production, you have to do the following:

```shell
forge variables list -e production
forge variables set --environment production --encrypt SUPABASE_URL <value>
forge variables set --environment production --encrypt SUPABASE_API_KEY <value>
```

See [Environment variables](https://developer.atlassian.com/platform/forge/cli-reference/variables/) for more information.

## Support

See [Get help](https://developer.atlassian.com/platform/forge/get-help/) for how to get help and provide feedback.
