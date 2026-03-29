---
title: "Netlify DB"
description: "Netlify DB offers a production-grade serverless database instance that you or a code agent can instantly set up and deploy with a single command."
---

Netlify DB offers a production-grade serverless database instance that you or a code agent can instantly set up and deploy with a single command. Netlify DB automatically connects to your functions and environment variables, making it ideal for fast development and automated scaffolding.

> **Pricing Information:** This feature is in [Beta](https://docs.netlify.com/release-phases/#beta) and is available on all pricing plans.

Netlify DB is a new Postgres database integration built into the Netlify workflow, powered by [Neon](https://neon.tech/).

## Use cases

- Build your full-stack app faster with a working serverless database instance
- Scale when you're ready with a full production database
- Stay in your building flow while Netlify handles your project's infrastructure

## Start a database instance

You have several options for starting a database instance with Netlify DB. These options are optimized for different workflows and starting points:
- **Recommended for local development**:  [Add a database using Netlify CLI](#add-a-database-using-netlify-cli)
- **Recommended for code agent-driven development**:  [Add a database while building on Netlify](#add-a-database-while-building-on-netlify)
- **Requires an existing project or project already deployed to Netlify**:  [Add a database in the Netlify UI](#add-a-database-in-the-netlify-ui)

### Add a database using Netlify CLI

Add a database to your project with `npx netlify db init`, which ensures you have the latest Netlify CLI version and launches a database instance with the required environment variables.

Note that you will need Node.js version 20.12.2 or later to use the Netlify CLI.

1. In your terminal, go to your project root directory and run `npx netlify db init`.

### Note - Configuration options

`npx netlify db init` will prompt you with your configuration options. You can also include a flag to your command to customize your database: 

 `--boilerplate=drizzle`: Use Drizzle ORM for your database boilerplate schema  <br /> 
 `--assume-no`: Assume "no" to all interactive configuration options, including no to a Drizzle ORM setup

2. Follow the prompts to create your database.

Note that you will want to claim your database if you want your project's database to work beyond an initial 7-day period. Learn more about how to [claim your database](#claim-your-database).

### Add a database in the Netlify UI

Follow these steps to set up a database for an existing project on Netlify within the Netlify UI.

1. Go to 
### NavigationPath Component:

Extensions
 and search for **Neon database**. Then, select **Install**.
2. Go to your project dashboard and under **Extensions** in the left sidebar, select **Neon**.
3. From your project's Neon extension page, select **Add database** and follow any prompts to finish your setup.

Note that you will want to claim your database if you want your project's database to work beyond an initial 7-day period. Learn more about how to [claim your database](#claim-your-database).

### Add a database while building on Netlify

We recommend code agents automatically add a database to a project by installing the `@netlify/neon` package in your project. 

If you have the `@netlify/neon` package installed in your project, Netlify will automatically create a Neon database instance for you (if it's not already created) whenever you build your project, such as when you run `netlify dev`, `netlify build`, or push changes locally to a Git hosting provider, which triggers a build on Netlify's infrastructure.

Code agents can get these instructions from [https://docs.netlify.com/ai-context/netlify-development.mdc](https://docs.netlify.com/ai-context/netlify-development.mdc). Note that you will need Node.js version 20.12.2 or later.

To set up automatic database provisioning when you build on Netlify, follow these steps:

1. Install the [npm package](https://www.npmjs.com/package/@netlify/neon) by running `npm install @netlify/neon` in your project.
2. To create the database and required environment variables, you can do either of the following:
    - run `netlify dev`
    - run `netlify build`
    - push changes to your Git hosting provider, which will trigger a build and deployment

Note that you will want to claim your database if you want your project's database to work beyond an initial 7-day period. Learn more about how to [claim your database](#claim-your-database).

## Claim your database

Claim your database in the Netlify UI so that you can do the following: 
- keep your database running beyond an initial 7-day period
- unlock the full production capacity of your database and add more compute resources
- be able to monitor your database
- upgrade to other Neon database features

### Caution - No recovery options for unclaimed databases

If you don't claim your database instance, then your database instance is deleted after 7 days and the database loses all data and settings without recovery options.

To claim your database:
1. Go to 
### NavigationPath Component:

Extensions
 and select **Neon database**.
2. Select **Connect Neon** and follow the Neon account setup and authorization prompts.
3. Returning to your project's Neon extension page, select **Claim database**.

Now you should be able to fully access your Neon account.

## Manage your database

After you've set up and claimed your database, you can manage it more fully in the Neon console. Check out the [official Neon docs](https://neon.com/docs/introduction) for help with this.

## Delete or disconnect a database

You can disconnect a database from your Netlify project in the Netlify UI. To fully delete a database, go to the Neon console. Learn more in the [official Neon docs](https://neon.tech/docs/introduction).

After disconnecting a database, you can connect to a different database or create a new database.

### Disconnect a database

When you disconnect a database, the database is removed from your Netlify project, but the database instance remains in your Neon account. You can reconnect a disconnected database to your Netlify project at any time or delete it from your Neon account.

1. Go to your project dashboard and under **Extensions** in the left sidebar, select **Neon**.
2. Select **Disconnect**, then **Confirm Disconnect** and follow the prompts to disconnect your database.
