import express from 'express';
import passport from 'passport';

import {
  getAllUsers,
  getUserById,
  editUserById,
  deleteUserById,
} from '@services/user.services';

import { UserAccountSchema } from '@validators/user.schema';
import { validate } from '@middlewares/validators.middleware';
import { extractTokenInfo } from '@middlewares/auth.middleware';

const router = express.Router();

router.route('/').get(passport.authenticate('jwt', { session: false }), getAllUsers);

router
  .route('/:id')
  .get(passport.authenticate('jwt', { session: false }), getUserById)
  .put(
    [
      passport.authenticate('jwt', { session: false }),
      extractTokenInfo,
      validate(UserAccountSchema),
    ],
    editUserById,
  )
  .delete([passport.authenticate('jwt', { session: false }), extractTokenInfo], deleteUserById);

export default router;
