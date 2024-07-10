import express from "express";
import dotenv from "dotenv";
// router -----------------
import apiRouter from "./route/route";
// handelr ----------------
import { errorHandler } from "./middleware/errors";
// cookie-parser -------------
import cookieParser from "cookie-parser";

dotenv.config();
const app = express();

// app 등록
app.use(cookieParser());
app.use("/api", apiRouter);
app.use(errorHandler);

// listen
app.listen(process.env.PORT, () => {
  console.log("서버 실행 중");
});
