const _ = require('lodash');
const chalk = require('chalk');
const dd = require('dumper.js/src/dd');
const fs = require('fs');
const SafeString = require('../schemas/SafeString');
const FluentWriteStream = require('../schemas/FluentWriteStream');
const CURR_DIR = process.cwd();
const SPRING_BOOT_COMPONENT_FILE_NAME = 'springBootComponentTemplate.txt';
const SPRING_BOOT_REPOSITORY_FILE_NAME = 'springBootRepositoryTemplate.txt';
const SPRING_BOOT_SERVICE_FILE_NAME = 'springBootServiceTemplate.txt';
const SPRING_BOOT_SERVICE_IMPL_FILE_NAME = 'springBootServiceImplTemplate.txt';
const utf8Encoding = 'utf8';
const springBootSaveDirectories = {
  controllers: `${CURR_DIR}/controllers`,
  services: `${CURR_DIR}/services`,
  servicesImpl: `${CURR_DIR}/services/impl`,
  entities: `${CURR_DIR}/entities`,
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

  if(!options.package) {
    console.log(chalk.red('Por favor, coloque o nome do package para que possa ser atribuído ao template gerado'));
    return;
  }

  const objectNameCapitalized = capitalizeFirstLetter(objectName);
  const componentFile = SafeString
    .lift(fs.readFileSync(`./src/templates/${SPRING_BOOT_COMPONENT_FILE_NAME}`, utf8Encoding))
    .changeCapitalizedObjectName(objectNameCapitalized)
    .changeObjectName(objectName.toLowerCase())
    .changePackageName(options.package)
    .changeLoweredObjectName(lowerFirstLetter(objectName))
    .get();

  const repositoryFile = SafeString
    .lift(fs.readFileSync(`./src/templates/${SPRING_BOOT_REPOSITORY_FILE_NAME}`, utf8Encoding))
    .changeCapitalizedObjectName(objectNameCapitalized)
    .changePackageName(options.package)
    .get();

  if (!fs.existsSync(springBootSaveDirectories.controllers)) {
    console.log(chalk.blue('Criado pasta Controllers'));
    fs.mkdirSync(springBootSaveDirectories.controllers);
  }
  
  if (!fs.existsSync(`${springBootSaveDirectories.controllers}/${objectNameCapitalized}Controller.java`)) {
    console.log(chalk.blue(`${objectNameCapitalized}Controller criado com sucesso`));
    fs.writeFileSync(`${springBootSaveDirectories.controllers}/${objectNameCapitalized}Controller.java`, componentFile);
  }

  if (!fs.existsSync(springBootSaveDirectories.repositories)) {
    console.log(chalk.blue('Criado pasta Repositories'));
    fs.mkdirSync(springBootSaveDirectories.repositories);
  }
  
  if (!fs.existsSync(`${springBootSaveDirectories.repositories}/${objectNameCapitalized}Repository.java`)) {
    console.log(chalk.blue(`${objectNameCapitalized}Repository criado com sucesso`));
    fs.writeFileSync(`${springBootSaveDirectories.repositories}/${objectNameCapitalized}Repository.java`, repositoryFile);
  }

  if (!fs.existsSync(springBootSaveDirectories.entities)) {
    console.log(chalk.blue('Criado pasta Entities'));
    fs.mkdirSync(springBootSaveDirectories.entities);
  }

  if(!fs.existsSync(`${springBootSaveDirectories.entities}/${objectNameCapitalized}.java`)) {
    let modelFile = FluentWriteStream
      .lift(`${springBootSaveDirectories.entities}/${objectNameCapitalized}.java`)
      .writeAndJumpLine(`package ${options.package};`)
      .newLine()
      .writeAndJumpLine('import javax.persistence.Entity;')
      .writeAndJumpLine('import javax.persistence.Table;')
      .writeAndJumpLine('import javax.persistence.Column;')
      .writeAndJumpLine('import javax.persistence.TemporalType;')
      .writeAndJumpLine('import javax.persistence.Temporal;')
      .writeAndJumpLine('import javax.persistence.Id;')
      .writeAndJumpLine('import javax.persistence.GeneratedValue;')
      .newLine()
      .writeAndJumpLine('@Entity')
      .writeAndJumpLine(`@Table(name="${objectNameCapitalized.toLowerCase()}")`)
      .writeAndJumpLine(`public class ${objectNameCapitalized} {`)
    for(const propertyName in options.file) {
      modelFile = modelFile.newLine();
      const capitalizedPropertyName = capitalizeFirstLetter(options.file[propertyName]);
      if (capitalizedPropertyName.toUpperCase() === 'DATE') modelFile = modelFile.write('  @Temporal(Temporal.Type.TIMESTAMP)\n');
      if (propertyName.toUpperCase().includes('ID')) {
        modelFile = modelFile
          .writeAndJumpLine('  @Id')
          .writeAndJumpLine('  @GeneratedValue');
      }
      modelFile = modelFile
        .writeAndJumpLine('  @Column')
        .writeAndJumpLine(`  private ${capitalizedPropertyName} ${propertyName};`)
    }
    modelFile = modelFile
      .newLine()
      .writeAndJumpLine(`}`)
      .end();
      console.log(chalk.blue(`Entidade ${objectNameCapitalized} criado com sucesso`));
  }

  const serviceFile = SafeString
    .lift(fs.readFileSync(`./src/templates/${SPRING_BOOT_SERVICE_FILE_NAME}`, utf8Encoding))
    .changeCapitalizedObjectName(objectNameCapitalized)
    .changeLoweredObjectName(lowerFirstLetter(objectName))
    .changePackageName(options.package)
    .get();

  if (!fs.existsSync(springBootSaveDirectories.services)) {
    console.log(chalk.blue('Criado pasta Services'));
    fs.mkdirSync(springBootSaveDirectories.services);
  }

  if (!fs.existsSync(`${springBootSaveDirectories.services}/${objectNameCapitalized}Service.java`)) {
    console.log(chalk.blue(`${objectNameCapitalized}Service criado com sucesso`));
    fs.writeFileSync(`${springBootSaveDirectories.services}/${objectNameCapitalized}Service.java`, serviceFile);
  }

  const serviceImplFile = SafeString
    .lift(fs.readFileSync(`./src/templates/${SPRING_BOOT_SERVICE_IMPL_FILE_NAME}`, utf8Encoding))
    .changeCapitalizedObjectName(objectNameCapitalized)
    .changeLoweredObjectName(lowerFirstLetter(objectName))
    .changePackageName(options.package)
    .get();

  if (!fs.existsSync(springBootSaveDirectories.servicesImpl)) {
    console.log(chalk.blue('Criado pasta Services/Impl'));
    fs.mkdirSync(springBootSaveDirectories.servicesImpl);
  }

  if (!fs.existsSync(`${springBootSaveDirectories.servicesImpl}/${objectNameCapitalized}ServiceImpl.java`)) {
    console.log(chalk.blue(`${objectNameCapitalized}ServiceImpl criado com sucesso`));
    fs.writeFileSync(`${springBootSaveDirectories.servicesImpl}/${objectNameCapitalized}ServiceImpl.java`, serviceImplFile);
  }

}


const capitalizeFirstLetter = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

const lowerFirstLetter = (string) => {
  return string.charAt(0).toLowerCase() + string.slice(1);
}

module.exports = {
  generate,
  generateSpringBootCrud
}