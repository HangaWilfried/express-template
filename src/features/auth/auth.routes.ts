import express from 'express';
import { login, register, refresh, logout } from './auth.service';
import { validate } from '@middlewares/validators.middleware';
import { UserLoginSchema, UserRegistrationSchema } from './auth.schema';

const router = express.Router();

router.route('/login').post(validate(UserLoginSchema), login);
router.route('/register').post(validate(UserRegistrationSchema), register);
router.route('/refresh').post(refresh);
router.route('/logout').post(logout);

export default router;
