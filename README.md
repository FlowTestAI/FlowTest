# FlowTestAI

[![Release Notes](https://img.shields.io/github/release/FlowTestAI/FlowTest)](https://github.com/FlowTestAI/FlowTest/releases)
[![Linkedin](https://img.shields.io/badge/LinkedIn-blue?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/company/flowtestai)
[![Twitter Follow](https://img.shields.io/twitter/follow/FlowTestAI?style=social)](https://twitter.com/FlowTestAI)
[![Chat on Discord](https://img.shields.io/badge/chat-Discord-7289DA?logo=discord)](https://discord.gg/Pf9tdSjPeF)

FlowTestAI stands as the world’s first GenAI powered OpenSource Integrated Development Environment (IDE) specifically designed to craft, visualize, and manage API-driven workflows. Characterized by its speed, lightweight architecture, and local operation, FlowTestAI safeguards privacy while facilitating the seamless integration of API driven workflows.

<img width="1728" alt="Screenshot 2024-04-18 at 5 41 43 PM" src="https://github.com/FlowTestAI/FlowTest/assets/5829490/c04f6e3e-fe69-4d25-a008-ba558c8fe149">


🚧 We are actively working on launching a CLI. The CLI allows you to run API driven workflows created using FlowTestAI from command line interface making it easier to automate and run them in a CI/CD (continuous integration/development) fashion.

## Documentation 📝

https://flowtestai.gitbook.io/flowtestai

💡 We are proud to announce that we were recently featured in a LangChain blog post. You can read the article here.

## Setup

## Production 🚀

FlowTestAI is an electron app that runs entirely in your local environment interacting with your local file system just like other IDE(s) out there like VSCode, Intellij etc. The platform-specific binaries are available for download from our GitHub releases. We currently offer binaries for macOS, with versions for Windows and Linux under development 🚧. If you require a binary for a specific platform, please let us know in the Discussions section. We will prioritize your request accordingly.

## Development 🔧

1. Clone the repository
   ```bash
   git clone https://github.com/FlowTestAI/FlowTest.git
   ```
2. Go into repository folder
   ```bash
   cd FlowTest
   ```
3. Clean any previously installed dependencies:
   ```bash
   npm run clean
   ```
4. Install all dependencies of all modules:
   ```bash
   npm install
   ```
5. Start the app:
   ```bash
   npm start
   ```
   The app should start as a normal desktop app

## Support 🙋

- ❓ QNA: feel free to ask questions, request new features or start a constructive discussion here [discussion](https://github.com/FlowTestAI/FlowTest/discussions)
- 🐛 Issues: Feel free to raise issues here [issues](https://github.com/FlowTestAI/FlowTest/issues) (contributing guidelines coming soon..)
- 🔄 Integration: If you want to explore how you can use this tool in your day to day activities or integrate with your existing stack or in general want to chat, you can reach out to us at any of our [social media handles](https://flowtestai.gitbook.io/flowtestai) or email me at jsajal1993@gmail.com.

## License 📄

Source code in this repository is made available under the [MIT License](LICENSE.md).
