class PurityCheckError extends Error {
  constructor (message) {
    super(message)
    this.name = 'PurityCheckError'
  }
}

export default PurityCheckError
