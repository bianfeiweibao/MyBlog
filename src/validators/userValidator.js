import { z } from "zod";

export const registerSchema = z.object({
  username: z.string().trim().min(2, { error: "用户名至少2个字符" }).max(30),
  email: z
    .string()
    .trim()
    .pipe(z.email({ error: "邮箱格式不正确" })),
  password: z.string().min(6, { error: "密码至少6位" }).max(100),
});

export const loginSchema = z.object({
  username: z.string().trim().min(1, { error: "用户名不能为空" }),
  password: z.string().min(1, { error: "密码不能为空" }),
});
