function errorHandler(err, request, response, next) {
  // console.error(error);  // Commented out to silence tests.
  const { status = 500, message = "Something went wrong!" } = err;
  response.status(status).json({ error: message });
}

module.exports = errorHandler;
