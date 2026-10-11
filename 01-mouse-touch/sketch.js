/* ==========================================================
   01 — Mouse & Touch
   Move the pointer: its position controls the font axes.
   "pointer" events work for mouse, touch and pen.
   ========================================================== */


/* ---------- SETTINGS: change me ---------- */

const TEXT = "Type of Motion";

// the font file (put other fonts into their own folder in shared/fonts/)
const FONT_FILE = "../shared/fonts/TimesNewArial/TimesNewArialVariable.woff2";

// the axes of the font and what controls them
// tag:   4-letter axis name (find them for any font on https://wakamaifondue.com)
// min / max: the part of the axis you want to use (swap them to reverse)
// input: what controls this axis, one of:
//        "x"  pointer left → right
//        "y"  pointer top → bottom
// add, remove or change lines to use other fonts and axes
const AXES = [
  { tag: "srff", min: 0,    max: 100, input: "x" },  // 0 = Arial, 100 = Times
  { tag: "ital", min: -100, max: 100, input: "y" },  // -100 = slant left, 100 = slant right
];

// how fast the type follows: 0.02 = slow and soft, 1 = instant
const SMOOTHING = 0.1;


/* ---------- SETUP ---------- */

const type = document.getElementById("type");
const readout = document.getElementById("readout");
type.textContent = TEXT;
loadFont(FONT_FILE, type);

let inputs = {};   // every input as a number from 0 to 1, e.g. { x: 0.5, y: 0.2 }
let current = {};  // the current value of every axis, e.g. { srff: 50, ital: 0 }


/* ---------- INPUT: read the pointer, as numbers from 0 to 1 ---------- */

window.addEventListener("pointermove", (event) => {
  inputs.x = event.clientX / window.innerWidth;   // 0 = left, 1 = right
  inputs.y = event.clientY / window.innerHeight;  // 0 = top, 1 = bottom
});


/* ---------- OUTPUT: update the font every frame ---------- */

function draw() {
  type.style.fontVariationSettings = updateAxes();
  requestAnimationFrame(draw);  // call draw again on the next frame
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

// loads a font file and uses it for an element
function loadFont(file, element) {
  const font = new FontFace("Variable Font", "url(" + file + ")");
  font.load().then(() => {
    document.fonts.add(font);
    element.style.fontFamily = "Variable Font";
  });
}
