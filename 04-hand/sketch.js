/* ==========================================================
   04 — Hand (ml5 handPose)
   The distance between thumb and index finger is the size of the word.

   ml5 finds 21 points on each hand, e.g. wrist, thumb_tip,
   index_finger_tip, middle_finger_tip, ring_finger_tip, pinky_finger_tip.
   Image of all points:
   https://ai.google.dev/edge/mediapipe/solutions/vision/hand_landmarker
   Docs: https://docs.ml5js.org/#/reference/handpose
   ========================================================== */


/* ---------- SETTINGS: change me ---------- */

const WORD = "Motion";
const FONT = "Arial";          // any font on your computer, e.g. "Times New Roman", "Courier New"
const TEXT_COLOR = "black";
const SIZE_FACTOR = 1;         // 1 = word is as tall as the gap between your fingers
const SHOW_VIDEO = true;       // show the camera faintly behind the word
const SHOW_FINGERS = true;     // show the two finger points


/* ---------- SETUP ---------- */

let video;
let handPose;
let hands = [];  // ml5 fills this with every hand it finds

// async setup: "await" waits until the model is loaded
async function setup() {
  handPose = await ml5.handPose({ maxHands: 1, flipped: true });

  createCanvas(640, 480);  // same size as the video, CSS scales it to the window
  video = createCapture(VIDEO, { flipped: true });  // flipped = mirror view
  video.size(640, 480);
  video.hide();

  textFont(FONT);
  textAlign(CENTER, CENTER);

  // start detecting, gotHands is called with the results
  handPose.detectStart(video, gotHands);
}

function gotHands(results) {
  hands = results;
}


/* ---------- DRAW: runs ~60 times per second ---------- */

function draw() {
  background(255);

  if (SHOW_VIDEO) {
    tint(255, 40);  // 40 of 255 → very transparent
    image(video, 0, 0);
  }

  if (hands.length === 0) return;  // no hand found (yet)

  const hand = hands[0];
  const thumb = hand.thumb_tip;
  const finger = hand.index_finger_tip;

  // distance between the two fingertips, in pixels
  const distance = dist(thumb.x, thumb.y, finger.x, finger.y);

  // the middle between the two fingertips
  const middleX = (thumb.x + finger.x) / 2;
  const middleY = (thumb.y + finger.y) / 2;

  // the word: its size is the distance
  noStroke();
  fill(TEXT_COLOR);
  textSize(max(distance * SIZE_FACTOR, 1));  // at least 1 px
  text(WORD, middleX, middleY);

  if (SHOW_FINGERS) {
    circle(thumb.x, thumb.y, 10);
    circle(finger.x, finger.y, 10);
  }
}
