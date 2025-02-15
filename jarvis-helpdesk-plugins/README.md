# Jarvis Helpdesk Plugins monorepo

AI plugins for existing helpdesk applications

# Prerequisites

- Node.js v20.x.x
- Yarn v1.22.x

# Workspaces
```
.
├── apps/ 
│   ├── pancake
│   ├── zendesk
│   └── zohodesk
└── packages/
    ├── shared
    ├── eslint-config
    └── typescript-config
```
- The `apps` folder should contain workspaces for launchable apps, such as pancake, zendesk, and zohodesk.
- The `packages` folder should contain workspaces for packages used by either an app or another package.

# Usages

## Install packages for all modules
By running this command at folder `jarvis-helpdesk-plugins/`, Yarn will install all dependencies for all modules.

```bash
yarn install
```

## Prepare the environment
Go to the desire app folder and run
```bash
cp .env.example .env
```
Then, fill in the environment variables in the `.env` file.

**NOTE**: `.env` can be named as
- `.env.development` for Vite development mode
- `.env.production` for Vite production mode

## Start the apps
[Recommended] Go to the desire app folder and run script. For example,

```bash
cd apps/zendesk
```

Then, run
```bash
yarn dev
```
---

or you can start the app at root folder `jarvis-helpdesk-plugins/` by running
```bash
yarn workspace <app> <script>
```
For example, `yarn workspace @jarvis-helpdesk-plugins/zendesk dev`