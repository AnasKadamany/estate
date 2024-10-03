import prisma from "../lib/prisma.js";

export const getPosts = async (req, res, next) => {
  try {
    const posts = await prisma.post.findMany();
    res.status(200).json(posts);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to Get Posts" });
  }
};
export const getPost = async (req, res, next) => {
  const id = req.params.id;
  console.log(req.params);
  try {
    const posts = await prisma.post.findUnique({ where: { id: id } });
    res.status(200).json(posts);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to Get Posts" });
  }
};

export const addPost = async (req, res, next) => {
  const body = req.body;
  const userTokenId = req.userId;
  try {
    const post = await prisma.post.create({
      data: {
        ...body.postData,
        userId: userTokenId,
        PostDetail: { ...body.postDetail },
      },
    });
    res.status(200).json(post);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to Get Posts" });
  }
};

export const updatePost = async (req, res, next) => {
  try {
    res.status(200).json();
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to Get Posts" });
  }
};

export const deletePost = async (req, res, next) => {
  const id = req.params.id;
  const tokenUserId = req.userId;
  try {
    const post = await prisma.post.findUnique({ where: { id } });
    if (post.userId != tokenUserId) {
      return res.status(403).json({ message: "Not Authorized!" });
    }
    await prisma.post.delete({ where: { id } });
    res.status(200).json({ message: "Post Deleted" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to Get Posts" });
  }
};
