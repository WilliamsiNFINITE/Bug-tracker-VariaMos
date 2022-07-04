import { Request, Response } from 'express';
import { Note } from '../entity/Note';
import nodemailer from 'nodemailer';
import { EMAIL, PASSWORD } from '../utils/config';
import { User } from '../entity/User';
import { Bug } from '../entity/Bug';

export const postNote = async (req: Request, res: Response) => {
  const { body, isReply, noteId } = req.body;
  const { bugId } = req.params;
  
  const currentUser = await User.findOne(req.user);

  if (!body || body.trim() === '') {
    return res
      .status(400)
      .send({ message: 'Note body field must not be empty.' });
  }

  const newNote = Note.create({ body, authorId: req.user, bugId });
  await newNote.save();

  const targetBug = await Bug.findOne({ id: bugId });
  console.log("target bug: ", targetBug)
  if (isReply) {
    const targetNote = await Note.findOne({ id: noteId });
    const authorId = targetNote?.authorId;
    const author = await User.findOne({ id: authorId })
    // if the author has entered an email, turned notifications on and the one replying is connected
    if (author?.email !== '' && author?.notificationsOn === true && currentUser?.username !== "user") {
      // send him a notification
      let transporter = nodemailer.createTransport({
        maxConnections: 200,
        pool: true,
        service: "hotmail", // outlook is hotmail service
        secure: false,
        auth: { 
          user: EMAIL,
          pass: PASSWORD,
        }
      });
      
      let mail = {
        from: EMAIL,
        to: author.email,
        subject: "VariaMos | New invitation",
        text: `Hello ${author.username}, someone replied to you on VariaMos BugTracker concerning the following bug: ${targetBug?.title}.
        \nYour message: ${targetNote?.body}
        \n\n${currentUser?.username} replied: ${body}
        \n\n If you want to stop receiving these emails, turn your notifications off.
        \nPlease do not reply to this email.
        \n\nThe VariaMos Team.`
      };
    
      transporter.verify(function (error, _success) {
        if (error) {
          console.log(error);
        } else {
          console.log("Server is ready to take our messages");
        }
      });
     
      transporter.sendMail(mail, (error, info) => {
        if (error) {
          console.log(error);
          return res.status(421).send({ message: "A problem occured, please try again later." });
        } else {
          console.log(`Email sent for ${author.username}: ` + info);
        }
      });
    }
  }
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
