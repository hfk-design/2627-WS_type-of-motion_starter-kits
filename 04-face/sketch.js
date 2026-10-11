/* ==========================================================
   04 — Face (ml5 faceMesh)
   Move your face: mouth, head tilt and distance
   control the font axes.

   ml5 finds 468 points on the face. Each has a number.
   Map of all numbers:
   https://github.com/tensorflow/tfjs-models/blob/master/face-landmarks-detection/mesh_map.jpg
   Docs: https://docs.ml5js.org/#/reference/facemesh
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
//        "mouthOpen"  mouth closed → open
//        "headTilt"   head tilted left → right
//        "closeness"  far from → close to the camera
// add, remove or change lines to use other fonts and axes
const AXES = [
  { tag: "srff", min: 0,    max: 100, input: "mouthOpen" },  // 0 = Arial, 100 = Times
  { tag: "ital", min: -100, max: 100, input: "headTilt" },   // -100 = slant left, 100 = slant right
];

// how fast the type follows: 0.02 = slow and soft, 1 = instant
const SMOOTHING = 0.1;

// show the camera preview with the detected points
const SHOW_VIDEO = true;

// the face points we use (numbers from the mesh map)
const UPPER_LIP = 13;
const LOWER_LIP = 14;
const FOREHEAD  = 10;
const CHIN      = 152;
const EYE_LEFT  = 263;  // your left eye, outer corner
const EYE_RIGHT = 33;   // your right eye, outer corner


/* ---------- SETUP ---------- */

const type = document.getElementById("type");
const readout = document.getElementById("readout");
type.textContent = TEXT;
loadFont(FONT_FILE, type);

let inputs = {};   // every input as a number from 0 to 1
let current = {};  // the current value of every axis

let video;
let faceMesh;
let faces = [];  // ml5 fills this with every face it finds

// preload runs before setup: load the model
function preload() {
  faceMesh = ml5.faceMesh({ maxFaces: 1, flipped: true });
}

function setup() {
  createCanvas(640, 480);  // the preview, scaled down by CSS
  video = createCapture(VIDEO, { flipped: true });  // flipped = mirror view
  video.size(640, 480);
  video.hide();

  // start detecting, gotFaces is called with the results
  faceMesh.detectStart(video, gotFaces);

  if (!SHOW_VIDEO) noCanvas();
}

function gotFaces(results) {
  faces = results;
}


function draw() {

  /* ---------- INPUT: read the face, as numbers from 0 to 1 ---------- */
  // change the middle numbers to make it more / less sensitive

  if (faces.length > 0) {
    const points = faces[0].keypoints;  // the first face

    const upperLip = points[UPPER_LIP];
    const lowerLip = points[LOWER_LIP];
    const forehead = points[FOREHEAD];
    const chin     = points[CHIN];
    const eyeLeft  = points[EYE_LEFT];
    const eyeRight = points[EYE_RIGHT];

    // sizes of the face, so it works close to and far from the camera
    const faceHeight = dist(forehead.x, forehead.y, chin.x, chin.y);
    const eyeDistance = dist(eyeLeft.x, eyeLeft.y, eyeRight.x, eyeRight.y);

    // mouth: gap between the lips, relative to the face height
    const mouthGap = dist(upperLip.x, upperLip.y, lowerLip.x, lowerLip.y) / faceHeight;
    inputs.mouthOpen = map(mouthGap, 0.02, 0.25, 0, 1, true);

    // head tilt: height difference between the eyes
    // tilt to your right → right eye lower → positive value
    const tilt = (eyeRight.y - eyeLeft.y) / eyeDistance;
    inputs.headTilt = map(tilt, -0.5, 0.5, 0, 1, true);

    // closeness: how much of the video height the face fills
    inputs.closeness = map(faceHeight / video.height, 0.2, 0.8, 0, 1, true);
  }


  /* ---------- OUTPUT: update the font ---------- */

  type.style.fontVariationSettings = updateAxes();


  /* ---------- PREVIEW: video + points ---------- */

  if (SHOW_VIDEO) {
    image(video, 0, 0, width, height);
    noStroke();
    fill(255);
    for (const face of faces) {
      for (const point of face.keypoints) {
        circle(point.x, point.y, 3);
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
