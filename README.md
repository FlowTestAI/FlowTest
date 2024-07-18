# FlowTestAI

[![Release Notes](https://img.shields.io/github/release/FlowTestAI/FlowTest)](https://github.com/FlowTestAI/FlowTest/releases)
[![Linkedin](https://img.shields.io/badge/LinkedIn-blue?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/company/flowtestai)
[![Twitter Follow](https://img.shields.io/twitter/follow/FlowTestAI?style=social)](https://twitter.com/FlowTestAI)
[![Chat on Discord](https://img.shields.io/badge/chat-Discord-7289DA?logo=discord)](https://discord.gg/Pf9tdSjPeF)

💡 We are proud to announce that we were recently featured in a [LangChain](https://blog.langchain.dev/empowering-development-with-flowtestai/) blog post.\
🔓 Unlock use cases by understanding our motivation [dev.to](https://dev.to/flowtestai/launching-flowtestai-ide-for-api-first-workflows-integrations-and-automations-30hd)

FlowTestAI stands as the world’s first GenAI powered OpenSource Integrated Development Environment (IDE) specifically designed to craft, visualize, and manage API-first workflows. Characterized by its speed, lightweight architecture, and localalized operation, FlowTestAI safeguards privacy while facilitating the seamless integration of API driven workflows.

It works as a normal desktop app and interacts directly with your local file system as other IDE(s) like VSCode, Intellij etc. This not only safeguards privacy but helps one to collaborate with others via git or any version control system.

<img width="1728" alt="Screenshot 2024-04-18 at 5 41 43 PM" src="https://github.com/FlowTestAI/FlowTest/assets/5829490/c04f6e3e-fe69-4d25-a008-ba558c8fe149">

## CLI
https://www.npmjs.com/package/flowtestai

The CLI allows you to run flows created using FlowTestAI from command line interface making it easier to automate and run them in a CI/CD (continuous integration/development) fashion.

[README](https://github.com/FlowTestAI/FlowTest/blob/main/packages/flowtest-cli/README.md)

## Documentation 📝

https://flowtestai.gitbook.io/flowtestai

## Setup

## Production 🚀

FlowTestAI is an electron app that runs entirely in your local environment interacting with your local file system just like other IDE(s) out there like VSCode, Intellij etc. The platform-specific binaries are available for download from our GitHub releases. We currently offer [binaries for macOS](https://github.com/FlowTestAI/FlowTest/releases), with versions for Windows and Linux under development 🚧. If you require a binary for a specific platform, please let us know in the Discussions section. We will prioritize your request accordingly.

## Development 🔧

### Prerequisite

This package uses version >= 18 of Node.js. There are different ways that you can install Node.js, following are steps for [Node Verson Manager or NVM](https://github.com/nvm-sh/nvm). If you need steps for other methods than NVM then please check [Official Node.js documentation](https://nodejs.org/en/download/package-manager). Here is a sample walkthrough installing version 18.

1. Installs nvm (Node Version Manager)

   ```bash
   curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
   ```

2. Download and install Node.js

   ```bash
   nvm install 18
   ```

3. Verifies the right Node.js version is in the environment

   ```bash
   node -v # should print `v18.20.2`
   ```

4. Verifies the right NPM version is in the environment

   ```bash
   npm -v # should print `10.5.0`
   ```

### Main setup

1. Clone the repository

   ```bash
   git clone https://github.com/FlowTestAI/FlowTest.git
   ```

2. Go into repository folder

   ```bash
   cd FlowTest
   ```

3. This project uses pnpm. Use [corepack](https://github.com/nodejs/corepack) to enable the required pnpm version:

   ```bash
   corepack enable pnpm
   ```

   or install with npm

   ```bash
   npm install -g pnpm@9.0.6
   ```

4. Install all project dependencies:

   ```bash
   pnpm install
   ```

5. Build and start the app:

   ```bash
   pnpm start
   ```

   The app should start as a normal desktop app

   NOTE: if you use npm and corepack to install pnpm you will have two instances of pnpm. Make sure the version you're using is the correct version for the repo. Check the [pnpm docs](https://pnpm.io/installation) and [corepack](https://github.com/nodejs/corepack) for troubleshooting. Pnpm installed with npm will overrun corepacks pnpm instance.

## Contribution 🤝

_"Little drops of water make a mighty ocean"_

No contribution is small even if it means fixing a spelling mistake. Follow our contributing guide below.
https://github.com/FlowTestAI/FlowTest/blob/main/CONTRIBUTING.md

Fun fact: our contributing guide itself was an external contribution 🍺

## Support 🙋

- ❓ QNA: feel free to ask questions, request new features or start a constructive discussion here [discussion](https://github.com/FlowTestAI/FlowTest/discussions)
- 🐛 Issues: Feel free to raise issues here [issues](https://github.com/FlowTestAI/FlowTest/issues) (contributing guidelines coming soon..)
- 🔄 Integration: If you want to explore how you can use this tool in your day to day activities or integrate with your existing stack or in general want to chat, you can reach out to us at any of our [social media handles](https://flowtestai.gitbook.io/flowtestai) or email me at jsajal1993@gmail.com.
- 🔐 Our tool requires OpenAI key if you wish to use the natural language to flow translation feature. You can either get yours by signing up [here](https://platform.openai.com/) or you can contact us on our [social media handles](https://flowtestai.gitbook.io/flowtestai) or at jsajal1993@gmail.com and we can provide you one.

## License 📄

Source code in this repository is made available under the [MIT License](LICENSE).
