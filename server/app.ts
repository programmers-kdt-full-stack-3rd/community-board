import express from 'express';
import dotenv from 'dotenv';
// router -----------------
import apiRouter from "./route/route";
// handelr ----------------
import { errorHandler } from "./middleware/errors";

dotenv.config();
const app = express();

// app 등록
app.use(errorHandler);
app.use("/api", apiRouter);

// listen
app.listen(process.env.PORT, ()=>{
    console.log('서버 실행 중')
});