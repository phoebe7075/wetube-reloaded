const video = document.querySelector("video");
const playBtn = document.getElementById("play");
const playBtnIcon = playBtn.querySelector("i");
const muteBtn = document.getElementById("mute");
const muteBtnIcon = muteBtn.querySelector("i");
const volumeRange = document.getElementById("volume")
const currentTime = document.getElementById("currentTime");
const totalTime = document.getElementById("totalTime");
const timeline = document.getElementById("timeline");
const fullScreenBtn = document.getElementById("fullScreen");
const fullScreenBtnIcon = fullScreenBtn.querySelector("i");
const videoContainer = document.getElementById("videoContainer");
const videoControls = document.getElementById("videoControls");

let volumeValue = 0.5;
let leaveTimeoutId = null;
let movementTimeoutId = null;
video.volume = volumeValue;

const handlePlayClick = (e) => {
    if(video.paused){
        video.play();
    }else {
        video.pause();
    }

    playBtnIcon.classList = video.paused ? "fas fa-play" : "fas fa-pause";
}

const handleMuteClick = (e) => {
    if(video.muted) {
        video.muted = false;
    } else {
        video.muted = true;
    }
    muteBtnIcon.classList = video.muted 
        ? "fas fa-volume-mute" 
        : "fas fa-volume-up";
    volumeRange.value = video.muted ? 0 : volumeValue;
}

const handlevolumeChange = (event) => {
    const {target: {value}} = event;
    if(video.muted && value > 0) {
        video.muted = false;
    } else if (value == 0) {
        video.muted = true;
    }
    volumeValue = value;
    video.volume = value;
    muteBtnIcon.classList = video.muted 
        ? "fas fa-volume-mute" 
        : "fas fa-volume-up";
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
    //timeline.value = value;
}

const handlefullScreenBtn = (event) => {
    if(document.fullscreenElement) {
        document.exitFullscreen();
        fullScreenBtnIcon.classList = "fas fa-expand";
    } else {
        videoContainer.requestFullscreen();
        fullScreenBtnIcon.classList = "fas fa-compress";
    }
    
}
const hideControls = () => {
    videoControls.classList.remove("showing");
}

const handleMouseMove = () => {
    if(leaveTimeoutId) {
        clearTimeout(leaveTimeoutId);
        leaveTimeoutId = null;
    }
    if(movementTimeoutId) {
        clearTimeout(movementTimeoutId);
        movementTimeoutId = null;
    }
    videoControls.classList.add("showing");

    movementTimeoutId = setTimeout(hideControls, 3000);
};

const handleMouseLeave = () => {
    leaveTimeoutId = setTimeout(hideControls, 3000)
}

const handleKeyUp = (e) => {
    if(e.code === "Space") {
        handlePlayClick();
    }
}

const handleEnded = () => {
    const {id} = videoContainer.dataset;
    fetch(`/api/videos/${id}/views`, {
        method: "POST",
    });
};

playBtn.addEventListener("click", handlePlayClick);
muteBtn.addEventListener("click", handleMuteClick);
volumeRange.addEventListener("input", handlevolumeChange);
video.addEventListener("loadeddata", handleLoadedMetadata);
video.addEventListener("timeupdate", handleTimeUpdate);
video.addEventListener("click", handlePlayClick);
video.addEventListener("ended", handleEnded);
timeline.addEventListener("input", handleTimelineUpdate);
fullScreenBtn.addEventListener("click", handlefullScreenBtn);

videoContainer.addEventListener("mousemove", handleMouseMove);
videoContainer.addEventListener("mouseleave", handleMouseLeave);

document.addEventListener("keyup", handleKeyUp);


