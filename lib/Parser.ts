import BaseParser from './BaseParser'
import { Module, Expression, Primary, Group, FunctionCall, Identifier, Number, Condition, Declaration } from './SyntaxNodes'

class Parser extends BaseParser {
  parse () {
    return this.module()
  }

  module () {
    const module: Module = {
      type: 'MODULE',
      body: []
    }

    while (this.currentPos < this.tokens.length) {
      module.body.push(this.pipe())
    }

    return module
  }

  pipe (): Expression {
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
      return body.reduce((acc, node) => ({ type: 'FUNCTION_CALL', callee: node, arguments: [acc] }))
    }

    else {
      return expr
    }
  }

  expr (): Expression {
    if (this.match('IF')) {
      return this.condition()
    }

    else if (this.match('VAR')) {
      return this.var()
    }

    return this.primary()
  }

  condition (): Condition {
    const condition = this.pipe()
    this.matchStrict('THEN')

    const ifBranch = this.pipe()
    this.matchStrict('ELSE')

    const elseBranch = this.pipe()

    return { type: 'CONDITION', condition, ifBranch, elseBranch }
  }

  var (): Declaration {
    this.matchStrict('IDENTIFIER')
    const id = this.prev()
    this.matchStrict('ASSIGNMENT')
    const value = this.pipe()

    return { type: 'DECLARATION', id: { type: 'IDENTIFIER', id: id.literal }, value }
  }

  primary (): Primary {
    if (this.match('IDENTIFIER')) {
      if (this.check('L_PAREN')) {
        return this.functionCall()
      }

      else {
        return this.identifier()
      }
    }

    else if (this.check('L_PAREN')) {
      return this.group()
    }

    else if (this.match('NUMBER')) {
      return this.number()
    }

    return this.complain()
  }

  identifier (): Identifier {
    return { type: 'IDENTIFIER', id: this.prev().literal }
  }

  number (): Number {
    return { type: 'NUMBER', value: this.prev().literal }
  }

  group (): Group {
    this.matchStrict('R_PAREN')
    const group: Group = { type: 'GROUP', body: this.pipe() }
    this.matchStrict('R_PAREN')

    return group
  }

  functionCall (): FunctionCall {
    const functionCall: FunctionCall = {
      type: 'FUNCTION_CALL',
      callee: { type: 'IDENTIFIER', id: this.prev().literal },
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

  complain (): Primary {
    throw new Error(`Unexpected token ${this.current().type}`)
  }
}

export default Parser
