import { Module, Expression, Identifier, Declaration, Condition, Group, Number, FunctionCall } from './SyntaxNodes'

class CodeGenerator {
  module: Module

  constructor (module: Module) {
    this.module = module
  }

  public generate (): string {
    return this.module.body.map((expr) => this.node(expr as Expression)).join('\n')
  }

  private node (node: Expression) {
    switch (node.type) {
      case 'DECLARATION': {
        const decl = node as Declaration
        return `const ${this.node(decl.id)} = ${this.node(decl.value)}`
      }

      case 'CONDITION': {
        const cond = node as Condition
        return `${this.node(cond.condition)} ? ${this.node(cond.ifBranch)} : ${this.node(cond.elseBranch)}`
      }

      case 'GROUP': {
        const group = node as Group
        return `(${this.node(group.body)})`
      }

      case 'IDENTIFIER': {
        const id = node as Identifier
        return id.id
      }

      case 'NUMBER': {
        const num = node as Number
        return num.value
      }

      case 'FUNCTION_CALL': {
        const call = node as FunctionCall
        return `${this.node(call.callee)}(${node.arguments.map((arg) => this.node(arg)).join(', ')})`
      }

      default: {
        throw new Error(`Unspecified generation branch for node ${(node as Expression).type}`)
      }
    }
  }
}

export default CodeGenerator
