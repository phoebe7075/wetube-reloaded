import express from "express";
import { getJoin, getLogin, postJoin, postLogin } from "../controllers/userController";
import { search, home } from "../controllers/videoController";

const rootRouter = express.Router();

rootRouter.get("/", home);
rootRouter.route("/join").get(getJoin).post(postJoin);
rootRouter.route("/login").get(getLogin).post(postLogin);
rootRouter.get("/search", search);

export default rootRouter; //특정 변수만 export 하기 위해 사용,