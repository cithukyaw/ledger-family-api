import {Request, Response} from 'express';
import {generateToken} from "../lib/jwt";
import bcrypt from "bcryptjs";
import {getUserByUsername} from "../services/user.service";

/**
 * Controller: login
 * Authenticate a user by username and password
 */
export const login = async (req: Request, res: Response) => {
  const { username, password } = req.body;

  const user = await getUserByUsername(username);
  if (!user) {
    return res.status(400).json({ message: 'User not found' });
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(400).json({ message: 'Invalid credentials' });
  }

  const token = generateToken(user);
  res.json({ token });
}

/**
 * Controller: logout
 * Invalidate user session or token
 */
export const logout = async (req: Request, res: Response) => {
  // TODO: implement logout logic
  res.status(200).json({});
}
