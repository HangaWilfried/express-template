import express from 'express';
import { login, register } from '@services/auth.services';
import { validate } from '@middlewares/validators.middleware';
import { UserLoginSchema, UserRegistrationSchema } from '@validators/auth.schema';

const router = express.Router();

router.route('/login').post(validate(UserLoginSchema), login);
router.route('/register').post(validate(UserRegistrationSchema), register);

export default router;
