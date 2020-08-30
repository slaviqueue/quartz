import Parser from './lib/Parser'
import Scanner from './lib/Scanner'
import { Module } from './lib/SyntaxNodes'
import CodeGenerator from './lib/CodeGenerator'

function parse (code: string) {
  return new Parser(new Scanner(code).scan()).parse()
}

function jsify (syntaxTree: Module) {
  return new CodeGenerator(syntaxTree).generate()
}

const code = `
1 |> sum(1) |> log
`

console.log(jsify(parse(code)))
