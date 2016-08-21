(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var classCallCheck = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};

// import {
//   textureLoader,
// }
// from './loaders/textureLoader';
// *****************************************************************************
// MESH OBJECT SUPERCLASS
// Superclass for any THREE.js mesh object. Returns a THREE mesh
// *****************************************************************************
//TODO: rename this class
var MeshObject = function () {
  function MeshObject(spec) {
    classCallCheck(this, MeshObject);

    this.spec = spec || {};

    this.init();
    if (this.spec.layer) {
      this.mesh.layers.set(this.spec.layer);
    }

    return this.mesh;
  }

  MeshObject.prototype.createMesh = function createMesh(geometry, material) {
    var mesh = new THREE.Mesh(geometry, material);
    return mesh;
  };

  // loadTexture(url) {
  //   return textureLoader(url);
  // }


  return MeshObject;
}();

// import {
//   Postprocessing,
// }
// from './postprocessing';
// *****************************************************************************
// RENDERER CLASS
//
// Create a THREE.js renderer and add postprocessing if required
// Each scene currently needs a unique renderer and associated HTML Canvas
// elem for the cancelRender function to work
// The container elem can be omitted if using only one scene as the default
// will be automatically added
// NOTE: Currently using TweenMax ticker for animation so the gsap files must
// be included
//
// The following spec object can be omitted for the following defaults
// const rendererSpec = {
//   containerElem: canvasElem, // omit for THREE js default
//   antialias: true,
//   alpha: false, //true required for multiple scenes
//   autoClear: true, //false required for multiple scenes
//   clearColor: 0x000000,
//   clearAlpha: 0,
//   width: window.innerWidth,
//   height: window.innerHeight,
//   pixelRatio: window.devicePixelRatio,
// };
// *****************************************************************************
var Renderer = function () {
  function Renderer(spec) {
    classCallCheck(this, Renderer);

    this.spec = spec || {};
    this.init();
  }

  Renderer.prototype.init = function init() {
    this.initParams();
    var rendererOptions = {
      antialias: this.spec.antialias,
      //required for multiple scenes and various other effects
      alpha: this.spec.alpha
    };
    if (this.spec.containerElem) {
      rendererOptions.canvas = this.spec.containerElem;
      this.renderer = new THREE.WebGLRenderer(rendererOptions);
    } else {
      this.renderer = new THREE.WebGLRenderer(rendererOptions);
      document.body.appendChild(this.renderer.domElement);
    }

    this.setRenderer();
  };

  Renderer.prototype.initParams = function initParams() {
    if (!this.spec.postprocessing) this.spec.postprocessing = false;
    if (!this.spec.antialias) this.spec.antialias = true;
    if (!this.spec.alpha) this.spec.alpha = true;
    if (!this.spec.autoClear) this.spec.autoClear = false;
    this.spec.clearColor = this.spec.clearColor || 0x000000;
    this.spec.clearAlpha = this.spec.clearAlpha || 1.0;
    var w = function () {
      return window.innerWidth;
    };
    this.spec.width = this.spec.width || w;
    var h = function () {
      return window.innerHeight;
    };
    this.spec.height = this.spec.height || h;
    this.spec.pixelRatio = this.spec.pixelRatio || window.devicePixelRatio;
  };

  Renderer.prototype.setSize = function setSize() {
    var w = arguments.length <= 0 || arguments[0] === undefined ? this.spec.width() : arguments[0];
    var h = arguments.length <= 1 || arguments[1] === undefined ? this.spec.height() : arguments[1];

    this.renderer.setSize(w, h);
  };

  Renderer.prototype.setRenderer = function setRenderer() {
    this.renderer.autoClear = this.spec.autoClear;
    this.renderer.setClearColor(this.spec.clearColor, this.spec.clearAlpha);
    this.renderer.setSize(this.spec.width, this.spec.height);
    this.renderer.setPixelRatio(this.spec.pixelRatio);
    this.setSize(this.spec.width(), this.spec.height());
  };

  Renderer.prototype.showStats = function showStats() {
    if (typeof Stats === 'function') {
      if (this.stats) return; //don't create stats more than once
      this.stats = new Stats();
      document.body.appendChild(this.stats.dom);
    } else {
      console.warn('https://github.com/mrdoob/stats.js must be included for stats to work');
    }
  };

  Renderer.prototype.render = function render(scene, camera, showStats) {
    if (showStats) this.showStats();
    this.renderer.setClearColor(this.spec.clearColor, this.spec.clearAlpha);
    if (this.spec.postprocessing) this.postRenderer = new Postprocessing(this.renderer, scene, camera);
    this.animate(scene, camera);
  };

  Renderer.prototype.cancelRender = function cancelRender() {
    TweenLite.ticker.removeEventListener('tick', this.renderHandler);
    this.renderer.clear();
  };

  Renderer.prototype.animate = function animate(scene, camera) {
    var _this = this;

    this.renderHandler = function () {
      if (_this.stats) _this.stats.update();
      if (_this.spec.postprocessing) _this.postRenderer.composer.render();else _this.renderer.render(scene, camera);
    };

    TweenLite.ticker.addEventListener('tick', this.renderHandler);
  };

  return Renderer;
}();

// *****************************************************************************
//  CAMERA CLASS
//
//  Used by Scene class - each scene will have an associated camera class
//
//  The following spec is optional and can be omitted for the defaults shown
//  const cameraSpec = {
//    type: 'PerspectiveCamera', //Or 'OrthographicCamera'
//    near: 10,
//    far: -10,
//    position: new THREE.Vector3(0, 0, 100),
//    //PerspectiveCamera only
//    fov: 45, //PerspectiveCamera only
//    aspect: window.innerWidth / window.innerHeight,
//    // OrthographicCamera only
//    width: window.innerWidth,
//    height: window.innerHeight,
//  };
var Camera = function () {
  function Camera(spec) {
    classCallCheck(this, Camera);

    this.spec = spec || {};
    this.init();
  }

  Camera.prototype.init = function init() {
    this.initParams();

    if (this.spec.type === 'PerspectiveCamera') {
      this.cam = new THREE.PerspectiveCamera();
    } else {
      this.cam = new THREE.OrthographicCamera();
    }
    this.set();
  };

  Camera.prototype.initParams = function initParams() {
    var position = function () {
      return new THREE.Vector3();
    };
    this.spec.position = this.spec.position || position;
    this.spec.near = this.spec.near || 10;
    this.spec.far = this.spec.far || -10;
    this.spec.type = this.spec.type || 'PerspectiveCamera';
    if (this.spec.type === 'PerspectiveCamera') {
      this.spec.fov = this.spec.fov || 45;
      var aspect = function () {
        return window.innerWidth / window.innerHeight;
      };
      this.spec.aspect = this.spec.aspect || aspect;
    } else {
      var w = function () {
        return window.innerWidth;
      };
      this.spec.width = this.spec.width || w;
      var h = function () {
        return window.innerHeight;
      };
      this.spec.height = this.spec.height || h;
    }
  };

  Camera.prototype.set = function set() {
    if (this.spec.type === 'PerspectiveCamera') {
      this.cam.fov = this.spec.fov;
      this.cam.aspect = this.spec.aspect();
    } else {
      this.cam.left = -this.spec.width() / 2;
      this.cam.right = this.spec.width() / 2;
      this.cam.top = this.spec.height() / 2;
      this.cam.bottom = -this.spec.height() / 2;
    }
    this.cam.position.copy(this.spec.position);
    this.cam.near = this.spec.near;
    this.cam.far = this.spec.far;
    this.cam.updateProjectionMatrix();
  };

  Camera.prototype.enableLayer = function enableLayer(n) {
    this.cam.layers.enable(n);
  };

  Camera.prototype.disableLayer = function disableLayer(n) {
    this.cam.layers.disable(n);
  };

  Camera.prototype.toggleLayer = function toggleLayer(n) {
    this.cam.layers.toggle(n);
  };

  return Camera;
}();

