export const initLoader = () => {
  const loadingOverlay = document.querySelector('#loadingOverlay');
  modularTHREE.loadingManager.onLoad = () => {
    loadingOverlay.style.opacity = 0;
    window.setTimeout(() => {
      loadingOverlay.classList.add('hide');
    }, 1000);
  };
};
