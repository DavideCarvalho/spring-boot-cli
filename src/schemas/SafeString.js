class SafeString {
  constructor(string) {
    this.string = string
  }

  static lift(stringtoLift) {
    return new SafeString(stringtoLift);
  }

  changePlaceholder(placeholderToChange, stringToPutInPlace) {
    const stringWithoutPlaceholder = this.string.split(placeholderToChange).join(stringToPutInPlace);
    return new SafeString(stringWithoutPlaceholder);
  }

  get() {
    return this.string;
  }
}

module.exports = SafeString;