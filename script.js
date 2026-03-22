const IMG = document.querySelector('.zoomer__img');
const VIEWFINDER = document.querySelector('.zoomer__viewfinder');
const VIEWFINDER_IMG = document.querySelector('.zoomer__viewfinder-img');

/* -------------------------
   SET YOUR IMAGE HERE
--------------------------*/
const IMAGE_PATH = "img.jpg";

IMG.src = IMAGE_PATH;
VIEWFINDER_IMG.src = IMAGE_PATH;


/* -------------------------
   CONFIGURATION
--------------------------*/
const CONFIG = {
  SCALE_MIN: 3,
  SCALE_MAX: 30,
  SCALE_STEP: 1
};


/* -------------------------
   STATE
--------------------------*/
const STATE = {
  ACTIVE: false,
  SCALE: parseInt(
    getComputedStyle(document.documentElement)
    .getPropertyValue('--viewfinder-scale')
  )
};


/* -------------------------
   ZOOM WITH MOUSE WHEEL
--------------------------*/
const updateScale = (e) => {

  const { wheelDeltaY } = e;

  if (wheelDeltaY > 0) {
    STATE.SCALE = Math.max(CONFIG.SCALE_MIN, STATE.SCALE - CONFIG.SCALE_STEP);
  } 
  else {
    STATE.SCALE = Math.min(CONFIG.SCALE_MAX, STATE.SCALE + CONFIG.SCALE_STEP);
  }

  document.documentElement.style.setProperty('--viewfinder-scale', STATE.SCALE);
};


/* -------------------------
   STOP ZOOM
--------------------------*/
const stop = () => {
  STATE.ACTIVE = false;

  VIEWFINDER.style.setProperty('--show', 0);

  window.removeEventListener('pointermove', update);
  window.removeEventListener('wheel', updateScale);
};


/* -------------------------
   UPDATE POSITION
--------------------------*/
const update = (e) => {

  const { x, y } = e;

  const { top, left, width, height } = IMG.getBoundingClientRect();

  const xPercent = ((x - left) / width) * 100;
  const yPercent = ((y - top) / height) * 100;

  if (xPercent < -1 || xPercent > 101 || yPercent < -1 || yPercent > 101) {
    return stop();
  }

  const xTranslation = (xPercent - 50) * -1;
  const yTranslation = (yPercent - 50) * -1;

  const threshold = 50 - 50 / STATE.SCALE;

  const setX = Math.min(Math.max(-threshold, xTranslation), threshold);
  const setY = Math.min(Math.max(-threshold, yTranslation), threshold);

  VIEWFINDER_IMG.style.setProperty('--x', setX);
  VIEWFINDER_IMG.style.setProperty('--y', setY);

  VIEWFINDER.style.setProperty('--x', xPercent);
  VIEWFINDER.style.setProperty('--y', yPercent);
};


/* -------------------------
   START ZOOM
--------------------------*/
const start = () => {

  if (STATE.ACTIVE) return;

  STATE.ACTIVE = true;

  VIEWFINDER.style.setProperty('--show', 1);

  window.addEventListener('pointermove', update);
  window.addEventListener('wheel', updateScale);
};


/* -------------------------
   EVENT
--------------------------*/
IMG.addEventListener('pointermove', start);