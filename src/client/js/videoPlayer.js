const video = document.querySelector("video");
const playBtn = document.getElementById("play")
const muteBtn = document.getElementById("mute")
const time = document.getElementById("time")
const volume = document.getElementById("volume")

const handlePlayBtn = (e) => {
    if(video.paused){
        handleChangePlayBtnText("Play");
        video.play();
    }else {
        handleChangePlayBtnText("Pause");
        video.pause();
    }
}

const handleMute = (e) => {

}

const handleChangePlayBtnText = (text) => {
    playBtn.innerText = text;
}

playBtn.addEventListener("click", handlePlayBtn);
muteBtn.addEventListener("click", handleMute);
video.addEventListener("pause", () => handleChangePlayBtnText("Play"));
video.addEventListener("play", () => handleChangePlayBtnText("Pause"));