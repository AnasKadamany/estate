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
    console.log(updatedData);
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
