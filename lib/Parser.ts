import BaseParser from './BaseParser'

class Parser extends BaseParser {
  parse () {
    return this.module()
  }

  module () {
    const module: { type: string, body: Array<object | null> } = {
      type: 'MODULE',
      body: []
    }

    while (this.currentPos < this.tokens.length) {
      module.body.push(this.expr())
    }

    return module
  }

  expr (): object {
    if (this.match('IF')) {
      const condition = this.expr()
      this.matchStrict('THEN')

      const ifBranch = this.expr()
      this.matchStrict('ELSE')

      const elseBranch = this.expr()

      return { type: 'CONDITION', condition, ifBranch, elseBranch }
    }

    return this.primary()
  }

  primary (): object {
    if (this.match('IDENTIFIER')) {
      if (this.check('L_PAREN')) {
        return this.finishFunction()
      } else {
        return this.prev()
      }
    } else if (this.match('L_PAREN')) {
      const group = { type: 'GROUP', body: this.expr() }

      this.match('R_PAREN')
      return group
    }

    return this.complain()
  }

  finishFunction () {
    const functionCall: {
      type: string
      callee: object
      arguments: Array<object | null>
    } = {
      type: 'FUNCTION_CALL',
      callee: this.prev(),
      arguments: []
    }

    this.move()

    while (!this.check('R_PAREN')) {
      const arg = this.expr()

      functionCall.arguments.push(arg)
      this.match('COMA')
    }

    this.matchStrict('R_PAREN')

    return functionCall
  }

  complain (): object {
    throw new Error(`Unexpected token ${this.current().type}`)
  }
}

const tokens = [
  { type: 'IF' },
  { type: 'IDENTIFIER', literal: 'a' },
  { type: 'THEN' },
  { type: 'IDENTIFIER', literal: 'b' },
  { type: 'ELSE' },
  { type: 'IF' },
  { type: 'IDENTIFIER', literal: 'a' },
  { type: 'THEN' },
  { type: 'IDENTIFIER', literal: 'b' },
  { type: 'ELSE' },
  { type: 'IDENTIFIER', literal: 'v' },

  { type: 'IF' },
  { type: 'IDENTIFIER', literal: 'a' },
  { type: 'L_PAREN' },
  { type: 'IF' },
  { type: 'IDENTIFIER', literal: 'a' },
  { type: 'THEN' },
  { type: 'IDENTIFIER', literal: 'b' },
  { type: 'ELSE' },
  { type: 'L_PAREN' },
  { type: 'IDENTIFIER', literal: 'c' },
  { type: 'R_PAREN' },
  { type: 'COMA' },
  { type: 'IDENTIFIER', literal: 'a' },
  { type: 'R_PAREN' },
  { type: 'THEN' },
  { type: 'IDENTIFIER', literal: 'b' },
  { type: 'ELSE' },
  { type: 'IDENTIFIER', literal: 'v' }
]

const result = new Parser(tokens).parse()

console.log(result)
