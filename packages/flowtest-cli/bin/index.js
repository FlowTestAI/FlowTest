#!/usr/bin/env node

const yargs = require('yargs/yargs');
const { hideBin } = require('yargs/helpers');
const chalk = require('chalk');
const readFile = require('../../flowtest-electron/src/utils/filemanager/readfile');
const { serialize } = require('../../flowtest-electron/src/utils/flowparser/parser');
const { Graph } = require('../graph/Graph');
const { cloneDeep } = require('lodash');
const dotenv = require('dotenv');
const { GraphLogger, LogLevel } = require('../graph/GraphLogger');
const { baseUrl, axiosClient } = require('./axiosClient');

const getEnvVariables = (pathname) => {
  const content = readFile(pathname);
  const buf = Buffer.from(content);
  const parsed = dotenv.parse(buf);
  return parsed;
};

function bytesToBase64(bytes) {
  const binString = Array.from(bytes, (byte) => String.fromCodePoint(byte)).join('');
  return btoa(binString);
}

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
        })
        .option('scan', {
          alias: 's',
          describe: 'generate and upload build scan',
        });
    },
    async (argv) => {
      console.log(`Reading file: ${argv.file}`);
      if (argv.file.toLowerCase().endsWith(`.flow`)) {
        let content = undefined;
        try {
          content = readFile(argv.file);
        } catch (error) {
          console.error(chalk.red(`${error}`));
          process.exit(1);
        }
        try {
          const flowData = serialize(JSON.parse(content));
          // output json output to a file
          //console.log(chalk.green(JSON.stringify(flowData)));
          const logger = new GraphLogger();
          const startTime = Date.now();
          const g = new Graph(
            cloneDeep(flowData.nodes),
            cloneDeep(flowData.edges),
            startTime,
            argv.timeout ? argv.timeout : 60000,
            argv.env ? getEnvVariables(argv.env) : {},
            logger,
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
          logger.add(LogLevel.INFO, `Total time: ${Date.now() - startTime} ms`);
          console.log(chalk.bold('Total Time: ') + chalk.dim(`${Date.now() - startTime} ms`));
          //console.log(logger.get());

          if (argv.scan) {
            const data = {
              version: 1,
              name: argv.file.toString(),
              scan: logger.get(),
            };
            try {
              const response = await axiosClient.post(
                '/upload',
                bytesToBase64(new TextEncoder().encode(JSON.stringify(data))),
              );
              console.log(chalk.bold('Build Scan: ') + chalk.dim(`${baseUrl}/scan/${response.data.data[0].id}`));
            } catch (error) {
              if (error?.response) {
                if (error.response?.status === 403 || error.response?.status === 429) {
                  console.log(chalk.red(`   ${JSON.stringify(error.response?.data)}`));
                }

                if (error.response?.status === 500) {
                  console.log(chalk.red('   Internal Server Error'));
                }
              }
              console.log(chalk.red(`   ✕ `) + chalk.dim('Unable to upload build scan'));
            }
          }

          process.exit(1);
          //console.log(chalk.green(JSON.stringify(result)));
        } catch (error) {
          console.error(chalk.red(`Internal error running flow`));
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
