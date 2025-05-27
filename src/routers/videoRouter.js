import express from "express"
import {see, edit, upload, remove} from "../controllers/videoController";

const videoRouter = express.Router();

videoRouter.get("/upload", upload); //반드시 파라미터를 쓰는 라우터 위에 존재해야 함. 아니라면 이게 파라미터처럼 인식하여 upload페이지를 가지 못한다. ~4.7 
videoRouter.get("/:id(\\d+)", see); //(\\d+)라는 Regular Expression으로 숫자만 받게 한다. 이러면 글자로 된 링크는 위치에 관계없이 인식 가능. ~4.8
videoRouter.get("/:id(\\d+)/edit", edit);
videoRouter.get("/:id(\\d+)/remove", remove);


export default videoRouter;