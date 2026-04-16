const errorHandler = (err, req, res, next) => {
  console.error(`[ERROR] ${err.message}`);
  const status = err.status || 500;
  res.status(status).json({
    status: "error",
    message: err.message || "Internal server error",
  });
};

module.exports = errorHandler;
