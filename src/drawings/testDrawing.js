import { Cube } from '../meshObjects/cube';

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
    this.initModels();
    this.initLighting();
    this.initPostprocessing();
    this.initControls();
  }

  initPostprocessing() {
    // this.addPostShader(THREE.KaleidoShader);
    this.addPostShader(THREE.VignetteShader, {
      offset: 0.5,
      darkness: 7.0,
    });

    this.addPostEffect(new THREE.GlitchPass());
  }

  initModels() {
    this.loadObject('models/crate/crate.json')
      .then((object) => {
        object.scale.set(15, 15, 15);
        object.position.set(30, -5, 0);
        this.scene.add(object);
        this.cube = object;
        this.initCubeAnimation();
        this.initCubeGUI();
      });
  }

  initLighting() {
    const ambient = new THREE.AmbientLight(0xffffff);
    this.add(ambient);
  }

  initControls() {
    this.controls = new THREE.OrbitControls(this.camera, this.domElement);

    this.controls.enableDamping = true;
    this.addPerFrameFunction(() => {
      this.controls.update();
    });
  }

  initCubeAnimation() {
    this.cubeAnimationClip = this.cube.animations[0];
    this.animationMixer.clipAction(this.cubeAnimationClip);
  }

  initCubeGUI() {
    if (this.gui) return;

    this.gui = new dat.GUI();

    const opts = {
      'play': () => {
        this.animationMixer.clipAction(this.cubeAnimationClip).play();
      },
      'stop': () => {
        this.animationMixer.clipAction(this.cubeAnimationClip).stop();
      },
    };

    this.gui.add(opts, 'play');
    this.gui.add(opts, 'stop');
  }
}
