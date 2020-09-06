import { zip } from 'lodash'
import { SyntaxTree, VariableDeclaration, FunctionCall, FunctionDeclaration, FunctionParameter, Module } from '../Parser/SyntaxNodes'
import InferenceError from './InferenceError'

type Identifier = string

type Type
  = VarType
  | NamedType
  | FunctionType

type VarType = { type: 'VAR_TYPE', name: string }
type NamedType = { type: 'NAMED_TYPE', name: string }
type FunctionType = { type: 'FUNCTION_TYPE', paramTypes: Array<string>, resultType: string }

class Environment {
  public parent: Environment
  public types: Record<Identifier, Type>

  constructor (parent?: Environment) {
    this.parent = parent
    this.types = {}
  }
}

class TypeInferer {
  syntaxTree: SyntaxTree
  currentEnv: Environment

  constructor (syntaxTree: SyntaxTree) {
    this.syntaxTree = syntaxTree
    this.currentEnv = new Environment()
  }

  public infer (): void {
    this.inferNode(this.syntaxTree)
  }

  private inferNode (node: SyntaxTree): Type {
    switch (node.type) {
      case 'MODULE': {
        const module = node as Module

        for (const expr of module.body) {
          this.inferNode(expr)
        }

        break
      }

      case 'VARIABLE_DECLARATION': {
        const decl = node as VariableDeclaration
        const valueType = this.inferNode(decl.value)

        if (this.currentEnv[decl.id.id]) {
          throw new Error(`Cannot reassign ${decl.id.id}`)
        }

        if (decl.varType && decl.varType !== (valueType as NamedType).name) {
          throw new InferenceError(`Type mismatch. Expected ${decl.id.id} to have type ${decl.varType} but got ${(valueType as NamedType).name}`)
        }

        return valueType
      }

      case 'FUNCTION_CALL': {
        const call = node as FunctionCall
        const calleeType = this.inferNode(call.callee)
        const argTypes = call.arguments.map(this.inferNode.bind(this))

        if (calleeType.type !== 'FUNCTION_TYPE') {
          throw new InferenceError(`${calleeType.name} is not a function`)
        }

        if (!zip(calleeType.paramTypes, argTypes).every(([p, a]) => p === (a as NamedType).name)) {
          throw new InferenceError('Function params and actual arguments mismatch')
        }

        return calleeType
      }

      case 'FUNCTION_DECLARATION': {
        const decl = node as FunctionDeclaration
        const id = decl.id.id

        this.currentEnv = new Environment(this.currentEnv)

        const paramTypes = decl.parameters.map((p) => this.inferFunctionParamType(p))
        const resultType = this.inferFunctionReturnType(decl)

        const type: FunctionType = {
          type: 'FUNCTION_TYPE',
          paramTypes,
          resultType
        }

        this.currentEnv.parent.types[id] = type

        this.currentEnv = this.currentEnv.parent
        return type
      }

      case 'IDENTIFIER': {
        return this.resolveTypeById(node.id)
      }

      case 'NUMBER': {
        return { type: 'NAMED_TYPE', name: 'number' }
      }

      case 'STRING': {
        return { type: 'NAMED_TYPE', name: 'string' }
      }

      default: {
        throw new InferenceError(`Inference rule for ${node.type} is not implemented`)
      }
    }
  }

  private areTypesEqual (t1: Type, t2: Type): boolean {
    if (t1.type !== t2.type) {
      return false
    }

    if (t1.type === 'FUNCTION_TYPE') {
      const fn1 = t1 as FunctionType
      const fn2 = t2 as FunctionType

      const areResultTypesEqual = fn1.resultType === fn2.resultType
      const areParamTypesEqual = zip(fn1.paramTypes, fn2.paramTypes).every(([p1, p2]) => p1 === p2)

      return areResultTypesEqual && areParamTypesEqual
    }

    if (t1.name === (t2 as NamedType | VarType).name) {
      return true
    }

    return false
  }

  private inferFunctionReturnType (decl: FunctionDeclaration): string {
    if (decl.returnType) {
      return decl.returnType
    }

    throw new Error('cannot infer yet') // temporarly
  }

  private inferFunctionParamType (param: FunctionParameter): string {
    if (param.paramType) {
      const type: NamedType = { type: 'NAMED_TYPE', name: param.paramType }
      this.currentEnv.types[param.id] = type

      return param.paramType
    }

    throw new Error('cannot ifner param types yet') // temportarly
  }

  private resolveTypeById (id: Identifier): Type {
    let tempEnv = this.currentEnv

    do {
      if (tempEnv.types[id]) {
        return tempEnv.types[id]
      }

      tempEnv = tempEnv.parent
    } while (tempEnv)

    throw new InferenceError(`Cannot resolve symbol ${id}`)
  }
}

export default TypeInferer
