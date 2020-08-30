type Token = {
  type: string;
  literal?: string;
};

class BaseParser {
  protected tokens: Array<Token>;
  protected currentPos: number;

  constructor (tokens: Array<Token> = []) {
    this.tokens = tokens
    this.currentPos = 0
  }

  protected match (tokenType: string) {
    const matches = this.check(tokenType)

    if (matches) this.move()

    return matches
  }

  protected check (tokenType: string, offset: number = 0) {
    const currentToken = this.tokens[this.currentPos + offset]

    if (currentToken && currentToken.type === tokenType) {
      return true
    }

    return false
  }

  protected matchStrict (tokenType: string) {
    const match = this.match(tokenType)

    if (!match) {
      throw new Error(
        `Unexpected token ${this.current().type}, expected: ${tokenType}`
      )
    }
  }

  protected move () {
    this.currentPos++
  }

  protected prev () {
    return this.tokens[this.currentPos - 1]
  }

  protected next () {
    return this.tokens[this.currentPos + 1]
  }

  protected current () {
    return this.tokens[this.currentPos]
  }

  protected back () {
    this.currentPos--
  }
}

export default BaseParser
