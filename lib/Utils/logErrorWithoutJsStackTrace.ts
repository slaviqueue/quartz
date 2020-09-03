function logErrorWithoutJsStackTrace (error: Error) {
  console.log(`${error.name}: ${error.message}`)
}

export default logErrorWithoutJsStackTrace
