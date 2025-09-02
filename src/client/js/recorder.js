const startBtn = document.getElementById("startBtn");
const video = document.getElementById("preview");

let stream;

const handleStop = () => {
    startBtn.innerText = "Start Recording";
    startBtn.removeEventListener("click", handleStop);
    startBtn.addEventListener("click", handleStart);
}

const handleStart = () => {
    startBtn.innerText = "Stop Recording";
    startBtn.removeEventListener("click", handleStart);
    startBtn.addEventListener("click", handleStop);

    const recorder = new MediaRecorder(stream);
    recorder.ondataavailable = (e) => {
        console.log("recorder");
        console.log(e);
        console.log(e.data);
    }
    recorder.start();

    setTimeout(() => {
        recorder.stop();
        handleStop();
    }, 10000);
}

const init = async () => {
    stream = await navigator.mediaDevices.getUserMedia({
        audio: false, 
        video: {
            width: 200,
            height: 100,
        },
    });

    video.srcObject = stream;
    video.play();
}

init();

startBtn.addEventListener("click", handleStart);