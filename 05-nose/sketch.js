/* ==========================================================
   05 — Nose (ml5 bodyPose)
   Your nose is a brush: every frame a letter is drawn where it is.
   The background is not cleared, so the letters leave a track.

   Based on DriftDraw: https://katharinanejdl.com/driftdraw/
   Docs: https://docs.ml5js.org/#/reference/bodypose
   ========================================================== */


/* ---------- SETTINGS: change me ---------- */

const LETTER = "A";
const FONT = "Times New Roman";  // any font on your computer, e.g. "Arial", "Courier New"
const LETTER_SIZE = 120;
const FILL_COLOR = "black";      // inside of the letter
const OUTLINE_COLOR = "white";   // outline of the letter
const PEN_POINT = "nose";        // the body point that draws, e.g. "left_wrist", "right_wrist"
const SHOW_VIDEO = true;         // small camera preview in the corner
const MIN_CONFIDENCE = 0.3;      // ignore points the model is unsure about (0 … 1)


/* ---------- SETUP ---------- */

let video;
let bodyPose;
let poses = [];  // ml5 fills this with every body it finds

// async setup: "await" waits until the model is loaded
async function setup() {
  bodyPose = await ml5.bodyPose("MoveNet", { flipped: true });

  createCanvas(640, 480);  // same size as the video, CSS scales it to the window
  video = createCapture(VIDEO, { flipped: true });  // flipped = mirror view
  video.size(640, 480);
  video.hide();

  textFont(FONT);
  textSize(LETTER_SIZE);
  textAlign(CENTER, CENTER);

  // white background, only once at the start
  background(255);

  // start detecting, gotPoses is called with the results
  bodyPose.detectStart(video, gotPoses);
}

function gotPoses(results) {
  poses = results;
}


/* ---------- DRAW: runs ~60 times per second ---------- */

function draw() {
  // no background() here: everything drawn stays on the canvas → a track

  if (poses.length > 0) {
    const pen = poses[0][PEN_POINT];

    if (pen.confidence > MIN_CONFIDENCE) {
      fill(FILL_COLOR);
      stroke(OUTLINE_COLOR);
      strokeWeight(1);
      text(LETTER, pen.x, pen.y);
    }
  }

  // the preview is drawn again every frame, on top of the track
  if (SHOW_VIDEO) {
    image(video, width - 160, height - 120, 160, 120);
  }
}

// press space to start again
function keyPressed() {
  if (key === " ") background(255);
}
