export const initLoader = () => {
  const loadingOverlay = document.querySelector('#loadingOverlay');
  modularTHREE.loadingManager.onLoad = () => {
    loadingOverlay.classList.add('hide');
    // TweenLite.to(loadingOverlay, 2, {
    //   opacity: 0,
    //   onComplete: () => loadingOverlay.classList.add('hide'),
    // });
  };
};
