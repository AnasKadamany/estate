import express from "express";
import {
  deleteUser,
  getUser,
  getUsers,
  savePost,
  updateUser,
  profilePosts,
} from "../controllers/user.controller.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();

router.get("/", getUsers);
router.put("/:id", verifyToken, updateUser);
router.delete("/:id", verifyToken, deleteUser);
router.post("/save", savePost);
router.get("/profilePosts", verifyToken, profilePosts);

export default router;
