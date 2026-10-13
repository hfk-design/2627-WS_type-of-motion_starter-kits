/* ==========================================================
   04 — Hand (ml5 handPose)
   Move your hand: pinch and position control the font axes.

   ml5 finds 21 points on each hand, e.g.
   wrist, thumb_tip, index_finger_tip, middle_finger_tip,
   ring_finger_tip, pinky_finger_tip, index_finger_mcp (knuckle).
   Docs: https://docs.ml5js.org/#/reference/handpose
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
//        "pinch"  thumb and index finger pinched → open
//        "x"      hand left → right
//        "y"      hand down → up
// add, remove or change lines to use other fonts and axes
const AXES = [
  { tag: "srff", min: 0,    max: 100, input: "pinch" },  // 0 = Arial, 100 = Times
  { tag: "ital", min: -100, max: 100, input: "x" },      // -100 = slant left, 100 = slant right
];

// how fast the type follows: 0.02 = slow and soft, 1 = instant
const SMOOTHING = 0.1;

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
let handPose;
let hands = [];  // ml5 fills this with every hand it finds

// preload runs before setup: load the model
function preload() {
  handPose = ml5.handPose({ maxHands: 1, flipped: true });
}

function setup() {
  createCanvas(640, 480);  // the preview, scaled down by CSS
  video = createCapture(VIDEO, { flipped: true });  // flipped = mirror view
  video.size(640, 480);
  video.hide();

  // start detecting, gotHands is called with the results
  handPose.detectStart(video, gotHands);

  if (!SHOW_VIDEO) noCanvas();
}

function gotHands(results) {
  hands = results;
}


function draw() {

  /* ---------- INPUT: read the hand, as numbers from 0 to 1 ---------- */
  // change the middle numbers to make it more / less sensitive

  if (hands.length > 0) {
    const hand = hands[0];  // the first hand
    const thumb   = hand.thumb_tip;
    const index   = hand.index_finger_tip;
    const wrist   = hand.wrist;
    const knuckle = hand.index_finger_mcp;

    // size of the hand, so it works close to and far from the camera
    const handSize = dist(wrist.x, wrist.y, knuckle.x, knuckle.y);

    // pinch: gap between thumb and index finger, relative to the hand size
    const gap = dist(thumb.x, thumb.y, index.x, index.y) / handSize;
    inputs.pinch = map(gap, 0.1, 1.5, 0, 1, true);

    // position: wrist at the left / bottom edge → 0, right / top edge → 1
    inputs.x = map(wrist.x / video.width, 0.2, 0.8, 0, 1, true);
    inputs.y = map(wrist.y / video.height, 0.9, 0.2, 0, 1, true);
  }


  /* ---------- OUTPUT: update the font ---------- */

  type.style.fontVariationSettings = updateAxes();


  /* ---------- PREVIEW: video + points ---------- */

  if (SHOW_VIDEO) {
    image(video, 0, 0, width, height);
    noStroke();
    fill(255);
    for (const hand of hands) {
      for (const point of hand.keypoints) {
        circle(point.x, point.y, 12);
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
