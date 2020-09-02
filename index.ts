import Parser from './lib/Parser/Parser'
import Scanner from './lib/Scanner/Scanner'
import { Module } from './lib/Parser/SyntaxNodes'
import CodeGenerator from './lib/CodeGenerator'

function parse (code: string) {
  return new Parser(new Scanner(code).scan()).parse()
}

function jsify (syntaxTree: Module) {
  return new CodeGenerator(syntaxTree).generate()
}

const code = `
var a = 1

pure fn test_fn (a, b) {
  fn no_args () {
    fn () {
      sum(a, b)
    }
  }
}

(if true then do else not_do)(2)

1 + 2 * 3 - 2

test_fn(1, 2)()() |> log
`

console.log(jsify(parse(code)))
