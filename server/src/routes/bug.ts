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
  destination: (_req, _file, cb) => {
    cb(null, '../client/public/Images')
  },
  filename: (_req, file, cb) => {
    const newFileName = Date.now() + path.extname(file.originalname)
    cb(null, newFileName);
    saveFilePath(newFileName);
  }
});

const upload = multer(({ storage: storage }))
const router = express.Router();
const { auth } = middleware;


router.get('/', auth, getBugs);
router.post('/', auth, createBug);
router.post('/upload', upload.single('image'), (_req, _res) => {
  return;
});

router.put('/:bugId', auth, updateBug);
router.delete('/:bugId', auth, deleteBug);
router.post('/:bugId/close', auth, closeBug);
router.post('/:bugId/reopen', auth, reopenBug);

export default router;
