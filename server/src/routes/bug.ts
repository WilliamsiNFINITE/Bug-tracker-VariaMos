import express from 'express';
import {
  getBugs,
  createBug,
  updateBug,
  deleteBug,
  closeBug,
  reopenBug,
} from '../controllers/bug';
import middleware from '../middleware';

const router = express.Router();
const { auth } = middleware;

router.get('/', auth, getBugs);
router.post('/', auth, createBug);
router.put('/:bugId', auth, updateBug);
router.delete('/:bugId', auth, deleteBug);
router.post('/:bugId/close', auth, closeBug);
router.post('/:bugId/reopen', auth, reopenBug);

export default router;
