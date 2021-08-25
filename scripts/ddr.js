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

        // start the arrow moving downwards
        setTimeout(()=>{
            this.elem.style.bottom = "0%";
        },10);

        // check gesture at end
        setTimeout(()=>{
            // gets first letter of gesture from pose.js and checks against key
            if (gesture[0] == this.key){
                new Message("fantastic!");
                new Cloud(this.left);
                score += 10;
            }
            else{
                new Message("miss!");
                score -= 2;
                score = Math.max(0, score);
            }
            document.getElementById("score").innerHTML = score;
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
            this.elem.style.transform = "translate(-50%, -50%) scale(1.5)";
            this.elem.style.opacity = "0%";
        },10);
        setTimeout(()=>{
            document.getElementById("arrow_parent").removeChild(this.elem);
        },3000);
    }
}

class Cloud{
    constructor(left){
        this.left = `${parseInt(left.slice(0,2))+25/2}%`;
        let parent = document.getElementById("arrow_parent");
        this.elem = document.createElement("img");
        this.elem.src = "assets/cloud.png";
        this.elem.className = "cloud";
        this.elem.style.left = this.left;
        parent.appendChild(this.elem);

        setTimeout(()=>{
            this.elem.style.transform = "translate(-50%, -50%) scale(2.0)";
            this.elem.style.opacity = "0%";
        },10);
        setTimeout(()=>{
            document.getElementById("arrow_parent").removeChild(this.elem);
        },3000); 
    }
}

let score = 0;

async function play(){
    // play music (4 second delay to match up the timings)
    setTimeout(()=>{
        audio.play();
    },4000);

    // ready set go
    setTimeout(()=>{
        new Message("Ready!");
    },1000);

    setTimeout(()=>{
        new Message("Set!");
    },2000);

    setTimeout(()=>{
        new Message("Dance!");
    },3000);

    // Start falling notes

    let start_time = Date.now(); // used to account for lag
    let accumulated_time = 0;
    let current_time;
    for (let note of track){
        // sleep
        current_time = Date.now();
        let drift = current_time - (start_time + accumulated_time);
        let delay = note[1] - drift;
        accumulated_time += note[1];
        console.log(drift);
        await new Promise(r => setTimeout(r, delay));
        // create arrow
        new Arrow(note[0]);
    }
    await new Promise(r => setTimeout(r, 5000));
    reset();
}

async function start(){
    score = 0;
    while (true){
        if (loaded){
            new Message("raise hands to play");
        }
        if (gesture == "up"){
            document.getElementById("score").innerHTML = score;
            play();
            break;
        }
        // sleep
        await new Promise(r => setTimeout(r, 1000)); 
    }
}