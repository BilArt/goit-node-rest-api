import express from "express";
import {
  register,
  login,
  logout,
  getCurrent,
  updateAvatar,
} from "../controllers/authControllers.js";

import auth from "../middlewares/auth.js";
import { upload } from "../middlewares/upload.js";

const authRouter = express.Router();

authRouter.post("/register", register);
authRouter.post("/login", login);
authRouter.post("/logout", auth, logout);
authRouter.get("/current", auth, getCurrent);
authRouter.patch("/avatars", auth, upload.single("avatar"), updateAvatar);

export default authRouter;
