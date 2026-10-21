/* ==========================================================
   03 — Face (ml5 faceMesh)
   Your face is the letter a, built from two shapes:
   the bowl is a circle around your mouth, the stem is a rectangle
   from your eyebrow down to your mouth.
   Open your mouth → the bowl gets taller.
   Raise your eyebrow → the stem gets longer.

   ml5 finds 468 points on the face, each one has a number.
   Map of all numbers:
   https://github.com/tensorflow/tfjs-models/blob/master/face-landmarks-detection/mesh_map.jpg
   Docs: https://docs.ml5js.org/#/reference/facemesh
   ========================================================== */


/* ---------- SETTINGS: change me ---------- */

const THICKNESS = 14;          // thickness of the bowl and the stem
const LETTER_COLOR = "black";
const OPEN_FACTOR = 2;         // how much the bowl reacts to an open mouth
const SHOW_VIDEO = true;       // show the camera faintly behind the letter
const SHOW_POINTS = true;      // show the face points that build the a

// the face points the letter is built from (numbers from the map)
const MOUTH_LEFT = 61;     // mouth corner
const MOUTH_RIGHT = 291;   // mouth corner, on the side of the stem
const LIP_TOP = 13;        // upper lip, inside
const LIP_BOTTOM = 14;     // lower lip, inside
const EYEBROW = 334;       // eyebrow, on the side of the stem


/* ---------- SETUP ---------- */

let video;
let faceMesh;
let faces = [];  // ml5 fills this with every face it finds

// async setup: "await" waits until the model is loaded
async function setup() {
  faceMesh = await ml5.faceMesh({ maxFaces: 1, flipped: true });

  createCanvas(640, 480);  // same size as the video, CSS scales it to the window
  video = createCapture(VIDEO, { flipped: true });  // flipped = mirror view
  video.size(640, 480);
  video.hide();

  // start detecting, gotFaces is called with the results
  faceMesh.detectStart(video, gotFaces);
}

function gotFaces(results) {
  faces = results;
}


/* ---------- DRAW: runs ~60 times per second ---------- */

function draw() {
  background(255);

  if (SHOW_VIDEO) {
    tint(255, 40);  // 40 of 255 → very transparent
    image(video, 0, 0);
  }

  if (faces.length === 0) return;  // no face found (yet)

  const face = faces[0];
  const mouthLeft  = face.keypoints[MOUTH_LEFT];
  const mouthRight = face.keypoints[MOUTH_RIGHT];
  const lipTop     = face.keypoints[LIP_TOP];
  const lipBottom  = face.keypoints[LIP_BOTTOM];
  const eyebrow    = face.keypoints[EYEBROW];

  // measure the mouth
  const mouthWidth = dist(mouthLeft.x, mouthLeft.y, mouthRight.x, mouthRight.y);
  const mouthOpen  = dist(lipTop.x, lipTop.y, lipBottom.x, lipBottom.y);

  // shape 1: the bowl, a circle around the mouth
  // it is as wide as the mouth, and gets taller when the mouth opens
  const bowlX = (mouthLeft.x + mouthRight.x) / 2;
  const bowlY = (lipTop.y + lipBottom.y) / 2;
  const bowlWidth  = mouthWidth;
  const bowlHeight = mouthWidth * 0.6 + mouthOpen * OPEN_FACTOR;

  noFill();
  stroke(LETTER_COLOR);
  strokeWeight(THICKNESS);
  ellipse(bowlX, bowlY, bowlWidth, bowlHeight);

  // shape 2: the stem, a rectangle at the right edge of the bowl
  // from the eyebrow down to the bottom of the bowl
  const stemX      = bowlX + bowlWidth / 2 - THICKNESS / 2;
  const stemTop    = eyebrow.y;
  const stemBottom = bowlY + bowlHeight / 2 + THICKNESS / 2;

  noStroke();
  fill(LETTER_COLOR);
  rect(stemX, stemTop, THICKNESS, stemBottom - stemTop);

  // the points that control the letter
  if (SHOW_POINTS) {
    fill("red");
    for (const point of [mouthLeft, mouthRight, lipTop, lipBottom, eyebrow]) {
      circle(point.x, point.y, 8);
    }
  }
}
