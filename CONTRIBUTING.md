# Contribution Guidelines

When contributing to `FlowTestAI`, whether on GitHub or in other community spaces:

- Be respectful, civil, and open-minded.
- Before opening a new pull request, try searching through the [issue tracker](https://github.com/FlowTestAI/FlowTest/issues) for known issues or fixes.
- If you want to make code changes based on your personal opinion(s), make sure you open an issue first describing the changes you want to make, and open a pull request only when your suggestions get approved by maintainers.

## How to Contribute

### Prerequisites

In order to not waste your time implementing a change that has already been declined, or is generally not needed, start by [opening an issue](https://github.com/FlowTestAI/FlowTest/issues/new/choose) describing the problem you would like to solve.

### Setup your environment locally

_Some commands will assume you have the Github CLI installed, if you haven't, consider [installing it](https://github.com/cli/cli#installation), but you can always use the Web UI if you prefer that instead._

In order to contribute to this project, you will need to fork the repository:

```bash
gh repo fork FlowTestAI/FlowTest
```

then, clone it to your local machine:

```bash
gh repo clone <your-github-name>/FlowTest
```

This project uses [pnpm](https://pnpm.io) as its package manager. Install it if you haven't already:

```bash
npm install -g pnpm@9.0.6
```

Then, install the project's dependencies:

```bash
pnpm install
```

### Implement your changes

This project is a monorepo. FlowTestAI is offered as a local electron desktop app. In lieu of that it has two major components, the main logical part of the application resides in `packages/flowtest-electron` and the renderer (UI) part of the application resides in `src`. We are also actively developing the CLI and it resides in `packages/flowtest-cli` directory.

Here are some useful scripts for when you are developing:

| Command         | Description                                        |
| --------------- | -------------------------------------------------- |
| `pnpm start`    | Builds and starts the FlowTest App on your desktop |
| `pnpm build`    | Builds the application for development use         |
| `pnpm format`   | Formats the code                                   |
| `pnpm lint`     | Lints the code                                     |
| `pnpm lint:fix` | Lints the code and fixes any errors                |
| `pnpm clean`    | Deletes all node_modules in the project            |

### When you're done

Please make a manual, functional test of your changes.

Check for formatting and linting errors:

```bash
pnpm lint && pnpmt format
```

When making commits, make sure to follow the [conventional commit](https://www.conventionalcommits.org/en/v1.0.0/) guidelines, i.e. prepending the message with `feat:`, `fix:`, `chore:`, `docs:`, etc... You can use `git status` to double check which files have not yet been staged for commit:

```bash
git add <file> && git commit -m "feat/fix/chore/docs: commit message"
```

If your change should appear in the changelog, i.e. it changes some behavior of either the CLI or the outputted elctron application, it must be captured by `changeset`. If this does not apply to your contribution skip to the pr creation step.

Run the changeset:

```bash
pnpm changeset
```

and filling out the form with the appropriate information. Then, add the generated changeset to git:

```bash
git add .changeset/*.md && git commit -m "chore: add changeset"
```

When all that's done, it's time to file a pull request to upstream:

```bash
gh pr create --web
```

and fill out the title and body appropriately. Again, make sure to follow the [conventional commit](https://www.conventionalcommits.org/en/v1.0.0/) guidelines for your title.

## Credits

This documented was inspired by the contributing guidelines for [t3-oss/create-t3-app](https://github.com/t3-oss/create-t3-app/blob/main/CONTRIBUTING.md).
