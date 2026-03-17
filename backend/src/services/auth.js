import bcrypt from 'bcrypt';
import { User } from '../models/user.js';

export const registerUser = async (payload) => {
  const hashedPassword = await bcrypt.hash(payload.password, 10);
  return await User.create({
    ...payload,
    password: hashedPassword,
  });
};

export const loginUser = async (email, password) => {
  const user = await User.findOne({ email });
  console.log('=== LOGIN ===');
  console.log('user found:', !!user);
  console.log('password from request:', password);
  console.log('password from db:', user?.password);
  if (!user) return null;

  const isPasswordCorrect = await bcrypt.compare(String(password), user.password);
  if (!isPasswordCorrect) return null;

  return user;
};