#!/usr/bin/env node

const yargs = require('yargs/yargs');
const { hideBin } = require('yargs/helpers');
const chalk = require('chalk');
const readFile = require('../../flowtest-electron/src/utils/filemanager/readfile');
const { serialize } = require('../../flowtest-electron/src/utils/flowparser/parser');
const Graph = require('../graph/Graph');
const { cloneDeep } = require('lodash');

// Define the CLI application using yargs
const argv = yargs(hideBin(process.argv))
  .usage('Usage: $0 <command> [options]')
  .command(
    'run',
    'Run a flow',
    {
      file: {
        description: 'path of the flow to run',
        alias: 'f',
        type: 'string',
        demandOption: true,
      },
    },
    async (argv) => {
      console.log(`Reading file: ${argv.file}`);
      if (argv.file.toLowerCase().endsWith(`.flow`)) {
        const content = readFile(argv.file);
        try {
          const flowData = serialize(JSON.parse(content));
          // find all complex nodes and verify if their paths are reachable before executing graph
          // check for accessId and accessKey then generate gradle link
          // output json output to a file
          // option to specify env file
          //console.log(chalk.green(JSON.stringify(flowData)));
          const startTime = Date.now();
          const g = new Graph(cloneDeep(flowData.nodes), cloneDeep(flowData.edges), startTime, {}, []);
          console.log(chalk.yellow('Running Graph \n'));
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
          console.error(chalk.red(`Failed to parse ${argv.file}`));
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
