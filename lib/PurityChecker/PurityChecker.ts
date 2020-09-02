import { SyntaxTree, FunctionCall, FunctionDeclaration } from '../Parser/SyntaxNodes'

type Identifier = string
type Purity = 'pure' | 'impure'

class Environment {
  public parent: Environment
  public functions: Record<Identifier, Purity>

  constructor (parent?: Environment) {
    this.parent = parent
    this.functions = {}
  }
}

class PurityChecker {
  currentEnv: Environment
  syntaxTree: SyntaxTree

  constructor (syntaxTree: SyntaxTree) {
    this.syntaxTree = syntaxTree
    this.currentEnv = new Environment()
  }

  public check () {
    this.checkNode(this.syntaxTree)
  }

  private checkNode (syntaxNode: SyntaxTree): Purity {
    switch (syntaxNode.type) {
      case 'MODULE': {
        return this.getSinglePurity(this.getExpressionsPurities(syntaxNode.body))
      }

      case 'FUNCTION_DECLARATION': {
        this.currentEnv = new Environment(this.currentEnv)

        const id = syntaxNode.id?.id

        if (syntaxNode.purity === 'impure') {
          this.setFunctionDeclarationPurityAndPopCurrentEnv(id, 'impure')
          return
        }

        const usedFunctionPurities: Array<Purity> = []

        for (const expr of syntaxNode.body) {
          usedFunctionPurities.push(this.checkNode(expr))
        }

        const isFunctionActuallyPure = usedFunctionPurities.indexOf('impure') === -1

        this.complainIfSpecifiedFunctionPurityIsIncorrect(syntaxNode, isFunctionActuallyPure)
        this.setFunctionDeclarationPurityAndPopCurrentEnv(id, isFunctionActuallyPure ? 'pure' : 'impure')

        return this.currentEnv[id]
      }

      case 'FUNCTION_CALL': {
        const { callee } = (syntaxNode as FunctionCall)

        if (callee.type !== 'IDENTIFIER') {
          return null
        }

        return this.getSinglePurity([
          this.getFunctionPurity(callee.id, this.currentEnv),
          ...this.getExpressionsPurities(syntaxNode.arguments)
        ])
      }

      default: {
        return 'pure'
      }
    }
  }

  private complainIfSpecifiedFunctionPurityIsIncorrect (syntaxNode: FunctionDeclaration, isFunctionActuallyPure: boolean) {
    if (syntaxNode.purity === 'pure' && !isFunctionActuallyPure) {
      throw new Error(`Function "${syntaxNode.id.id}" is actually impure bruh`)
    }
  }

  private setFunctionDeclarationPurityAndPopCurrentEnv (id: Identifier, purity: Purity): void {
    this.currentEnv.parent.functions[id] = purity
    this.currentEnv = this.currentEnv.parent
  }

  private getSinglePurity (purities: Array<Purity>): Purity {
    return purities.indexOf('impure') === -1 ? 'pure' : 'impure'
  }

  private getExpressionsPurities (expressions: Array<SyntaxTree>): Array<Purity> {
    return expressions.map(this.checkNode.bind(this))
  }

  private getFunctionPurity (id: Identifier, env: Environment): Purity {
    if (env.functions[id]) {
      return env.functions[id]
    }

    if (!env.parent) {
      return null
    }

    return this.getFunctionPurity(id, env.parent)
  }
}

export default PurityChecker
