import express from "express"
import {watch, getEdit,  postEdit, getUpload, postUpload, deleteVideo} from "../controllers/videoController";
import { protectorMiddleware } from "../middlewares";

const videoRouter = express.Router();

videoRouter.route("/:id([0-9a-f]{24})").get(watch); //16진수 24 길이인 id에 대한 regx.
videoRouter.route("/:id([0-9a-f]{24})/edit").all(protectorMiddleware).get(getEdit).post(postEdit);
videoRouter.route("/:id([0-9a-f]{24})/delete").all(protectorMiddleware).get(deleteVideo)
videoRouter.route("/upload").all(protectorMiddleware).get(getUpload).post(postUpload);

export default videoRouter;