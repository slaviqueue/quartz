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
      '=': 'ASSIGNMENT'
    }
  }

  scan () {
    while (this.currentPos < this.code.length) {
      if (this.isNumber(this.current())) {
        this.eatMany('NUMBER', this.isNumber)
      } else if (this.isWhiteSpace(this.current())) {
        this.skipMany(this.isWhiteSpace)
      } else if (this.isText(this.current())) {
        this.eatIdentifier()
      } else if (this.matchMany('===')) {
        this.pushToken('STRICT_EQ')
        this.skipN(3)
      } else if (this.match('(')) {
        this.eatOne('L_PAREN')
      } else if (this.match(')')) {
        this.eatOne('R_PAREN')
      } else if (this.matchMany('|>')) {
        this.pushToken('PIPE')
        this.skipN(2)
      } else if (this.match(',')) {
        this.eatOne('COMA')
      } else {
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

  match (char: string): boolean {
    return this.code[this.currentPos] === char
  }

  matchMany (chars: string): boolean {
    return this.code.substr(this.currentPos, chars.length) === chars
  }

  pushToken (type: TokenType, literal?: string): void {
    this.tokens.push({ type, literal })
  }

  eatOne (type: TokenType): void {
    this.pushToken(type)
    this.currentPos++
  }

  eatMany (type: TokenType, tester: (s: string) => boolean): void {
    this.pushToken(type, this.readWhile(tester))
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
    } while (tester(this.current()))

    return value
  }

  eatIdentifier (): void {
    const id = this.readWhile(this.isText)

    if (this.keywords[id]) {
      return this.pushToken(this.keywords[id])
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
    return /^[a-z]$/.test(value)
  }
}

const code = `
  plus(3, 5) |> print

  if a then 3 else 5
`

const result = new Scanner(code).scan()

console.log(result)