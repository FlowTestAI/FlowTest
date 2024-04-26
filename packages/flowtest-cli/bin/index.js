#!/usr/bin/env node

const yargs = require('yargs/yargs');
const { hideBin } = require('yargs/helpers');
const chalk = require('chalk');
const readFile = require('../../flowtest-electron/src/utils/filemanager/readfile');
const { serialize } = require('../../flowtest-electron/src/utils/flowparser/parser');
const { Graph } = require('../graph/Graph');
const { cloneDeep } = require('lodash');
const dotenv = require('dotenv');

const omelette = require('omelette');

// Initialize tab completion
const completion = omelette('flow');

completion.on('complete', (fragment, data) => {
  if (data.line.endsWith('--file ') || data.line.endsWith('--env ')) {
    completion.reply([]);
  } else {
    // Dynamically list directories and files as suggestions
    const fs = require('fs');
    const path = require('path');

    const lineParts = data.line.split(' ');
    const basePath = lineParts[lineParts.length - 1];

    try {
      const items = fs.readdirSync(basePath, { withFileTypes: true });
      //   console.log(`Base path: ${basePath}`);
      //   console.log(`Items: ${JSON.stringify(items)}`);
      const results = items.map((item) => path.join(basePath, item.name) + (item.isDirectory() ? '/' : ''));
      completion.reply(results);
    } catch (error) {
      completion.reply([]);
    }
  }
});

completion.init();

if (~process.argv.indexOf('--completion')) {
  completion.setupShellInitFile();
  console.log('Run `source ~/.bashrc` or restart your terminal to activate completion.');
  process.exit();
}

const getEnvVariables = (pathname) => {
  const content = readFile(pathname);
  const buf = Buffer.from(content);
  const parsed = dotenv.parse(buf);
  return parsed;
};

// Define the CLI application using yargs
const argv = yargs(hideBin(process.argv))
  .usage('Usage: $0 <command> [options]')
  .command(
    'run',
    'Run a flow',
    (yargs) => {
      return yargs
        .option('file', {
          alias: 'f',
          describe: 'path of the flow to run',
          demandOption: true,
          type: 'string',
        })
        .option('env', {
          alias: 'e',
          describe: 'path of the environment file',
          demandOption: false,
          type: 'string',
        })
        .option('timeout', {
          alias: 't',
          describe: 'timeout for graph run in ms',
          demandOption: false,
          type: 'number',
        });
    },
    async (argv) => {
      console.log(`Reading file: ${argv.file}`);
      if (argv.file.toLowerCase().endsWith(`.flow`)) {
        const content = readFile(argv.file);
        try {
          const flowData = serialize(JSON.parse(content));
          // output json output to a file
          //console.log(chalk.green(JSON.stringify(flowData)));
          const startTime = Date.now();
          const g = new Graph(
            cloneDeep(flowData.nodes),
            cloneDeep(flowData.edges),
            startTime,
            argv.timeout ? argv.timeout : 60000,
            argv.env ? getEnvVariables(argv.env) : {},
            [],
          );
          console.log(chalk.yellow('Running Graph \n'));
          if (flowData.nodes.find((n) => n.type === 'complexNode')) {
            console.log(
              chalk.blue(
                '[Note] This flow contains nested flows so run it from parent directory of collection. Ignore if already doing that. \n',
              ),
            );
          }
          const result = await g.run();
          console.log('\n');
          if (result.status === 'Success') {
            console.log(chalk.bold('Graph Run: ') + chalk.green(`   ✓ `) + chalk.dim(result.status));
          } else {
            console.log(chalk.bold('Graph Run: ') + chalk.red(`   ✕ `) + chalk.dim(result.status));
          }
          console.log(chalk.bold('Total Time: ') + chalk.dim(`${Date.now() - startTime} ms`));
          process.exit(1);
          //console.log(chalk.green(JSON.stringify(result)));
        } catch (error) {
          console.error(chalk.red(`Error running flow due to: ${error}`));
          process.exit(1);
        }
      } else {
        console.error(chalk.red('Input file is not a flow file'));
        process.exit(1);
      }
    },
  )
  .help()
  .alias('help', 'h')
  .parse();
