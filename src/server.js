import express from "express";
const PORT = 4000;
const app = express();

const handleHome = (req, res) => {
    //console.log(req);
    //return res.end(); //request를 종료시키는 방법 중 하나.
    return res.send("It is end");
};

const handleLogin = (req, res) => {
    return res.send("Login success.");
};

app.get("/", handleHome);
app.get("/login", handleLogin);

const handleListening = () => 
    console.log(`Server Listening on port http://localhost:${PORT}.`);

app.listen(PORT, handleListening);