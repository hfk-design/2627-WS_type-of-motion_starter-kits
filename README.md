# Variable Font Starter Kit

Six small examples of controlling a variable font with your body and devices.

| Folder           | Input                | → srff (Arial / Times)  | → ital (slant left / right) |
| ---------------- | -------------------- | ----------------------- | --------------------------- |
| `01-mouse-touch` | mouse / finger       | move left / right       | move up / down              |
| `02-gyroscope`   | phone tilt           | phone flat / upright    | tilt left / right           |
| `03-body`        | camera, ml5 bodyPose | wrists together / apart | lean left / right           |
| `04-face`        | camera, ml5 faceMesh | mouth closed / open     | tilt head left / right      |
| `05-hand`        | camera, ml5 handPose | fingers pinched / open  | hand left / right           |
| `06-drift-type`  | camera, ml5 bodyPose | fixed: Times            | fixed: upright              |

Every example is one folder with an `index.html` and a `sketch.js`.
Start with one, copy the folder, and change it.

## The font

[**Times New Arial**](https://timesnewarial.liebermannkiepereddemann.de/) is a variable font
concept by Liebermann Kiepe Reddemann produced by [Elias Hanzer](https://www.eliashanzer.com).

It has these axes:

| Axis   | Range      | Meaning                                           |
| ------ | ---------- | ------------------------------------------------- |
| `srff` | 0 … 100    | 0 = Arial, 100 = Times                            |
| `ital` | -100 … 100 | -100 = slant left, 0 = upright, 100 = slant right |

## Using another variable font

Every `sketch.js` starts with the same settings:

```js
const FONT_FILE = '../shared/fonts/TimesNewArial/TimesNewArialVariable.woff2';

const AXES = [
  { tag: 'srff', min: 0, max: 100, input: 'x' },
  { tag: 'ital', min: -100, max: 100, input: 'y' },
];
```

1. Put the font file (`.woff2`, `.woff` or `.ttf`) into its own folder in `shared/fonts/`.
2. Change `FONT_FILE` to the new path.
3. Find the axes of the font: drop the file onto
   [wakamaifondue.com](https://wakamaifondue.com) → section _Variable_.
   It lists every axis with its tag, min and max.
4. Write one line per axis into `AXES`:
   - `tag`: the axis name, e.g. `"wght"` (weight), `"wdth"` (width), `"slnt"` (slant)
   - `min` / `max`: the part of the axis you want to use (swap them to reverse)
   - `input`: what controls it. Each sketch lists its inputs above `AXES`,
     e.g. `"x"`, `"pinch"`, `"mouthOpen"`. One input can control several axes.

Every input is a number from 0 to 1. The sketch turns it into
`min … max` and writes it into `font-variation-settings`.
Remember to also change the descriptions in `index.html`.

## How every sketch is structured

```
SETTINGS   → what you can change: text, font file, AXES, smoothing …
SETUP      → find the HTML elements, load the font, start camera / model
INPUT      → read the movement and turn it into numbers from 0 to 1
OUTPUT     → updateAxes() turns the inputs into axis values
HELPERS    → small functions you don't need to change
```

Things to try:

- change `TEXT`
- connect an axis to a different input
- swap `min` and `max` of an axis to reverse the direction
- change `SMOOTHING` (0.02 = slow and soft, 1 = instant)
- change the numbers in the INPUT section to make it more / less sensitive
- add your own input, e.g. `inputs.elbow = map(...)`, and use it in `AXES`
- change the size or colours at the top of `shared/css/style.css`

## How pose recognition works

![The 17 points ml5 bodyPose finds](shared/imgs/bodypose-points.svg)

1. **Camera:** the webcam sends a new image many times per second.
2. **Model:** a neural network looks at each image. It was trained on
   thousands of photos of people, so it can guess where body parts are.
3. **Points:** for every body part it returns a point with
   `x`, `y` (position in the video) and `confidence` (0 … 1, how sure it is).
   bodyPose finds 17 points on the body (see image),
   handPose 21 per hand, faceMesh 468 on the face.
4. **Your code:** you measure something with these points (a distance,
   a height, an angle), turn it into a number from 0 to 1 and connect it
   to a font axis.

Everything runs in your browser. The video is not uploaded anywhere.

The names in the image are the ones you use in the code, e.g. `pose.left_wrist.x`.
The image shows the mirror view used in the sketches: your left side is on the left.

More:

- [The Coding Train: Pose Detection with ml5.js bodyPose](https://thecodingtrain.com/tracks/ml5js-beginners-guide/ml5/7-bodypose/pose-detection) — video intro
- [The Coding Train: Hand Pose](https://thecodingtrain.com/tracks/ml5js-beginners-guide/ml5/hand-pose) and [Face Mesh](https://thecodingtrain.com/tracks/ml5js-beginners-guide/ml5/facemesh)
- [TensorFlow: Next-generation pose detection with MoveNet](https://blog.tensorflow.org/2021/05/next-generation-pose-detection-with-movenet-and-tensorflowjs.html) — the model behind bodyPose
- [MediaPipe: Hand landmarks](https://ai.google.dev/edge/mediapipe/solutions/vision/hand_landmarker) — image of all 21 hand points
- [Face mesh map](https://github.com/tensorflow/tfjs-models/blob/master/face-landmarks-detection/mesh_map.jpg) — all 468 face points with their numbers

Critical context:

- [Excavating AI: The Politics of Images in Machine Learning Training Sets](https://excavating.ai/) — Kate Crawford & Trevor Paglen (2019).
  How training datasets classify human bodies.

## How to run it

The examples need to run on a local server (not by double-clicking the file),
because the camera and the font only load properly that way.

In VS Code: install the extension _Live Server_,
right-click `index.html` → _Open with Live Server_.
It opens at <http://localhost:5500>.

The browser will ask for camera access in examples 03–06.
`localhost` counts as secure, so the camera works on your laptop.

## Testing the gyroscope on a phone

Phones only allow motion sensors on **HTTPS** pages
(or on `localhost`). Opening `http://192.168.x.x:5500` from your phone
will **not** work.

**Upload to a web server with HTTPS**
To use it on a phone, upload the folder to a web server with HTTPS
(the address starts with `https://`) and open that address on your phone.
Because of the font license, the page must not be public:
use a password-protected folder.

For quick testing without uploading:

**Android + USB (no internet needed)**

1. On the phone: enable _Developer options_ → _USB debugging_.
2. Connect the phone with a cable, open `chrome://inspect` in Chrome on your laptop.
3. Click _Port forwarding_, add `5500` → `localhost:5500`, enable it.
4. On the phone, open `http://localhost:5500` in Chrome.

**Any phone, temporary tunnel**
A tunnel gives your local server a temporary HTTPS address:

```
npx localtunnel --port 5500
```

Open the printed `https://…` link on your phone.
Stop the tunnel (Ctrl + C) when you're done: while it runs,
the page (and the font) is reachable on the internet.

**iPhone:** the page shows an _Allow motion_ button, tap it and confirm.

## Libraries

- [p5.js](https://p5js.org) 1.11.1 — camera and drawing (examples 03–06)
- [ml5.js](https://ml5js.org) 1.2.1 — pose recognition (examples 03–06)
  - [bodyPose](https://docs.ml5js.org/#/reference/bodypose)
  - [faceMesh](https://docs.ml5js.org/#/reference/facemesh)
  - [handPose](https://docs.ml5js.org/#/reference/handpose)

Examples 01 and 02 use plain JavaScript, no libraries.

## Examples

- [Times New Arial](https://timesnewarial.liebermannkiepereddemann.de/) — mouse / touch
- [Mistaking Glass for Skin, Ralph Tharayil](https://andshymagazine.com/mistakingglassforskin/ralphtharayil/) — gyroscope
- [Type of Motion](https://www.katharinanejdl.com/typeofmotion/) — variable font w/ pose recognition
- [DriftDraw](https://katharinanejdl.com/driftdraw/) — draw with your head

## Resources

### Variable fonts

- [v-fonts](https://v-fonts.com) — collection of variable fonts to try and download
- [MDN: Variable fonts guide](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_fonts/Variable_fonts_guide) — the CSS behind it
- [Font Gauntlet](https://fontgauntlet.com) by ABC Dinamo — drop in a variable font, animate its axes

> **→ TUE 13.10.:** input session on p5.js and ml5.js.

### p5.js

- [p5.js reference](https://p5js.org/reference/) — every function, with examples
- [p5.js tutorials](https://p5js.org/tutorials/)

### ml5.js

- [ml5.js docs](https://docs.ml5js.org) — all models, with examples
- [The Coding Train: Beginner's Guide to ml5.js](https://thecodingtrain.com/tracks/ml5js-beginners-guide) — video series

### Creative coding

- [The Coding Train](https://thecodingtrain.com) — video tutorials by Daniel Shiffman
- [Generative Gestaltung](http://www.generative-gestaltung.de) — book + p5.js examples (German / English)
- [→ _Thoughts towards vibe-coding_](https://hfkbremen.sharepoint.com/:w:/s/S26BlockBTextTypeTools/cQrVSmIL7ODMSo9VGdRpfl-2EgUD1-pyCUHNydv1e8MlNIWOnQ)
