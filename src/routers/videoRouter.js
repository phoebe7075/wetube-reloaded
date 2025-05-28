import express from "express"
import {watch, getEdit,  postEdit} from "../controllers/videoController";

const videoRouter = express.Router();

videoRouter.get("/:id(\\d+)", watch); //(\\d+)라는 Regular Expression으로 숫자만 받게 한다. 이러면 글자로 된 링크는 위치에 관계없이 인식 가능. ~4.8
videoRouter.route("/:id(\\d+)/edit").get(getEdit).post(postEdit);


export default videoRouter;