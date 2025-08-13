const video = document.querySelector("video");
const playBtn = document.getElementById("play")
const muteBtn = document.getElementById("mute")
const volumeRange = document.getElementById("volume")
const currentTime = document.getElementById("currentTime");
const totalTime = document.getElementById("totalTime");
const timeline = document.getElementById("timeline");


let volumeValue = 0.5;
video.volume = volumeValue;

const handlePlayBtn = (e) => {
    if(video.paused){
        video.play();
    }else {
        video.pause();
    }

    playBtn.innerText = video.paused ? "Play" : "Pause";
}

const handleMute = (e) => {
    if(video.muted) {
        video.muted = false;
    } else {
        video.muted = true;
    }
    muteBtn.innerText = video.muted ? "Unmute" : "Mute";
    volumeRange.value = video.muted ? 0 : volumeValue;
}

const handlevolumeChange = (event) => {
    const {target: {value}} = event;
    if(video.muted) {
        video.muted = false;
        muteBtn.innerText = "Mute";
    }
    volumeValue = value;
    video.volume = value;
}

const formatTime = (seconds) => {
    if(seconds >= 3600) {
        return new Date(Math.floor(seconds*1000)).toISOString().substring(11,19);
    } else {
        return new Date(Math.floor(seconds*1000)).toISOString().substring(14,19);
    }
}

const handleLoadedMetadata = () => {
    const videolength = video.duration;

    totalTime.innerText = formatTime(videolength);
    timeline.max = Math.floor(videolength);
}


const handleTimeUpdate = () => {
    const cTime = video.currentTime;
    currentTime.innerText = formatTime(cTime);
    timeline.value = Math.floor(cTime*100)/100;
}

const handleTimelineUpdate = (event) => {
    const {target: {value}} = event;

    video.currentTime = value;
    timeline.value = value;
}

playBtn.addEventListener("click", handlePlayBtn);
muteBtn.addEventListener("click", handleMute);
volumeRange.addEventListener("input", handlevolumeChange);
video.addEventListener("loadedmetadata", handleLoadedMetadata);
video.addEventListener("timeupdate", handleTimeUpdate);

timeline.addEventListener("input", handleTimelineUpdate);