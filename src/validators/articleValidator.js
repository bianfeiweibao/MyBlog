import { z } from "zod";

export const createArticleSchema = z.object({
  title: z.string().trim().min(1, "标题不能为空").max(200),
  content: z.string().trim().min(1, "内容不能为空"),
  author: z.string().trim().optional(),
});

export const updateArticleSchema = createArticleSchema;

export function validate(schema) {
  return (req, res, next) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      const err = new Error(result.error.issues[0].message);
      err.status = 400;
      return next(err);
    }
    req.body = result.data;
    next();
  };
}
