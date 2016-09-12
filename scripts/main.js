(function () {
'use strict';

var classCallCheck = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};

var inherits = function (subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
  }

  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      enumerable: false,
      writable: true,
      configurable: true
    }
  });
  if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
};

var possibleConstructorReturn = function (self, call) {
  if (!self) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return call && (typeof call === "object" || typeof call === "function") ? call : self;
};

var Cube = function (_modularTHREE$MeshObj) {
  inherits(Cube, _modularTHREE$MeshObj);

  function Cube() {
    classCallCheck(this, Cube);
    return possibleConstructorReturn(this, _modularTHREE$MeshObj.call(this));
  }

  Cube.prototype.init = function init() {
    var texture = this.loadTexture('images/textures/crate.jpg');
    var geometry = new THREE.BoxBufferGeometry(20, 20, 20);
    var material = new THREE.MeshBasicMaterial({
      map: texture
    });
    this.mesh = new THREE.Mesh(geometry, material);
  };

  return Cube;
}(modularTHREE.MeshObject);

// The following spec objects are optional and can be omitted
//for the defaults shown
var rendererSpec = {
  canvasID: 'testDrawing',
  antialias: true,
  alpha: true, //true required for multiple scenes
  autoClear: true, //false required for multiple scenes
  clearColor: 0x6858bb,
  clearAlpha: 1.0,
  width: function () {
    return window.innerWidth;
  },
  height: function () {
    return window.innerHeight;
  },
  pixelRatio: window.devicePixelRatio,
  postprocessing: false,
  useGSAP: true,
  showStats: true
};

// Optional
var cameraSpec = {
  type: 'PerspectiveCamera', //Or 'OrthographicCamera'
  near: 10,
  far: -10,
  position: new THREE.Vector3(0, 0, 100),
  //PerspectiveCamera only
  fov: 45,
  aspect: function () {
    return window.innerWidth / window.innerHeight;
  },
  // OrthographicCamera only
  width: function () {
    return window.innerWidth;
  },
  height: function () {
    return window.innerHeight;
  }
};

var TestDrawing = function (_modularTHREE$Drawing) {
  inherits(TestDrawing, _modularTHREE$Drawing);

  function TestDrawing() {
    classCallCheck(this, TestDrawing);
    return possibleConstructorReturn(this, _modularTHREE$Drawing.call(this, rendererSpec, cameraSpec));
  }

  TestDrawing.prototype.init = function init() {
    this.initModels();
    this.initLighting();
    this.initPostprocessing();
    this.initControls();
  };

  TestDrawing.prototype.initPostprocessing = function initPostprocessing() {
    // this.addPostShader(THREE.KaleidoShader);
    this.addPostShader(THREE.VignetteShader, {
      offset: 0.5,
      darkness: 7.0
    });

    this.addPostEffect(new THREE.GlitchPass());
  };

  TestDrawing.prototype.initModels = function initModels() {
    var _this2 = this;

    this.loadObject('models/crate/crate.json').then(function (object) {
      object.scale.set(15, 15, 15);
      object.position.set(30, -5, 0);
      _this2.scene.add(object);
      _this2.cube = object;
      _this2.cubeAnimation();
    });
  };

  TestDrawing.prototype.initLighting = function initLighting() {
    var ambient = new THREE.AmbientLight(0xffffff);
    this.add(ambient);
  };

  TestDrawing.prototype.initControls = function initControls() {
    var _this3 = this;

    this.controls = new THREE.OrbitControls(this.camera, this.domElement);

    this.controls.enableDamping = true;
    this.addPerFrameFunction(function () {
      _this3.controls.update();
    });
  };

  TestDrawing.prototype.cubeAnimation = function cubeAnimation() {
    var cubeAnimationClip = this.cube.animations[0];
    this.animationMixer.clipAction(cubeAnimationClip).play();
  };

  return TestDrawing;
}(modularTHREE.Drawing);

var loadingOverlay = void 0;
var loadingIcon = void 0;

var checkHeartcodeLoaded = function () {
  if (typeof CanvasLoader === 'undefined') {
    var msg = 'Error: HeartcodeLoader not loaded.\n';
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

var addLoaderElem = function () {
  loadingOverlay = document.createElement('div');
  loadingOverlay.id = 'loadingOverlay';
  loadingOverlay.style = 'position: absolute; top: 0; left: 0; width: 100%; height: 100%;z-index: 999; background-color: black;';
  loadingIcon = document.createElement('div');
  loadingIcon.id = 'loadingIcon';
  loadingIcon.style = 'position: fixed; top: 50%; left: 50%; -webkit-transform: translate(-50%, -50%); -ms-transform: translate(-50%, -50%); transform: translate(-50%, -50%); }';

  loadingOverlay.appendChild(loadingIcon);
  document.body.appendChild(loadingOverlay);
};

var initHeartcodeLoader = function () {
  checkHeartcodeLoaded();

  modularTHREE.loadingManager.onLoad = function () {
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

//import setupGlobals for side effects
// import './setupGlobals.js';

//Set any config options here
modularTHREE.config.useLoadingManager = true;

//Run init() AFTER setting config options
modularTHREE.init();

if (modularTHREE.config.useLoadingManager) initHeartcodeLoader();

var testDrawing = new TestDrawing();
testDrawing.render();

}());