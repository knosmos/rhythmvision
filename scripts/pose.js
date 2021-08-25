let videoElement = document.getElementById('input_video');
let canvasElement = document.getElementById('output_canvas');
let canvasCtx = canvasElement.getContext('2d');
let gestureDisplay = document.getElementById('gesture');

let x_threshold = 0.2;
let y_threshold = 0.2;

let gesture = "none";
let loaded = false;

function onResults(results) {
    canvasCtx.save();
    canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
    canvasCtx.drawImage(
        results.image, 0, 0, canvasElement.width, canvasElement.height);
    drawConnectors(canvasCtx, results.poseLandmarks, POSE_CONNECTIONS,
            {color: '#FF147D', lineWidth: 2});
    //drawLandmarks(canvasCtx, results.poseLandmarks,
    //        {color: '#FF0000', lineWidth: 1});
    canvasCtx.restore();

    // pose detection
    if (results.poseLandmarks){
        loaded = true;
        let leftHand = results.poseLandmarks[15];
        let leftShoulder = results.poseLandmarks[11];

        let rightHand = results.poseLandmarks[16];
        let rightShoulder = results.poseLandmarks[12];

        let x_diff = (leftHand.x - leftShoulder.x) + (rightHand.x - rightShoulder.x);
        let y_diff = (leftHand.y - leftShoulder.y) + (rightHand.y - rightShoulder.y);

        gesture = "none";
        if (x_diff > x_threshold){
            gesture = "left";
        }
        else if (-x_diff > x_threshold){
            gesture = "right";
        }
        else if (y_diff > y_threshold){
            gesture = "down";
        }
        else if (-y_diff > y_threshold){
            gesture = "up";
        }
        
        gestureDisplay.innerHTML = gesture;        
    }
}

let pose = new Pose({locateFile: (file) => {
    console.log(file);
    return `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}`;
}});
pose.setOptions({
    modelComplexity: 1,
    smoothLandmarks: true,
    enableSegmentation: true,
    smoothSegmentation: true,
    minDetectionConfidence: 0.5,
    minTrackingConfidence: 0.5
});
pose.onResults(onResults);

let camera = new Camera(videoElement, {
  onFrame: async () => {
    await pose.send({image: videoElement});
  },
  width: 1280,
  height: 720
});
camera.start();