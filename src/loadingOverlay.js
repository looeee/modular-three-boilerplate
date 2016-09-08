let loadingOverlay;
let loadingIcon;

const checkHeartcodeLoaded = () => {
  if (typeof CanvasLoader === 'undefined') {
    let msg = 'Error: HeartcodeLoader not loaded.\n';
    msg += 'If you do not wish to use HeartcodeLoader set modularTHREE.config.useHeartcodeLoader = false\n';
    msg += 'Otherwise get https://raw.githubusercontent.com/heartcode/';
    msg += 'CanvasLoader/master/js/heartcode-canvasloader-min.js\n';
    msg += 'and add <script src="path-to-script/heartcode-canvasloader-min.js">';
    msg += '</script> to your <head>';
    console.error(msg);
    return false;
  }
  return true;
};

const addLoaderElem = () => {
  loadingOverlay = document.createElement('div');
  loadingOverlay.id = 'loadingOverlay';
  loadingOverlay.style = 'position: absolute; top: 0; left: 0; width: 100%; height: 100%;z-index: 999; background-color: black;';
  loadingIcon = document.createElement('div');
  loadingIcon.id = 'loadingIcon';
  loadingIcon.style = 'position: fixed; top: 50%; left: 50%; -webkit-transform: translate(-50%, -50%); -ms-transform: translate(-50%, -50%); transform: translate(-50%, -50%); }';

  loadingOverlay.appendChild(loadingIcon);
  document.body.appendChild(loadingOverlay);
};

export const initHeartcodeLoader = () => {
  checkHeartcodeLoaded();

  modularTHREE.loadingManager.onLoad = () => {
    if (loadingIcon) {
      loadingIcon.hide();
      loadingOverlay.classList.add('hide');
      // TweenLite.to(loadingOverlay, 2, {
      //   opacity: 0,
      //   onComplete: () => loadingOverlay.classList.add('hide'),
      // });
    }
  };

  addLoaderElem();
  loadingIcon = new CanvasLoader('loadingIcon');
  loadingIcon.setColor('#5a6f70');
  loadingIcon.setShape('spiral'); // default is 'oval'
  loadingIcon.setDiameter(150); // default is 40
  loadingIcon.setDensity(50); // default is 40
  loadingIcon.setRange(0.7); // default is 1.3
  loadingIcon.setSpeed(1); // default is 2
  loadingIcon.setFPS(30); // default is 24
  loadingIcon.show(); // Hidden by default
};
