import axios from 'axios';
import backendUrl from '../backendUrl';
import { setConfig } from './auth';

const baseUrl = `${backendUrl}/bugs`;

const createNote = async (
  bugId: string,
  noteBody: string,
  isReply: boolean,
  noteId?: number
) => {
  if (noteId) {
    const response = await axios.post(`${baseUrl}/${bugId}/notes`,{ body: noteBody, isReply, noteId },setConfig());
    return response.data;
  }
  else {
    console.log(noteId)
    const response = await axios.post(`${baseUrl}/${bugId}/notes`,{ body: noteBody, isReply },setConfig());
    return response.data;
  }
};

const editNote = async (
  bugId: string,
  noteId: number,
  noteBody: string
) => {
  const response = await axios.put(
    `${baseUrl}/${bugId}/notes/${noteId}`,
    { body: noteBody },
    setConfig()
  );
  return response.data;
};

const deleteNote = async (bugId: string, noteId: number) => {
  const response = await axios.delete(
    `${baseUrl}/${bugId}/notes/${noteId}`,
    setConfig()
  );
  return response.data;
};

const noteService = {
  createNote,
  editNote,
  deleteNote,
};

export default noteService;
