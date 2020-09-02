import { isNil } from 'lodash'
import { Token } from './Token'
import { TokenType } from './TokenType'

type KeywordsMapping = Record<string, TokenType>

class Scanner {
  private code: string
  private currentPos: number
  private tokens: Array<Token>
  private keywords: KeywordsMapping

  constructor (code: string) {
    this.code = code

    this.currentPos = 0
    this.tokens = []

    this.keywords = {
      if: 'IF',
      then: 'THEN',
      else: 'ELSE',
      var: 'VAR',
      fn: 'FN',
      pure: 'PURE',
      impure: 'IMPURE'
    }
  }

  scan () {
    while (this.currentPos < this.code.length) {
      if (this.isNumber(this.current())) {
        this.eatMany('NUMBER', this.isNumber, Number)
      }

      else if (this.match("'")) {
        this.skipN(1)
        this.eatMany('STRING', this.isString.bind(this))
        this.skipN(1)
      }

      else if (this.isWhiteSpace(this.current())) {
        this.skipMany(this.isWhiteSpace)
      }

      else if (this.isText(this.current())) {
        this.eatIdentifier()
      }

      else if (this.matchMany('===')) {
        this.pushToken('STRICT_EQ', '===')
        this.skipN(3)
      }

      else if (this.match('=')) {
        this.eatOne('ASSIGNMENT')
      }

      else if (this.match('(')) {
        this.eatOne('L_PAREN')
      }

      else if (this.match(')')) {
        this.eatOne('R_PAREN')
      }

      else if (this.match('{')) {
        this.eatOne('L_CURLY')
      }

      else if (this.match('}')) {
        this.eatOne('R_CURLY')
      }

      else if (this.match('+')) {
        this.eatOne('PLUS')
      }

      else if (this.match('-')) {
        this.eatOne('MINUS')
      }

      else if (this.match('*')) {
        this.eatOne('ASTERISK')
      }

      else if (this.match('/')) {
        this.eatOne('SLASH')
      }

      else if (this.matchMany('|>')) {
        this.pushToken('PIPE', '|>')
        this.skipN(2)
      }

      else if (this.match(',')) {
        this.eatOne('COMA')
      }

      else {
        throw new Error(
          `unexpected character at ${this.currentPos}: ${this.current()}`
        )
      }
    }

    return this.tokens
  }

  current (): string {
    return this.code[this.currentPos]
  }

  prev (): string {
    return this.code[this.currentPos - 1]
  }

  match (char: string): boolean {
    return this.code[this.currentPos] === char
  }

  matchMany (chars: string): boolean {
    return this.code.substr(this.currentPos, chars.length) === chars
  }

  pushToken (type: TokenType, literal?: string): void {
    const token: Token = { type }

    if (!isNil(literal)) {
      token.literal = literal
    }

    this.tokens.push(token)
  }

  eatOne (type: TokenType): void {
    this.pushToken(type, this.current())
    this.currentPos++
  }

  eatMany (type: TokenType, tester: (s: string) => boolean, transform = a => a): void {
    this.pushToken(type, transform(this.readWhile(tester)))
  }

  skipMany (tester: (s: string) => boolean): void {
    this.readWhile(tester)
  }

  skipN (charsNumber: number): void {
    this.currentPos += charsNumber
  }

  readWhile (tester: (s: string) => boolean): string {
    let value: string = ''

    do {
      value += this.current()
      this.currentPos++
    } while (this.currentPos < this.code.length && tester(this.current()))

    return value
  }

  eatIdentifier (): void {
    const id = this.readWhile(this.isText)

    if (this.keywords[id]) {
      return this.pushToken(this.keywords[id], id)
    }

    return this.pushToken('IDENTIFIER', id)
  }

  isNumber (value: string): boolean {
    return /^[0-9]$/.test(value)
  }

  isWhiteSpace (value: string): boolean {
    return /[ \n]/.test(value)
  }

  isText (value: string): boolean {
    return /^[a-zA-Z_]$/.test(value)
  }

  isString (value: string): boolean {
    if (this.prev() === '\\') {
      return true
    }

    return value !== "'"
  }
}

export default Scanner
