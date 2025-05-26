import express from "express";
const PORT = 4000;
const app = express();

const handleHome = (req, res) => { // 이것은 middlewares, controller임.
    //console.log(req);
    //return res.end(); //request를 종료시키는 방법 중 하나.
    return res.send("<h1>It is end</h1>"); //이러한 방식으로 html, json 등을 respond 할 수 있다.
};

const logger = (req, res, next) => {
    //console.log("I'm in the middle!");
    console.log(`Someone is going to: ${req.url}, on: ${req.method}`);
    next();
};

const privateMiddleware = (req, res, next) => {
    const url = req.url;
    if(url === "/protected"){
        return res.send("<h1>Not Allowed</h1>");
    }
    console.log("Allowed, you may continue.");
    next();
}

const handleLogin = (req, res) => {
    return res.send("Login success.");
};

const handleProtected = (req, res) => {
    return res.send("Welcome to the private lounge.");
}
 
//use()는 global middleware = 어디서 접속하든 적용되는 middleware를 적용하는 매서드. 순서 중요
// 모든 get보다 앞서있으면 무조건 적용되고, 맨 아래에 있다면 get 등으로 등록하지 않은 주소에 대해서만 적용.
app.use(logger);
app.use(privateMiddleware);

//app.get("/", handleHome); // ~3.4
//app.get("/", gossipMiddleware, handleHome); // ~3.5
app.get("/", handleHome);
app.get("/login", handleLogin);
app.get("/protected", handleProtected);
const handleListening = () => 
    console.log(`Server Listening on port http://localhost:${PORT}.`);

app.listen(PORT, handleListening);