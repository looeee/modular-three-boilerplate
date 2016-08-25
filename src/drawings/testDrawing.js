import * as modularTHREE from 'modular-three';
// import * as modularTHREE from 'modular-three/src/index.js';

import {
  Cube,
} from '../meshObjects/cube';

// The following spec objects are optional and can be omitted
//for the defaults shown
const rendererSpec = {
  canvasID: 'testDrawing',
  antialias: true,
  alpha: true, //true required for multiple scenes
  autoClear: true, //false required for multiple scenes
  clearColor: 0x000000,
  clearAlpha: 1,
  width: () => window.innerWidth,
  height: () => window.innerHeight,
  pixelRatio: window.devicePixelRatio,
  postprocessing: false,
  useGSAP: true,
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
    this.initObjects();
    this.initAnimations();
  }

  initObjects() {
    this.cube = new Cube();

    this.cube.rotation.set(-2, 2, 0);
    this.cube.position.set(0, 30, 0);

    this.scene.add(this.cube);
  }

  initAnimations() {
    const cubeTimeline = new TimelineMax();

    const cubeFallTween = TweenMax.to(this.cube.position, 3.5, {
      y: -20,
      ease: Bounce.easeOut,
    });

    const cubeRotateTween = TweenMax.to(this.cube.rotation, 3.5, {
      x: 0,
      y: 0,
      ease: Sine.easeInOut,
    });

    cubeTimeline.add(cubeFallTween);

    cubeTimeline.add(cubeRotateTween, 0);
  }
}
