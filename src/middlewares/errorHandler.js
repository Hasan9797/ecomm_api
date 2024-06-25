import Errors from "../errors/generalError.js";

const errorHandler = (err, req, res, next) => {
  if (err instanceof Errors) {
    return res.status(err.statusCode).json({
      error: {
        name: err.name,
        message: err.message,
      },
    });
  }

  // Log error for debugging
  console.error(err.message);

  res.status(500).json({
    error: {
      name: "InternalServerError",
      message: err.message, //'Something went wrong!',
      code: err.code,
    },
  });
};

export default errorHandler;
