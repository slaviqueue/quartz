let counter = 0

function getFreshVariableName () {
  const name = `Var-${counter}`

  counter++
  return name
}

export default getFreshVariableName
