export type SyntaxTree = Module | Expression

export type Module = { type: 'MODULE', body: Array<Expression> }

export type Expression
  = Condition
  | FunctionCall
  | VariableDeclaration
  | Binary
  | Primary
  | FunctionDeclaration

export type Binary
  = Subtraction
  | Addition
  | Multiplication
  | Division

export type Primary
  = Group
  | FunctionCall
  | Number
  | Identifier
  | String
  | FunctionParameter

export type Condition = { type: 'CONDITION', condition: Expression, ifBranch: Expression, elseBranch: Expression }
export type FunctionCall = { type: 'FUNCTION_CALL', callee: Expression, arguments: Array<Expression> }
export type VariableDeclaration = { type: 'VARIABLE_DECLARATION', id: Identifier, value: Expression, varType: string }

export type FunctionDeclaration = {
  type: 'FUNCTION_DECLARATION',
  id: Identifier,
  parameters: Array<FunctionParameter>,
  body: Array<Expression>,
  purity: 'pure' | 'impure',
  returnType?: string
}

export type FunctionParameter = { type: 'FUNCTION_PARAMETER', paramType: string, id: string }

export type Subtraction = { type: 'SUBTRACTION', left: Expression, right: Expression }
export type Addition = { type: 'ADDITION', left: Expression, right: Expression }
export type Multiplication = { type: 'MULTIPLICATION', left: Expression, right: Expression }
export type Division = { type: 'DIVISION', left: Expression, right: Expression }

export type Identifier = { type: 'IDENTIFIER', id: string }
export type Number = { type: 'NUMBER', value: number }
export type String = { type: 'STRING', value: string }
export type Group = { type: 'GROUP', body: Expression }
