import express from "express"


const globalRouter = express.Router();

const handleHome = (req, res) => res.send("Home");


globalRouter.get("/", handleHome);




export default globalRouter; //특정 변수만 export 하기 위해 사용,