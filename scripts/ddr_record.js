let track = [];
let audio = new Audio();

class Arrow{
    constructor(key){
        this.key = key;
        this.time = 4; // how long it takes to reach bottom
        this.src = `assets/arrow_${key}.png`;
        this.left = {"l":"0%","d":"25%","u":"50%","r":"75%"}[key];
        this.build();
    }
    build(){
        // construct the arrow img element
        let parent = document.getElementById("arrow_parent");
        this.elem = document.createElement("img");
        this.elem.src = this.src;
        this.elem.className = "arrow";
        this.elem.style.left = this.left;
        parent.appendChild(this.elem);

        // start the arrow moving upwards
        this.elem.style.bottom = "0%";
        setTimeout(()=>{
            this.elem.style.bottom = "100%";
        },10);

        // check gesture at end
        setTimeout(()=>{
            document.getElementById("arrow_parent").removeChild(this.elem);
        },this.time*1000);
    }
}

class Message{
    constructor(text){
        this.text = text;

        let parent = document.getElementById("arrow_parent");
        this.elem = document.createElement("div");
        this.elem.innerHTML = this.text;
        this.elem.className = "message";
        parent.appendChild(this.elem);

        setTimeout(()=>{
            this.elem.style.opacity = "0%";
        },10);
        setTimeout(()=>{
            document.getElementById("arrow_parent").removeChild(this.elem);
        },3000);
    }
}

async function play(){
    // play music
    audio.play();
    let start_time = Date.now();
    let accumulated_time = 0;
    let old_gesture = "up";
    while (true){
        if (old_gesture != gesture & gesture != "none"){
            new Arrow(gesture[0]);
            let current_time = Date.now();
            let note_delay = current_time - (start_time + accumulated_time);
            accumulated_time += note_delay;
            old_gesture = gesture;

            track.push([gesture[0], note_delay]);
        }
        await new Promise(r => setTimeout(r, 100)); 
    }
}

async function start(){
    while (true){
        if (loaded){
            new Message("raise hands to play");
        }
        if (gesture == "up"){
            play();
            break;
        }
        // sleep
        await new Promise(r => setTimeout(r, 1000)); 
    }
}

function setsong(){
    let musicFile = document.getElementById("custom-music").files[0];
    let fileReader = new FileReader();
    fileReader.readAsDataURL(musicFile);
    fileReader.onload = function(e) {
        audio.src=e.target.result;
        start();
    }
}

function download(filename, text) {
    var element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    element.setAttribute('download', filename);
  
    element.style.display = 'none';
    document.body.appendChild(element);
  
    element.click();
    document.body.removeChild(element);
}

function copytrack(){
    let track_str = JSON.stringify(track);
    navigator.clipboard.writeText(track_str);
}

function savetrack(){
    let track_str = JSON.stringify(track);
    let track_name = document.getElementById("custom-music").files[0].name;
    track_name = track_name.split(".")[0];
    track_name = track_name.replace(/ /g, "_");
    let filename = `${track_name}_track.json`;
    download(filename, track_str);
}