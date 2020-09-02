import Parser from './lib/Parser/Parser'
import Scanner from './lib/Scanner/Scanner'
import { Module, SyntaxTree } from './lib/Parser/SyntaxNodes'
import CodeGenerator from './lib/CodeGenerator'
import PurityChecker from './lib/PurityChecker/PurityChecker'

function parse (code: string) {
  return new Parser(new Scanner(code).scan()).parse()
}

function jsify (syntaxTree: Module) {
  return new CodeGenerator(syntaxTree).generate()
}

function checkPurity (syntaxTree: SyntaxTree) {
  return new PurityChecker(syntaxTree).check()
}

const code = `
impure fn test () {
  var a = 1

  pure fn oneMore () {}

  impure fn ohMan (a) {}

  oneMore(ohMan())
}

impure fn oneMoreTest () {
  test()
}

`

const tree = parse(code)
const js = jsify(tree)

checkPurity(tree)

console.log(js)
