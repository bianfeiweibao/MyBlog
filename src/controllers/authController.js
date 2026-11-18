import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { prisma } from "../lib/prisma.js";

export async function register(req, res, next) {
  const { username, email, password } = req.body;
  try {
    const passwordHash = await bcrypt.hash(password, 10); //10代表saltRound，计算强度
    const user = await prisma.user.create({
      data: { username, email, passwordHash },
    });
    res.status(201).json({
      data: {
        id: user.id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (err) {
    if (err.code === "P2002") {
      const e = new Error("用户名或邮箱已被注册");
      e.status = 409;
      return next(e);
    }
    next(err);
  }
}

export async function login(req, res, next) {
  const { username, password } = req.body;
  try {
    const user = await prisma.user.findUnique({ where: { username } });
    if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
      const e = new Error("用户名或密码错误");
      e.status = 401;
      return next(e);
    }
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
      expiresIn: "7d", //过期时间
    });
    res.json({
      data: {
        token,
        user: {
          id: user.id,
          username: user.username,
        },
      },
    });
  } catch (err) {
    next(err);
  }
}

export async function me(req, res, next) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.userId }, //中间件auth.js挂上来的,验签成功后放行进入me
    });
    if (!user) {
      const e = new Error("用户不存在");
      e.status = 404;
      return next(e);
    }
    res.json({
      data: {
        id: user.id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (err) {
    next(err);
  }
}
