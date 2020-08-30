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
      module.body.push(this.pipe())
    }

    return module
  }

  pipe (): object {
    const expr = this.expr()
    const body = []

    if (this.match('PIPE')) {
      body.push(expr)

      do {
        const secondExpr = this.expr()
        body.push(secondExpr)
      } while (this.match('PIPE'))
    }

    if (body.length) {
      return { type: 'PIPE', body }
    }

    else {
      return expr
    }
  }

  expr (): object {
    if (this.match('IF')) {
      const condition = this.pipe()
      this.matchStrict('THEN')

      const ifBranch = this.pipe()
      this.matchStrict('ELSE')

      const elseBranch = this.pipe()

      return { type: 'CONDITION', condition, ifBranch, elseBranch }
    }

    else if (this.match('VAL')) {
      this.matchStrict('IDENTIFIER')
      const id = this.prev()
      this.matchStrict('ASSIGNMENT')
      const value = this.pipe()

      return { type: 'DECLARATION', id, value }
    }

    return this.primary()
  }

  primary (): object {
    if (this.match('IDENTIFIER')) {
      if (this.check('L_PAREN')) {
        return this.finishFunction()
      }

      else {
        return this.prev()
      }
    }

    else if (this.match('L_PAREN')) {
      return this.finishGroup()
    }

    else if (this.match('NUMBER')) {
      return this.prev()
    }

    return this.complain()
  }

  finishGroup () {
    const group = { type: 'GROUP', body: this.pipe() }

    this.match('R_PAREN')
    return group
  }

  finishFunction () {
    const functionCall: { type: string, callee: object, arguments: Array<object | null> } = {
      type: 'FUNCTION_CALL',
      callee: this.prev(),
      arguments: []
    }

    this.move()

    while (!this.check('R_PAREN')) {
      const arg = this.pipe()

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

export default Parser
