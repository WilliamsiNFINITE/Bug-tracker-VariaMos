import express from 'express';
import {
  getBugs,
  createBug,
  updateBug,
  deleteBug,
  closeBug,
  reopenBug,
  saveFilePath,
} from '../controllers/bug';
import middleware from '../middleware';
import multer from 'multer';
import path from 'path';

const storage = multer.diskStorage({
  destination: (_req, file, cb) => {

    if (file.fieldname === 'image') {
      cb(null, '../client/public/Images');
    }
    else if (file.fieldname === 'json') {
      cb(null, '../client/public/JSON_files');
    }

  },
  filename: (_req, file, cb) => {
    let imageFileName: string = '';
    let JSONFileName: string = '';
    if (file.fieldname === 'image') {
      imageFileName = Date.now() + path.extname(file.originalname)
      cb(null, imageFileName);
    }
    else if (file.fieldname === 'json') {
      JSONFileName = Date.now() + path.extname(file.originalname);
      cb(null, JSONFileName);
    }
    saveFilePath(imageFileName, JSONFileName);
  }
});

const upload = multer(({ storage: storage }))
const router = express.Router();
const { auth } = middleware;


router.get('/', auth, getBugs);
router.post('/', auth, createBug);
router.post('/upload', upload.any(), (_req, res) => {
  res.status(201).end();
});

router.put('/:bugId', auth, updateBug);
router.delete('/:bugId', auth, deleteBug);
router.post('/:bugId/close', auth, closeBug);
router.post('/:bugId/reopen', auth, reopenBug);

export default router;
