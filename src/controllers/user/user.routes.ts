import express from "express";
import passport from "passport";
import {
  getAllUsers,
  getUserById,
  editUserById,
  createAccount,
  deleteUserById,
  changeUserPassword,
} from "./user.services";
import { extractTokenInfo, isAdmin } from "../../utils/jwt";
import {
  ChangePasswordSchema,
  UserAccountSchema,
  validateSchema,
} from "../../utils/validations";

const router = express.Router();

router
  .route("/")
  .get(passport.authenticate("jwt", { session: false }), getAllUsers);

router
  .route("/change-password")
  .put(
    [
      passport.authenticate("jwt", { session: false }),
      extractTokenInfo,
      validateSchema(ChangePasswordSchema),
    ],
    changeUserPassword,
  );

router
  .route("/:id")
  .get(passport.authenticate("jwt", { session: false }), getUserById)
  .put(
    [
      passport.authenticate("jwt", { session: false }),
      extractTokenInfo,
      isAdmin,
      validateSchema(UserAccountSchema),
    ],
    editUserById,
  )
  .delete(
    [
      passport.authenticate("jwt", { session: false }),
      extractTokenInfo,
      isAdmin,
    ],
    deleteUserById,
  );

router
  .route("/register")
  .post(
    [
      passport.authenticate("jwt", { session: false }),
      extractTokenInfo,
      isAdmin,
      validateSchema(UserAccountSchema),
    ],
    createAccount,
  );

export default router;
