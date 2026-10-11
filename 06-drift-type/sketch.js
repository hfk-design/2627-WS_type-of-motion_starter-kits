/* ==========================================================
   06 — Drift Type (ml5 bodyPose)
   Your nose is a pen that writes letters on the screen.

   Based on DriftDraw, which draws a line instead of letters.
   Docs: https://docs.ml5js.org/#/reference/bodypose
   ========================================================== */


/* ---------- SETTINGS: change me ---------- */

const TEXT = "Type of Motion ";  // written letter by letter, then repeats

// the font: a file (put other fonts into their own folder in shared/fonts/)
// or the name of a web font loaded in index.html, e.g. Adobe Fonts (see README)
const FONT_FILE = "../shared/fonts/TimesNewArial/TimesNewArialVariable.woff2";
// const FONT_FILE = "scale-variable";  // Adobe Fonts, axes: wght 200 … 900, wdth 50 … 175

// one fixed style for all letters (axis values don't change here)
// srff: 0 = Arial, 100 = Times / ital: -100 = slant left, 100 = slant right
const FONT_STYLE = '"srff" 100, "ital" 0';

// the body point that draws (e.g. "nose", "left_wrist", "right_wrist")
const PEN_POINT = "nose";

// how softly the pen follows: 0.02 = slow and soft, 1 = instant
const EASING = 0.05;

// distance in pixels between two letters
const SPACING = 40;

// turn each letter in the direction of the movement
const ROTATE_LETTERS = true;

// oldest letters are removed when there are more than this
const MAX_LETTERS = 600;

// ignore points the model is unsure about (0 … 1)
const MIN_CONFIDENCE = 0.3;

// show the camera preview with the detected points
const SHOW_VIDEO = true;


/* ---------- SETUP ---------- */

const drawing = document.getElementById("drawing");
const readout = document.getElementById("readout");
loadFont(FONT_FILE, drawing);
drawing.style.fontVariationSettings = FONT_STYLE;

let video;
let bodyPose;
let poses = [];  // ml5 fills this with every body it finds

let pen = null;       // where the pen is now { x, y }, null until a body is found
let travelled = 0;    // distance moved since the last letter
let letterIndex = 0;  // which letter of TEXT comes next

// preload runs before setup: load the model
function preload() {
  bodyPose = ml5.bodyPose("MoveNet", { flipped: true });
}

function setup() {
  createCanvas(640, 480);  // the preview, scaled down by CSS
  video = createCapture(VIDEO, { flipped: true });  // flipped = mirror view
  video.size(640, 480);
  video.hide();

  bodyPose.detectStart(video, gotPoses);
  readout.textContent = "";  // model is loaded

  if (!SHOW_VIDEO) noCanvas();
}

function gotPoses(results) {
  poses = results;
}


function draw() {

  if (poses.length > 0) {
    const pose = poses[0];
    const point = pose[PEN_POINT];

    if (point.confidence > MIN_CONFIDENCE) {

      /* ---------- move the pen ---------- */

      // from video coordinates to screen coordinates
      const targetX = point.x / video.width * windowWidth;
      const targetY = point.y / video.height * windowHeight;

      // first time: start the pen right there
      if (pen === null) pen = { x: targetX, y: targetY };

      // move the pen a bit towards the target (easing)
      const previous = { x: pen.x, y: pen.y };
      pen.x += (targetX - pen.x) * EASING;
      pen.y += (targetY - pen.y) * EASING;

      const speed = dist(previous.x, previous.y, pen.x, pen.y);    // pixels per frame
      const angle = atan2(pen.y - previous.y, pen.x - previous.x);  // in radians


      /* ---------- OUTPUT: place a letter every SPACING pixels ---------- */

      travelled += speed;
      if (travelled >= SPACING) {
        placeLetter(pen.x, pen.y, angle);
        travelled = 0;
      }
    }
  }


  /* ---------- PREVIEW: video + points ---------- */

  if (SHOW_VIDEO) {
    image(video, 0, 0, width, height);
    noStroke();
    fill(255);
    for (const pose of poses) {
      for (const point of pose.keypoints) {
        if (point.confidence < MIN_CONFIDENCE) continue;
        circle(point.x, point.y, point.name === PEN_POINT ? 40 : 12);
      }
    }
  }
}


/* ---------- placing and clearing letters ---------- */

function placeLetter(x, y, angle) {
  const letter = document.createElement("span");
  letter.className = "letter";
  letter.textContent = TEXT[letterIndex];
  letterIndex = (letterIndex + 1) % TEXT.length;  // next letter, back to 0 at the end

  // position: centered on the pen, turned in the direction of movement
  letter.style.left = x + "px";
  letter.style.top = y + "px";
  const rotation = ROTATE_LETTERS ? angle : 0;
  letter.style.transform = "translate(-50%, -50%) rotate(" + rotation + "rad)";

  drawing.appendChild(letter);

  // remove the oldest letter if there are too many
  if (drawing.children.length > MAX_LETTERS) drawing.firstChild.remove();
}

function clearDrawing() {
  drawing.innerHTML = "";
  letterIndex = 0;
}

window.addEventListener("keydown", (event) => {
  if (event.code === "Space") clearDrawing();
});
window.addEventListener("dblclick", clearDrawing);


/* ---------- HELPERS (no need to change) ---------- */

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
