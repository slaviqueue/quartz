export type SyntaxNode = { type: SyntaxNodeType }

export type Module = { type: 'MODULE', body: Array<Expression> }

export type Expression = Condition | FunctionCall | Declaration | Primary | Pipe
export type Primary = Group | FunctionCall | Number | Identifier

export type Pipe = { type: 'PIPE', body: Array<Expression> }
export type Condition = { type: 'CONDITION', condition: Expression, ifBranch: Expression, elseBranch: Expression }
export type FunctionCall = { type: 'FUNCTION_CALL', callee: Expression, arguments: Array<Expression> }
export type Declaration = { type: 'DECLARATION', id: Identifier, value: Expression }

export type Identifier = { type: 'IDENTIFIER', id: string }
export type Number = { type: 'NUMBER', value: number }
export type Group = { type: 'GROUP', body: Expression }
