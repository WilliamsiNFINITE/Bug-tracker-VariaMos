import { Request, Response } from 'express';
import { User } from '../entity/User';
import { Not } from 'typeorm';

export const getAllUsers = async (req: Request, res: Response) => {
  const users = await User.find({
    where: { id: Not(req.user) },
    select: ['id', 'username', 'isAdmin'],
  });

  res.json(users);
};

export const addAdmins = async (req: Request, res: Response) => {
  const currentUser = await User.findOne(req.user);

  if (currentUser?.isAdmin !== true) {
    return res.status(403).send({ message: 'Permission denied.'});
  }

  const adminsIds = req.body.admins as string[];
  
  if (adminsIds.length === 0) {
    return res
    .status(400)
    .send({ message: 'You have to select at least one user' });
  }

  let cpt: number = adminsIds.length;
  let ind: number = 0;

  while (cpt > 0) {
    const user = await User.findOne({
      where: { id: adminsIds[ind] },
    });

    if (user) { 
      user.isAdmin = true;
      user?.save();
    }
    ind += 1;
    cpt -= 1;
  }

  const updatedUsers = await User.createQueryBuilder('user')
    .where('user.isAdmin = :isAdmin', { isAdmin: true })
    .select([
      'user.id',
      'user.username',
      'user.isAdmin',
    ])
    .getMany();

  res.status(201).json(updatedUsers);
};

export const removeAdmin = async (req: Request, res: Response) => {
  const currentUser = await User.findOne(req.user);

  if (currentUser?.isAdmin !== true) {
    return res.status(403).send({ message: 'Permission denied.'});
  }

  const adminId = req.params.adminId;

  const user = await User.findOne({
    where: { id: adminId },
  });

  if (user) { 
    user.isAdmin = false;
    user?.save();
  }

  res.status(204).end();
};
