const OBJECT_NAME_CAPITALIZED_PLACEHOLDER = '<%objectNameCapitalized%>';
const OBJECT_NAME_PLACEHOLDER = '<%objectName%>';
const PACKAGE_NAME_PLACEHOLDER = '<%packageName%>';
const OBJECT_NAME_LOWERED_PLACEHOLDER = '<%objectNameLowered%>';

class SafeString {
  constructor(string) {
    this.string = string
  }

  static lift(stringtoLift) {
    return new SafeString(stringtoLift);
  }

  changeCapitalizedObjectName(capitalizedObjectName) {
    const stringWithoutCapitalizedPlaceholder = this.string.split(OBJECT_NAME_CAPITALIZED_PLACEHOLDER).join(capitalizedObjectName);
    return new SafeString(stringWithoutCapitalizedPlaceholder);
  }

  changeObjectName(objectName) {
    const stringWithoutObjectNamePlaceholder =  this.string.split(OBJECT_NAME_PLACEHOLDER).join(objectName);
    return new SafeString(stringWithoutObjectNamePlaceholder);
  }

  changePackageName(packageName) {
    const stringWithoutPackageNamePlaceholder = this.string.split(PACKAGE_NAME_PLACEHOLDER).join(packageName);
    return new SafeString(stringWithoutPackageNamePlaceholder);
  }

  changeLoweredObjectName(lowredObjectName) {
    const stringWithoutLoweredPlaceholder = this.string.split(OBJECT_NAME_LOWERED_PLACEHOLDER).join(lowredObjectName)
    return new SafeString(stringWithoutLoweredPlaceholder);
  }

  get() {
    return this.string;
  }
}

module.exports = SafeString;