import { Request, Response } from 'express';
import { User } from '../entity/User';
import { AssignedAdmins } from '../entity/AssignedAdmins';
import { Bug } from '../entity/Bug';

export const assignBug = async (req: Request, res: Response) => {
  const { bugId } = req.params;
  const adminsIds = req.body.admins as string[];

  const currentUser = await User.findOne(req.user);

  if (!currentUser?.isAdmin) {
    return res.status(403).send({ message: 'Permission denied.'});
  }

  if (adminsIds.length === 0) {
    return res
    .status(400)
    .send({ message: 'You have to select at least one user' });
  }

  const targetBug = await Bug.findOne({
    where: { id: bugId },
    relations: ['assignments'],
  })

  if (!targetBug) {
    return res.status(404).send({ message: 'Invalid bug ID.'});
  }

  // verification if an admin selected is already in charge of the bug
  const currentAdminsInCharge = targetBug.assignments.map((a) => a.adminId);

  const l1 = currentAdminsInCharge.length;
  const l2 = adminsIds.length;
  for (let i=0; i<l1; i++) {
    for (let j=0; j<l2; j++) {
      if (currentAdminsInCharge[i] === adminsIds[j]) {
        const adminAlreadyInCharge = await User.findOne({
          where: { id: adminsIds[j] }
        })
        return res.status(409).send({ message: `This bug is already assigned to ${adminAlreadyInCharge?.username}. Please select someone else.`})
      }
    }
  }
  
  const AssignmentsArray = adminsIds.map((adminId) => ({
    adminId,
    bugId,
  }));

  await AssignedAdmins.insert(AssignmentsArray);

  const updatedAssignments = await AssignedAdmins.createQueryBuilder('assignment')
  .leftJoinAndSelect('assignment.admin', 'admin')
  .leftJoinAndSelect('assignment.bug', 'bug')
  .where('assignment.bugId = :bugId', { bugId })
  .select([
    'assignment.id',
    'assignment.joinedAt',
    'admin.id',
    'admin.username',
    'admin.email',
    'admin.notificationsOn',
    'bug.id',
  ])
  .getMany();

  res.status(201).json([updatedAssignments, adminsIds.length])
};