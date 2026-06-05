import config from '../config/index.js';

export const errorHandler = (err, req, res, next) => {
  // Supabase returns plain objects (not Error instances), so .stack may be undefined
  // Log the full error for debugging
  console.error('[ErrorHandler]', err.stack || JSON.stringify(err));

  // Supabase error object
  if (err.code && typeof err.code === 'string' && err.message) {
    // PGRST116 = row not found
    if (err.code === 'PGRST116') {
      return res.status(404).json({
        error: 'Not Found',
        message: 'Resource not found',
      });
    }
    // 23505 = unique constraint violation
    if (err.code === '23505') {
      return res.status(409).json({
        error: 'Conflict',
        message: 'Resource already exists',
      });
    }
    // Any other Supabase / DB error
    return res.status(500).json({
      error: 'Database Error',
      message: config.nodeEnv === 'development' ? `[${err.code}] ${err.message}` : 'Something went wrong',
    });
  }

  if (err.name === 'ValidationError') {
    return res.status(400).json({
      error: 'Validation Error',
      details: err.message,
    });
  }

  if (err.name === 'UnauthorizedError') {
    return res.status(401).json({
      error: 'Unauthorized',
      message: err.message,
    });
  }

  res.status(500).json({
    error: 'Internal Server Error',
    message: config.nodeEnv === 'development' ? (err.message || JSON.stringify(err)) : 'Something went wrong',
  });
};

export const notFound = (req, res) => {
  res.status(404).json({
    error: 'Not Found',
    message: `Route ${req.method} ${req.path} not found`,
  });
};
