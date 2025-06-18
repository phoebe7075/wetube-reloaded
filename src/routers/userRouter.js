import express from "express";
import { getEdit, see, logout, startGithubLogin, finishGithubLogin, postEdit, getChangePassword, postChangePassword } from "../controllers/userController";
import { avatarUpload, protectorMiddleware, publicOnlyMiddleware,  } from "../middlewares";


const userRouter = express.Router();

userRouter.route("/edit").all(protectorMiddleware).get(getEdit).post(avatarUpload.single("avatar"), postEdit);
userRouter.get("/logout", protectorMiddleware ,logout);
userRouter.route("/github/start").get(publicOnlyMiddleware, startGithubLogin);
userRouter.route("/github/finish").get(publicOnlyMiddleware, finishGithubLogin);
userRouter.route("/change-password").all(protectorMiddleware).get(getChangePassword).post(postChangePassword);
userRouter.get("/:id([0-9a-f]{24})", see);



export default userRouter;