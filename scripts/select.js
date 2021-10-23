// Song selection
let selectElem = document.getElementById("select");
let selectMenuOpen = true;
let track;
let audio = new Audio("songs/background.mp3");
let songs = {
    "Airship Serenity":[track_airship,"songs/airship.mp3"],
    "Arroz con Pollo":[track_arroz,"songs/arroz-con-pollo.mp3"],
    "Living Voyage":[track_voyage,"songs/living-voyage.mp3"],
    "The Builder":[track_builder,"songs/the-builder.mp3"],
    "Voxel Revolution":[track_voxel,"songs/voxel-revolution.mp3"],
    "Cold Funk":[track_cold,"songs/cold-funk.mp3"],
    "Maple Leaf Rag":[track_maple,"songs/maple-leaf-rag.mp3"],
    "Welcome to the Show":[track_welcome,"songs/welcome-to-the-show.mp3"],
    "Desert of Lost Souls":[track_desert,"songs/desert-of-lost-souls.mp3"]
}

for (let song_name of Object.keys(songs)) {
    document.getElementById("song-button-container").innerHTML += `
    <button onclick="selectSong('${song_name}')">${song_name}</button>`;
}

function selectSong(song){
    console.log(playing);
    if (!playing && loaded){
        track = songs[song][0];
        // selectElem.style.display = "none";
        selectElem.style.top = "-50%";
        selectMenuOpen = false;
        audio.pause();
        audio = new Audio(songs[song][1]);
        start();        
    }
}

function reset(){
    // selectElem.style.display = "block";
    selectElem.style.top = "50%";
    selectMenuOpen = true;
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

// settings menu
let settingsElem = document.getElementById("settings");
settingsElem.style.top = "-50%";

function openSettings(){
    selectElem.style.top = "-50%";
    settingsElem.style.top = "50%";
}

function closeSettings(){
    if (selectMenuOpen){
        selectElem.style.top = "50%";
    }
    settingsElem.style.top = "-50%";
}