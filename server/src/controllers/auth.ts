import { Request, Response } from 'express';
import { User } from '../entity/User';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { JWT_SECRET } from '../utils/variables';
import { registerValidator, loginValidator } from '../utils/validators';

export const signupUser = async (req: Request, res: Response) => {
  const { username, password, email } = req.body.credentials;
  const adminMode = req.body.adminMode;
  const { errors, valid } = registerValidator(username, password, email);
  if (!valid) {
    return res.status(400).send({ message: Object.values(errors)[0] });
  }

  const existingUser = await User.findOne({
    where: `"username" ILIKE '${username}'`,
  });

  if (existingUser) {
    return res
      .status(401)
      .send({ message: `Username '${username}' is already taken.` });
  }

  const users = await User.find();
  for (let user of users) {
    if (user.email === email) {
      return res.status(400).send({ message: `Email adress ${email} is already taken.` });
    }
  }

  const saltRounds = 10;
  const passwordHash = await bcrypt.hash(password, saltRounds);

  const user = User.create({ username, passwordHash, email });

  let isAdmin: boolean = false;
  if (adminMode) {
    user.isAdmin = true;
    isAdmin = true;
  }

  await user.save();



  const notificationsOn: boolean = true;

  const token = jwt.sign(
    {
      id: user.id,
      username: user.username,
    },
    JWT_SECRET
  );

  return res.status(201).json({
    id: user.id,
    username: user.username,
    token,
    isAdmin,
    email,
    notificationsOn,
  });
};

export const loginUser = async (req: Request, res: Response) => {
  const { username, password } = req.body;
  const { errors, valid } = loginValidator(username, password);

  if (!valid) {
    return res.status(400).send({ message: Object.values(errors)[0] });
  }

  const user = await User.findOne({
    where: `"username" ILIKE '${username}'`,
  });

  if (!user) {
    return res.status(401).send({ message: `User: '${username}' not found.` });
  }

  const credentialsValid = await bcrypt.compare(password, user.passwordHash);

  if (!credentialsValid) {
    return res.status(401).send({ message: 'Invalid credentials.' });
  }

  const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET);

  const isAdmin: boolean = user.isAdmin;

  const email = user.email;
  const notificationsOn = user.notificationsOn;

  return res.status(201).json({
    id: user.id,
    username: user.username,
    token,
    isAdmin,
    email,
    notificationsOn,
  });
};
