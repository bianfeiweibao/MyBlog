import jwt from "jsonwebtoken";

export function requireAuth(req, res, next) {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;
  if (!token) {
    const e = new Error("未登录");
    e.status = 401;
    return next(e);
  }
  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET); //{userId, iat（签发时间）, exp（过期时间）}
    next();
  } catch {
    const e = new Error("登录已过期，请重新登录");
    e.status = 401;
    next(e);
  }
}
