class InferenceError extends Error {
  constructor (message) {
    super(message)
    this.name = 'InferenceError'
  }
}

export default InferenceError
