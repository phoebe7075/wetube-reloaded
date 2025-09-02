const startBtn = document.getElementById("startBtn");
const video = document.getElementById("preview");

let stream;

let recorder;

const handleDownload = () => {
    startBtn.innerText = "Download Recording";
}

const handleStop = () => {
    startBtn.innerText = "Start Recording";
    startBtn.removeEventListener("click", handleStop);
    startBtn.addEventListener("click", handleDownload);

    recorder.stop();
}

const handleStart = () => {
    startBtn.innerText = "Stop Recording";
    startBtn.removeEventListener("click", handleStart);
    startBtn.addEventListener("click", handleStop);

    recorder = new MediaRecorder(stream);
    recorder.ondataavailable = (e) => {
        const videoFile = URL.createObjectURL(e.data); //브라우저 내의 메모리를 가리키는 URL.
        video.srcObject = null;
        video.src = videoFile;
        video.loop = true;
        video.play();
    }
    recorder.start();
}

const init = async () => {
    stream = await navigator.mediaDevices.getUserMedia({
        audio: false, 
        video: {
            width: 200,
            height: 100,
        },
    });
}

init();

startBtn.addEventListener("click", handleStart);