// *****************************************************************************
//  SCENE CLASS
//
//  THREE.js scene is used by DRAWING classes
//  The scene will automatically clear all meshes and reset camera on
//  window resize - the drawing is responsible for repopulating the scene
//  with it's own reset() function
//
// *****************************************************************************
var Scene = function () {
  function Scene(cameraSpec, rendererSpec) {
    classCallCheck(this, Scene);

    this.cameraSpec = cameraSpec;
    this.rendererSpec = rendererSpec;
    this.init();
  }

  Scene.prototype.init = function init() {
    this.scene = new THREE.Scene();
    this.camera = new Camera(this.cameraSpec);
    this.scene.add(this.camera.cam);

    //used to add Orbit Controls to the camera
    //this.camera.cam.userData.domElement = this.rendererSpec.containerElem;

    this.renderer = new Renderer(this.rendererSpec);
  };

  Scene.prototype.add = function add() {
    for (var _len = arguments.length, objects = Array(_len), _key = 0; _key < _len; _key++) {
      objects[_key] = arguments[_key];
    }

    for (var _iterator = objects, _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : _iterator[Symbol.iterator]();;) {
      var _ref;

      if (_isArray) {
        if (_i >= _iterator.length) break;
        _ref = _iterator[_i++];
      } else {
        _i = _iterator.next();
        if (_i.done) break;
        _ref = _i.value;
      }

      var object = _ref;

      this.scene.add(object);
    }
  };

  Scene.prototype.reset = function reset() {
    this.clearScene();
    this.camera.set();
    this.renderer.setSize();
  };

  Scene.prototype.clearScene = function clearScene() {
    for (var i = this.scene.children.length - 1; i >= 0; i--) {
      this.scene.remove(this.scene.children[i]);
    }
  };

  Scene.prototype.cancelRender = function cancelRender() {
    this.renderer.cancelRender();
  };

  Scene.prototype.render = function render(showStats) {
    this.renderer.render(this.scene, this.camera.cam, showStats);
  };

  return Scene;
}();

// *****************************************************************************
//
//  DRAWING CLASS
//
// *****************************************************************************
var Drawing = function () {
  function Drawing(cameraSpec, rendererSpec) {
    classCallCheck(this, Drawing);

    this.scene = new Scene(cameraSpec, rendererSpec);
    this.camera = this.scene.camera;
    this.uuid = THREE.Math.generateUUID();
    this.init();
  }

  //gets called on window resize or other events that require recalculation of
  //object dimensions


  Drawing.prototype.reset = function reset() {
    this.scene.reset();
    this.init();
  };

  Drawing.prototype.render = function render(showStats) {
    this.scene.render(showStats);
  };

  Drawing.prototype.cancelRender = function cancelRender() {
    this.scene.renderer.cancelRender();
  };

  return Drawing;
}();

var config = {
  useGSAP: true,
  useHeartcodeLoader: true,
  showStats: true
};

// *****************************************************************************
// Perform various initialisation checks and setup
// *****************************************************************************
var moduleName = 'unnamedTHREESetupModule';
//TODO: turn check functions into proper checks
var checkTHREELoaded = function () {
  if (typeof THREE === 'undefined') {
    var msg = moduleName + ' Error: THREE not loaded. THREE.js must be loaded before this module\n';
    msg += 'Try adding <script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r79/three.min.js">';
    msg += '</script> to your <head>';
    console.error(msg);
  }
};

checkTHREELoaded();

var checkGSAPLoaded = function () {
  if (typeof TweenLite === 'undefined') {
    var msg = moduleName + ' Error: GSAP not loaded.\n';
    msg += 'If you do not wish to use GSAP set ' + moduleName + '.config.useGSAP = false\n';
    msg += 'Otherwise try adding <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/1.19.0/TweenMax.min.js">';
    msg += '</script> to your <head>';
    console.error(msg);
  }
};

