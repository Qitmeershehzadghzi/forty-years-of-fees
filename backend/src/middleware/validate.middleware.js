import { errorResponse } from '../utils/apiResponse.js';

export const validateRequest = (schema, target = 'body') => {
  return (req, res, next) => {
    try {
      const dataToValidate = req[target];
      const parsed = schema.parse(dataToValidate);
      req[target] = parsed;
      next();
    } catch (err) {
      if (err.errors) {
        const formattedErrors = err.errors.map(e => ({
          field: e.path.join('.'),
          message: e.message,
        }));
        return errorResponse(res, 'Validation failed', 400, formattedErrors);
      }
      return errorResponse(res, 'Invalid request data', 400);
    }
  };
};
