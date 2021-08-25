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
    // play music
    document.getElementById("track").play();
    for (let note of track){
        // sleep
        await new Promise(r => setTimeout(r, note[1]));
        // create arrow
        new Arrow(note[0]);
    }
    await new Promise(r => setTimeout(r, 10000));
    start();
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
start();