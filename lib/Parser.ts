import BaseParser from './BaseParser'
import { Module, Expression, Primary, Group, FunctionCall, Identifier, Number, Condition, VariableDeclaration, FunctionDeclaration } from './SyntaxNodes'

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
    if (this.check('IF')) {
      return this.condition()
    }

    else if (this.check('VAR')) {
      return this.variableDeclaration()
    }

    else if (this.check('FN')) {
      return this.functionDeclaration()
    }

    return this.primary()
  }

  condition (): Condition {
    this.matchStrict('IF')
    const condition = this.pipe()
    this.matchStrict('THEN')

    const ifBranch = this.pipe()
    this.matchStrict('ELSE')

    const elseBranch = this.pipe()

    return { type: 'CONDITION', condition, ifBranch, elseBranch }
  }

  functionDeclaration (): FunctionDeclaration {
    this.matchStrict('FN')

    const functionDeclaration: FunctionDeclaration = {
      type: 'FUNCTION_DECLARATION',
      id: this.check('IDENTIFIER') ? this.identifier() : null,
      arguments: [],
      body: []
    }

    this.matchStrict('L_PAREN')

    while (!this.check('R_PAREN')) {
      functionDeclaration.arguments.push(this.identifier())
      this.match('COMA')
    }

    this.matchStrict('R_PAREN')
    this.matchStrict('L_CURLY')

    while (!this.check('R_CURLY')) {
      functionDeclaration.body.push(this.pipe())
    }

    this.matchStrict('R_CURLY')

    return functionDeclaration
  }

  variableDeclaration (): VariableDeclaration {
    this.matchStrict('VAR')
    const id = this.identifier()
    this.matchStrict('ASSIGNMENT')
    const value = this.pipe()

    return { type: 'VARIABLE_DECLARATION', id, value }
  }

  primary (): Primary {
    if (this.check('IDENTIFIER')) {
      if (this.check('L_PAREN', 1)) {
        return this.functionCall()
      }

      else {
        return this.identifier()
      }
    }

    else if (this.check('L_PAREN')) {
      return this.group()
    }

    else if (this.check('NUMBER')) {
      return this.number()
    }

    return this.complain()
  }

  identifier (): Identifier {
    this.matchStrict('IDENTIFIER')
    return { type: 'IDENTIFIER', id: this.prev().literal }
  }

  number (): Number {
    this.matchStrict('NUMBER')
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
      callee: this.identifier(),
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
