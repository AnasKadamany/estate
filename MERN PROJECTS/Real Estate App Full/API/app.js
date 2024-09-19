import express from "express";
import cors from "cors";
import authRoute from "./routes/auth.route.js";
import postRoute from "./routes/post.route.js";
import cookieParser from "cookie-parser";
const app = express();

app.use(cors({ origin: process.env.CLIENTURL, Credential: true }));
app.use(express.json());
app.use(cookieParser());

app.use("/api/posts", postRoute);
app.use("/api/auth", authRoute);

app.listen(8800, () => {
  console.log("Server Is Running");
});
