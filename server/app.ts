import express, { Request, Response } from "express";
import dotenv from "dotenv";
import path from "path";
// router -----------------
import apiRouter from "./route/route";
// handelr ----------------
import { errorHandler } from "./middleware/errors";
// cookie-parser -------------
import cookieParser from "cookie-parser";
import { authToken } from "./middleware/auth";

dotenv.config({ path: "./../.env" });
const app = express();
// app 등록
app.use(cookieParser());
app.use(authToken);
app.use("/api", apiRouter);
app.use(errorHandler);

// client 파일 제공
app.use(express.static(`${__dirname}/../client/dist`));
app.get(`*`, (req: Request, res: Response) => {
	let indexPath = path.join(__dirname, "../client/dist/index.html");
	res.sendFile(indexPath);
});

// listen
app.listen(process.env.PORT, () => {
	console.log("서버 실행 중");
});
