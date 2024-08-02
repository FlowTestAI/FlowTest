# FlowTestAI: Streamlining End-to-End API Testing

[![Release Notes](https://img.shields.io/github/release/FlowTestAI/FlowTest)](https://github.com/FlowTestAI/FlowTest/releases)
[![Linkedin](https://img.shields.io/badge/LinkedIn-blue?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/company/flowtestai)
[![Twitter Follow](https://img.shields.io/twitter/follow/FlowTestAI?style=social)](https://twitter.com/FlowTestAI)
[![Chat on Discord](https://img.shields.io/badge/chat-Discord-7289DA?logo=discord)](https://discord.gg/Pf9tdSjPeF)

💡 We are proud to announce that we were recently featured in a [LangChain](https://blog.langchain.dev/empowering-development-with-flowtestai/) blog post.

FlowTest is a powerful, code-agnostic tool designed to simplify the creation and execution of end-to-end API tests. With its intuitive interface and robust features, FlowTest empowers developers and QA teams to streamline their API testing process, improve collaboration, and gain valuable insights into their API performance.

<img width="1728" alt="Screenshot 2024-04-18 at 5 41 43 PM" src="https://github.com/FlowTestAI/FlowTest/assets/5829490/c04f6e3e-fe69-4d25-a008-ba558c8fe149">

## 🚀 Key Features

- **Low Code/No Code Solution**: Create complex end-to-end API tests without writing code.
- **Natural Language Processing**: Describe your test scenarios in plain English.
- **Support Leading LLMs**: Choose from a wide range of leading LLMs: OpenAI, AWS Bedrock, Google Gemini etc.
- **Drag-and-Drop Interface**: Visually design your API tests with ease.
- **OpenAPI Spec Integration**: Automatically parse and pre-fill request nodes from your OpenAPI specifications.
- **Cross-Platform Compatibility**: Available as an Desktop application for Mac, Windows, and Linux.
- **Local File System Integration**: Direct interaction with local file system for enhanced privacy and control.
- **Version Control Ready**: Easily collaborate using Git or any other VCS.
- **CI/CD Ready**: Run tests in CI pipelines with our CLI tool.
- **Advanced Analytics**: Gain insights into API performance and test results.

## 🛠️ Getting Started

### Desktop App Installation

1. Download FlowTestAI for your OS from our [releases page](https://github.com/FlowTestAI/FlowTest/releases).
2. Install and launch FlowTest like any other desktop application.
3. Start creating end-to-end API tests using natural language or drag-and-drop.
4. Save your work locally and use Git for version control, just like with traditional IDEs.

### CLI Installation (for CI/CD)

```bash
npm install -g flowtestai
```

https://www.npmjs.com/package/flowtestai

The CLI allows you to run flows created using FlowTestAI from command line interface making it easier to automate and run them in a CI/CD (continuous integration/development) fashion.

[README](https://github.com/FlowTestAI/FlowTest/blob/main/packages/flowtest-cli/README.md)

### Analytics Setup (Optional)

1. Visit https://www.useflowtest.ai/
2. Go to Products -> Analytics -> Get Access Key Pairs
3. For CLI: Export key pairs as environment variables
4. For IDE: Open Settings and paste the access key pairs
5. Now start publishing scans for each test run.

## 📚 Documentation

https://flowtestai.gitbook.io/flowtestai

## Setup

## 💻 Production

FlowTestAI is an electron app that runs entirely in your local environment interacting with your local file system just like other IDE(s) out there like VSCode, Intellij etc. The platform-specific binaries are available for download from our GitHub releases. We currently offer [binaries for macOS](https://github.com/FlowTestAI/FlowTest/releases), with versions for Windows and Linux under development 🚧. If you require a binary for a specific platform, please let us know in the Discussions section. We will prioritize your request accordingly.

## 🔧 Development

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

## 🤝 Contribution

_"Little drops of water make a mighty ocean"_

No contribution is small even if it means fixing a spelling mistake. Follow our contributing guide below.
https://github.com/FlowTestAI/FlowTest/blob/main/CONTRIBUTING.md

Fun fact: our contributing guide itself was an external contribution 🍺

## 🌟 Support

- ❓ QNA: feel free to ask questions, request new features or start a constructive discussion here [discussion](https://github.com/FlowTestAI/FlowTest/discussions)
- 🐛 Issues: Feel free to raise issues here [issues](https://github.com/FlowTestAI/FlowTest/issues) (contributing guidelines coming soon..)
- 🔄 Integration: If you want to explore how you can use this tool in your day to day activities or integrate with your existing stack or in general want to chat, you can reach out to us at any of our [social media handles](https://flowtestai.gitbook.io/flowtestai) or email me at jsajal1993@gmail.com.
- 🔐 Our tool integrates with various leading Large Lanugage Models (LLMs) if you wish to use the natural language to flow translation feature. You can request their api keys:
  - [OpenAI](https://platform.openai.com/)
  - [AWS Bedrock](https://console.aws.amazon.com/bedrock/)
  - [Local AI] (Coming Soon...)

## 📜 License

Source code in this repository is made available under the [MIT License](LICENSE).

## Connect with Us

- Website: [useflowtest.ai](https://www.useflowtest.ai/)
- Email: jsajal1993@gmail.com
