import path from "path";
import express from "express";
import cors from "cors";
import postsRouter from "./routes/articles.js";
import authRouter from "./routes/auth.js";
import { fileURLToPath } from "url";
import { dirname } from "path";
import { errorHandler } from "./middleware/errorHandler.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const app = express();

// 基础配置：允许所有来源
app.use(cors());
app.use(express.json());

//express.static()访问根路径/，会自动寻找这个目录下的index.html
app.use(express.static(path.join(__dirname, "../demo")));

app.get("/", (req, res) => {
  res.json({
    message: "Hello, World!",
  });
});

app.use("/api/articles", postsRouter);
// /api/articles

app.use("/api/auth", authRouter);

app.use((req, res) => {
  res.status(404).json({
    error: "Not Found",
  });
});

app.use(errorHandler);

export default app;
