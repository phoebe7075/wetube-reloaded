import "./db";
import Video from "./models/Video";
import app from "./server"



const PORT = 4000;

const handleListening = () => 
    console.log(`Server Listening on port http://localhost:${PORT}.`);

app.listen(PORT, handleListening);