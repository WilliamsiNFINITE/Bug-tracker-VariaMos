import express from 'express';
import { getAllUsers, addAdmins, removeAdmin, changeSettings, sendNotification } from '../controllers/user';
import middleware from '../middleware';

const router = express.Router();
const { auth } = middleware;

router.get('/', auth, getAllUsers);       
router.post('/admins', auth, addAdmins);
router.delete('/admin/:adminId', auth, removeAdmin);
router.post('/email', auth, changeSettings);
router.post('/sendNotification', auth, sendNotification);

export default router;
