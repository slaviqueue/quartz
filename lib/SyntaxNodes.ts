export type SyntaxNode = { type: SyntaxNodeType }

export type Module = SyntaxNode & { body: Array<SyntaxNode> }

export type Expression = Condition | FunctionCall | Declaration | Primary | Pipe
export type Primary = Group | FunctionCall | Number | Identifier

export type Pipe = SyntaxNode & { body: Array<Expression> }
export type Condition = SyntaxNode & { condition: Expression, ifBranch: Expression, elseBranch: Expression }
export type FunctionCall = SyntaxNode & { callee: Expression, arguments: Array<Expression> }
export type Declaration = SyntaxNode & { id: Identifier, value: Expression }

export type Identifier = SyntaxNode & { id: string }
export type Number = SyntaxNode & { value: number }
export type Group = SyntaxNode & { body: Expression }
