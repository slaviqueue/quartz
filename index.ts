import Parser from './lib/Parser/Parser'
import Scanner from './lib/Scanner/Scanner'
import { Module, SyntaxTree } from './lib/Parser/SyntaxNodes'
import CodeGenerator from './lib/CodeGenerator'
import PurityChecker from './lib/PurityChecker/PurityChecker'

function parse (code: string) {
  const tokens = new Scanner(code).scan()
  return new Parser(tokens).parse()
}

function jsify (syntaxTree: Module) {
  return new CodeGenerator(syntaxTree).generate()
}

function checkPurity (syntaxTree: SyntaxTree) {
  return new PurityChecker(syntaxTree).check()
}

const code = `
impure fn fetch() {}

pure fn ohMan (a) {
  fetch('http://google.com')
    |> pThen(log)
    |> pCatch(log)
}
`

const tree = parse(code)
const js = jsify(tree)

checkPurity(tree)

console.log(js)
