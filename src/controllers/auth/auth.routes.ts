import express from "express";
import { login, register } from "./auth.services";
import {
  LoginSchema,
  validateSchema,
  AdminAccountSchema,
} from "../../utils/validations";

const router = express.Router();

router.route("/login").post(validateSchema(LoginSchema), login);
router.route("/register").post(validateSchema(AdminAccountSchema), register);

export default router;
