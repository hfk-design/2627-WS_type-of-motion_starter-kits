/* ==========================================================
   03 — Body (ml5 bodyPose)
   Move your arms and upper body to control the font axes.

   ml5 finds 17 points on the body:
   nose, left_eye, right_eye, left_ear, right_ear,
   left_shoulder, left_elbow, left_wrist, left_hip, left_knee,
   left_ankle (and the same for right_).
   Docs: https://docs.ml5js.org/#/reference/bodypose
   ========================================================== */


/* ---------- SETTINGS: change me ---------- */

const TEXT = "Type of Motion";

// the font: a file (put other fonts into their own folder in shared/fonts/)
// or the name of a web font loaded in index.html, e.g. Adobe Fonts (see README)
const FONT_FILE = "../shared/fonts/TimesNewArial/TimesNewArialVariable.woff2";
// const FONT_FILE = "scale-variable";  // Adobe Fonts, axes: wght 200 … 900, wdth 50 … 175

// the axes of the font and what controls them
// tag:   4-letter axis name (find them for any font on https://wakamaifondue.com)
// min / max: the part of the axis you want to use (swap them to reverse)
// input: what controls this axis, one of:
//        "armsApart"  wrists together → far apart
//        "tilt"       upper body leaning left → right
//        "leftHand"   left hand down → up
//        "rightHand"  right hand down → up
// add, remove or change lines to use other fonts and axes
const AXES = [
  { tag: "srff", min: 0,    max: 100, input: "armsApart" },  // 0 = Arial, 100 = Times
  { tag: "ital", min: -100, max: 100, input: "tilt" },       // -100 = slant left, 100 = slant right
];

// how fast the type follows: 0.02 = slow and soft, 1 = instant
const SMOOTHING = 0.1;

// ignore points the model is unsure about (0 … 1)
const MIN_CONFIDENCE = 0.2;

// show the camera preview with the detected points
const SHOW_VIDEO = true;


/* ---------- SETUP ---------- */

const type = document.getElementById("type");
const readout = document.getElementById("readout");
type.textContent = TEXT;
loadFont(FONT_FILE, type);

let inputs = {};   // every input as a number from 0 to 1
let current = {};  // the current value of every axis

let video;
let bodyPose;
let poses = [];  // ml5 fills this with every body it finds

// preload runs before setup: load the model
function preload() {
  bodyPose = ml5.bodyPose("MoveNet", { flipped: true });
}

function setup() {
  createCanvas(640, 480);  // the preview, scaled down by CSS
  video = createCapture(VIDEO, { flipped: true });  // flipped = mirror view
  video.size(640, 480);
  video.hide();

  // start detecting, gotPoses is called with the results
  bodyPose.detectStart(video, gotPoses);

  if (!SHOW_VIDEO) noCanvas();
}

function gotPoses(results) {
  poses = results;
}


function draw() {

  /* ---------- INPUT: read the body, as numbers from 0 to 1 ---------- */
  // change the middle numbers to make it more / less sensitive

  if (poses.length > 0) {
    const pose = poses[0];  // the first person
    const leftShoulder  = pose.left_shoulder;
    const rightShoulder = pose.right_shoulder;
    const leftWrist     = pose.left_wrist;
    const rightWrist    = pose.right_wrist;

    // tilt and arms are measured in shoulder widths,
    // so they work close to and far from the camera
    if (leftShoulder.confidence > MIN_CONFIDENCE && rightShoulder.confidence > MIN_CONFIDENCE) {
      const shoulderWidth = dist(leftShoulder.x, leftShoulder.y, rightShoulder.x, rightShoulder.y);

      // tilt: lean to your right → right shoulder lower → positive value
      const tilt = (rightShoulder.y - leftShoulder.y) / shoulderWidth;
      inputs.tilt = map(tilt, -0.4, 0.4, 0, 1, true);

      // arms apart: distance between the wrists
      // half a shoulder width → 0, three shoulder widths → 1
      if (leftWrist.confidence > MIN_CONFIDENCE && rightWrist.confidence > MIN_CONFIDENCE) {
        const wristDistance = dist(leftWrist.x, leftWrist.y, rightWrist.x, rightWrist.y) / shoulderWidth;
        inputs.armsApart = map(wristDistance, 0.5, 3, 0, 1, true);
      }
    }

    // hand height: y is 0 at the top of the video and 1 at the bottom
    // hand low (90 %) → 0, hand high (10 %) → 1
    if (leftWrist.confidence > MIN_CONFIDENCE) {
      inputs.leftHand = map(leftWrist.y / video.height, 0.9, 0.1, 0, 1, true);
    }
    if (rightWrist.confidence > MIN_CONFIDENCE) {
      inputs.rightHand = map(rightWrist.y / video.height, 0.9, 0.1, 0, 1, true);
    }
  }


  /* ---------- OUTPUT: update the font ---------- */

  type.style.fontVariationSettings = updateAxes();


  /* ---------- PREVIEW: video + points ---------- */

  if (SHOW_VIDEO) {
    image(video, 0, 0, width, height);
    noStroke();
    fill(255);
    for (const pose of poses) {
      for (const point of pose.keypoints) {
        if (point.confidence > MIN_CONFIDENCE) circle(point.x, point.y, 16);
      }
    }
  }
}


/* ---------- HELPERS (no need to change) ---------- */

// turns the inputs into axis values, eases them, and returns
// the text for font-variation-settings, e.g. '"srff" 50, "ital" 0'
function updateAxes() {
  const settings = [];
  let text = "";

  for (const axis of AXES) {
    const input = inputs[axis.input];
    if (input === undefined) continue;  // this input has no value yet

    // input (0 … 1) → axis value (min … max)
    const target = axis.min + input * (axis.max - axis.min);

    // move a little bit towards the target each frame (easing)
    if (current[axis.tag] === undefined) current[axis.tag] = target;
    current[axis.tag] += (target - current[axis.tag]) * SMOOTHING;

    settings.push('"' + axis.tag + '" ' + current[axis.tag]);
    text += axis.input + " → " + axis.tag + " " + Math.round(current[axis.tag]) + "\n";
  }

  readout.textContent = text;
  return settings.join(", ");
}

// loads a font file and uses it for an element
function loadFont(file, element) {
  // no file ending: it is the name of a web font loaded in index.html
  if (!/\.(woff2?|ttf|otf)$/.test(file)) {
    element.style.fontFamily = '"' + file + '"';
    return;
  }

  const font = new FontFace("Variable Font", "url(" + file + ")");
  font.load().then(() => {
    document.fonts.add(font);
    element.style.fontFamily = "Variable Font";
  });
}
