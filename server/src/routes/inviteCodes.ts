import express from 'express';
import { 
    verifyInvitation
} from '../controllers/inviteCodes';
import middleware from '../middleware';

const router = express.Router();
const { auth } = middleware;

router.post('/verifyCode', auth, verifyInvitation);

export default router;