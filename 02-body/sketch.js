/* ==========================================================
   02 — Body (ml5 bodyPose)
   Your body is the letter T, built from two shapes:
   the crossbar is a thick line from shoulder to shoulder,
   the stem is a rectangle from your neck down.

   ml5 finds 17 points on the body, e.g. nose, left_shoulder,
   left_elbow, left_wrist, left_hip (and the same for right_).
   Docs: https://docs.ml5js.org/#/reference/bodypose
   ========================================================== */


/* ---------- SETTINGS: change me ---------- */

const THICKNESS = 40;          // thickness of stem and crossbar
const LETTER_COLOR = "black";
const SHOW_VIDEO = true;       // show the camera faintly behind the letter
const SHOW_POINTS = true;      // show the body points that build the T
const MIN_CONFIDENCE = 0.2;    // ignore points the model is unsure about (0 … 1)


/* ---------- SETUP ---------- */

let video;
let bodyPose;
let poses = [];  // ml5 fills this with every body it finds

// preload runs before setup: load the model
function preload() {
  bodyPose = ml5.bodyPose("MoveNet", { flipped: true });
}

function setup() {
  createCanvas(640, 480);  // same size as the video, CSS scales it to the window
  video = createCapture(VIDEO, { flipped: true });  // flipped = mirror view
  video.size(640, 480);
  video.hide();

  // start detecting, gotPoses is called with the results
  bodyPose.detectStart(video, gotPoses);
}

function gotPoses(results) {
  poses = results;
}


/* ---------- DRAW: runs ~60 times per second ---------- */

function draw() {
  background(255);

  if (SHOW_VIDEO) {
    tint(255, 40);  // 40 of 255 → very transparent
    image(video, 0, 0);
  }

  if (poses.length === 0) return;  // no body found (yet)

  const pose = poses[0];  // the first person
  const leftShoulder  = pose.left_shoulder;
  const rightShoulder = pose.right_shoulder;

  // without shoulders there is no letter
  if (!isVisible(leftShoulder) || !isVisible(rightShoulder)) return;

  // the middle between the shoulders = the neck
  const neckX = (leftShoulder.x + rightShoulder.x) / 2;
  const neckY = (leftShoulder.y + rightShoulder.y) / 2;

  // shape 1: the stem, a rectangle from the neck down to the bottom
  noStroke();
  fill(LETTER_COLOR);
  rect(neckX - THICKNESS / 2, neckY, THICKNESS, height - neckY);

  // shape 2: the crossbar, a thick line from shoulder to shoulder
  stroke(LETTER_COLOR);
  strokeWeight(THICKNESS);
  line(leftShoulder.x, leftShoulder.y, rightShoulder.x, rightShoulder.y);

  if (SHOW_POINTS) {
    noStroke();
    fill("red");
    circle(leftShoulder.x, leftShoulder.y, 12);
    circle(rightShoulder.x, rightShoulder.y, 12);
  }
}


/* ---------- HELPERS ---------- */

// true if the model is sure enough about this point
function isVisible(point) {
  return point.confidence > MIN_CONFIDENCE;
}
