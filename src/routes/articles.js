import { Router } from "express";
import * as articleController from "../controllers/articlesController.js";
import {
  createArticleSchema,
  updateArticleSchema,
  validate,
} from "../validators/articleValidator.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

router.get("/", articleController.getPosts);
router.get("/:id", articleController.getPostById);
router.post(
  "/",
  requireAuth,
  validate(createArticleSchema),
  articleController.createPost,
);
router.put(
  "/:id",
  requireAuth,
  validate(updateArticleSchema),
  articleController.updatePost,
);
router.delete("/:id", requireAuth, articleController.deletePost);
export default router;
