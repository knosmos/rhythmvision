// Song selection
let selectElem = document.getElementById("select");
let track;
let audio;
let songs = {
    "arroz":[track_arroz,"songs/arroz-con-pollo.mp3"],
    "builder":[track_builder,"songs/the-builder.mp3"],
    "cold":[track_cold,"songs/cold-funk.mp3"]
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