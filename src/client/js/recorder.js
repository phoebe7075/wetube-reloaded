import { createFFmpeg, FFmpeg } from '@ffmpeg/ffmpeg';
import { fetchFile, toBlobURL } from '@ffmpeg/util'

const startBtn = document.getElementById("startBtn");
const video = document.getElementById("preview");

let stream;
let recorder;
let videoFile;

const handleDownload = async () => {
    const ffmpeg = new FFmpeg();
    await ffmpeg.load({
    corePath: '/node_modules/@ffmpeg/core/dist/esm/ffmpeg-core.js',
    });
    ffmpeg.on('log', ({message})=>console.log(message));


    ffmpeg.writeFile("recording.webm", await fetchFile(videoFile)); //브라우저 상의 ffmpeg 가상 환경에서 파일 생성
    
    await ffmpeg.exec(["-i", "recording.webm", "-r", "60", "output.mp4"]); // webm -> mp4 컨버트
    await ffmpeg.exec(["-i", "recording.webm", "-ss", "00:00:01", "-frames:v", "1", "thumbnail.jpg"]);

    const videoData = await ffmpeg.readFile('output.mp4');
    const thumbFile = await ffmpeg.readFile("thumbnail.jpg");

    const videoBlob = new Blob([videoData.buffer], { type: "video/mp4" });
    const thumbBlob = new Blob([thumbFile.buffer], {type: "image/jpg"});

    const videoUrl = URL.createObjectURL(videoBlob);
    const thumbUrl = URL.createObjectURL(thumbBlob);

    videoFile = videoUrl;


    const a = document.createElement("a");
    a.href = videoFile;
    a.download = "MyRecording";
    document.body.appendChild(a);
    a.click();

    const thumbA = document.createElement("a");
    thumbA.href = thumbUrl;
    thumbA.download = "Thumbnail.jpg";
    document.body.appendChild(thumbA);
    thumbA.click();
}

const handleStop = () => {
    startBtn.innerText = "Download Recording";
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
        videoFile = URL.createObjectURL(e.data); //브라우저 내의 메모리를 가리키는 URL.
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