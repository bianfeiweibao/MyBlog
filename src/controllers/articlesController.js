import { prisma } from "../lib/prisma.js";

function parseId(value) {
  const id = Number(value);

  if (!Number.isInteger(id) || id <= 0) {
    return null;
  }

  return id;
}

export const getPosts = async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 3;

    const safePage = Math.max(1, page);
    const total = await prisma.article.count();
    const safeLimit = Math.min(Math.max(1, limit), 50);

    const skip = (safePage - 1) * safeLimit;

    const list = await prisma.article.findMany({
      orderBy: {
        createdAt: "desc",
      },
      skip,
      take: safeLimit,
    });

    const totalPages = Math.ceil(total / safeLimit);
    res.json({
      data: {
        list,
        total,
        page: safePage,
        limit: safeLimit,
        totalPages,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "查询文章失败" });
  }
};

export const getPostById = async (req, res) => {
  const id = parseId(req.params.id);
  //如果返回null
  if (!id) {
    return res.status(400).json({ error: "Invalid article id" });
  }

  try {
    const post = await prisma.article.findUnique({
      where: { id },
    });

    if (!post) {
      return res.status(404).json({ error: "Article not found" });
    }

    res.json({ data: post });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "获取文章失败" });
  }
};

export const createPost = async (req, res, next) => {
  const { title, content, author } = req.body;

  const post = await prisma.article.create({
    data: {
      title,
      content,
      //在author为undefined和null时author?.trim()为undefined
      //在author为""," "时，author?.trim()为""
      //prisma拿到null和"",会以为就是设置null和"";但是拿到undefined就会用默认值
      author: author || undefined,
    },
  });

  res.status(201).json({ data: post });
};

export const updatePost = async (req, res, next) => {
  const id = parseId(req.params.id);

  if (!id) {
    return res.status(400).json({ error: "Invalid article id" });
  }

  const { title, content, author } = req.body;

  const exist = await prisma.article.findUnique({
    where: { id },
  });

  if (!exist) {
    return res.status(404).json({ error: "Article not found" });
  }

  const post = await prisma.article.update({
    where: { id },
    data: {
      title,
      content,
      author: author || undefined,
    },
  });

  res.json({ data: post });
};

export const deletePost = async (req, res) => {
  const id = parseId(req.params.id);

  if (!id) {
    return res.status(400).json({ error: "Invalid article id" });
  }

  try {
    const exist = await prisma.article.findUnique({
      where: { id },
    });

    if (!exist) {
      return res.status(404).json({ error: "Article not found" });
    }

    await prisma.article.delete({
      where: { id },
    });

    res.status(204).send();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "删除文章失败" });
  }
};
