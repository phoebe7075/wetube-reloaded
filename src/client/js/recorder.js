import { createFFmpeg, FFmpeg } from '@ffmpeg/ffmpeg';
import { fetchFile, toBlobURL } from '@ffmpeg/util'

const actionBtn = document.getElementById("actionBtn");
const video = document.getElementById("preview");

let stream;
let recorder;
let videoFile;

const files = {
    input: "recording.webm",
    output: "output.mp4",
    thumb: "thumbnail.jpg",
}

const downloadFile = (fileUrl, fileName) => {
    
    const a = document.createElement("a");
    a.href = fileUrl;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
}

const handleDownload = async () => {
    actionBtn.removeEventListener("click", handleDownload);

    actionBtn.innerText = "Transcoding...";

    actionBtn.disabled = true;

    const ffmpeg = new FFmpeg();
    await ffmpeg.load({
    corePath: '/node_modules/@ffmpeg/core/dist/esm/ffmpeg-core.js',
    });
    ffmpeg.on('log', ({message})=>console.log(message));


    ffmpeg.writeFile(files.input, await fetchFile(videoFile)); //브라우저 상의 ffmpeg 가상 환경에서 파일 생성
    
    await ffmpeg.exec(["-i", files.input, "-r", "60", files.output]); // webm -> mp4 컨버트
    await ffmpeg.exec(["-i", files.input, "-ss", "00:00:01", "-frames:v", "1", files.thumb]);

    const videoData = await ffmpeg.readFile(files.output);
    const thumbFile = await ffmpeg.readFile(files.thumb);

    const videoBlob = new Blob([videoData.buffer], { type: "video/mp4" });
    const thumbBlob = new Blob([thumbFile.buffer], {type: "image/jpg"});

    const videoUrl = URL.createObjectURL(videoBlob);
    const thumbUrl = URL.createObjectURL(thumbBlob);

    videoFile = videoUrl;


    downloadFile(videoFile, "MyRecording.mp4");
    downloadFile(thumbUrl, "Thumbnail.jpg");

    ffmpeg.unlink(files.input);
    ffmpeg.unlink(files.output);
    ffmpeg.unlink(files.thumb);

    actionBtn.disabled = false;
    actionBtn.innerText = "Recording again";
    actionBtn.addEventListener("click", handleStart);
}

const handleStart = () => {
    actionBtn.innerText = "Recording";
    actionBtn.disabled = true;
    actionBtn.removeEventListener("click", handleStart);


    recorder = new MediaRecorder(stream);
    recorder.ondataavailable = (e) => {
        videoFile = URL.createObjectURL(e.data); //브라우저 내의 메모리를 가리키는 URL.
        video.srcObject = null;
        video.src = videoFile;
        video.loop = true;
        video.play();
        actionBtn.innerText = "Download";
        actionBtn.disabled = false;
        actionBtn.addEventListener("click", handleDownload);
    }
    recorder.start();
    setTimeout(()=>{
        recorder.stop();
    }, 5000);
}

const init = async () => {
    stream = await navigator.mediaDevices.getUserMedia({
        audio: false, 
        video: {
            width: 1024,
            height: 576,
        },
    });
    video.srcObject = stream;
    video.play();
}

init();

actionBtn.addEventListener("click", handleStart);