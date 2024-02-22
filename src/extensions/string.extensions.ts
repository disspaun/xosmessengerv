// @ts-ignore
interface String {
  replaceAt(startIndex: number, length: number, replaceString: string): string
  insertAt(prev: string, insertString: string, start: number): string
}

String.prototype.replaceAt = function (startIndex: number, length: number, replaceString: string) {
  return this.substring(0, startIndex) + replaceString + this.substring(startIndex + length)
}

String.prototype.insertAt = function (prev: string, insertString: string, start: number) {
  return `${prev.slice(0, start)}${insertString}${prev.slice(start)}`
}
