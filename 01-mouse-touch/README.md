# Variable Fonts – Starter Kit

## Contents

- `index.html` – starting point
- `fonts/` – font files (e.g. TimesNewArial)

> **Note:** The font files in `fonts/` are not included in this repository (see `.gitignore`), since they may not be redistributed. Download the font separately and place it at `fonts/TimesNewArial/TimesNewArialVariable.woff2`, or swap in your own variable font and update the `@font-face` path in `style.css`.

## Quick example

```css
@font-face {
  font-family: 'TimesNewArial';
  src: url('fonts/TimesNewArial/TimesNewArialVariable.woff2') format('woff2');
}

h1 {
  font-family: 'TimesNewArial';
  animation: morph 2s ease-in-out infinite alternate;
}

@keyframes morph {
  from {
    font-variation-settings: 'srff' 0;
  }
  to {
    font-variation-settings: 'srff' 100;
  }
}
```

Use Dinamo Font Gauntlet or Wakamai Fondue to find out which axes your font has and their ranges.

## References for Beginners

### Getting started

- [MDN – Variable fonts guide](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_fonts/Variable_fonts_guide) – the best first read: what variable fonts are, standard vs. custom axes, how to use them in CSS
- [web.dev – Introduction to variable fonts on the web](https://web.dev/articles/variable-fonts) – a short, practical introduction with examples
- [Google Fonts Knowledge – Introducing variable fonts](https://fonts.google.com/knowledge/introducing_type/introducing_variable_fonts) – explains the concept from a type design perspective

### Finding and testing fonts

- [v-fonts.com](https://v-fonts.com) – a collection of variable fonts with interactive sliders to try out every axis
- [Font Gauntlet by Dinamo](https://fontgauntlet.com) – drop in a variable font and animate its axes live, great for seeing type in motion
- [Wakamai Fondue](https://wakamaifondue.com) – drop in a font file to see its axes, instances and features, and get ready-made CSS
- [Google Fonts – variable fonts only](https://fonts.google.com/?vfonly=true) – free variable fonts

### CSS reference (MDN)

- [`@font-face`](https://developer.mozilla.org/en-US/docs/Web/CSS/@font-face) – loading your own font files
- [`font-variation-settings`](https://developer.mozilla.org/en-US/docs/Web/CSS/font-variation-settings) – setting axis values directly, e.g. `"wght" 700, "wdth" 80`
- [`font-weight`](https://developer.mozilla.org/en-US/docs/Web/CSS/font-weight), [`font-stretch`](https://developer.mozilla.org/en-US/docs/Web/CSS/font-stretch), [`font-style`](https://developer.mozilla.org/en-US/docs/Web/CSS/font-style) – the standard axes (`wght`, `wdth`, `slnt`/`ital`)

### Bringing type into motion

- [MDN – Using CSS animations](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_animations/Using_CSS_animations) – `@keyframes` and `animation`, which can animate axis values
- [MDN – Using CSS transitions](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_transitions/Using_CSS_transitions) – smooth changes, e.g. on `:hover`
- [MDN – Using CSS custom properties](https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_custom_properties) – handy for controlling axes with JavaScript (mouse, scroll, sound…)

## Code

<dl>
  <dt>HTML</dt>
  <dd>
    <a href="https://www.w3schools.com/TAgs/default.asp" target="_blank">[References: HTML
      elements]</a><br>
    <a href="https://youtu.be/CkzbI1Tv_rQ" target="_blank">[Video: Basics of HTML by Laurel
      Schwulst]</a><br>
    <a href="https://www.webdesign-essentials.ch/kategorien/html-css-einfuhrung-fur-designer-innen"
      target="_blank">[Web Essentials: HTML / CSS Einführung]</a><br>
    <a href="https://www.codecademy.com/learn/learn-html" target="_blank">[CodeAcademy: Learn HTML
      tutorial]</a>
  </dd>
</dl>
<dl>
  <dt>CSS I</dt>
  <dd>
    <a href="https://www.w3schools.com/cssref/" target="_blank">[References: CSS properties]</a><br>
    <a href="https://youtu.be/BUZIaTHm_oE" target="_blank">[Video: Basics of CSS by Laurel
      Schwulst]</a><br>
    <a href="https://www.codecademy.com/learn/learn-css" target="_blank">[CodeAcademy: Learn CSS
      tutorial]</a><br>
    <a href="https://www.geeksforgeeks.org/css/css-text-formatting/" target="_blank">[GeeksForGeeks: CSS Text Formatting]</a><br/>
  <a href="https://www.w3schools.com/cssref/atrule_font-face.php" target="_blank">[W3Schools Fonts einbinden]</a><br>
    <a href="https://web.dev/learn/css/typography">[CSS Typography]</a><br>
    <a href="https://www.joshwcomeau.com/css/transforms/">[CSS Transformations]</a><br>
    <a href="https://3dtransforms.desandro.com/">[CSS 3D Transform]</a>
  </dd>
</dl>
<dl>
  <dt>CSS II</dt>
  <dd>
    <a href="https://www.w3schools.com/css/css_rwd_mediaqueries.asp" target="_blank">[References: CSS Media
      Queries]</a><br>
    <a href="https://www.w3schools.com/css/css3_animations.asp" target="_blank">[References: CSS
      Animations]</a><br>
    <a href="https://www.codecademy.com/learn/learn-intermediate-css" target="_blank">[CodeAcademy:
      Learn
      indermediate CSS]</a>
  </dd>
</dl>
