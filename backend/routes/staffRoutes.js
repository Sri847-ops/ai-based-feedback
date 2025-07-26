import express from 'express';
import { registerStaff, loginStaff } from '../controllers/staffController.js';

const router = express.Router();

router.post('/register', registerStaff);
router.post('/login', loginStaff);

export default router;
