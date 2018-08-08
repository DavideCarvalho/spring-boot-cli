const fs = require('fs');

class FluentWriteStream {

  constructor(writeStream) {
    this.writeStream = writeStream;
  }

  static lift(filePath) {
    return new FluentWriteStream(fs.createWriteStream(filePath))
  }

  newLine() {
    this.writeStream.write('\n');
    return new FluentWriteStream(this.writeStream);
  }

  write(stringToWrite) {
    this.writeStream.write(`${stringToWrite}`);
    return new FluentWriteStream(this.writeStream);
  }

  writeAndJumpLine(stringToWrite) {
    this.writeStream.write(`${stringToWrite}\n`);
    return new FluentWriteStream(this.writeStream);
  }

  get() {
    return this.writeStream;
  }

  end() {
    this.writeStream.end();
  }
}

module.exports = FluentWriteStream;