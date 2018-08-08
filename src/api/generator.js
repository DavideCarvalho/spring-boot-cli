const _ = require('lodash');
const chalk = require('chalk');
const dd = require('dumper.js/src/dd');
const fs = require('fs');
const SafeString = require('../schemas/SafeString');
const FluentWriteStream = require('../schemas/FluentWriteStream');
const {
  OBJECT_NAME_CAPITALIZED_PLACEHOLDER,
  OBJECT_NAME_PLACEHOLDER,
  PACKAGE_NAME_PLACEHOLDER,
  OBJECT_NAME_LOWERED_PLACEHOLDER,
  SPRING_BOOT_COMPONENT_BOILERPLATE_DIR,
  SPRING_BOOT_REPOSITORY_BOILERPLATE_DIR,
  SPRING_BOOT_SERVICE_BOILERPLATE_DIR,
  SPRING_BOOT_SERVICE_IMPL_BOILERPLATE_DIR,
  SPRING_BOOT_SAVE_DIRECTORIES,
  SPRING_BOOT_CONTROLLERS_SAVE_DIRECTORY,
  SPRING_BOOT_SERVICES_SAVE_DIRECTORY,
  SPRING_BOOT_SERVICES_IMPL_SAVE_DIRECTORY,
  SPRING_BOOT_REPOSITORIES_SAVE_DIRECTORY,
  SPRING_BOOT_ENTITIES_SAVE_DIRECTORY,
  CURR_DIR,
  UTF8_ENCODING
} = require('./constants');

