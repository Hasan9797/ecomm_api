class Errors extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.name = this.constructor.name;

    // Maintain proper stack trace -> error ma'lumotlarini to'g'ri saqlash
    Error.captureStackTrace(this, this.constructor);
  }

  static noAuthorization(message = "Authorization failed") {
    return new Errors(message, 401);
  }

  static forbeddinError(message = "user role is not Super Admin") {
    return new Errors(message, 403);
  }

  static badRequest(message = "Bad Request") {
    return new Errors(message, 400);
  }

  static notFound(message = "Not Found") {
    return new Errors(message, 404);
  }

  static internal(message = "Internal Server Error") {
    return new Errors(message, 500);
  }
}

export default Errors;
