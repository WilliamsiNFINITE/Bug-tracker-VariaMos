import { Request, Response } from 'express';
import { Note } from '../entity/Note';

export const postNote = async (req: Request, res: Response) => {
  const { body } = req.body;
  const { bugId } = req.params;

  if (!body || body.trim() === '') {
    return res
      .status(400)
      .send({ message: 'Note body field must not be empty.' });
  }

  const newNote = Note.create({ body, authorId: req.user, bugId });
  await newNote.save();

  const relationedNote = await Note.createQueryBuilder('note')
    .where('note.id = :noteId', { noteId: newNote.id })
    .leftJoinAndSelect('note.author', 'author')
    .select([
      'note.id',
      'note.bugId',
      'note.body',
      'note.createdAt',
      'note.updatedAt',
      'author.id',
      'author.username',
    ])
    .getOne();

  res.status(201).json(relationedNote);
};

export const deleteNote = async (req: Request, res: Response) => {
  const { noteId } = req.params;

  const targetNote = await Note.findOne({ id: Number(noteId) });

  if (!targetNote) {
    return res.status(404).send({ message: 'Invalid note ID.' });
  }

  await targetNote.remove();
  res.status(204).end();
};

export const updateNote = async (req: Request, res: Response) => {
  const { body } = req.body;
  const { noteId } = req.params;

  if (!body || body.trim() === '') {
    return res
      .status(400)
      .send({ message: 'Note body field must not be empty.' });
  }

  const targetNote = await Note.findOne({ id: Number(noteId) });

  if (!targetNote) {
    return res.status(404).send({ message: 'Invalid note ID.' });
  }

  if (targetNote.authorId !== req.user) {
    return res.status(401).send({ message: 'Access is denied.' });
  }

  targetNote.body = body;
  await targetNote.save();
  res.json(targetNote);
};
