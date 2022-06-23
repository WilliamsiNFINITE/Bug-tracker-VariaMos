import express from 'express';
import { getAllUsers, addAdmins, removeAdmin } from '../controllers/user';
import middleware from '../middleware';

const router = express.Router();
const { auth } = middleware;

router.get('/', auth, getAllUsers);       
router.post('/admins', auth, addAdmins);
router.delete('/admin/:adminId', auth, removeAdmin);

export default router;
