import { User } from './user.model.js';
import bcrypt from 'bcryptjs';
import { logAudit } from '../audit/audit.service.js';

export const getAllUsers = async () => {
  return User.find().select('-passwordHash').sort({ createdAt: -1 });
};

export const getUserById = async (id) => {
  return User.findById(id).select('-passwordHash');
};

export const createUser = async ({ name, email, password, role = 'VIEWER' }, performedByUserId) => {
  const existing = await User.findOne({ email: email.toLowerCase() });
  if (existing) throw new Error('A user with this email already exists');

  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash(password, salt);

  const user = await User.create({
    name,
    email: email.toLowerCase(),
    passwordHash,
    role,
  });

  await logAudit({
    action: 'CREATE',
    entity: 'User',
    entityId: user._id,
    newValues: { name: user.name, email: user.email, role: user.role },
    userId: performedByUserId,
  });

  return {
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    isActive: user.isActive,
  };
};

export const updateUser = async (id, data, performedByUserId) => {
  const user = await User.findById(id);
  if (!user) throw new Error('User not found');

  const prev = { name: user.name, role: user.role, isActive: user.isActive };

  if (data.name) user.name = data.name;
  if (data.role) user.role = data.role;
  if (data.isActive !== undefined) user.isActive = data.isActive;
  if (data.password) {
    const salt = await bcrypt.genSalt(10);
    user.passwordHash = await bcrypt.hash(data.password, salt);
  }

  await user.save();

  await logAudit({
    action: 'UPDATE',
    entity: 'User',
    entityId: id,
    previousValues: prev,
    newValues: { name: user.name, role: user.role, isActive: user.isActive },
    userId: performedByUserId,
  });

  return {
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    isActive: user.isActive,
  };
};

export const deleteUser = async (id, performedByUserId) => {
  const user = await User.findById(id);
  if (!user) throw new Error('User not found');

  // Prevent self deletion
  if (performedByUserId && id.toString() === performedByUserId.toString()) {
    throw new Error('Cannot delete your own administrator account');
  }

  await User.findByIdAndDelete(id);

  await logAudit({
    action: 'DELETE',
    entity: 'User',
    entityId: id,
    previousValues: { name: user.name, email: user.email, role: user.role },
    userId: performedByUserId,
  });

  return true;
};
