import { Request, Response } from 'express';
import { Bug } from '../entity/Bug';
import { Note } from '../entity/Note';
import { User } from '../entity/User';
import { createBugValidator } from '../utils/validators';

const fieldsToSelect = [
  'bug.id',
  'bug.title',
  'bug.description',
  'bug.priority',
  'bug.isResolved',
  'bug.createdAt',
  'bug.updatedAt',
  'bug.closedAt',
  'bug.reopenedAt',
  'createdBy.id',
  'createdBy.username',
  'updatedBy.id',
  'updatedBy.username',
  'closedBy.id',
  'closedBy.username',
  'reopenedBy.id',
  'reopenedBy.username',
  'note.id',
  'note.bugId',
  'note.body',
  'note.createdAt',
  'note.updatedAt',
  'noteAuthor.id',
  'noteAuthor.username',
];

export const getBugs = async (_req: Request, res: Response) => {

  const bugs = await Bug.createQueryBuilder('bug')
    .leftJoinAndSelect('bug.createdBy', 'createdBy')
    .leftJoinAndSelect('bug.updatedBy', 'updatedBy')
    .leftJoinAndSelect('bug.closedBy', 'closedBy')
    .leftJoinAndSelect('bug.reopenedBy', 'reopenedBy')
    .leftJoinAndSelect('bug.notes', 'note')
    .leftJoinAndSelect('note.author', 'noteAuthor')
    .select(fieldsToSelect)
    .getMany();

  res.json(bugs);
};

export const createBug = async (req: Request, res: Response) => {
  const { title, description, priority } = req.body;

  const { errors, valid } = createBugValidator(title, description, priority);

  if (!valid) {
    return res.status(400).send({ message: Object.values(errors)[0] });
  }

  const newBug = Bug.create({
    title,
    description,
    priority,
    createdById: req.user,
  });
  await newBug.save();

  const relationedBug = await Bug.createQueryBuilder('bug')
    .where('bug.id = :bugId', { bugId: newBug.id })
    .leftJoinAndSelect('bug.createdBy', 'createdBy')
    .leftJoinAndSelect('bug.updatedBy', 'updatedBy')
    .leftJoinAndSelect('bug.closedBy', 'closedBy')
    .leftJoinAndSelect('bug.reopenedBy', 'reopenedBy')
    .leftJoinAndSelect('bug.notes', 'note')
    .leftJoinAndSelect('note.author', 'noteAuthor')
    .select(fieldsToSelect)
    .getOne();

  return res.status(201).json(relationedBug);
};

export const updateBug = async (req: Request, res: Response) => {
  const { title, description, priority } = req.body;
  const { bugId } = req.params;

  const currentUser = await User.findOne(req.user);

  if (currentUser?.isAdmin !== true) {
    return res.status(403).send({ message: 'Permission denied.'});
  }

  const { errors, valid } = createBugValidator(title, description, priority);

  if (!valid) {
    return res.status(400).send({ message: Object.values(errors)[0] });
  }

  const targetBug = await Bug.findOne({ id: bugId });

  if (!targetBug) {
    return res.status(400).send({ message: 'Invalid bug ID.' });
  }

  targetBug.title = title;
  targetBug.description = description;
  targetBug.priority = priority;
  targetBug.updatedById = req.user;
  targetBug.updatedAt = new Date();

  await targetBug.save();
  const relationedBug = await Bug.createQueryBuilder('bug')
    .where('bug.id = :bugId', { bugId })
    .leftJoinAndSelect('bug.createdBy', 'createdBy')
    .leftJoinAndSelect('bug.updatedBy', 'updatedBy')
    .leftJoinAndSelect('bug.closedBy', 'closedBy')
    .leftJoinAndSelect('bug.reopenedBy', 'reopenedBy')
    .leftJoinAndSelect('bug.notes', 'note')
    .leftJoinAndSelect('note.author', 'noteAuthor')
    .select(fieldsToSelect)
    .getOne();

  return res.status(201).json(relationedBug);
};

export const deleteBug = async (req: Request, res: Response) => {
  const { bugId } = req.params;

  const targetBug = await Bug.findOne({ id: bugId });

  const currentUser = await User.findOne(req.user);

  if (currentUser?.isAdmin !== true) {
    return res.status(403).send({ message: 'Permission denied.'});
  }


  if (!targetBug) {
    return res.status(404).send({ message: 'Invalid bug ID.' });
  }

  await Note.delete({ bugId });
  await targetBug.remove();
  res.status(204).end();
};

export const closeBug = async (req: Request, res: Response) => {
  const { bugId } = req.params;

  const currentUser = await User.findOne(req.user);

  if (currentUser?.isAdmin !== true) {
    return res.status(403).send({ message: 'Permission denied.'});
  }

  const targetBug = await Bug.findOne({ id: bugId });

  if (!targetBug) {
    return res.status(400).send({ message: 'Invalid bug ID.' });
  }

  if (targetBug.isResolved === true) {
    return res
      .status(400)
      .send({ message: 'Bug is already marked as closed.' });
  }

  targetBug.isResolved = true;
  targetBug.closedById = req.user;
  targetBug.closedAt = new Date();
  targetBug.reopenedById = null;
  targetBug.reopenedAt = null;

  await targetBug.save();
  const relationedBug = await Bug.createQueryBuilder('bug')
    .where('bug.id = :bugId', { bugId })
    .leftJoinAndSelect('bug.createdBy', 'createdBy')
    .leftJoinAndSelect('bug.updatedBy', 'updatedBy')
    .leftJoinAndSelect('bug.closedBy', 'closedBy')
    .leftJoinAndSelect('bug.reopenedBy', 'reopenedBy')
    .leftJoinAndSelect('bug.notes', 'note')
    .leftJoinAndSelect('note.author', 'noteAuthor')
    .select(fieldsToSelect)
    .getOne();

  return res.status(201).json(relationedBug);
};

export const reopenBug = async (req: Request, res: Response) => {
  const { bugId } = req.params;

  const currentUser = await User.findOne(req.user);

  if (currentUser?.isAdmin !== true) {
    return res.status(403).send({ message: 'Permission denied.'});
  }

  const targetBug = await Bug.findOne({ id: bugId });

  if (!targetBug) {
    return res.status(400).send({ message: 'Invalid bug ID.' });
  }

  if (targetBug.isResolved === false) {
    return res
      .status(400)
      .send({ message: 'Bug is already marked as opened.' });
  }

  targetBug.isResolved = false;
  targetBug.reopenedById = req.user;
  targetBug.reopenedAt = new Date();
  targetBug.closedById = null;
  targetBug.closedAt = null;

  await targetBug.save();
  const relationedBug = await Bug.createQueryBuilder('bug')
    .where('bug.id = :bugId', { bugId })
    .leftJoinAndSelect('bug.createdBy', 'createdBy')
    .leftJoinAndSelect('bug.updatedBy', 'updatedBy')
    .leftJoinAndSelect('bug.closedBy', 'closedBy')
    .leftJoinAndSelect('bug.reopenedBy', 'reopenedBy')
    .leftJoinAndSelect('bug.notes', 'note')
    .leftJoinAndSelect('note.author', 'noteAuthor')
    .select(fieldsToSelect)
    .getOne();

  return res.status(201).json(relationedBug);
};
