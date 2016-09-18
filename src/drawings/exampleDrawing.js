// import { Cube } from '../meshObjects/cube';

// The following spec objects are optional and can be omitted
//for the defaults shown
const rendererSpec = {
  canvasID: 'testDrawing',
  antialias: true,
  alpha: true, //true required for multiple scenes
  autoClear: true, //false required for multiple scenes
  clearColor: 0x6858bb,
  clearAlpha: 1.0,
  width: () => window.innerWidth,
  height: () => window.innerHeight,
  pixelRatio: window.devicePixelRatio,
  postprocessing: false,
  useGSAP: true,
  showStats: true,
};

// Optional
const cameraSpec = {
  type: 'PerspectiveCamera', //Or 'OrthographicCamera'
  near: 1,
  far: 1000,
  position: new THREE.Vector3(0, 0, 100),
  //PerspectiveCamera only
  fov: 45,
  aspect: () => window.innerWidth / window.innerHeight,
  // OrthographicCamera only
  width: () => window.innerWidth,
  height: () => window.innerHeight,
};

export class ExampleDrawing extends modularTHREE.Drawing {
  constructor() {
    super(rendererSpec, cameraSpec);
  }

  init() {
  }
}
