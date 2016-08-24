const modularTHREE = require('modular-three');

import {
  Cube,
} from '../meshObjects/cube';

// The following spec objects are optional and can be omitted
//for the defaults shown
const rendererSpec = {
  canvasID: 'testDrawing', //TODO: add this functionality, including check that ID is unique
  antialias: true,
  alpha: true, //true required for multiple scenes
  autoClear: true, //false required for multiple scenes
  clearColor: 0x000000,
  clearAlpha: 1,
  width: () => window.innerWidth,
  height: () => window.innerHeight,
  pixelRatio: window.devicePixelRatio,
  postprocessing: false,
  useGSAP: false,
};

// Optional
const cameraSpec = {
  type: 'PerspectiveCamera', //Or 'OrthographicCamera'
  near: 10,
  far: -10,
  position: new THREE.Vector3(0, 0, 100),
  //PerspectiveCamera only
  fov: 45,
  aspect: () => window.innerWidth / window.innerHeight,
  // OrthographicCamera only
  width: () => window.innerWidth,
  height: () => window.innerHeight,
};

export class TestDrawing extends modularTHREE.Drawing {
  constructor() {
    super(rendererSpec, cameraSpec);
  }
  
  init() {
    this.cube = new Cube();
    this.scene.add(this.cube);

    this.initAnimations();
  }

  initAnimations() {
    const rotateCube = () => {
      this.cube.rotation.x += 0.005;
      this.cube.rotation.y += 0.01;
    };

    this.perFrameFunctions.push(rotateCube);
  }
}
