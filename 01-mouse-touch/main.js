console.log('hi');

/* CHANGE FONT VARIATION SETTINGS WITH CSS VARIABLES
   style.css reads the axes from the variables --srff and --ital.
   Here we only change those variables, CSS does the rest.

   Axes:
   srff    0 … 100    0 = Arial, 100 = Times
   ital -100 … 100    -100 = slant left, 0 = upright, 100 = slant right
*/

/* SELECT ELEMENTS */
const mouseText = document.querySelector('#mouse');
const animateText = document.querySelector('#animate');

/* MOUSE INTERACTION
   x position → ital (left = slant left, right = slant right)
   y position → srff (top = Arial, bottom = Times) */

window.addEventListener('mousemove', (event) => {
  // mouse position from 0 to 1
  const x = event.clientX / window.innerWidth;
  const y = event.clientY / window.innerHeight;

  console.log(x, y);

  // map to axis ranges
  const ital = x * 200 - 100; // -100 … 100
  const srff = y * 100; // 0 … 100

  //   mouseText.style.setProperty('--ital', ital);
  //   mouseText.style.setProperty('--srff', srff);
});
