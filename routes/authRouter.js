import express from "express";
import { register, login, logout } from "../controllers/authControllers.js";
import auth from "../middlewares/auth.js";

const authRouter = express.Router();

authRouter.post("/register", register);
authRouter.post("/login", login);
authRouter.post("/logout", auth, logout);

export default authRouter;
