import express from "express"
import {see, edit, upload, remove} from "../controllers/videoController";

const videoRouter = express.Router();

videoRouter.get("/:id", see);
videoRouter.get("/:id/edit", edit);
videoRouter.get("/:id/remove", remove);
videoRouter.get("/upload", upload);

export default videoRouter;