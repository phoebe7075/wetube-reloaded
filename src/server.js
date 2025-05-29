import "./db";
import Video from "./models/Video";
import express from "express";
import morgan from "morgan";

import globalRouter from "./routers/globalRouter";
import userRouter from "./routers/userRouter";
import videoRouter from "./routers/videoRouter";


const PORT = 4000;
const app = express();
const logger = morgan("dev");

app.set("view engine", "pug"); //express에서 사용할 view engine을 pug를 사용하겠다고 설정.
app.set("views", process.cwd() + "/src/views");
app.use(logger);
app.use(express.urlencoded({extended: true}))

app.use("/", globalRouter);
app.use("/videos", videoRouter);
app.use("/users", userRouter);


export default app;