/* ==========================================================
   02 — Gyroscope
   Tilt the phone: its angle controls the font axes.

   Only works on phones / tablets, and only over HTTPS.
   See the README for how to test it.
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
//        "tiltSide"   tilted left → right
//        "tiltFront"  phone lying flat → standing upright
// add, remove or change lines to use other fonts and axes
const AXES = [
  { tag: "srff", min: 0,    max: 100, input: "tiltFront" },  // 0 = Arial, 100 = Times
  { tag: "ital", min: -100, max: 100, input: "tiltSide" },   // -100 = slant left, 100 = slant right
];

// how fast the type follows: 0.02 = slow and soft, 1 = instant
const SMOOTHING = 0.1;


/* ---------- SETUP ---------- */

const type = document.getElementById("type");
const readout = document.getElementById("readout");
const hint = document.getElementById("hint");
const startButton = document.getElementById("start");
type.textContent = TEXT;
loadFont(FONT_FILE, type);

let inputs = {};   // every input as a number from 0 to 1
let current = {};  // the current value of every axis


/* ---------- PERMISSION ----------
   iPhones ask for permission first, and only after a tap.
   Other devices start right away. */

if (typeof DeviceOrientationEvent !== "undefined" &&
    typeof DeviceOrientationEvent.requestPermission === "function") {
  startButton.hidden = false;
  hint.hidden = true;
  startButton.addEventListener("click", async () => {
    const answer = await DeviceOrientationEvent.requestPermission();
    if (answer === "granted") {
      startButton.hidden = true;
      startListening();
    }
  });
} else {
  startListening();
}


/* ---------- INPUT: read the tilt, as numbers from 0 to 1 ---------- */

function startListening() {
  window.addEventListener("deviceorientation", (event) => {
    if (event.gamma === null) return;  // no sensor (e.g. a laptop)
    hint.hidden = true;  // the sensor works, the hint is no longer needed

    // gamma: -45° (tilted left) → 0, 45° (tilted right) → 1
    inputs.tiltSide = mapRange(event.gamma, -45, 45, 0, 1);
    // beta: 0° (lying flat) → 0, 90° (standing upright) → 1
    inputs.tiltFront = mapRange(event.beta, 0, 90, 0, 1);
  });
}


/* ---------- OUTPUT: update the font every frame ---------- */

function draw() {
  type.style.fontVariationSettings = updateAxes();
  requestAnimationFrame(draw);
}

draw();


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

// converts a value from one range to another, and keeps it inside the new range
// e.g. mapRange(45, 0, 90, 0, 1) → 0.5
function mapRange(value, inMin, inMax, outMin, outMax) {
  const t = (value - inMin) / (inMax - inMin);
  const clamped = Math.min(Math.max(t, 0), 1);
  return outMin + clamped * (outMax - outMin);
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
