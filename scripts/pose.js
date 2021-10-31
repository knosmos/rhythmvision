let videoElement = document.getElementById('input_video');
let canvasElement = document.getElementById('output_canvas');
let canvasCtx = canvasElement.getContext('2d');
let gestureDisplay = document.getElementById('gesture');

let x_threshold = 0.15;
let y_threshold = 0.15;
let squat_threshold = 1.25;
let kick_threshold = 0.15;

let gesture = "none";
let gesture_log = []; // log of previous 50 frames
for (let i=0; i<10; i++) {
    gesture_log.push("n"); // fill array
}

let loaded = false;

let showCamera = true; // whether to overlay camera view on pose detection canvas

let squatForDown = false; // whether down motion is triggered by squatting
let kickForLateral = false; // whether left/right motion is triggered by kicking

function onResults(results) {
    canvasCtx.save();
    canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);

    if (results.poseLandmarks) {
        for (i = 0; i < 11; i++) {
            results.poseLandmarks[i] = [NaN,NaN,NaN]; // remove facial landmarks
        }    
    }

    if (showCamera){
        canvasCtx.drawImage(
            results.image, 0, 0, canvasElement.width, canvasElement.height);    
        drawConnectors(canvasCtx, results.poseLandmarks, POSE_CONNECTIONS,
            {color: '#FF147D', lineWidth: 10});
    }
    else{
        canvasCtx.rect(0, 0, canvasElement.width, canvasElement.height);
        canvasCtx.fillStyle = "#042736";
        canvasCtx.fill();
        drawConnectors(canvasCtx, results.poseLandmarks, POSE_CONNECTIONS,
            {color: '#FF147D', lineWidth: 20});  
        // drawLandmarks(canvasCtx, results.poseLandmarks,
        //     {color: '#FF147D', lineWidth: 1});      
    }
    canvasCtx.restore();

    // pose detection
    if (results.poseLandmarks){
        loaded = true;

        let leftHand = results.poseLandmarks[15];
        let leftShoulder = results.poseLandmarks[11];

        let rightHand = results.poseLandmarks[16];
        let rightShoulder = results.poseLandmarks[12];

        let rightKnee = results.poseLandmarks[26];
        let leftKnee = results.poseLandmarks[25];

        let rightHip = results.poseLandmarks[24];
        let leftHip = results.poseLandmarks[23];

        let x_diff = (leftHand.x - leftShoulder.x) + (rightHand.x - rightShoulder.x);
        let y_diff = (leftHand.y - leftShoulder.y) + (rightHand.y - rightShoulder.y);
        
        let s_diff = (leftKnee.y - leftShoulder.y) + (rightKnee.y - rightShoulder.y);

        let r_leg_diff = Math.abs(rightKnee.y - rightHip.y);
        let l_leg_diff = Math.abs(leftKnee.y - leftHip.y);

        gesture = "none";

        if (-y_diff > y_threshold){
            gesture = "up";
        }

        if (!squatForDown) {
            if (y_diff > y_threshold){
                gesture = "down";
            }            
        }

        if (kickForLateral) {
            if (r_leg_diff < kick_threshold && l_leg_diff > kick_threshold){
                gesture = "right";
            }
            else if (l_leg_diff < kick_threshold){
                gesture = "left";
            }
        }
        else {
            if (x_diff > x_threshold){
                gesture = "left";
            }
            else if (-x_diff > x_threshold){
                gesture = "right";
            }
        }
        
        if (squatForDown) {
            // let s_diff = r_leg_diff + l_leg_diff;
            // console.log (Math.abs(r_leg_diff-l_leg_diff));
            if (s_diff < squat_threshold && Math.abs(r_leg_diff-l_leg_diff) < 0.05){
                gesture = "down";
            }
        }

        gestureDisplay.innerHTML = gesture;
        gesture_log.shift();
        gesture_log.push(gesture[0]); 
    }
}

let pose = new Pose({locateFile: (file) => {
    console.log(file);
    return `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}`;
}});
pose.setOptions({
    modelComplexity: 0,
    smoothLandmarks: true,
    enableSegmentation: true,
    smoothSegmentation: true,
    minDetectionConfidence: 0.5,
    minTrackingConfidence: 0.5
});
pose.onResults(onResults);

function setPoseModelComplexity(complexity) {
    pose.setOptions({modelComplexity: complexity});
}

let camera = new Camera(videoElement, {
  onFrame: async () => {
    await pose.send({image: videoElement});
  },
  width: 1280,
  height: 720
});
camera.start();