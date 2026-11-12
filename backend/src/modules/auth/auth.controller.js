import { loginUser } from './auth.service.js';
import { successResponse, errorResponse } from '../../utils/apiResponse.js';

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return errorResponse(res, 'Email and password are required', 400);
    }

    const result = await loginUser({ email, password });
    return successResponse(res, result, 'Login successful');
  } catch (error) {
    return errorResponse(res, error.message, 401);
  }
};

export const logout = async (req, res) => {
  return successResponse(res, null, 'Logged out successfully');
};

export const getMe = async (req, res) => {
  return successResponse(res, {
    id: req.user._id,
    name: req.user.name,
    email: req.user.email,
    role: req.user.role,
    isActive: req.user.isActive,
    lastLogin: req.user.lastLogin,
  }, 'Authenticated user profile');
};
