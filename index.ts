import Parser from './lib/Parser/Parser'
import Scanner from './lib/Scanner/Scanner'
import { Module, SyntaxTree } from './lib/Parser/SyntaxNodes'
import CodeGenerator from './lib/CodeGenerator'
import PurityChecker from './lib/PurityChecker/PurityChecker'
import TypeInferer from './lib/TypeInferer/TypeInferer'

function parse (code: string) {
  const tokens = new Scanner(code).scan()
  return new Parser(tokens).parse()
}

function jsify (syntaxTree: Module) {
  // console.log(JSON.stringify(syntaxTree, null, '  '))
  return new CodeGenerator(syntaxTree).generate()
}

function checkPurity (syntaxTree: SyntaxTree) {
  return new PurityChecker(syntaxTree).check()
}

function checkTypes (syntaxTree: SyntaxTree) {
  return new TypeInferer(syntaxTree).infer()
}

const code = `
impure fn log (a: number) (void) {}

1 |> log

var a = 1
var a = 2
`

const tree = parse(code)
const js = jsify(tree)

checkPurity(tree)
checkTypes(tree)

console.log(js)
