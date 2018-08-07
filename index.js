#! /usr/bin/env node
const program = require('commander');
const fs = require('fs');
const { generate, generateSpringBootCrud } = require('./src/api');

getJsonFile = (jsonFileName) => {
  return JSON.parse(fs.readFileSync(jsonFileName, 'utf8'));
}

program
  .command('crud <objectName>')
  .option('-f, --file <fileName>', 'receive json file with property and its types', getJsonFile)
  .option('-p, --package <packageName>', 'receive package name to be inserted into the generated files')
  .description('Generate a crud based on given name and object type')
  .action(generateSpringBootCrud);

program.parse(process.argv);