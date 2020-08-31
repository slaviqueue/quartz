export type SyntaxNode = { type: SyntaxNodeType }

export type Module = { type: 'MODULE', body: Array<Expression> }

export type Expression = Condition | FunctionCall | VariableDeclaration | Primary | FunctionDeclaration
export type Primary = Group | FunctionCall | Number | Identifier

export type Condition = { type: 'CONDITION', condition: Expression, ifBranch: Expression, elseBranch: Expression }
export type FunctionCall = { type: 'FUNCTION_CALL', callee: Expression, arguments: Array<Expression> }
export type VariableDeclaration = { type: 'VARIABLE_DECLARATION', id: Identifier, value: Expression }
export type FunctionDeclaration = { type: 'FUNCTION_DECLARATION', id: Identifier, arguments: Array<Expression>, body: Array<Expression> }

export type Identifier = { type: 'IDENTIFIER', id: string }
export type Number = { type: 'NUMBER', value: number }
export type Group = { type: 'GROUP', body: Expression }
