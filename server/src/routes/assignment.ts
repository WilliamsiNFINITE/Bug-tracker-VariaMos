import express from 'express';
import { 
    assignBug 
} from '../controllers/assignment';
import middleware from '../middleware';

const router = express.Router();
const { auth } = middleware;

router.post('/:bugId/assignBug', auth, assignBug);

export default router;