class GeneralError extends Error {
	constructor(message, statusCode) {
		super(message);
		this.statusCode = statusCode;
		this.name = this.constructor.name;

		// Maintain proper stack trace -> error ma'lumotlarini to'g'ri saqlash
		Error.captureStackTrace(this, this.constructor);
	}

	static badRequest(message = 'Bad Request') {
		return new GeneralError(message, 400);
	}

	static notFound(message = 'Not Found') {
		return new GeneralError(message, 404);
	}

	static internal(message = 'Internal Server Error') {
		return new GeneralError(message, 500);
	}

	// ...
}

export default GeneralError;
