import jwt from 'jsonwebtoken';

import { promisify } from 'util';
import authConfig from '../../config/auth';

export default async (req, res, next) => {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(400).json({ error: 'Token not provided' });
  }

  try {
    await promisify(jwt.verify)(token, authConfig.secret);

    return next();
  } catch (error) {
    return res.status(400).json({ error: 'Invalid token' });
  }
};
