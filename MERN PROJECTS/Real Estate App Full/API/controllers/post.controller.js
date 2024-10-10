import prisma from "../lib/prisma.js";

export const getPosts = async (req, res, next) => {
  const query = req.query;
  try {
    const posts = await prisma.post.findMany({
      where: {
        city: query.city || undefined,
        type: query.type || undefined,
        property: query.property || undefined,
        bedroom: parseInt(query.bedroom) || undefined,
        price: {
          gte: parseInt(query.minPrice) || 0,
          lte: parseInt(query.maxPrice) || 100000000,
        },
      },
    });
    res.status(200).json(posts);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to Get Posts" });
  }
};
export const getPost = async (req, res, next) => {
  const id = req.params.id;
  try {
    const posts = await prisma.post.findUnique({
      where: { id: id },
      include: { user: true, PostDetail: true },
    });
    res.status(200).json(posts);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to Get Posts" });
  }
};

export const addPost = async (req, res, next) => {
  const { postData, PostDetail } = req.body;
  const userTokenId = req.userId;

  try {
    const post = await prisma.post.create({
      data: {
        ...postData,
        userId: userTokenId,
        PostDetail: {
          create: PostDetail, // Ensure you're using 'create' for nested writes
        },
      },
      include: {
        user: { select: { username: true, avatar: true } },
        PostDetail: true,
      }, // Include related fields in the response
    });
    res.status(200).json(post);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to Create Post" });
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
