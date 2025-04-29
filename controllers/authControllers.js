import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import gravatar from "gravatar";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import { v4 as uuidv4 } from "uuid";

import { User } from "../models/User.js";
import HttpError from "../helpers/HttpError.js";
import { sendEmail } from "../helpers/sendEmail.js";
import { emailSchema } from "../schemas/userSchemas.js";

const JWT_SECRET = "your_jwt_secret";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const avatarsDir = path.join(__dirname, "../public/avatars");

export const register = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      throw HttpError(400, "Missing required fields");
    }

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      throw HttpError(409, "Email in use");
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const avatarURL = gravatar.url(email, { s: "250", d: "retro" }, true);
    const verificationToken = uuidv4();

    const newUser = await User.create({
      email,
      password: hashedPassword,
      subscription: "starter",
      avatarURL,
      verificationToken,
      verify: false,
    });

    await sendEmail(email, verificationToken);

    res.status(201).json({
      user: {
        email: newUser.email,
        subscription: newUser.subscription,
        avatarURL: newUser.avatarURL,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      throw HttpError(400, "Missing required fields");
    }

    const user = await User.findOne({ where: { email } });
    if (!user) {
      throw HttpError(401, "Email or password is wrong");
    }

    if (!user.verify) {
      throw HttpError(401, "Email not verified");
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw HttpError(401, "Email or password is wrong");
    }

    const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: "24h" });

    user.token = token;
    await user.save();

    res.json({
      token,
      user: {
        email: user.email,
        subscription: user.subscription,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const logout = async (req, res, next) => {
  try {
    const user = req.user;

    if (!user) {
      throw HttpError(401, "Not authorized");
    }

    user.token = null;
    await user.save();

    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

export const getCurrent = async (req, res, next) => {
  try {
    const user = req.user;

    res.json({
      email: user.email,
      subscription: user.subscription,
    });
  } catch (error) {
    next(error);
  }
};

export const updateAvatar = async (req, res, next) => {
  try {
    if (!req.file) {
      throw HttpError(400, "Avatar file is required");
    }

    const { path: tempPath, originalname } = req.file;
    const filename = `${req.user.id}_${originalname}`;
    const finalPath = path.join(avatarsDir, filename);

    await fs.rename(tempPath, finalPath);

    const avatarURL = `/avatars/${filename}`;
    req.user.avatarURL = avatarURL;
    await req.user.save();

    res.json({ avatarURL });
  } catch (error) {
    next(error);
  }
};

export const verifyEmail = async (req, res, next) => {
  try {
    const { verificationToken } = req.params;

    const user = await User.findOne({ where: { verificationToken } });

    if (!user) {
      throw HttpError(404, "User not found");
    }

    user.verify = true;
    user.verificationToken = null;
    await user.save();

    res.json({ message: "Verification successful" });
  } catch (error) {
    next(error);
  }
};

export const resendVerifyEmail = async (req, res, next) => {
  try {
    const { error } = emailSchema.validate(req.body);

    if (error) {
      throw HttpError(400, error.message);
    }

    const { email } = req.body;

    const user = await User.findOne({ where: { email } });

    if (!user) {
      throw HttpError(404, "User not found");
    }

    if (user.verify) {
      throw HttpError(400, "Verification has already been passed");
    }

    await sendEmail(email, user.verificationToken);

    res.json({ message: "Verification email sent" });
  } catch (error) {
    next(error);
  }
};