const generateSpringBootCrud = (objectName, options) => {

  console.log(SPRING_BOOT_REPOSITORY_BOILERPLATE_DIR);
  if(!options.package) {
    console.log(chalk.red('Por favor, coloque o nome do package para que possa ser atribuído ao template gerado'));
    return;
  }

  const objectNameCapitalized = capitalizeFirstLetter(objectName);
  const componentFile = SafeString
    .lift(fs.readFileSync(SPRING_BOOT_COMPONENT_BOILERPLATE_DIR, UTF8_ENCODING))
    .changePlaceholder(OBJECT_NAME_CAPITALIZED_PLACEHOLDER, objectNameCapitalized)
    .changePlaceholder(OBJECT_NAME_PLACEHOLDER, objectName.toLowerCase())
    .changePlaceholder(PACKAGE_NAME_PLACEHOLDER, options.package)
    .changePlaceholder(OBJECT_NAME_LOWERED_PLACEHOLDER, lowerFirstLetter(objectName))
    .get();

  const repositoryFile = SafeString
    .lift(fs.readFileSync(SPRING_BOOT_REPOSITORY_BOILERPLATE_DIR, UTF8_ENCODING))
    .changePlaceholder(OBJECT_NAME_CAPITALIZED_PLACEHOLDER, objectNameCapitalized)
    .changePlaceholder(PACKAGE_NAME_PLACEHOLDER, options.package)
    .get();

  if (!fs.existsSync(SPRING_BOOT_CONTROLLERS_SAVE_DIRECTORY)) {
    console.log(chalk.blue('Criado pasta Controllers'));
    fs.mkdirSync(SPRING_BOOT_CONTROLLERS_SAVE_DIRECTORY);
  }
  
  if (!fs.existsSync(`${SPRING_BOOT_CONTROLLERS_SAVE_DIRECTORY}/${objectNameCapitalized}Controller.java`)) {
    console.log(chalk.blue(`${objectNameCapitalized}Controller criado com sucesso`));
    fs.writeFileSync(`${SPRING_BOOT_CONTROLLERS_SAVE_DIRECTORY}/${objectNameCapitalized}Controller.java`, componentFile);
  }

  if (!fs.existsSync(SPRING_BOOT_REPOSITORIES_SAVE_DIRECTORY)) {
    console.log(chalk.blue('Criado pasta Repositories'));
    fs.mkdirSync(SPRING_BOOT_REPOSITORIES_SAVE_DIRECTORY);
  }
  
  if (!fs.existsSync(`${SPRING_BOOT_REPOSITORIES_SAVE_DIRECTORY}/${objectNameCapitalized}Repository.java`)) {
    console.log(chalk.blue(`${objectNameCapitalized}Repository criado com sucesso`));
    fs.writeFileSync(`${SPRING_BOOT_REPOSITORIES_SAVE_DIRECTORY}/${objectNameCapitalized}Repository.java`, repositoryFile);
  }

  if (!fs.existsSync(SPRING_BOOT_ENTITIES_SAVE_DIRECTORY)) {
    console.log(chalk.blue('Criado pasta Entities'));
    fs.mkdirSync(SPRING_BOOT_ENTITIES_SAVE_DIRECTORY);
  }

  if(!fs.existsSync(`${SPRING_BOOT_ENTITIES_SAVE_DIRECTORY}/${objectNameCapitalized}.java`)) {
    let modelFile = FluentWriteStream
      .lift(`${SPRING_BOOT_ENTITIES_SAVE_DIRECTORY}/${objectNameCapitalized}.java`)
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
        .writeAndJumpLine('  @Column');
      modelFile = propertyName.toUpperCase().includes('ID') ? 
        modelFile.writeAndJumpLine(`  private Long ${propertyName};`) :
        modelFile.writeAndJumpLine(`  private ${capitalizedPropertyName} ${propertyName};`);
    }
    modelFile = modelFile
      .newLine()
      .writeAndJumpLine(`}`)
      .end();
      console.log(chalk.blue(`Entidade ${objectNameCapitalized} criado com sucesso`));
  }

  const serviceFile = SafeString
    .lift(fs.readFileSync(SPRING_BOOT_SERVICE_BOILERPLATE_DIR, UTF8_ENCODING))
    .changePlaceholder(OBJECT_NAME_CAPITALIZED_PLACEHOLDER, objectNameCapitalized)
    .changePlaceholder(OBJECT_NAME_LOWERED_PLACEHOLDER, lowerFirstLetter(objectName))
    .changePlaceholder(PACKAGE_NAME_PLACEHOLDER, options.package)
    .get();

  if (!fs.existsSync(SPRING_BOOT_SERVICES_SAVE_DIRECTORY)) {
    console.log(chalk.blue('Criado pasta Services'));
    fs.mkdirSync(SPRING_BOOT_SERVICES_SAVE_DIRECTORY);
  }

  if (!fs.existsSync(`${SPRING_BOOT_SERVICES_SAVE_DIRECTORY}/${objectNameCapitalized}Service.java`)) {
    console.log(chalk.blue(`${objectNameCapitalized}Service criado com sucesso`));
    fs.writeFileSync(`${SPRING_BOOT_SERVICES_SAVE_DIRECTORY}/${objectNameCapitalized}Service.java`, serviceFile);
  }

  const serviceImplFile = SafeString
    .lift(fs.readFileSync(SPRING_BOOT_SERVICE_IMPL_BOILERPLATE_DIR, UTF8_ENCODING))
    .changePlaceholder(OBJECT_NAME_CAPITALIZED_PLACEHOLDER, objectNameCapitalized)
    .changePlaceholder(OBJECT_NAME_LOWERED_PLACEHOLDER, lowerFirstLetter(objectName))
    .changePlaceholder(PACKAGE_NAME_PLACEHOLDER, options.package)
    .get();

  if (!fs.existsSync(SPRING_BOOT_SERVICES_IMPL_SAVE_DIRECTORY)) {
    console.log(chalk.blue('Criado pasta Services/Impl'));
    fs.mkdirSync(SPRING_BOOT_SERVICES_IMPL_SAVE_DIRECTORY);
  }

  if (!fs.existsSync(`${SPRING_BOOT_SERVICES_IMPL_SAVE_DIRECTORY}/${objectNameCapitalized}ServiceImpl.java`)) {
    console.log(chalk.blue(`${objectNameCapitalized}ServiceImpl criado com sucesso`));
    fs.writeFileSync(`${SPRING_BOOT_SERVICES_IMPL_SAVE_DIRECTORY}/${objectNameCapitalized}ServiceImpl.java`, serviceImplFile);
  }

}

const capitalizeFirstLetter = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

const lowerFirstLetter = (string) => {
  return string.charAt(0).toLowerCase() + string.slice(1);
}

module.exports = {
  generateSpringBootCrud
}