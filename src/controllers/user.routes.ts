import express from 'express';
import passport from 'passport';

import {
  getAllUsers,
  getUserById,
  editUserById,
  deleteUserById,
  changeUserPassword,
} from '@services/user.services';

import { validate } from '@middlewares/validators.middleware';
import { extractTokenInfo } from '@middlewares/auth.middleware';

const router = express.Router();

router.route('/').get(passport.authenticate('jwt', { session: false }), getAllUsers);

router
  .route('/change-password')
  .put(
    [
      passport.authenticate('jwt', { session: false }),
      extractTokenInfo,
      validate(ChangePasswordSchema),
    ],
    changeUserPassword,
  );

router
  .route('/:id')
  .get(passport.authenticate('jwt', { session: false }), getUserById)
  .put(
    [
      passport.authenticate('jwt', { session: false }),
      extractTokenInfo,
      isAdmin,
      validate(UserAccountSchema),
    ],
    editUserById,
  )
  .delete([passport.authenticate('jwt', { session: false }), extractTokenInfo], deleteUserById);

export default router;
