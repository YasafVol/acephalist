---
title: "Netlify MCP Server"
description: "Give code agents the ability to build, deploy, and more with Netlify MCP Server."
---

Give code agents the ability to build, deploy, and more with Netlify MCP Server.

Netlify MCP Server follows the [Model Context Protocol](https://modelcontextprotocol.io/introduction) to enable code agents to use the Netlify API and CLI to create new projects and to build and manage your deployments.

Curious how it works? Check out the [full source code on GitHub](https://github.com/netlify/netlify-mcp).

## Overview

The Model Context Protocol is a standardized protocol that enables code agents to connect to MCP servers to manage resources and complete tasks for you using natural language prompts.

An MCP Server provides the necessary context for code agents to use, such as APIs, CLI functionality, prompts, and other dev tools.

An MCP client is an application that connects to an MCP server, such as Windsurf, Kiro, Cursor, Claude, or VSCode Copilot. For a more complete list, check out the [Model Context Protocol documentation](https://modelcontextprotocol.io/clients).

To learn more about how MCP servers work, check out the official [Model Context Protocol architecture documentation](https://modelcontextprotocol.io/introduction#general-architecture).

## Use cases

Use the Netlify MCP Server to speed up your development workflow by letting your AI agents:
- Create, manage, and deploy projects
- Modify Netlify access controls to protect projects from unwanted access
- Install or uninstall Netlify extensions
- Fetch Netlify user and team information
- Enable and manage form submissions on projects
- Create environment variables and secrets for projects

## Prerequisites

To use the Netlify MCP Server, you need:
- Node.js 22 or higher
- A Netlify account
- An MCP client (e.g. Windsurf, Kiro, Cursor, Claude, Copilot)

We recommend installing [the Netlify CLI](/api-and-cli-guides/cli-guides/get-started-with-cli) with `npm install -g netlify-cli` so that the MCP server can use it directly where possible.

## Add Netlify MCP Server

When possible, we recommend adding Netlify MCP Server locally at the root of your project.

Use the one-click installation icons or docs for your MCP client to add a custom MCP server and complete the installation (typically with a refresh or restart of your MCP client).

Note: There are many other MCP clients available, check out the [official MCP client list](https://modelcontextprotocol.io/clients) for more.

### Netlify MCP configuration

This is an example of a `mcp.json` file that adds the Netlify MCP server:

```json
{
  "mcpServers": {
    "netlify": {
      "command": "npx",
      "args": ["-y", "@netlify/mcp"]
    }
  }
}
```

### Windsurf

You can find the Netlify MCP Server in the Windsurf plugin store within the Windsurf editor.

Learn more about installing an MCP Server in the [Windsurf docs](https://docs.windsurf.com/windsurf/cascade/mcp).

### Cursor

[![Install MCP Server](https://cursor.com/deeplink/mcp-install-dark.svg)](cursor://anysphere.cursor-deeplink/mcp/install?name=Netlify&amp;config=eyJjb21tYW5kIjoibnB4IC15IEBuZXRsaWZ5L21jcCJ9)

Read more in the [Cursor docs](https://docs.cursor.com/context/model-context-protocol).

### VS Code

[![Install on VS Code](https://img.shields.io/badge/VS_Code-VS_Code?style=flat-square&label=Install%20Server&color=0098FF)](https://insiders.vscode.dev/redirect/mcp/install?name=netlify&config=%7B%22command%22%3A%22npx%22%2C%22args%22%3A%5B%22-y%22%2C%22%40netlify%2Fmcp%22%5D%7D)

[![Install on VS Code Insiders Edition](https://img.shields.io/badge/VS_Code_Insiders-VS_Code_Insiders?style=flat-square&label=Install%20Server&color=24bfa5)](https://insiders.vscode.dev/redirect/mcp/install?name=netlify&config=%7B%22command%22%3A%22npx%22%2C%22args%22%3A%5B%22-y%22%2C%22%40netlify%2Fmcp%22%5D%7D&quality=insiders)

Read more in the [VS Code docs](https://code.visualstudio.com/docs/copilot/chat/mcp-servers?wt.md_id=AZ-MVP-5004796#_add-an-mcp-server).

### Claude

For Claude Code, run:

```sh
claude mcp add netlify npx -- -y @netlify/mcp
```

You can also find the Netlify MCP Server in the [Claude MCP directory](https://www.anthropic.com/partners/mcp).

For Claude desktop users, learn how to install an MCP server in the [Claude docs](https://modelcontextprotocol.io/quickstart/user).

### Goose

[![Install on Goose](https://img.shields.io/badge/Install_MCP-Goose-black)](goose://extension?cmd=npx&arg=-y&arg=%40netlify%2Fmcp&id=netlify&name=Netlify&description=Build%2C%20deploy%2C%20and%20manage%20sites%20with%20Netlify's%20official%20MCP%20server.)

Read more about using MCP-based extensions in the [Goose docs](https://block.github.io/goose/docs/getting-started/using-extensions).

### Sourcegraph Amp

Add the Netlify MCP server to your Amp configuration file. The configuration file location depends on your operating system:

- **Windows**: `%APPDATA%\amp\settings.json`
- **macOS/Linux**: `~/.config/amp/settings.json`

Or add it to your editor settings (e.g., `.vscode/settings.json`).

```json
{
  "amp.mcpServers": {
    "netlify": {
      "command": "npx",
      "args": ["-y", "@netlify/mcp"]
    }
  }
}
```

Read more about MCP servers in the [Sourcegraph Amp docs](https://ampcode.com/manual).

## Troubleshoot

Here are some common issues and solutions or workarounds. You may find it helpful to install the latest version of the [Netlify CLI](/api-and-cli-guides/cli-guides/get-started-with-cli) as you troubleshoot.

### Node issues

For the best experience, we recommend using Node 22 or higher.

In your terminal, run `node --version` to check your current version.

If you have a node version manager like [nvm](https://github.com/nvm-sh/nvm), you can run `nvm install 22` to install Node 22 and `nvm use 22` to use it.

### Netlify authentication issues

If you're experiencing issues staying logged in to your Netlify account while using the Netlify MCP Server, we recommend you start by confirming that you can log in to your Netlify account in other ways without any authentication issues.

You can use the [Netlify CLI](/api-and-cli-guides/cli-guides/get-started-with-cli) to check auth with `netlify status` or `netlify login`.

If you're still having auth issues while trying to use the Netlify MCP Server, as a temporary workaround, you can add a Netlify PAT (Personal Access Token) to your MCP configuration file.

```json
{
  "mcpServers": {
    "netlify": {
      "command": "npx",
      "args": ["-y", "@netlify/mcp"],
      "env": {
        "NETLIFY_PERSONAL_ACCESS_TOKEN": "YOUR-PAT-VALUE"
      }
    }
  }
}
```

### Caution - Don't commit your PAT

Note that this is a temporary workaround and that you should not commit this update to your repository and publish the PAT value!

#### Get a new PAT

To get a new PAT for use with the Netlify MCP Server, follow these steps:

1. In the Netlify dashboard, on the bottom left corner (on desktop), select your user icon and go to 
### NavigationPath Component:

User settings > OAuth
 and select **New access token**.

2. Copy your new personal access token securely.

3. Add the PAT value to your MCP configuration file. Note this is a temporary workaround and this sensitive value should not be committed to your repository.

4. Restart or refresh your MCP client following your MCP client's instructions.

5. Use the Netlify MCP Server. You should now be able to stay logged in to your Netlify account while using the Netlify MCP Server.

6. Be sure not to commit your PAT value to your Git remote repository. When you're ready, remove the PAT from your MCP configuration file.