var checkHeartcodeLoaded = function () {
  if (typeof CanvasLoader === 'undefined') {
    var msg = moduleName + ' Error: HeartcodeLoader not loaded.\n';
    msg += 'If you do not wish to use HeartcodeLoader set ' + moduleName + '.config.useHeartcodeLoader = false\n';
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
  var elem = document.querySelector('#loadingOverlay');
  if (elem === null) {
    var loadingOverlay = document.createElement('div');
    loadingOverlay.id = 'loadingOverlay';
    loadingOverlay.style = 'position: absolute; top: 0; left: 0; width: 100%; height: 100%;z-index: 999; background-color: black;';
    var loadingIcon = document.createElement('div');
    loadingIcon.id = 'loadingIcon';
    loadingIcon.style = 'position: fixed; top: 50%; left: 50%; -webkit-transform: translate(-50%, -50%); -ms-transform: translate(-50%, -50%); transform: translate(-50%, -50%); }';

    loadingOverlay.appendChild(loadingIcon);
    document.body.appendChild(loadingOverlay);
  }
};

var checkStatsLoaded = function () {
  if (typeof Stats === 'undefined') {
    var msg = moduleName + ' Error: Stats not loaded.\n';
    msg += 'If you do not wish to show Stats set ' + moduleName + '.config.showStats = false\n';
    msg += 'Otherwise get https://raw.githubusercontent.com/mrdoob/stats.js/master/build/stats.min.js\n';
    msg += 'and add <script src="path-to-script/stats.min.js">';
    msg += '</script> to your <head>';
    console.error(msg);
  }
};

var init = function () {
  if (config.useGSAP) checkGSAPLoaded();

  if (config.useHeartcodeLoader) {
    if (checkHeartcodeLoaded()) {
      addLoaderElem();
    }
  }

  if (config.showStats) checkStatsLoaded();
};

module.exports = {
  init: init,
  config: config,
  MeshObject: MeshObject,
  Drawing: Drawing
};
},{}],2:[function(require,module,exports){
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

var modularTHREE$2 = require('modular-three');

var Cube = function (_modularTHREE$MeshObj) {
  inherits(Cube, _modularTHREE$MeshObj);

  function Cube() {
    classCallCheck(this, Cube);
    return possibleConstructorReturn(this, _modularTHREE$MeshObj.call(this));
  }

  Cube.prototype.init = function init() {
    var geometry = new THREE.BoxGeometry(5, 5, 5);
    var material = new THREE.MeshBasicMaterial({ color: 0xFF0000 });
    this.mesh = new THREE.Mesh(geometry, material);
  };

  return Cube;
}(modularTHREE$2.MeshObject);

var modularTHREE$1 = require('modular-three');

var rendererSpec = {
  canvasID: '',
  antialias: true,
  alpha: true, //true required for multiple scenes
  autoClear: true, //false required for multiple scenes
  clearColor: 0x000000,
  clearAlpha: 1,
  width: function () {
    return window.innerWidth;
  },
  height: function () {
    return window.innerHeight;
  },
  pixelRatio: window.devicePixelRatio,
  postprocessing: false
};

// The following spec is optional and can be omitted for the defaults shown
var cameraSpec = {
  type: 'PerspectiveCamera', //Or 'OrthographicCamera'
  near: 10,
  far: -10,
  position: new THREE.Vector3(0, 0, 100),
  //PerspectiveCamera only
  fov: 45, //PerspectiveCamera only
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
    return possibleConstructorReturn(this, _modularTHREE$Drawing.call(this, cameraSpec, rendererSpec));
  }

  TestDrawing.prototype.init = function init() {
    var cube = new Cube();
    this.scene.add(cube);
  };

  return TestDrawing;
}(modularTHREE$1.Drawing);

var modularTHREE = require('modular-three');

modularTHREE.config.useHeartcodeLoader = false;

modularTHREE.init();

var testDrawing = new TestDrawing();
testDrawing.render(true);
},{"modular-three":1}]},{},[2])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIuLi8uLi9tb2R1bGFyLXRocmVlL2Rpc3QvaW5kZXguanMiLCJzcmMvZW50cnkuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMWNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJ2YXIgY2xhc3NDYWxsQ2hlY2sgPSBmdW5jdGlvbiAoaW5zdGFuY2UsIENvbnN0cnVjdG9yKSB7XG4gIGlmICghKGluc3RhbmNlIGluc3RhbmNlb2YgQ29uc3RydWN0b3IpKSB7XG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcihcIkNhbm5vdCBjYWxsIGEgY2xhc3MgYXMgYSBmdW5jdGlvblwiKTtcbiAgfVxufTtcblxuLy8gaW1wb3J0IHtcbi8vICAgdGV4dHVyZUxvYWRlcixcbi8vIH1cbi8vIGZyb20gJy4vbG9hZGVycy90ZXh0dXJlTG9hZGVyJztcbi8vICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4vLyBNRVNIIE9CSkVDVCBTVVBFUkNMQVNTXG4vLyBTdXBlcmNsYXNzIGZvciBhbnkgVEhSRUUuanMgbWVzaCBvYmplY3QuIFJldHVybnMgYSBUSFJFRSBtZXNoXG4vLyAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuLy9UT0RPOiByZW5hbWUgdGhpcyBjbGFzc1xudmFyIE1lc2hPYmplY3QgPSBmdW5jdGlvbiAoKSB7XG4gIGZ1bmN0aW9uIE1lc2hPYmplY3Qoc3BlYykge1xuICAgIGNsYXNzQ2FsbENoZWNrKHRoaXMsIE1lc2hPYmplY3QpO1xuXG4gICAgdGhpcy5zcGVjID0gc3BlYyB8fCB7fTtcblxuICAgIHRoaXMuaW5pdCgpO1xuICAgIGlmICh0aGlzLnNwZWMubGF5ZXIpIHtcbiAgICAgIHRoaXMubWVzaC5sYXllcnMuc2V0KHRoaXMuc3BlYy5sYXllcik7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXMubWVzaDtcbiAgfVxuXG4gIE1lc2hPYmplY3QucHJvdG90eXBlLmNyZWF0ZU1lc2ggPSBmdW5jdGlvbiBjcmVhdGVNZXNoKGdlb21ldHJ5LCBtYXRlcmlhbCkge1xuICAgIHZhciBtZXNoID0gbmV3IFRIUkVFLk1lc2goZ2VvbWV0cnksIG1hdGVyaWFsKTtcbiAgICByZXR1cm4gbWVzaDtcbiAgfTtcblxuICAvLyBsb2FkVGV4dHVyZSh1cmwpIHtcbiAgLy8gICByZXR1cm4gdGV4dHVyZUxvYWRlcih1cmwpO1xuICAvLyB9XG5cblxuICByZXR1cm4gTWVzaE9iamVjdDtcbn0oKTtcblxuLy8gaW1wb3J0IHtcbi8vICAgUG9zdHByb2Nlc3NpbmcsXG4vLyB9XG4vLyBmcm9tICcuL3Bvc3Rwcm9jZXNzaW5nJztcbi8vICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4vLyBSRU5ERVJFUiBDTEFTU1xuLy9cbi8vIENyZWF0ZSBhIFRIUkVFLmpzIHJlbmRlcmVyIGFuZCBhZGQgcG9zdHByb2Nlc3NpbmcgaWYgcmVxdWlyZWRcbi8vIEVhY2ggc2NlbmUgY3VycmVudGx5IG5lZWRzIGEgdW5pcXVlIHJlbmRlcmVyIGFuZCBhc3NvY2lhdGVkIEhUTUwgQ2FudmFzXG4vLyBlbGVtIGZvciB0aGUgY2FuY2VsUmVuZGVyIGZ1bmN0aW9uIHRvIHdvcmtcbi8vIFRoZSBjb250YWluZXIgZWxlbSBjYW4gYmUgb21pdHRlZCBpZiB1c2luZyBvbmx5IG9uZSBzY2VuZSBhcyB0aGUgZGVmYXVsdFxuLy8gd2lsbCBiZSBhdXRvbWF0aWNhbGx5IGFkZGVkXG4vLyBOT1RFOiBDdXJyZW50bHkgdXNpbmcgVHdlZW5NYXggdGlja2VyIGZvciBhbmltYXRpb24gc28gdGhlIGdzYXAgZmlsZXMgbXVzdFxuLy8gYmUgaW5jbHVkZWRcbi8vXG4vLyBUaGUgZm9sbG93aW5nIHNwZWMgb2JqZWN0IGNhbiBiZSBvbWl0dGVkIGZvciB0aGUgZm9sbG93aW5nIGRlZmF1bHRzXG4vLyBjb25zdCByZW5kZXJlclNwZWMgPSB7XG4vLyAgIGNvbnRhaW5lckVsZW06IGNhbnZhc0VsZW0sIC8vIG9taXQgZm9yIFRIUkVFIGpzIGRlZmF1bHRcbi8vICAgYW50aWFsaWFzOiB0cnVlLFxuLy8gICBhbHBoYTogZmFsc2UsIC8vdHJ1ZSByZXF1aXJlZCBmb3IgbXVsdGlwbGUgc2NlbmVzXG4vLyAgIGF1dG9DbGVhcjogdHJ1ZSwgLy9mYWxzZSByZXF1aXJlZCBmb3IgbXVsdGlwbGUgc2NlbmVzXG4vLyAgIGNsZWFyQ29sb3I6IDB4MDAwMDAwLFxuLy8gICBjbGVhckFscGhhOiAwLFxuLy8gICB3aWR0aDogd2luZG93LmlubmVyV2lkdGgsXG4vLyAgIGhlaWdodDogd2luZG93LmlubmVySGVpZ2h0LFxuLy8gICBwaXhlbFJhdGlvOiB3aW5kb3cuZGV2aWNlUGl4ZWxSYXRpbyxcbi8vIH07XG4vLyAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxudmFyIFJlbmRlcmVyID0gZnVuY3Rpb24gKCkge1xuICBmdW5jdGlvbiBSZW5kZXJlcihzcGVjKSB7XG4gICAgY2xhc3NDYWxsQ2hlY2sodGhpcywgUmVuZGVyZXIpO1xuXG4gICAgdGhpcy5zcGVjID0gc3BlYyB8fCB7fTtcbiAgICB0aGlzLmluaXQoKTtcbiAgfVxuXG4gIFJlbmRlcmVyLnByb3RvdHlwZS5pbml0ID0gZnVuY3Rpb24gaW5pdCgpIHtcbiAgICB0aGlzLmluaXRQYXJhbXMoKTtcbiAgICB2YXIgcmVuZGVyZXJPcHRpb25zID0ge1xuICAgICAgYW50aWFsaWFzOiB0aGlzLnNwZWMuYW50aWFsaWFzLFxuICAgICAgLy9yZXF1aXJlZCBmb3IgbXVsdGlwbGUgc2NlbmVzIGFuZCB2YXJpb3VzIG90aGVyIGVmZmVjdHNcbiAgICAgIGFscGhhOiB0aGlzLnNwZWMuYWxwaGFcbiAgICB9O1xuICAgIGlmICh0aGlzLnNwZWMuY29udGFpbmVyRWxlbSkge1xuICAgICAgcmVuZGVyZXJPcHRpb25zLmNhbnZhcyA9IHRoaXMuc3BlYy5jb250YWluZXJFbGVtO1xuICAgICAgdGhpcy5yZW5kZXJlciA9IG5ldyBUSFJFRS5XZWJHTFJlbmRlcmVyKHJlbmRlcmVyT3B0aW9ucyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMucmVuZGVyZXIgPSBuZXcgVEhSRUUuV2ViR0xSZW5kZXJlcihyZW5kZXJlck9wdGlvbnMpO1xuICAgICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZCh0aGlzLnJlbmRlcmVyLmRvbUVsZW1lbnQpO1xuICAgIH1cblxuICAgIHRoaXMuc2V0UmVuZGVyZXIoKTtcbiAgfTtcblxuICBSZW5kZXJlci5wcm90b3R5cGUuaW5pdFBhcmFtcyA9IGZ1bmN0aW9uIGluaXRQYXJhbXMoKSB7XG4gICAgaWYgKCF0aGlzLnNwZWMucG9zdHByb2Nlc3NpbmcpIHRoaXMuc3BlYy5wb3N0cHJvY2Vzc2luZyA9IGZhbHNlO1xuICAgIGlmICghdGhpcy5zcGVjLmFudGlhbGlhcykgdGhpcy5zcGVjLmFudGlhbGlhcyA9IHRydWU7XG4gICAgaWYgKCF0aGlzLnNwZWMuYWxwaGEpIHRoaXMuc3BlYy5hbHBoYSA9IHRydWU7XG4gICAgaWYgKCF0aGlzLnNwZWMuYXV0b0NsZWFyKSB0aGlzLnNwZWMuYXV0b0NsZWFyID0gZmFsc2U7XG4gICAgdGhpcy5zcGVjLmNsZWFyQ29sb3IgPSB0aGlzLnNwZWMuY2xlYXJDb2xvciB8fCAweDAwMDAwMDtcbiAgICB0aGlzLnNwZWMuY2xlYXJBbHBoYSA9IHRoaXMuc3BlYy5jbGVhckFscGhhIHx8IDEuMDtcbiAgICB2YXIgdyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgIHJldHVybiB3aW5kb3cuaW5uZXJXaWR0aDtcbiAgICB9O1xuICAgIHRoaXMuc3BlYy53aWR0aCA9IHRoaXMuc3BlYy53aWR0aCB8fCB3O1xuICAgIHZhciBoID0gZnVuY3Rpb24gKCkge1xuICAgICAgcmV0dXJuIHdpbmRvdy5pbm5lckhlaWdodDtcbiAgICB9O1xuICAgIHRoaXMuc3BlYy5oZWlnaHQgPSB0aGlzLnNwZWMuaGVpZ2h0IHx8IGg7XG4gICAgdGhpcy5zcGVjLnBpeGVsUmF0aW8gPSB0aGlzLnNwZWMucGl4ZWxSYXRpbyB8fCB3aW5kb3cuZGV2aWNlUGl4ZWxSYXRpbztcbiAgfTtcblxuICBSZW5kZXJlci5wcm90b3R5cGUuc2V0U2l6ZSA9IGZ1bmN0aW9uIHNldFNpemUoKSB7XG4gICAgdmFyIHcgPSBhcmd1bWVudHMubGVuZ3RoIDw9IDAgfHwgYXJndW1lbnRzWzBdID09PSB1bmRlZmluZWQgPyB0aGlzLnNwZWMud2lkdGgoKSA6IGFyZ3VtZW50c1swXTtcbiAgICB2YXIgaCA9IGFyZ3VtZW50cy5sZW5ndGggPD0gMSB8fCBhcmd1bWVudHNbMV0gPT09IHVuZGVmaW5lZCA/IHRoaXMuc3BlYy5oZWlnaHQoKSA6IGFyZ3VtZW50c1sxXTtcblxuICAgIHRoaXMucmVuZGVyZXIuc2V0U2l6ZSh3LCBoKTtcbiAgfTtcblxuICBSZW5kZXJlci5wcm90b3R5cGUuc2V0UmVuZGVyZXIgPSBmdW5jdGlvbiBzZXRSZW5kZXJlcigpIHtcbiAgICB0aGlzLnJlbmRlcmVyLmF1dG9DbGVhciA9IHRoaXMuc3BlYy5hdXRvQ2xlYXI7XG4gICAgdGhpcy5yZW5kZXJlci5zZXRDbGVhckNvbG9yKHRoaXMuc3BlYy5jbGVhckNvbG9yLCB0aGlzLnNwZWMuY2xlYXJBbHBoYSk7XG4gICAgdGhpcy5yZW5kZXJlci5zZXRTaXplKHRoaXMuc3BlYy53aWR0aCwgdGhpcy5zcGVjLmhlaWdodCk7XG4gICAgdGhpcy5yZW5kZXJlci5zZXRQaXhlbFJhdGlvKHRoaXMuc3BlYy5waXhlbFJhdGlvKTtcbiAgICB0aGlzLnNldFNpemUodGhpcy5zcGVjLndpZHRoKCksIHRoaXMuc3BlYy5oZWlnaHQoKSk7XG4gIH07XG5cbiAgUmVuZGVyZXIucHJvdG90eXBlLnNob3dTdGF0cyA9IGZ1bmN0aW9uIHNob3dTdGF0cygpIHtcbiAgICBpZiAodHlwZW9mIFN0YXRzID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICBpZiAodGhpcy5zdGF0cykgcmV0dXJuOyAvL2Rvbid0IGNyZWF0ZSBzdGF0cyBtb3JlIHRoYW4gb25jZVxuICAgICAgdGhpcy5zdGF0cyA9IG5ldyBTdGF0cygpO1xuICAgICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZCh0aGlzLnN0YXRzLmRvbSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbnNvbGUud2FybignaHR0cHM6Ly9naXRodWIuY29tL21yZG9vYi9zdGF0cy5qcyBtdXN0IGJlIGluY2x1ZGVkIGZvciBzdGF0cyB0byB3b3JrJyk7XG4gICAgfVxuICB9O1xuXG4gIFJlbmRlcmVyLnByb3RvdHlwZS5yZW5kZXIgPSBmdW5jdGlvbiByZW5kZXIoc2NlbmUsIGNhbWVyYSwgc2hvd1N0YXRzKSB7XG4gICAgaWYgKHNob3dTdGF0cykgdGhpcy5zaG93U3RhdHMoKTtcbiAgICB0aGlzLnJlbmRlcmVyLnNldENsZWFyQ29sb3IodGhpcy5zcGVjLmNsZWFyQ29sb3IsIHRoaXMuc3BlYy5jbGVhckFscGhhKTtcbiAgICBpZiAodGhpcy5zcGVjLnBvc3Rwcm9jZXNzaW5nKSB0aGlzLnBvc3RSZW5kZXJlciA9IG5ldyBQb3N0cHJvY2Vzc2luZyh0aGlzLnJlbmRlcmVyLCBzY2VuZSwgY2FtZXJhKTtcbiAgICB0aGlzLmFuaW1hdGUoc2NlbmUsIGNhbWVyYSk7XG4gIH07XG5cbiAgUmVuZGVyZXIucHJvdG90eXBlLmNhbmNlbFJlbmRlciA9IGZ1bmN0aW9uIGNhbmNlbFJlbmRlcigpIHtcbiAgICBUd2VlbkxpdGUudGlja2VyLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ3RpY2snLCB0aGlzLnJlbmRlckhhbmRsZXIpO1xuICAgIHRoaXMucmVuZGVyZXIuY2xlYXIoKTtcbiAgfTtcblxuICBSZW5kZXJlci5wcm90b3R5cGUuYW5pbWF0ZSA9IGZ1bmN0aW9uIGFuaW1hdGUoc2NlbmUsIGNhbWVyYSkge1xuICAgIHZhciBfdGhpcyA9IHRoaXM7XG5cbiAgICB0aGlzLnJlbmRlckhhbmRsZXIgPSBmdW5jdGlvbiAoKSB7XG4gICAgICBpZiAoX3RoaXMuc3RhdHMpIF90aGlzLnN0YXRzLnVwZGF0ZSgpO1xuICAgICAgaWYgKF90aGlzLnNwZWMucG9zdHByb2Nlc3NpbmcpIF90aGlzLnBvc3RSZW5kZXJlci5jb21wb3Nlci5yZW5kZXIoKTtlbHNlIF90aGlzLnJlbmRlcmVyLnJlbmRlcihzY2VuZSwgY2FtZXJhKTtcbiAgICB9O1xuXG4gICAgVHdlZW5MaXRlLnRpY2tlci5hZGRFdmVudExpc3RlbmVyKCd0aWNrJywgdGhpcy5yZW5kZXJIYW5kbGVyKTtcbiAgfTtcblxuICByZXR1cm4gUmVuZGVyZXI7XG59KCk7XG5cbi8vICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4vLyAgQ0FNRVJBIENMQVNTXG4vL1xuLy8gIFVzZWQgYnkgU2NlbmUgY2xhc3MgLSBlYWNoIHNjZW5lIHdpbGwgaGF2ZSBhbiBhc3NvY2lhdGVkIGNhbWVyYSBjbGFzc1xuLy9cbi8vICBUaGUgZm9sbG93aW5nIHNwZWMgaXMgb3B0aW9uYWwgYW5kIGNhbiBiZSBvbWl0dGVkIGZvciB0aGUgZGVmYXVsdHMgc2hvd25cbi8vICBjb25zdCBjYW1lcmFTcGVjID0ge1xuLy8gICAgdHlwZTogJ1BlcnNwZWN0aXZlQ2FtZXJhJywgLy9PciAnT3J0aG9ncmFwaGljQ2FtZXJhJ1xuLy8gICAgbmVhcjogMTAsXG4vLyAgICBmYXI6IC0xMCxcbi8vICAgIHBvc2l0aW9uOiBuZXcgVEhSRUUuVmVjdG9yMygwLCAwLCAxMDApLFxuLy8gICAgLy9QZXJzcGVjdGl2ZUNhbWVyYSBvbmx5XG4vLyAgICBmb3Y6IDQ1LCAvL1BlcnNwZWN0aXZlQ2FtZXJhIG9ubHlcbi8vICAgIGFzcGVjdDogd2luZG93LmlubmVyV2lkdGggLyB3aW5kb3cuaW5uZXJIZWlnaHQsXG4vLyAgICAvLyBPcnRob2dyYXBoaWNDYW1lcmEgb25seVxuLy8gICAgd2lkdGg6IHdpbmRvdy5pbm5lcldpZHRoLFxuLy8gICAgaGVpZ2h0OiB3aW5kb3cuaW5uZXJIZWlnaHQsXG4vLyAgfTtcbnZhciBDYW1lcmEgPSBmdW5jdGlvbiAoKSB7XG4gIGZ1bmN0aW9uIENhbWVyYShzcGVjKSB7XG4gICAgY2xhc3NDYWxsQ2hlY2sodGhpcywgQ2FtZXJhKTtcblxuICAgIHRoaXMuc3BlYyA9IHNwZWMgfHwge307XG4gICAgdGhpcy5pbml0KCk7XG4gIH1cblxuICBDYW1lcmEucHJvdG90eXBlLmluaXQgPSBmdW5jdGlvbiBpbml0KCkge1xuICAgIHRoaXMuaW5pdFBhcmFtcygpO1xuXG4gICAgaWYgKHRoaXMuc3BlYy50eXBlID09PSAnUGVyc3BlY3RpdmVDYW1lcmEnKSB7XG4gICAgICB0aGlzLmNhbSA9IG5ldyBUSFJFRS5QZXJzcGVjdGl2ZUNhbWVyYSgpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLmNhbSA9IG5ldyBUSFJFRS5PcnRob2dyYXBoaWNDYW1lcmEoKTtcbiAgICB9XG4gICAgdGhpcy5zZXQoKTtcbiAgfTtcblxuICBDYW1lcmEucHJvdG90eXBlLmluaXRQYXJhbXMgPSBmdW5jdGlvbiBpbml0UGFyYW1zKCkge1xuICAgIHZhciBwb3NpdGlvbiA9IGZ1bmN0aW9uICgpIHtcbiAgICAgIHJldHVybiBuZXcgVEhSRUUuVmVjdG9yMygpO1xuICAgIH07XG4gICAgdGhpcy5zcGVjLnBvc2l0aW9uID0gdGhpcy5zcGVjLnBvc2l0aW9uIHx8IHBvc2l0aW9uO1xuICAgIHRoaXMuc3BlYy5uZWFyID0gdGhpcy5zcGVjLm5lYXIgfHwgMTA7XG4gICAgdGhpcy5zcGVjLmZhciA9IHRoaXMuc3BlYy5mYXIgfHwgLTEwO1xuICAgIHRoaXMuc3BlYy50eXBlID0gdGhpcy5zcGVjLnR5cGUgfHwgJ1BlcnNwZWN0aXZlQ2FtZXJhJztcbiAgICBpZiAodGhpcy5zcGVjLnR5cGUgPT09ICdQZXJzcGVjdGl2ZUNhbWVyYScpIHtcbiAgICAgIHRoaXMuc3BlYy5mb3YgPSB0aGlzLnNwZWMuZm92IHx8IDQ1O1xuICAgICAgdmFyIGFzcGVjdCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIHdpbmRvdy5pbm5lcldpZHRoIC8gd2luZG93LmlubmVySGVpZ2h0O1xuICAgICAgfTtcbiAgICAgIHRoaXMuc3BlYy5hc3BlY3QgPSB0aGlzLnNwZWMuYXNwZWN0IHx8IGFzcGVjdDtcbiAgICB9IGVsc2Uge1xuICAgICAgdmFyIHcgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiB3aW5kb3cuaW5uZXJXaWR0aDtcbiAgICAgIH07XG4gICAgICB0aGlzLnNwZWMud2lkdGggPSB0aGlzLnNwZWMud2lkdGggfHwgdztcbiAgICAgIHZhciBoID0gZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gd2luZG93LmlubmVySGVpZ2h0O1xuICAgICAgfTtcbiAgICAgIHRoaXMuc3BlYy5oZWlnaHQgPSB0aGlzLnNwZWMuaGVpZ2h0IHx8IGg7XG4gICAgfVxuICB9O1xuXG4gIENhbWVyYS5wcm90b3R5cGUuc2V0ID0gZnVuY3Rpb24gc2V0KCkge1xuICAgIGlmICh0aGlzLnNwZWMudHlwZSA9PT0gJ1BlcnNwZWN0aXZlQ2FtZXJhJykge1xuICAgICAgdGhpcy5jYW0uZm92ID0gdGhpcy5zcGVjLmZvdjtcbiAgICAgIHRoaXMuY2FtLmFzcGVjdCA9IHRoaXMuc3BlYy5hc3BlY3QoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5jYW0ubGVmdCA9IC10aGlzLnNwZWMud2lkdGgoKSAvIDI7XG4gICAgICB0aGlzLmNhbS5yaWdodCA9IHRoaXMuc3BlYy53aWR0aCgpIC8gMjtcbiAgICAgIHRoaXMuY2FtLnRvcCA9IHRoaXMuc3BlYy5oZWlnaHQoKSAvIDI7XG4gICAgICB0aGlzLmNhbS5ib3R0b20gPSAtdGhpcy5zcGVjLmhlaWdodCgpIC8gMjtcbiAgICB9XG4gICAgdGhpcy5jYW0ucG9zaXRpb24uY29weSh0aGlzLnNwZWMucG9zaXRpb24pO1xuICAgIHRoaXMuY2FtLm5lYXIgPSB0aGlzLnNwZWMubmVhcjtcbiAgICB0aGlzLmNhbS5mYXIgPSB0aGlzLnNwZWMuZmFyO1xuICAgIHRoaXMuY2FtLnVwZGF0ZVByb2plY3Rpb25NYXRyaXgoKTtcbiAgfTtcblxuICBDYW1lcmEucHJvdG90eXBlLmVuYWJsZUxheWVyID0gZnVuY3Rpb24gZW5hYmxlTGF5ZXIobikge1xuICAgIHRoaXMuY2FtLmxheWVycy5lbmFibGUobik7XG4gIH07XG5cbiAgQ2FtZXJhLnByb3RvdHlwZS5kaXNhYmxlTGF5ZXIgPSBmdW5jdGlvbiBkaXNhYmxlTGF5ZXIobikge1xuICAgIHRoaXMuY2FtLmxheWVycy5kaXNhYmxlKG4pO1xuICB9O1xuXG4gIENhbWVyYS5wcm90b3R5cGUudG9nZ2xlTGF5ZXIgPSBmdW5jdGlvbiB0b2dnbGVMYXllcihuKSB7XG4gICAgdGhpcy5jYW0ubGF5ZXJzLnRvZ2dsZShuKTtcbiAgfTtcblxuICByZXR1cm4gQ2FtZXJhO1xufSgpO1xuXG4vLyAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuLy8gIFNDRU5FIENMQVNTXG4vL1xuLy8gIFRIUkVFLmpzIHNjZW5lIGlzIHVzZWQgYnkgRFJBV0lORyBjbGFzc2VzXG4vLyAgVGhlIHNjZW5lIHdpbGwgYXV0b21hdGljYWxseSBjbGVhciBhbGwgbWVzaGVzIGFuZCByZXNldCBjYW1lcmEgb25cbi8vICB3aW5kb3cgcmVzaXplIC0gdGhlIGRyYXdpbmcgaXMgcmVzcG9uc2libGUgZm9yIHJlcG9wdWxhdGluZyB0aGUgc2NlbmVcbi8vICB3aXRoIGl0J3Mgb3duIHJlc2V0KCkgZnVuY3Rpb25cbi8vXG4vLyAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxudmFyIFNjZW5lID0gZnVuY3Rpb24gKCkge1xuICBmdW5jdGlvbiBTY2VuZShjYW1lcmFTcGVjLCByZW5kZXJlclNwZWMpIHtcbiAgICBjbGFzc0NhbGxDaGVjayh0aGlzLCBTY2VuZSk7XG5cbiAgICB0aGlzLmNhbWVyYVNwZWMgPSBjYW1lcmFTcGVjO1xuICAgIHRoaXMucmVuZGVyZXJTcGVjID0gcmVuZGVyZXJTcGVjO1xuICAgIHRoaXMuaW5pdCgpO1xuICB9XG5cbiAgU2NlbmUucHJvdG90eXBlLmluaXQgPSBmdW5jdGlvbiBpbml0KCkge1xuICAgIHRoaXMuc2NlbmUgPSBuZXcgVEhSRUUuU2NlbmUoKTtcbiAgICB0aGlzLmNhbWVyYSA9IG5ldyBDYW1lcmEodGhpcy5jYW1lcmFTcGVjKTtcbiAgICB0aGlzLnNjZW5lLmFkZCh0aGlzLmNhbWVyYS5jYW0pO1xuXG4gICAgLy91c2VkIHRvIGFkZCBPcmJpdCBDb250cm9scyB0byB0aGUgY2FtZXJhXG4gICAgLy90aGlzLmNhbWVyYS5jYW0udXNlckRhdGEuZG9tRWxlbWVudCA9IHRoaXMucmVuZGVyZXJTcGVjLmNvbnRhaW5lckVsZW07XG5cbiAgICB0aGlzLnJlbmRlcmVyID0gbmV3IFJlbmRlcmVyKHRoaXMucmVuZGVyZXJTcGVjKTtcbiAgfTtcblxuICBTY2VuZS5wcm90b3R5cGUuYWRkID0gZnVuY3Rpb24gYWRkKCkge1xuICAgIGZvciAodmFyIF9sZW4gPSBhcmd1bWVudHMubGVuZ3RoLCBvYmplY3RzID0gQXJyYXkoX2xlbiksIF9rZXkgPSAwOyBfa2V5IDwgX2xlbjsgX2tleSsrKSB7XG4gICAgICBvYmplY3RzW19rZXldID0gYXJndW1lbnRzW19rZXldO1xuICAgIH1cblxuICAgIGZvciAodmFyIF9pdGVyYXRvciA9IG9iamVjdHMsIF9pc0FycmF5ID0gQXJyYXkuaXNBcnJheShfaXRlcmF0b3IpLCBfaSA9IDAsIF9pdGVyYXRvciA9IF9pc0FycmF5ID8gX2l0ZXJhdG9yIDogX2l0ZXJhdG9yW1N5bWJvbC5pdGVyYXRvcl0oKTs7KSB7XG4gICAgICB2YXIgX3JlZjtcblxuICAgICAgaWYgKF9pc0FycmF5KSB7XG4gICAgICAgIGlmIChfaSA+PSBfaXRlcmF0b3IubGVuZ3RoKSBicmVhaztcbiAgICAgICAgX3JlZiA9IF9pdGVyYXRvcltfaSsrXTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIF9pID0gX2l0ZXJhdG9yLm5leHQoKTtcbiAgICAgICAgaWYgKF9pLmRvbmUpIGJyZWFrO1xuICAgICAgICBfcmVmID0gX2kudmFsdWU7XG4gICAgICB9XG5cbiAgICAgIHZhciBvYmplY3QgPSBfcmVmO1xuXG4gICAgICB0aGlzLnNjZW5lLmFkZChvYmplY3QpO1xuICAgIH1cbiAgfTtcblxuICBTY2VuZS5wcm90b3R5cGUucmVzZXQgPSBmdW5jdGlvbiByZXNldCgpIHtcbiAgICB0aGlzLmNsZWFyU2NlbmUoKTtcbiAgICB0aGlzLmNhbWVyYS5zZXQoKTtcbiAgICB0aGlzLnJlbmRlcmVyLnNldFNpemUoKTtcbiAgfTtcblxuICBTY2VuZS5wcm90b3R5cGUuY2xlYXJTY2VuZSA9IGZ1bmN0aW9uIGNsZWFyU2NlbmUoKSB7XG4gICAgZm9yICh2YXIgaSA9IHRoaXMuc2NlbmUuY2hpbGRyZW4ubGVuZ3RoIC0gMTsgaSA+PSAwOyBpLS0pIHtcbiAgICAgIHRoaXMuc2NlbmUucmVtb3ZlKHRoaXMuc2NlbmUuY2hpbGRyZW5baV0pO1xuICAgIH1cbiAgfTtcblxuICBTY2VuZS5wcm90b3R5cGUuY2FuY2VsUmVuZGVyID0gZnVuY3Rpb24gY2FuY2VsUmVuZGVyKCkge1xuICAgIHRoaXMucmVuZGVyZXIuY2FuY2VsUmVuZGVyKCk7XG4gIH07XG5cbiAgU2NlbmUucHJvdG90eXBlLnJlbmRlciA9IGZ1bmN0aW9uIHJlbmRlcihzaG93U3RhdHMpIHtcbiAgICB0aGlzLnJlbmRlcmVyLnJlbmRlcih0aGlzLnNjZW5lLCB0aGlzLmNhbWVyYS5jYW0sIHNob3dTdGF0cyk7XG4gIH07XG5cbiAgcmV0dXJuIFNjZW5lO1xufSgpO1xuXG4vLyAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuLy9cbi8vICBEUkFXSU5HIENMQVNTXG4vL1xuLy8gKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbnZhciBEcmF3aW5nID0gZnVuY3Rpb24gKCkge1xuICBmdW5jdGlvbiBEcmF3aW5nKGNhbWVyYVNwZWMsIHJlbmRlcmVyU3BlYykge1xuICAgIGNsYXNzQ2FsbENoZWNrKHRoaXMsIERyYXdpbmcpO1xuXG4gICAgdGhpcy5zY2VuZSA9IG5ldyBTY2VuZShjYW1lcmFTcGVjLCByZW5kZXJlclNwZWMpO1xuICAgIHRoaXMuY2FtZXJhID0gdGhpcy5zY2VuZS5jYW1lcmE7XG4gICAgdGhpcy51dWlkID0gVEhSRUUuTWF0aC5nZW5lcmF0ZVVVSUQoKTtcbiAgICB0aGlzLmluaXQoKTtcbiAgfVxuXG4gIC8vZ2V0cyBjYWxsZWQgb24gd2luZG93IHJlc2l6ZSBvciBvdGhlciBldmVudHMgdGhhdCByZXF1aXJlIHJlY2FsY3VsYXRpb24gb2ZcbiAgLy9vYmplY3QgZGltZW5zaW9uc1xuXG5cbiAgRHJhd2luZy5wcm90b3R5cGUucmVzZXQgPSBmdW5jdGlvbiByZXNldCgpIHtcbiAgICB0aGlzLnNjZW5lLnJlc2V0KCk7XG4gICAgdGhpcy5pbml0KCk7XG4gIH07XG5cbiAgRHJhd2luZy5wcm90b3R5cGUucmVuZGVyID0gZnVuY3Rpb24gcmVuZGVyKHNob3dTdGF0cykge1xuICAgIHRoaXMuc2NlbmUucmVuZGVyKHNob3dTdGF0cyk7XG4gIH07XG5cbiAgRHJhd2luZy5wcm90b3R5cGUuY2FuY2VsUmVuZGVyID0gZnVuY3Rpb24gY2FuY2VsUmVuZGVyKCkge1xuICAgIHRoaXMuc2NlbmUucmVuZGVyZXIuY2FuY2VsUmVuZGVyKCk7XG4gIH07XG5cbiAgcmV0dXJuIERyYXdpbmc7XG59KCk7XG5cbnZhciBjb25maWcgPSB7XG4gIHVzZUdTQVA6IHRydWUsXG4gIHVzZUhlYXJ0Y29kZUxvYWRlcjogdHJ1ZSxcbiAgc2hvd1N0YXRzOiB0cnVlXG59O1xuXG4vLyAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuLy8gUGVyZm9ybSB2YXJpb3VzIGluaXRpYWxpc2F0aW9uIGNoZWNrcyBhbmQgc2V0dXBcbi8vICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG52YXIgbW9kdWxlTmFtZSA9ICd1bm5hbWVkVEhSRUVTZXR1cE1vZHVsZSc7XG4vL1RPRE86IHR1cm4gY2hlY2sgZnVuY3Rpb25zIGludG8gcHJvcGVyIGNoZWNrc1xudmFyIGNoZWNrVEhSRUVMb2FkZWQgPSBmdW5jdGlvbiAoKSB7XG4gIGlmICh0eXBlb2YgVEhSRUUgPT09ICd1bmRlZmluZWQnKSB7XG4gICAgdmFyIG1zZyA9IG1vZHVsZU5hbWUgKyAnIEVycm9yOiBUSFJFRSBub3QgbG9hZGVkLiBUSFJFRS5qcyBtdXN0IGJlIGxvYWRlZCBiZWZvcmUgdGhpcyBtb2R1bGVcXG4nO1xuICAgIG1zZyArPSAnVHJ5IGFkZGluZyA8c2NyaXB0IHNyYz1cImh0dHBzOi8vY2RuanMuY2xvdWRmbGFyZS5jb20vYWpheC9saWJzL3RocmVlLmpzL3I3OS90aHJlZS5taW4uanNcIj4nO1xuICAgIG1zZyArPSAnPC9zY3JpcHQ+IHRvIHlvdXIgPGhlYWQ+JztcbiAgICBjb25zb2xlLmVycm9yKG1zZyk7XG4gIH1cbn07XG5cbmNoZWNrVEhSRUVMb2FkZWQoKTtcblxudmFyIGNoZWNrR1NBUExvYWRlZCA9IGZ1bmN0aW9uICgpIHtcbiAgaWYgKHR5cGVvZiBUd2VlbkxpdGUgPT09ICd1bmRlZmluZWQnKSB7XG4gICAgdmFyIG1zZyA9IG1vZHVsZU5hbWUgKyAnIEVycm9yOiBHU0FQIG5vdCBsb2FkZWQuXFxuJztcbiAgICBtc2cgKz0gJ0lmIHlvdSBkbyBub3Qgd2lzaCB0byB1c2UgR1NBUCBzZXQgJyArIG1vZHVsZU5hbWUgKyAnLmNvbmZpZy51c2VHU0FQID0gZmFsc2VcXG4nO1xuICAgIG1zZyArPSAnT3RoZXJ3aXNlIHRyeSBhZGRpbmcgPHNjcmlwdCBzcmM9XCJodHRwczovL2NkbmpzLmNsb3VkZmxhcmUuY29tL2FqYXgvbGlicy9nc2FwLzEuMTkuMC9Ud2Vlbk1heC5taW4uanNcIj4nO1xuICAgIG1zZyArPSAnPC9zY3JpcHQ+IHRvIHlvdXIgPGhlYWQ+JztcbiAgICBjb25zb2xlLmVycm9yKG1zZyk7XG4gIH1cbn07XG5cbnZhciBjaGVja0hlYXJ0Y29kZUxvYWRlZCA9IGZ1bmN0aW9uICgpIHtcbiAgaWYgKHR5cGVvZiBDYW52YXNMb2FkZXIgPT09ICd1bmRlZmluZWQnKSB7XG4gICAgdmFyIG1zZyA9IG1vZHVsZU5hbWUgKyAnIEVycm9yOiBIZWFydGNvZGVMb2FkZXIgbm90IGxvYWRlZC5cXG4nO1xuICAgIG1zZyArPSAnSWYgeW91IGRvIG5vdCB3aXNoIHRvIHVzZSBIZWFydGNvZGVMb2FkZXIgc2V0ICcgKyBtb2R1bGVOYW1lICsgJy5jb25maWcudXNlSGVhcnRjb2RlTG9hZGVyID0gZmFsc2VcXG4nO1xuICAgIG1zZyArPSAnT3RoZXJ3aXNlIGdldCBodHRwczovL3Jhdy5naXRodWJ1c2VyY29udGVudC5jb20vaGVhcnRjb2RlLyc7XG4gICAgbXNnICs9ICdDYW52YXNMb2FkZXIvbWFzdGVyL2pzL2hlYXJ0Y29kZS1jYW52YXNsb2FkZXItbWluLmpzXFxuJztcbiAgICBtc2cgKz0gJ2FuZCBhZGQgPHNjcmlwdCBzcmM9XCJwYXRoLXRvLXNjcmlwdC9oZWFydGNvZGUtY2FudmFzbG9hZGVyLW1pbi5qc1wiPic7XG4gICAgbXNnICs9ICc8L3NjcmlwdD4gdG8geW91ciA8aGVhZD4nO1xuICAgIGNvbnNvbGUuZXJyb3IobXNnKTtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbiAgcmV0dXJuIHRydWU7XG59O1xuXG52YXIgYWRkTG9hZGVyRWxlbSA9IGZ1bmN0aW9uICgpIHtcbiAgdmFyIGVsZW0gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjbG9hZGluZ092ZXJsYXknKTtcbiAgaWYgKGVsZW0gPT09IG51bGwpIHtcbiAgICB2YXIgbG9hZGluZ092ZXJsYXkgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICBsb2FkaW5nT3ZlcmxheS5pZCA9ICdsb2FkaW5nT3ZlcmxheSc7XG4gICAgbG9hZGluZ092ZXJsYXkuc3R5bGUgPSAncG9zaXRpb246IGFic29sdXRlOyB0b3A6IDA7IGxlZnQ6IDA7IHdpZHRoOiAxMDAlOyBoZWlnaHQ6IDEwMCU7ei1pbmRleDogOTk5OyBiYWNrZ3JvdW5kLWNvbG9yOiBibGFjazsnO1xuICAgIHZhciBsb2FkaW5nSWNvbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgIGxvYWRpbmdJY29uLmlkID0gJ2xvYWRpbmdJY29uJztcbiAgICBsb2FkaW5nSWNvbi5zdHlsZSA9ICdwb3NpdGlvbjogZml4ZWQ7IHRvcDogNTAlOyBsZWZ0OiA1MCU7IC13ZWJraXQtdHJhbnNmb3JtOiB0cmFuc2xhdGUoLTUwJSwgLTUwJSk7IC1tcy10cmFuc2Zvcm06IHRyYW5zbGF0ZSgtNTAlLCAtNTAlKTsgdHJhbnNmb3JtOiB0cmFuc2xhdGUoLTUwJSwgLTUwJSk7IH0nO1xuXG4gICAgbG9hZGluZ092ZXJsYXkuYXBwZW5kQ2hpbGQobG9hZGluZ0ljb24pO1xuICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQobG9hZGluZ092ZXJsYXkpO1xuICB9XG59O1xuXG52YXIgY2hlY2tTdGF0c0xvYWRlZCA9IGZ1bmN0aW9uICgpIHtcbiAgaWYgKHR5cGVvZiBTdGF0cyA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICB2YXIgbXNnID0gbW9kdWxlTmFtZSArICcgRXJyb3I6IFN0YXRzIG5vdCBsb2FkZWQuXFxuJztcbiAgICBtc2cgKz0gJ0lmIHlvdSBkbyBub3Qgd2lzaCB0byBzaG93IFN0YXRzIHNldCAnICsgbW9kdWxlTmFtZSArICcuY29uZmlnLnNob3dTdGF0cyA9IGZhbHNlXFxuJztcbiAgICBtc2cgKz0gJ090aGVyd2lzZSBnZXQgaHR0cHM6Ly9yYXcuZ2l0aHVidXNlcmNvbnRlbnQuY29tL21yZG9vYi9zdGF0cy5qcy9tYXN0ZXIvYnVpbGQvc3RhdHMubWluLmpzXFxuJztcbiAgICBtc2cgKz0gJ2FuZCBhZGQgPHNjcmlwdCBzcmM9XCJwYXRoLXRvLXNjcmlwdC9zdGF0cy5taW4uanNcIj4nO1xuICAgIG1zZyArPSAnPC9zY3JpcHQ+IHRvIHlvdXIgPGhlYWQ+JztcbiAgICBjb25zb2xlLmVycm9yKG1zZyk7XG4gIH1cbn07XG5cbnZhciBpbml0ID0gZnVuY3Rpb24gKCkge1xuICBpZiAoY29uZmlnLnVzZUdTQVApIGNoZWNrR1NBUExvYWRlZCgpO1xuXG4gIGlmIChjb25maWcudXNlSGVhcnRjb2RlTG9hZGVyKSB7XG4gICAgaWYgKGNoZWNrSGVhcnRjb2RlTG9hZGVkKCkpIHtcbiAgICAgIGFkZExvYWRlckVsZW0oKTtcbiAgICB9XG4gIH1cblxuICBpZiAoY29uZmlnLnNob3dTdGF0cykgY2hlY2tTdGF0c0xvYWRlZCgpO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gIGluaXQ6IGluaXQsXG4gIGNvbmZpZzogY29uZmlnLFxuICBNZXNoT2JqZWN0OiBNZXNoT2JqZWN0LFxuICBEcmF3aW5nOiBEcmF3aW5nXG59OyIsIid1c2Ugc3RyaWN0JztcblxudmFyIGNsYXNzQ2FsbENoZWNrID0gZnVuY3Rpb24gKGluc3RhbmNlLCBDb25zdHJ1Y3Rvcikge1xuICBpZiAoIShpbnN0YW5jZSBpbnN0YW5jZW9mIENvbnN0cnVjdG9yKSkge1xuICAgIHRocm93IG5ldyBUeXBlRXJyb3IoXCJDYW5ub3QgY2FsbCBhIGNsYXNzIGFzIGEgZnVuY3Rpb25cIik7XG4gIH1cbn07XG5cbnZhciBpbmhlcml0cyA9IGZ1bmN0aW9uIChzdWJDbGFzcywgc3VwZXJDbGFzcykge1xuICBpZiAodHlwZW9mIHN1cGVyQ2xhc3MgIT09IFwiZnVuY3Rpb25cIiAmJiBzdXBlckNsYXNzICE9PSBudWxsKSB7XG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcihcIlN1cGVyIGV4cHJlc3Npb24gbXVzdCBlaXRoZXIgYmUgbnVsbCBvciBhIGZ1bmN0aW9uLCBub3QgXCIgKyB0eXBlb2Ygc3VwZXJDbGFzcyk7XG4gIH1cblxuICBzdWJDbGFzcy5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKHN1cGVyQ2xhc3MgJiYgc3VwZXJDbGFzcy5wcm90b3R5cGUsIHtcbiAgICBjb25zdHJ1Y3Rvcjoge1xuICAgICAgdmFsdWU6IHN1YkNsYXNzLFxuICAgICAgZW51bWVyYWJsZTogZmFsc2UsXG4gICAgICB3cml0YWJsZTogdHJ1ZSxcbiAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxuICAgIH1cbiAgfSk7XG4gIGlmIChzdXBlckNsYXNzKSBPYmplY3Quc2V0UHJvdG90eXBlT2YgPyBPYmplY3Quc2V0UHJvdG90eXBlT2Yoc3ViQ2xhc3MsIHN1cGVyQ2xhc3MpIDogc3ViQ2xhc3MuX19wcm90b19fID0gc3VwZXJDbGFzcztcbn07XG5cbnZhciBwb3NzaWJsZUNvbnN0cnVjdG9yUmV0dXJuID0gZnVuY3Rpb24gKHNlbGYsIGNhbGwpIHtcbiAgaWYgKCFzZWxmKSB7XG4gICAgdGhyb3cgbmV3IFJlZmVyZW5jZUVycm9yKFwidGhpcyBoYXNuJ3QgYmVlbiBpbml0aWFsaXNlZCAtIHN1cGVyKCkgaGFzbid0IGJlZW4gY2FsbGVkXCIpO1xuICB9XG5cbiAgcmV0dXJuIGNhbGwgJiYgKHR5cGVvZiBjYWxsID09PSBcIm9iamVjdFwiIHx8IHR5cGVvZiBjYWxsID09PSBcImZ1bmN0aW9uXCIpID8gY2FsbCA6IHNlbGY7XG59O1xuXG52YXIgbW9kdWxhclRIUkVFJDIgPSByZXF1aXJlKCdtb2R1bGFyLXRocmVlJyk7XG5cbnZhciBDdWJlID0gZnVuY3Rpb24gKF9tb2R1bGFyVEhSRUUkTWVzaE9iaikge1xuICBpbmhlcml0cyhDdWJlLCBfbW9kdWxhclRIUkVFJE1lc2hPYmopO1xuXG4gIGZ1bmN0aW9uIEN1YmUoKSB7XG4gICAgY2xhc3NDYWxsQ2hlY2sodGhpcywgQ3ViZSk7XG4gICAgcmV0dXJuIHBvc3NpYmxlQ29uc3RydWN0b3JSZXR1cm4odGhpcywgX21vZHVsYXJUSFJFRSRNZXNoT2JqLmNhbGwodGhpcykpO1xuICB9XG5cbiAgQ3ViZS5wcm90b3R5cGUuaW5pdCA9IGZ1bmN0aW9uIGluaXQoKSB7XG4gICAgdmFyIGdlb21ldHJ5ID0gbmV3IFRIUkVFLkJveEdlb21ldHJ5KDUsIDUsIDUpO1xuICAgIHZhciBtYXRlcmlhbCA9IG5ldyBUSFJFRS5NZXNoQmFzaWNNYXRlcmlhbCh7IGNvbG9yOiAweEZGMDAwMCB9KTtcbiAgICB0aGlzLm1lc2ggPSBuZXcgVEhSRUUuTWVzaChnZW9tZXRyeSwgbWF0ZXJpYWwpO1xuICB9O1xuXG4gIHJldHVybiBDdWJlO1xufShtb2R1bGFyVEhSRUUkMi5NZXNoT2JqZWN0KTtcblxudmFyIG1vZHVsYXJUSFJFRSQxID0gcmVxdWlyZSgnbW9kdWxhci10aHJlZScpO1xuXG52YXIgcmVuZGVyZXJTcGVjID0ge1xuICBjYW52YXNJRDogJycsXG4gIGFudGlhbGlhczogdHJ1ZSxcbiAgYWxwaGE6IHRydWUsIC8vdHJ1ZSByZXF1aXJlZCBmb3IgbXVsdGlwbGUgc2NlbmVzXG4gIGF1dG9DbGVhcjogdHJ1ZSwgLy9mYWxzZSByZXF1aXJlZCBmb3IgbXVsdGlwbGUgc2NlbmVzXG4gIGNsZWFyQ29sb3I6IDB4MDAwMDAwLFxuICBjbGVhckFscGhhOiAxLFxuICB3aWR0aDogZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiB3aW5kb3cuaW5uZXJXaWR0aDtcbiAgfSxcbiAgaGVpZ2h0OiBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIHdpbmRvdy5pbm5lckhlaWdodDtcbiAgfSxcbiAgcGl4ZWxSYXRpbzogd2luZG93LmRldmljZVBpeGVsUmF0aW8sXG4gIHBvc3Rwcm9jZXNzaW5nOiBmYWxzZVxufTtcblxuLy8gVGhlIGZvbGxvd2luZyBzcGVjIGlzIG9wdGlvbmFsIGFuZCBjYW4gYmUgb21pdHRlZCBmb3IgdGhlIGRlZmF1bHRzIHNob3duXG52YXIgY2FtZXJhU3BlYyA9IHtcbiAgdHlwZTogJ1BlcnNwZWN0aXZlQ2FtZXJhJywgLy9PciAnT3J0aG9ncmFwaGljQ2FtZXJhJ1xuICBuZWFyOiAxMCxcbiAgZmFyOiAtMTAsXG4gIHBvc2l0aW9uOiBuZXcgVEhSRUUuVmVjdG9yMygwLCAwLCAxMDApLFxuICAvL1BlcnNwZWN0aXZlQ2FtZXJhIG9ubHlcbiAgZm92OiA0NSwgLy9QZXJzcGVjdGl2ZUNhbWVyYSBvbmx5XG4gIGFzcGVjdDogZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiB3aW5kb3cuaW5uZXJXaWR0aCAvIHdpbmRvdy5pbm5lckhlaWdodDtcbiAgfSxcbiAgLy8gT3J0aG9ncmFwaGljQ2FtZXJhIG9ubHlcbiAgd2lkdGg6IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gd2luZG93LmlubmVyV2lkdGg7XG4gIH0sXG4gIGhlaWdodDogZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiB3aW5kb3cuaW5uZXJIZWlnaHQ7XG4gIH1cbn07XG5cbnZhciBUZXN0RHJhd2luZyA9IGZ1bmN0aW9uIChfbW9kdWxhclRIUkVFJERyYXdpbmcpIHtcbiAgaW5oZXJpdHMoVGVzdERyYXdpbmcsIF9tb2R1bGFyVEhSRUUkRHJhd2luZyk7XG5cbiAgZnVuY3Rpb24gVGVzdERyYXdpbmcoKSB7XG4gICAgY2xhc3NDYWxsQ2hlY2sodGhpcywgVGVzdERyYXdpbmcpO1xuICAgIHJldHVybiBwb3NzaWJsZUNvbnN0cnVjdG9yUmV0dXJuKHRoaXMsIF9tb2R1bGFyVEhSRUUkRHJhd2luZy5jYWxsKHRoaXMsIGNhbWVyYVNwZWMsIHJlbmRlcmVyU3BlYykpO1xuICB9XG5cbiAgVGVzdERyYXdpbmcucHJvdG90eXBlLmluaXQgPSBmdW5jdGlvbiBpbml0KCkge1xuICAgIHZhciBjdWJlID0gbmV3IEN1YmUoKTtcbiAgICB0aGlzLnNjZW5lLmFkZChjdWJlKTtcbiAgfTtcblxuICByZXR1cm4gVGVzdERyYXdpbmc7XG59KG1vZHVsYXJUSFJFRSQxLkRyYXdpbmcpO1xuXG52YXIgbW9kdWxhclRIUkVFID0gcmVxdWlyZSgnbW9kdWxhci10aHJlZScpO1xuXG5tb2R1bGFyVEhSRUUuY29uZmlnLnVzZUhlYXJ0Y29kZUxvYWRlciA9IGZhbHNlO1xuXG5tb2R1bGFyVEhSRUUuaW5pdCgpO1xuXG52YXIgdGVzdERyYXdpbmcgPSBuZXcgVGVzdERyYXdpbmcoKTtcbnRlc3REcmF3aW5nLnJlbmRlcih0cnVlKTsiXX0=
