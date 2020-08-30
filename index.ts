import Parser from './lib/Parser'
import Scanner from './lib/Scanner'

function parse (code: string) {
  return new Parser(new Scanner(code).scan()).parse()
}

const code = `
  if a
    then b
    else a |> b |> c
`

console.log(JSON.stringify(parse(code), null, '  '))
