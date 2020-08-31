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
var a = 1

if true then log(1) else log(0)

fn do_stuff(a) {
  fn (b) {
    a |> sum(b) |> log
  }
}

2 |> do_stuff(1)
`

console.log(jsify(parse(code)))
