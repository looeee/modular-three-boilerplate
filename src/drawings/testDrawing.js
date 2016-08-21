const modularTHREE = require('modular-three');

import {
  Cube,
} from '../objects/cube';

// The following spec object can be omitted for the following defaults
const rendererSpec = {
  canvasID: '',
  antialias: true,
  alpha: true, //true required for multiple scenes
  autoClear: true, //false required for multiple scenes
  clearColor: 0x000000,
  clearAlpha: 1,
  width: () => window.innerWidth,
  height: () => window.innerHeight,
  pixelRatio: window.devicePixelRatio,
  postprocessing: false,
};

// The following spec is optional and can be omitted for the defaults shown
const cameraSpec = {
  type: 'PerspectiveCamera', //Or 'OrthographicCamera'
  near: 10,
  far: -10,
  position: new THREE.Vector3(0, 0, 100),
  //PerspectiveCamera only
  fov: 45, //PerspectiveCamera only
  aspect: () => window.innerWidth / window.innerHeight,
  // OrthographicCamera only
  width: () => window.innerWidth,
  height: () => window.innerHeight,
};

export class TestDrawing extends modularTHREE.Drawing {
  constructor() {
    super(cameraSpec, rendererSpec);
  }

  init() {
    const cube = new Cube();
    this.scene.add(cube);
  }
}
