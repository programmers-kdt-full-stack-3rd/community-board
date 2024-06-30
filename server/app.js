const express = require('express');
const app = express();
const dotenv = require('dotenv');
dotenv.config();

// router -----------------
const route = require("./route/route");
// handelr ----------------

// app 등록
app.use("/", route);

// listen
app.listen(process.env.PORT, ()=>{
    console.log('서버 실행 중')
});