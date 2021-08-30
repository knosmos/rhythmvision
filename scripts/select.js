// Song selection
let selectElem = document.getElementById("select");
let track;
let audio = new Audio("songs/background.mp3");
let songs = {
    "arroz":[track_arroz,"songs/arroz-con-pollo.mp3"],
    "airship":[track_airship,"songs/airship.mp3"],
    "builder":[track_builder,"songs/the-builder.mp3"],
    "voxel":[track_voxel,"songs/voxel-revolution.mp3"],
    "cold":[track_cold,"songs/cold-funk.mp3"],
    "show":[track_welcome,"songs/welcome-to-the-show.mp3"],
    "desert":[track_desert,"songs/desert-of-lost-souls.mp3"],
    "maple":[track_maple,"songs/maple-leaf-rag.mp3"]
}

function selectSong(song){
    console.log(playing);
    if (!playing && loaded){
        track = songs[song][0];
        // selectElem.style.display = "none";
        selectElem.style.top = "-50%";
        audio.pause();
        audio = new Audio(songs[song][1]);
        start();        
    }
}

function reset(){
    // selectElem.style.display = "block";
    selectElem.style.top = "50%";
    audio.pause();
    audio = new Audio("songs/background.mp3");
    audio.play();
}

async function backgroundmusic(){
    while (true){
        if (loaded && !playing){
            reset();
            document.getElementById("splash").style.display = "none";
            break;
        }
        await new Promise(r => setTimeout(r, 1000)); 
    }
}
backgroundmusic();