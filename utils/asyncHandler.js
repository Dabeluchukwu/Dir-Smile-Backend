const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch((err) => {
    console.error('Async handler error:', err);
    next(err);
  });
};

module.exports = asyncHandler;