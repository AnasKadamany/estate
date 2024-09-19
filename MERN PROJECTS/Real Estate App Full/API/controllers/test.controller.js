import jwt from "jsonwebtoken";
export const shouldBeLoggedIn = async (req, res, next) => {
  console.log(req.userId);
  res.status(200).json({ message: "You Are Authenticated" });
};

export const shouldBeAdmin = async (req, res, next) => {};
