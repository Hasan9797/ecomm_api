import GeneralError from '../helpers/generalError.js';

const errorHandler = (err, req, res, next) => {
	if (err instanceof GeneralError) {
		return res.status(err.statusCode).json({
			error: {
				name: err.name,
				message: err.message,
			},
		});
	}

	// Log error for debugging
	console.error(err);

	res.status(500).json({
		error: {
			name: 'InternalServerError',
			message: err.message, //'Something went wrong!',
			code: err.code,
		},
	});
};

export default errorHandler;
