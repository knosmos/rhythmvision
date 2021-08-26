// Song selection
let selectElem = document.getElementById("select");
let track;
let audio;
let songs = {
    "arroz":[track_arroz,"songs/arroz-con-pollo.mp3"],
    "builder":[track_builder,"songs/the-builder.mp3"],
    "voxel":[track_voxel,"songs/voxel-revolution.mp3"],
    "cold":[track_cold,"songs/cold-funk.mp3"],
    "show":[track_welcome,"songs/welcome-to-the-show.mp3"],
    "desert":[track_desert,"songs/desert-of-lost-souls.mp3"]
}

function selectSong(song){
    track = songs[song][0];
    selectElem.style.display = "none";
    audio = new Audio(songs[song][1]);
    start();
}

function reset(){
    selectElem.style.display = "block";
}