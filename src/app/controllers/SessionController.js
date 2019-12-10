import * as Yup from 'yup';
import jwt from 'jsonwebtoken';

import authConfig from '../../config/auth';

import User from '../models/User';

class SessionController {
  async create(req, res) {
    const schema = Yup.object().shape({
      email: Yup.string()
        .email()
        .required(),
      password: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      res.status(400).json({ error: 'Invalid request body' });
    }

    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } });

    if (!user) {
      res.status(401).json({ error: 'User not found' });
    }

    if (!(await user.checkPassword(password))) {
      res.status(401).json({ error: 'Password does not match' });
    }

    const { id, name } = user;

    res.json({
      user: {
        id,
        name,
      },
      token: jwt.sign({ id }, authConfig.secret, {
        expiresIn: authConfig.expiresIn,
      }),
    });
  }
}

export default new SessionController();
