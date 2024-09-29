import bcrypt from "bcrypt";
import prisma from "../lib/prisma.js";
import jwt from "jsonwebtoken";

export const register = async (req, res, next) => {
  const { username, email, password } = req.body;

  try {
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user and save to the database
    const newUser = await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
      },
    });

    res
      .status(201)
      .json({ message: "User Created Successfully", user: newUser });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to create User!" });
  }
};

export const login = async (req, res, next) => {
  const { username, password } = req.body;

  try {
    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { username: username },
    });

    if (!user) {
      return res.status(401).json({ error: "Invalid username or password" });
    }

    // Check if the password is correct
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid username or password" });
    }
    const age = 1000 * 60 * 60 * 24 * 7;
    const token = jwt.sign(
      {
        id: user.id,
      },
      process.env.JWT_SECRET_KEY,
      { expiresIn: age }
    );

    const { password: userPassword, ...userInfo } = user;
    res
      .cookie("token", token, { httpOnly: true, maxAge: age })
      .status(200)
      .json(userInfo);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Login failed" });
    next(err);
  }
};

export const logout = (req, res, next) => {
  res.clearCookie("token").status(200).json({ message: "Logout Successfull" });
};
