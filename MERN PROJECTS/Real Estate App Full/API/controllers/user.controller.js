import { hash } from "bcrypt";
import prisma from "../lib/prisma.js";

export const getUsers = async (req, res) => {
  console.log("it Works");
  try {
    const users = await prisma.user.findMany();
    res.status(200).json(users);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to Get Users!" });
  }
};

export const getUser = async (req, res) => {
  const id = req.params.id;
  try {
    const user = await prisma.user.findUnique({ where: { id: id } });
    res.status(200).json(user);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Faild to Get User!" });
  }
};

export const updateUser = async (req, res) => {
  const id = req.params.id;
  const TokenId = req.userId;
  const { password, ...inputs } = req.body;
  if (id !== TokenId) {
    return res.status(401).json({ message: "Not Authorized" });
  }
  try {
    let updatedPassword = null;
    let updatedData = { ...inputs };
    if (password) {
      updatedPassword = await hash(password, 10);
      updatedData.password = updatedPassword;
    }

    const updatedUser = await prisma.user.update({
      where: { id: id },
      data: updatedData,
    });
    const { password: pass, ...rest } = updatedUser;
    res.status(200).json(rest);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Faild to update User!" });
  }
};

export const deleteUser = async (req, res) => {
  const id = req.params.id;
  const TokenId = req.userId;
  if (id !== TokenId) {
    return res.status(401).json({ message: "Not Authorized" });
  }
  try {
    const deleteUser = await prisma.user.delete({
      where: {
        id: id,
      },
    });
    res.status(200).json({ message: "user Deleted" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Faild to Delete User!" });
  }
};

export const savePost = async (req, res) => {
  const postId = req.body.postId;
  const tokenUserId = req.userId;

  // Log the userId for debugging purposes
  console.log("tokenUserId:", tokenUserId); // Ensure this is defined

  if (!tokenUserId) {
    return res.status(400).json({ message: "User ID is missing" });
  }

  try {
    const savedPost = await prisma.savedPost.findUnique({
      where: { userId_postId: { userId: tokenUserId, postId } }, // Ensure tokenUserId is a string
    });

    if (savedPost) {
      await prisma.savedPost.delete({
        where: { id: savedPost.id },
      });
      res.status(200).json({ message: "Post removed from Saved List" });
    } else {
      await prisma.savedPost.create({
        data: { userId: tokenUserId, postId },
      });
      res.status(200).json({ message: "Post added to Saved List" });
    }
  } catch (err) {
    console.error("Error saving/removing post:", err);
    res.status(500).json({ message: "Failed to save or remove post!" });
  }
};

export const profilePosts = async (req, res) => {
  const tokenUserId = req.params.userId;
  try {
    const userPosts = await prisma.post.findMany({
      where: { userId: tokenUserId },
    });
    const saved = await prisma.savedPost.findMany({
      where: { userId: tokenUserId },
      include: { post: true },
    });
    const savedPosts = await saved.map((item) => item.post);
    res.status(200).json({ userPosts, savedPosts });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to Get ProfilePosts!" });
  }
};
