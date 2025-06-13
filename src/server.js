import "./db";
import Video from "./models/Video";
import express from "express";
import morgan from "morgan";
import session from "express-session";
import MongoStore from "connect-mongo";
import flash from "connect-flash";

import rootRouter from "./routers/rootRouter";
import userRouter from "./routers/userRouter";
import videoRouter from "./routers/videoRouter";
import { flashMiddleware, localsMiddleware } from "./middlewares";


const PORT = 4000;
const app = express();
const logger = morgan("dev");

app.set("view engine", "pug"); //express에서 사용할 view engine을 pug를 사용하겠다고 설정.
app.set("views", process.cwd() + "/src/views");
app.use(logger);
app.use(express.urlencoded({extended: true}))
app.use(session({
    secret: process.env.COOKIE_SECRET,
    resave: false,
    saveUninitialized: false, // false의 경우 세션을 수정하지 않은 경우엔 세션을 저장하지 않게 함 
    store: MongoStore.create({mongoUrl:process.env.DB_URL}),
}));

app.use(flash());

app.use(localsMiddleware);
app.use(flashMiddleware);

app.use("/uploads", express.static("uploads"))
app.use("/", rootRouter);
app.use("/videos", videoRouter);
app.use("/users", userRouter);


export default app;