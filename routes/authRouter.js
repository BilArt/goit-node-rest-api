import express from "express";
import {
  register,
  login,
  logout,
  getCurrent,
  updateAvatar,
  verifyEmail,
} from "../controllers/authControllers.js";

import auth from "../middlewares/auth.js";
import { upload } from "../middlewares/upload.js";
import validateBody from "../helpers/validateBody.js";
import { registerSchema, loginSchema } from "../schemas/authSchemas.js";
import { resendVerifyEmail } from "../controllers/authControllers.js";

const authRouter = express.Router();

authRouter.post("/register", validateBody(registerSchema), register);
authRouter.get("/verify/:verificationToken", verifyEmail);
authRouter.post("/login", validateBody(loginSchema), login);
authRouter.post("/logout", auth, logout);
authRouter.get("/current", auth, getCurrent);
authRouter.patch("/avatars", auth, upload.single("avatar"), updateAvatar);
authRouter.post("/verify", resendVerifyEmail);

export default authRouter;
