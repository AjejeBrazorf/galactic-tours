# Galactic Tours


## Architecture

### Apps and Packages
#### Apps

- `shell`: Next.js app, orchestrates the apps for the Galactic Tours website
- `docs`: Storybook (React) app for the Galactic Tours documentation
- `destinations`: React app for the Galactic Tours destinations, it renders an interactive 3d map, a list of destinations and the details of each destination

#### Packages
- `@galactic-tours/eslint-config`: `eslint` configurations (includes `eslint-config-next` and `eslint-config-prettier`)
- `@galactic-tours/typescript-config`: `tsconfig.json`s used throughout the monorepo
- `@galactic-tours/ui`: ui library of the Galactic Tours application
- `@galactic-tours/messaging`: messaging library of the Galactic Tours application it is responsible for orchestrating the communication between the apps

Each package/app is 100% [TypeScript](https://www.typescriptlang.org/).

### Microfrontends choices
iframes and event bus messaging is used to communicate between the apps
lock-in for react as a framework is used for the apps in order to provide a consistent developer experience across all apps

### Utilities

- [TypeScript](https://www.typescriptlang.org/) for static type checking
- [ESLint](https://eslint.org/) for code linting
- [Prettier](https://prettier.io) for code formatting

### Build

To build all apps and packages, run the following command:

```
cd galactic-tours
pnpm build
```

### Develop

To develop all apps and packages, run the following command:

```
cd galactic-tours
pnpm i
pnpm dev
```
