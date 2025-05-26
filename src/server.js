import express from "express";
const PORT = 4000;
const app = express();

const handleHome = (req, res) => { // 이것은 middlewares, controller임.
    //console.log(req);
    //return res.end(); //request를 종료시키는 방법 중 하나.
    return res.send("<h1>It is end</h1>"); //이러한 방식으로 html, json 등을 respond 할 수 있다.
};

const gossipMiddleware = (req, res, next) => {
    //console.log("I'm in the middle!");
    console.log(`Someone is going to: ${req.url}`);
    next();
};

const handleLogin = (req, res) => {
    return res.send("Login success.");
};

//app.get("/", handleHome); // ~3.4
app.get("/", gossipMiddleware, handleHome); // 3.5~
app.get("/login", handleLogin);

const handleListening = () => 
    console.log(`Server Listening on port http://localhost:${PORT}.`);

app.listen(PORT, handleListening);