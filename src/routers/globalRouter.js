import express from "express";
import { join, login } from "../controllers/userController";
import { search, home } from "../controllers/videoController";

const globalRouter = express.Router();

globalRouter.get("/", home);
globalRouter.get("/join", join);
globalRouter.get("/login", login);
globalRouter.get("/search", search);

export default globalRouter; //특정 변수만 export 하기 위해 사용,