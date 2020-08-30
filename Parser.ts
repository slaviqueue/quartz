import BaseParser from './BaseParser'

class Parser extends BaseParser {
  parse() {
    return this.module()
  }

  module() {
    const module: { type: string; body: Array<object | null> } = {
      type: "MODULE",
      body: []
    };

    while (this.currentPos < this.tokens.length) {
      module.body.push(this.expr());
    }

    return module;
  }

  expr(): object {
    if (this.match("IF")) {
      const condition = this.expr();
      this.matchStrict("THEN");

      const ifBranch = this.expr();
      this.matchStrict("ELSE");

      const elseBranch = this.expr();

      return { type: "CONDITION", condition, ifBranch, elseBranch };
    }

    return this.primary()
  }

  primary(): object {
    if (this.match("IDENTIFIER")) {
      if (this.check('L_PAREN')) {
        const functionCall: { type: string, callee: object, arguments: Array<object | null> } = {
          type: 'FUNCTION_CALL',
          callee: this.prev(),
          arguments: []
        }

        this.move()

        while(!this.check('R_PAREN')) {
          const arg = this.expr()

          functionCall.arguments.push(arg)
          this.match('COMA')
        }

        this.matchStrict('R_PAREN')

        return functionCall
      } else {
        return this.prev();
      }
    }

    return this.complain()    
  }

  complain(): object {
    throw new Error(`Unexpected token ${this.current().type}`);
  }
}

const tokens = [
  { type: "IF" },
  { type: "IDENTIFIER", literal: "a" },
  { type: "THEN" },
  { type: "IDENTIFIER", literal: "b" },
  { type: "ELSE" },
  { type: "IF" },
  { type: "IDENTIFIER", literal: "a" },
  { type: "THEN" },
  { type: "IDENTIFIER", literal: "b" },
  { type: "ELSE" },
  { type: "IDENTIFIER", literal: "v" },

  { type: "IF" },
    { type: "IDENTIFIER", literal: "a" },
    { type: "L_PAREN" },
    { type: "IDENTIFIER", literal: "a" },
    { type: "COMA" },
    { type: "IDENTIFIER", literal: "a" },
    { type: "R_PAREN" },
  { type: "THEN" },
  { type: "IDENTIFIER", literal: "b" },
  { type: "ELSE" },
  { type: "IDENTIFIER", literal: "v" }
];

const result = new Parser(tokens).parse();

console.log(result);
