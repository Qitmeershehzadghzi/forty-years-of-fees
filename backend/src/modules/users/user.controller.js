import * as userService from './user.service.js';
import { successResponse, errorResponse } from '../../utils/apiResponse.js';

export const getUsers = async (req, res, next) => {
  try {
    const users = await userService.getAllUsers();
    return successResponse(res, users, 'Users retrieved');
  } catch (err) {
    next(err);
  }
};

export const getUser = async (req, res, next) => {
  try {
    const user = await userService.getUserById(req.params.id);
    if (!user) return errorResponse(res, 'User not found', 404);
    return successResponse(res, user, 'User details');
  } catch (err) {
    next(err);
  }
};

export const createUser = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;
    if (!name || !email || !password) {
      return errorResponse(res, 'Name, email, and password are required', 400);
    }
    const user = await userService.createUser({ name, email, password, role }, req.user?._id);
    return successResponse(res, user, 'User created', 201);
  } catch (err) {
    next(err);
  }
};

export const updateUser = async (req, res, next) => {
  try {
    const user = await userService.updateUser(req.params.id, req.body, req.user?._id);
    return successResponse(res, user, 'User updated');
  } catch (err) {
    next(err);
  }
};

export const deleteUser = async (req, res, next) => {
  try {
    await userService.deleteUser(req.params.id, req.user?._id);
    return successResponse(res, null, 'User deleted');
  } catch (err) {
    next(err);
  }
};
