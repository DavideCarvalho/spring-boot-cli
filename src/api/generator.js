const _ = require('lodash');
const chalk = require('chalk');
const dd = require('dumper.js/src/dd');
const fs = require('fs');
const CURR_DIR = process.cwd();
const springBootComponentFileName = 'springBootComponentTemplate.txt';
const springBootRepositoryFileName = 'springBootRepositoryTemplate.txt';
const objectNameCapitalizedPlaceholder = '<%objectNameCapitalized%>';
const utf8Encoding = 'utf8';
const springBootSaveDirectories = {
  controllers: `${CURR_DIR}/controllers`,
  services: `${CURR_DIR}/services`,
  models: `${CURR_DIR}/models`,
  repositories: `${CURR_DIR}/repositories`
};

const generate = (fileType, fileName) => {
  const camelCasedFileName = _.camelCase(fileName);
  const createdDir = `${CURR_DIR}/src/${fileType}s`;
  const serviceFile = fs
    .readFileSync(`./src/templates/${fileType}Template.txt`, utf8Encoding)
    .replace('<%serviceName%>', camelCasedFileName);
  if (!fs.existsSync(createdDir))
    fs.mkdirSync(createdDir);
  if (fs.existsSync(`${createdDir}/${fileName}.ts`)) {
    console.log(chalk.red(`${fileType} com o nome \n${fileName} já existente em \n${createdDir}`));
    return;
  }
  fs.writeFileSync(`${createdDir}/${fileName}.ts`, serviceFile);
  console.log(
    chalk.blue(`${fileType} ${fileName} \ncriado com sucesso em \n${createdDir}`)
  );
}

const generateSpringBootCrud = (objectName, options) => {
  dd(CURR_DIR);
  const objectNameCapitalized = capitalizeFirstLetter(objectName);
  const componentFile = generateSpringBootFile(springBootComponentFileName, objectNameCapitalizedPlaceholder, objectNameCapitalized).replace('<%objectName%>', objectName.toLowerCase());
  const repositoryFile = generateSpringBootFile(springBootRepositoryFileName, objectNameCapitalizedPlaceholder, objectNameCapitalized);

  if (!fs.existsSync(springBootSaveDirectories.controllers)) {
    console.log(chalk.blue('Criado pasta Controllers'));
    fs.mkdirSync(springBootSaveDirectories.controllers);
  }
  
  if (!fs.existsSync(`${springBootSaveDirectories.controllers}/${objectNameCapitalized}Controller.java`)) {
    console.log(chalk.blue(`${objectNameCapitalized}Controller criado com sucesso`));
    fs.writeFileSync(`${springBootSaveDirectories.controllers}/${objectNameCapitalized}Controller.java`, componentFile);
  }

  if (!fs.existsSync(springBootSaveDirectories.repositories)){
    console.log(chalk.blue('Criado pasta Repositories'));
    fs.mkdirSync(springBootSaveDirectories.repositories);
  }
  
  if (!fs.existsSync(`${springBootSaveDirectories.repositories}/${objectNameCapitalized}Repository.java`)) {
    console.log(chalk.blue(`${objectNameCapitalized}Repository criado com sucesso`));
    fs.writeFileSync(`${springBootSaveDirectories.repositories}/${objectNameCapitalized}Repository.java`, repositoryFile);
  }

  if (!fs.existsSync(springBootSaveDirectories.models)){
    console.log(chalk.blue('Criado pasta Models'));
    fs.mkdirSync(springBootSaveDirectories.models);
  }

  const modelFile = fs.createWriteStream(`${CURR_DIR}/models/${objectNameCapitalized}.java`);
  modelFile.write(`public class ${objectNameCapitalized} {`);
  for(propertyName in options.string) {
    modelFile.write(`\n`);
    const capitalizedPropertyName = capitalizeFirstLetter(options.string[propertyName]);
    modelFile.write(`  private ${capitalizedPropertyName} ${propertyName}`);
  }
  modelFile.write(`\n`);
  modelFile.write(`}`);
  modelFile.end();
}

const generateSpringBootFile = (fileName, stringToFind, newValue) => {
  return fs
    .readFileSync(`./src/templates/${fileName}`, utf8Encoding)
    .split(stringToFind)
    .join(newValue)
}

const capitalizeFirstLetter = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

module.exports = {
  generate,
  generateSpringBootCrud
}