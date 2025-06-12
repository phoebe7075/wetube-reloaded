import express from "express";
import { getEdit, remove, see, logout, startGithubLogin, finishGithubLogin, postEdit } from "../controllers/userController";


const userRouter = express.Router();

userRouter.route("/edit").get(getEdit).post(postEdit);
userRouter.get("/logout", logout);
userRouter.route("/github/start").get(startGithubLogin);
userRouter.route("/github/finish").get(finishGithubLogin);
userRouter.get("/:id(\\d+)", see);



export default userRouter;