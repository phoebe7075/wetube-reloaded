import express from "express";
import { getEdit, remove, see, logout, startGithubLogin, finishGithubLogin, postEdit, getChangePassword, postChangePassword } from "../controllers/userController";
import { protectorMiddleware, publicOnlyMiddleware, uploadFiles } from "../middlewares";


const userRouter = express.Router();

userRouter.route("/edit").all(protectorMiddleware).get(getEdit).post(uploadFiles.single("avatar"), postEdit);
userRouter.get("/logout", protectorMiddleware ,logout);
userRouter.route("/github/start").get(publicOnlyMiddleware, startGithubLogin);
userRouter.route("/github/finish").get(publicOnlyMiddleware, finishGithubLogin);
userRouter.route("/change-password").all(protectorMiddleware).get(getChangePassword).post(postChangePassword);
userRouter.get("/:id(\\d+)", see);



export default userRouter;