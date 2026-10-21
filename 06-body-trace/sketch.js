/* ==========================================================
   06 — Body Trace (ml5 bodyPose)
   Your pose is drawn as dots (the points) and lines (the skeleton).

   Two modes, press V to switch:
   video on  → the video is drawn new every frame, you see only the current pose
   video off → nothing is cleared, so every movement leaves a trace

   ml5 finds 17 points on the body, e.g. nose, left_shoulder,
   left_elbow, left_wrist, left_hip (and the same for right_).
   Docs: https://docs.ml5js.org/#/reference/bodypose
   ========================================================== */


/* ---------- SETTINGS: change me ---------- */

const COLOR = "red";
const DOT_SIZE = 6;
const LINE_WEIGHT = 1;
const MIN_CONFIDENCE = 0.2;    // ignore points the model is unsure about (0 … 1)

let showVideo = true;          // start with the video, press V to switch


/* ---------- SETUP ---------- */

let video;
let bodyPose;
let poses = [];      // ml5 fills this with every body it finds
let connections;     // which points are connected by a line

// async setup: "await" waits until the model is loaded
async function setup() {
  bodyPose = await ml5.bodyPose("MoveNet", { flipped: true });

  createCanvas(640, 480);  // same size as the video, CSS scales it to the window
  video = createCapture(VIDEO, { flipped: true });  // flipped = mirror view
  video.size(640, 480);
  video.hide();

  // pairs of point numbers, e.g. [5, 7] = left shoulder → left elbow
  connections = bodyPose.getConnections();

  // start detecting, gotPoses is called with the results
  bodyPose.detectStart(video, gotPoses);
}

function gotPoses(results) {
  poses = results;
}


/* ---------- DRAW: runs ~60 times per second ---------- */

function draw() {
  // video on: draw it new every frame → covers everything from before
  // video off: draw no background → everything stays → a trace
  if (showVideo) image(video, 0, 0);

  for (const pose of poses) {

    // the lines: connect two points if the model is sure about both
    stroke(COLOR);
    strokeWeight(LINE_WEIGHT);
    for (const [a, b] of connections) {
      const pointA = pose.keypoints[a];
      const pointB = pose.keypoints[b];
      if (isVisible(pointA) && isVisible(pointB)) {
        line(pointA.x, pointA.y, pointB.x, pointB.y);
      }
    }

    // the dots: one on every point
    noStroke();
    fill(COLOR);
    for (const point of pose.keypoints) {
      if (isVisible(point)) circle(point.x, point.y, DOT_SIZE);
    }
  }
}

// V → switch video / trace, space → clear the trace
function keyPressed() {
  if (key === "v") {
    showVideo = !showVideo;
    background(255);  // start the trace on white
  }
  if (key === " ") background(255);
}


/* ---------- HELPERS ---------- */

// true if the model is sure enough about this point
function isVisible(point) {
  return point.confidence > MIN_CONFIDENCE;
}
