import Parser from './lib/Parser'
import Scanner from './lib/Scanner'

function parse (code: string) {
  return new Parser(new Scanner(code).scan()).parse()
}

const code = `
  val a = sum(1, 2)
  if 1 then yes() else no()
`

console.log(JSON.stringify(parse(code), null, '  '))
