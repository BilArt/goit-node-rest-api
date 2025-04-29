import "dotenv/config";
import express from "express";
import morgan from "morgan";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

import authRouter from "./routes/authRouter.js";
import contactsRouter from "./routes/contactsRouter.js";
import { connectToDatabase } from "./db/connection.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(morgan("tiny"));
app.use(cors());
app.use(express.json());
app.use("/avatars", express.static(path.join(__dirname, "public/avatars")));

app.use("/api/auth", authRouter);
app.use("/api/contacts", contactsRouter);

app.use((_, res) => {
  res.status(404).json({ message: "Route not found" });
});

app.use((err, req, res, next) => {
  const { status = 500, message = "Server error" } = err;
  res.status(status).json({ message });
});

const PORT = process.env.PORT || 3000;

const startServer = async () => {
  try {
    await connectToDatabase();

    const server = app.listen(PORT, () => {
      console.log(`Server is running. Use our API on port: ${PORT}`);
    });

    server.on("error", (error) => {
      if (error.code === "EADDRINUSE") {
        console.error(`Port ${PORT} is already in use. Try restarting your server or freeing the port.`);
        process.exit(1); // Завершаем процесс, чтобы nodemon автоматически перезапустил
      } else {
        console.error("Server error:", error.message);
        process.exit(1);
      }
    });

  } catch (error) {
    console.error("Failed to start server:", error.message);
    process.exit(1);
  }
};

startServer();
