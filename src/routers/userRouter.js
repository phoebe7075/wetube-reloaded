import express from "express";
import { edit, remove, see, logout, startGithubLogin, finishGithubLogin } from "../controllers/userController";


const userRouter = express.Router();

userRouter.get("/edit", edit);
userRouter.get("/remove", remove);
userRouter.get("/logout", logout);
userRouter.route("/github/start").get(startGithubLogin);
userRouter.route("/github/finish").get(finishGithubLogin);
userRouter.get("/:id(\\d+)", see);



export default userRouter;