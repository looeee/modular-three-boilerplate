(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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
    var geometry = new THREE.BoxBufferGeometry(20, 20, 20);
    var material = new THREE.MeshBasicMaterial({
      //color: 0xb6b6b6,
      //side: THREE.DoubleSide,
      map: this.loadTexture('images/textures/crate.jpg')
    });
    this.mesh = new THREE.Mesh(geometry, material);
  };

  return Cube;
}(modularTHREE$2.MeshObject);

var modularTHREE$1 = require('modular-three');

// The following spec objects are optional and can be omitted
//for the defaults shown
var rendererSpec = {
  canvasID: 'testDrawing', //TODO: add this functionality, including check that ID is unique
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
  postprocessing: false,
  useGSAP: false
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
    this.cube = new Cube();
    this.scene.add(this.cube);

    this.initAnimations();
  };

  TestDrawing.prototype.initAnimations = function initAnimations() {
    var _this2 = this;

    var rotateCube = function () {
      _this2.cube.rotation.x += 0.005;
      _this2.cube.rotation.y += 0.01;
    };

    this.perFrameFunctions.push(rotateCube);
  };

  return TestDrawing;
}(modularTHREE$1.Drawing);

var modularTHREE = require('modular-three');

modularTHREE.config.showStats = true;
modularTHREE.config.showHeartcodeLoader = true;

modularTHREE.init();

var testDrawing = new TestDrawing();
testDrawing.render();
},{"modular-three":2}],2:[function(require,module,exports){
var warnIfConfigUpdatedAfterInit = function () {
  console.warn('Config setting should be set before calling ModularTHREE.init()');
};

var config = {
  initCalled: false,

  heartcodeLoader: false,
  get showHeartcodeLoader() {
    return this.heartcodeLoader;
  },
  set showHeartcodeLoader(value) {
    if (this.initCalled) warnIfConfigUpdatedAfterInit();
    this.heartcodeLoader = value;
  },

  stats: false,
  get showStats() {
    return this.stats;
  },
  set showStats(value) {
    if (this.initCalled) warnIfConfigUpdatedAfterInit();
    this.stats = value;
  }
};

// *****************************************************************************
//  LOADING MANAGER
//  To be used by all other loaders
// *****************************************************************************
var loadingOverlay = void 0;
var loadingIcon = void 0;

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

var loadingManager = new THREE.LoadingManager();

loadingManager.onLoad = function () {
  if (loadingIcon) {
    loadingIcon.hide();
    TweenLite.to(loadingOverlay, 2, {
      opacity: 0,
      onComplete: function () {
        return loadingOverlay.classList.add('hide');
      }
    });
  }
};

// *****************************************************************************
//  Texture Loader
//  includes simple memoization to ensure
//  THREE.TextureLoader() and textures are only loaded once
// *****************************************************************************
var loader = null;

var textures = {};

function textureLoader(url) {
  if (!loader) loader = new THREE.TextureLoader(loadingManager);

  if (!textures[url]) textures[url] = loader.load(url);

  return textures[url];
}

var classCallCheck = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};

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

  MeshObject.prototype.loadTexture = function loadTexture(url) {
    return textureLoader(url);
  };

  MeshObject.prototype.updateTexture = function updateTexture(url) {
    //TODO: implement this
  };

  return MeshObject;
}();

var showStats = config.showStats;
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
    this.initRenderer();

    this.setRenderer();
  };

  Renderer.prototype.initRenderer = function initRenderer() {
    var rendererOptions = {
      antialias: this.spec.antialias,
      //required for multiple scenes and various other effects
      alpha: this.spec.alpha
    };

    if (this.spec.canvasID) {
      rendererOptions.canvas = document.createElement('canvas');
      rendererOptions.canvas.id = this.spec.canvasID;
    }

    this.renderer = new THREE.WebGLRenderer(rendererOptions);
    document.body.appendChild(this.renderer.domElement);
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

  Renderer.prototype.initStats = function initStats() {
    if (this.stats) return; //don't create stats more than once
    this.stats = new Stats();
    document.body.appendChild(this.stats.dom);
  };

  Renderer.prototype.render = function render(scene, camera, perFrameFunctions) {
    if (showStats) this.initStats();
    if (this.spec.postprocessing) this.postRenderer = new Postprocessing(this.renderer, scene, camera);

    if (this.spec.useGSAP && this.checkGSAPScriptLoaded()) {
      this.animateWithGSAP(scene, camera, perFrameFunctions);
    } else {
      this.animateWithTHREE(scene, camera, perFrameFunctions);
    }
  };

  Renderer.prototype.animateWithGSAP = function animateWithGSAP(scene, camera, perFrameFunctions) {
    var _this = this;

    var renderHandler = function () {
      for (var i = 0; i < perFrameFunctions.length; i++) {
        perFrameFunctions[i]();
      }

      if (showStats) _this.stats.update();
      if (_this.spec.postprocessing) _this.postRenderer.composer.render();else _this.renderer.render(scene, camera);
    };

    TweenLite.ticker.addEventListener('tick', renderHandler);
    this.usingGSAP = true;
  };

  Renderer.prototype.animateWithTHREE = function animateWithTHREE(scene, camera, perFrameFunctions) {
    var _this2 = this;

    var renderHandler = function () {
      for (var i = 0; i < perFrameFunctions.length; i++) {
        perFrameFunctions[i]();
      }

      if (showStats) _this2.stats.update();
      if (_this2.spec.postprocessing) _this2.postRenderer.composer.render();else _this2.renderer.render(scene, camera);

      _this2.animationFrame = requestAnimationFrame(renderHandler);
    };

    renderHandler();
  };

  Renderer.prototype.cancelRender = function cancelRender() {
    if (this.usingGSAP) TweenLite.ticker.removeEventListener('tick', this.renderHandler);else cancelAnimationFrame(this.animationFrame);
    this.renderer.clear();
    this.usingGSAP = false;
  };

  Renderer.prototype.checkGSAPScriptLoaded = function checkGSAPScriptLoaded() {
    if (typeof TweenLite === 'undefined') {
      var msg = 'ModularTHREE Error: GSAP not loaded.\n';
      msg += 'Attempting to use THREE for animation.\n';
      msg += 'If you do not wish to use GSAP set rendererSpec.useGSAP = false\n';
      msg += 'Otherwise try adding <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/1.19.0/TweenMax.min.js">';
      msg += '</script> to your <head>';
      console.error(msg);
      return false;
    }
    return true;
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
//
// *****************************************************************************
var Scene = function () {
  function Scene(rendererSpec, cameraSpec) {
    classCallCheck(this, Scene);

    this.rendererSpec = rendererSpec;
    this.cameraSpec = cameraSpec;
    this.init();
  }

  Scene.prototype.init = function init() {
    this.scene = new THREE.Scene();
    this.camera = new Camera(this.cameraSpec);
    this.scene.add(this.camera.cam);
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

  Scene.prototype.render = function render(perFrameFunctions) {
    this.renderer.render(this.scene, this.camera.cam, perFrameFunctions);
  };

  return Scene;
}();

var throttle = require('lodash.throttle');

//hold a reference to all drawings so that they can be reset easily
var drawings = {};

var resetDrawings = function () {
  Object.keys(drawings).forEach(function (key) {
    drawings[key].reset();
  });
};

window.addEventListener('resize', throttle(function () {
  resetDrawings();
}, 500), false);

// *****************************************************************************
//
//  DRAWING CLASS
//
// *****************************************************************************
var Drawing = function () {
  function Drawing(rendererSpec, cameraSpec) {
    classCallCheck(this, Drawing);

    this.scene = new Scene(rendererSpec, cameraSpec);
    this.camera = this.scene.camera;

    this.uuid = THREE.Math.generateUUID();
    drawings[this.uuid] = this;

    this.perFrameFunctions = [];

    this.init();
  }

  //gets called on window resize or other events that require recalculation of
  //object dimensions


  Drawing.prototype.reset = function reset() {
    this.scene.reset();
    this.init();
  };

  Drawing.prototype.render = function render() {
    this.scene.render(this.perFrameFunctions);
  };

  Drawing.prototype.cancelRender = function cancelRender() {
    this.scene.renderer.cancelRender();
  };

  return Drawing;
}();

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

var checkStatsLoaded = function () {
  if (typeof Stats === 'undefined') {
    var msg = moduleName + ' Error: Stats not loaded.\n';
    msg += 'If you do not wish to show Stats set ' + moduleName + '.config.showStats = false\n';
    msg += 'Otherwise get https://raw.githubusercontent.com/mrdoob/stats.js/master/build/stats.min.js\n';
    msg += 'and add <script src="path-to-script/stats.min.js">';
    msg += '</script> to your <head>';
    console.error(msg);
    config.showStats = false;
  }
};

var init = function () {
  if (config.showHeartcodeLoader) {
    if (checkHeartcodeLoaded()) {
      initHeartcodeLoader();
    }
  }

  if (config.showStats) checkStatsLoaded();

  config.initCalled = true;
};

module.exports = {
  init: init,
  config: config,
  MeshObject: MeshObject,
  Drawing: Drawing
};
},{"lodash.throttle":3}],3:[function(require,module,exports){
(function (global){
/**
 * lodash (Custom Build) <https://lodash.com/>
 * Build: `lodash modularize exports="npm" -o ./`
 * Copyright jQuery Foundation and other contributors <https://jquery.org/>
 * Released under MIT license <https://lodash.com/license>
 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
 * Copyright Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 */

/** Used as the `TypeError` message for "Functions" methods. */
var FUNC_ERROR_TEXT = 'Expected a function';

/** Used as references for various `Number` constants. */
var NAN = 0 / 0;

/** `Object#toString` result references. */
var symbolTag = '[object Symbol]';

/** Used to match leading and trailing whitespace. */
var reTrim = /^\s+|\s+$/g;

/** Used to detect bad signed hexadecimal string values. */
var reIsBadHex = /^[-+]0x[0-9a-f]+$/i;

/** Used to detect binary string values. */
var reIsBinary = /^0b[01]+$/i;

/** Used to detect octal string values. */
var reIsOctal = /^0o[0-7]+$/i;

/** Built-in method references without a dependency on `root`. */
var freeParseInt = parseInt;

/** Detect free variable `global` from Node.js. */
var freeGlobal = typeof global == 'object' && global && global.Object === Object && global;

/** Detect free variable `self`. */
var freeSelf = typeof self == 'object' && self && self.Object === Object && self;

/** Used as a reference to the global object. */
var root = freeGlobal || freeSelf || Function('return this')();

/** Used for built-in method references. */
var objectProto = Object.prototype;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */
var objectToString = objectProto.toString;

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeMax = Math.max,
    nativeMin = Math.min;

/**
 * Gets the timestamp of the number of milliseconds that have elapsed since
 * the Unix epoch (1 January 1970 00:00:00 UTC).
 *
 * @static
 * @memberOf _
 * @since 2.4.0
 * @category Date
 * @returns {number} Returns the timestamp.
 * @example
 *
 * _.defer(function(stamp) {
 *   console.log(_.now() - stamp);
 * }, _.now());
 * // => Logs the number of milliseconds it took for the deferred invocation.
 */
var now = function() {
  return root.Date.now();
};

/**
 * Creates a debounced function that delays invoking `func` until after `wait`
 * milliseconds have elapsed since the last time the debounced function was
 * invoked. The debounced function comes with a `cancel` method to cancel
 * delayed `func` invocations and a `flush` method to immediately invoke them.
 * Provide `options` to indicate whether `func` should be invoked on the
 * leading and/or trailing edge of the `wait` timeout. The `func` is invoked
 * with the last arguments provided to the debounced function. Subsequent
 * calls to the debounced function return the result of the last `func`
 * invocation.
 *
 * **Note:** If `leading` and `trailing` options are `true`, `func` is
 * invoked on the trailing edge of the timeout only if the debounced function
 * is invoked more than once during the `wait` timeout.
 *
 * If `wait` is `0` and `leading` is `false`, `func` invocation is deferred
 * until to the next tick, similar to `setTimeout` with a timeout of `0`.
 *
 * See [David Corbacho's article](https://css-tricks.com/debouncing-throttling-explained-examples/)
 * for details over the differences between `_.debounce` and `_.throttle`.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Function
 * @param {Function} func The function to debounce.
 * @param {number} [wait=0] The number of milliseconds to delay.
 * @param {Object} [options={}] The options object.
 * @param {boolean} [options.leading=false]
 *  Specify invoking on the leading edge of the timeout.
 * @param {number} [options.maxWait]
 *  The maximum time `func` is allowed to be delayed before it's invoked.
 * @param {boolean} [options.trailing=true]
 *  Specify invoking on the trailing edge of the timeout.
 * @returns {Function} Returns the new debounced function.
 * @example
 *
 * // Avoid costly calculations while the window size is in flux.
 * jQuery(window).on('resize', _.debounce(calculateLayout, 150));
 *
 * // Invoke `sendMail` when clicked, debouncing subsequent calls.
 * jQuery(element).on('click', _.debounce(sendMail, 300, {
 *   'leading': true,
 *   'trailing': false
 * }));
 *
 * // Ensure `batchLog` is invoked once after 1 second of debounced calls.
 * var debounced = _.debounce(batchLog, 250, { 'maxWait': 1000 });
 * var source = new EventSource('/stream');
 * jQuery(source).on('message', debounced);
 *
 * // Cancel the trailing debounced invocation.
 * jQuery(window).on('popstate', debounced.cancel);
 */
function debounce(func, wait, options) {
  var lastArgs,
      lastThis,
      maxWait,
      result,
      timerId,
      lastCallTime,
      lastInvokeTime = 0,
      leading = false,
      maxing = false,
      trailing = true;

  if (typeof func != 'function') {
    throw new TypeError(FUNC_ERROR_TEXT);
  }
  wait = toNumber(wait) || 0;
  if (isObject(options)) {
    leading = !!options.leading;
    maxing = 'maxWait' in options;
    maxWait = maxing ? nativeMax(toNumber(options.maxWait) || 0, wait) : maxWait;
    trailing = 'trailing' in options ? !!options.trailing : trailing;
  }

  function invokeFunc(time) {
    var args = lastArgs,
        thisArg = lastThis;

    lastArgs = lastThis = undefined;
    lastInvokeTime = time;
    result = func.apply(thisArg, args);
    return result;
  }

  function leadingEdge(time) {
    // Reset any `maxWait` timer.
    lastInvokeTime = time;
    // Start the timer for the trailing edge.
    timerId = setTimeout(timerExpired, wait);
    // Invoke the leading edge.
    return leading ? invokeFunc(time) : result;
  }

  function remainingWait(time) {
    var timeSinceLastCall = time - lastCallTime,
        timeSinceLastInvoke = time - lastInvokeTime,
        result = wait - timeSinceLastCall;

    return maxing ? nativeMin(result, maxWait - timeSinceLastInvoke) : result;
  }

  function shouldInvoke(time) {
    var timeSinceLastCall = time - lastCallTime,
        timeSinceLastInvoke = time - lastInvokeTime;

    // Either this is the first call, activity has stopped and we're at the
    // trailing edge, the system time has gone backwards and we're treating
    // it as the trailing edge, or we've hit the `maxWait` limit.
    return (lastCallTime === undefined || (timeSinceLastCall >= wait) ||
      (timeSinceLastCall < 0) || (maxing && timeSinceLastInvoke >= maxWait));
  }

  function timerExpired() {
    var time = now();
    if (shouldInvoke(time)) {
      return trailingEdge(time);
    }
    // Restart the timer.
    timerId = setTimeout(timerExpired, remainingWait(time));
  }

  function trailingEdge(time) {
    timerId = undefined;

    // Only invoke if we have `lastArgs` which means `func` has been
    // debounced at least once.
    if (trailing && lastArgs) {
      return invokeFunc(time);
    }
    lastArgs = lastThis = undefined;
    return result;
  }

  function cancel() {
    if (timerId !== undefined) {
      clearTimeout(timerId);
    }
    lastInvokeTime = 0;
    lastArgs = lastCallTime = lastThis = timerId = undefined;
  }

  function flush() {
    return timerId === undefined ? result : trailingEdge(now());
  }

  function debounced() {
    var time = now(),
        isInvoking = shouldInvoke(time);

    lastArgs = arguments;
    lastThis = this;
    lastCallTime = time;

    if (isInvoking) {
      if (timerId === undefined) {
        return leadingEdge(lastCallTime);
      }
      if (maxing) {
        // Handle invocations in a tight loop.
        timerId = setTimeout(timerExpired, wait);
        return invokeFunc(lastCallTime);
      }
    }
    if (timerId === undefined) {
      timerId = setTimeout(timerExpired, wait);
    }
    return result;
  }
  debounced.cancel = cancel;
  debounced.flush = flush;
  return debounced;
}

/**
 * Creates a throttled function that only invokes `func` at most once per
 * every `wait` milliseconds. The throttled function comes with a `cancel`
 * method to cancel delayed `func` invocations and a `flush` method to
 * immediately invoke them. Provide `options` to indicate whether `func`
 * should be invoked on the leading and/or trailing edge of the `wait`
 * timeout. The `func` is invoked with the last arguments provided to the
 * throttled function. Subsequent calls to the throttled function return the
 * result of the last `func` invocation.
 *
 * **Note:** If `leading` and `trailing` options are `true`, `func` is
 * invoked on the trailing edge of the timeout only if the throttled function
 * is invoked more than once during the `wait` timeout.
 *
 * If `wait` is `0` and `leading` is `false`, `func` invocation is deferred
 * until to the next tick, similar to `setTimeout` with a timeout of `0`.
 *
 * See [David Corbacho's article](https://css-tricks.com/debouncing-throttling-explained-examples/)
 * for details over the differences between `_.throttle` and `_.debounce`.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Function
 * @param {Function} func The function to throttle.
 * @param {number} [wait=0] The number of milliseconds to throttle invocations to.
 * @param {Object} [options={}] The options object.
 * @param {boolean} [options.leading=true]
 *  Specify invoking on the leading edge of the timeout.
 * @param {boolean} [options.trailing=true]
 *  Specify invoking on the trailing edge of the timeout.
 * @returns {Function} Returns the new throttled function.
 * @example
 *
 * // Avoid excessively updating the position while scrolling.
 * jQuery(window).on('scroll', _.throttle(updatePosition, 100));
 *
 * // Invoke `renewToken` when the click event is fired, but not more than once every 5 minutes.
 * var throttled = _.throttle(renewToken, 300000, { 'trailing': false });
 * jQuery(element).on('click', throttled);
 *
 * // Cancel the trailing throttled invocation.
 * jQuery(window).on('popstate', throttled.cancel);
 */
function throttle(func, wait, options) {
  var leading = true,
      trailing = true;

  if (typeof func != 'function') {
    throw new TypeError(FUNC_ERROR_TEXT);
  }
  if (isObject(options)) {
    leading = 'leading' in options ? !!options.leading : leading;
    trailing = 'trailing' in options ? !!options.trailing : trailing;
  }
  return debounce(func, wait, {
    'leading': leading,
    'maxWait': wait,
    'trailing': trailing
  });
}

/**
 * Checks if `value` is the
 * [language type](http://www.ecma-international.org/ecma-262/7.0/#sec-ecmascript-language-types)
 * of `Object`. (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an object, else `false`.
 * @example
 *
 * _.isObject({});
 * // => true
 *
 * _.isObject([1, 2, 3]);
 * // => true
 *
 * _.isObject(_.noop);
 * // => true
 *
 * _.isObject(null);
 * // => false
 */
function isObject(value) {
  var type = typeof value;
  return !!value && (type == 'object' || type == 'function');
}

/**
 * Checks if `value` is object-like. A value is object-like if it's not `null`
 * and has a `typeof` result of "object".
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
 * @example
 *
 * _.isObjectLike({});
 * // => true
 *
 * _.isObjectLike([1, 2, 3]);
 * // => true
 *
 * _.isObjectLike(_.noop);
 * // => false
 *
 * _.isObjectLike(null);
 * // => false
 */
function isObjectLike(value) {
  return !!value && typeof value == 'object';
}

/**
 * Checks if `value` is classified as a `Symbol` primitive or object.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a symbol, else `false`.
 * @example
 *
 * _.isSymbol(Symbol.iterator);
 * // => true
 *
 * _.isSymbol('abc');
 * // => false
 */
function isSymbol(value) {
  return typeof value == 'symbol' ||
    (isObjectLike(value) && objectToString.call(value) == symbolTag);
}

/**
 * Converts `value` to a number.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to process.
 * @returns {number} Returns the number.
 * @example
 *
 * _.toNumber(3.2);
 * // => 3.2
 *
 * _.toNumber(Number.MIN_VALUE);
 * // => 5e-324
 *
 * _.toNumber(Infinity);
 * // => Infinity
 *
 * _.toNumber('3.2');
 * // => 3.2
 */
function toNumber(value) {
  if (typeof value == 'number') {
    return value;
  }
  if (isSymbol(value)) {
    return NAN;
  }
  if (isObject(value)) {
    var other = typeof value.valueOf == 'function' ? value.valueOf() : value;
    value = isObject(other) ? (other + '') : other;
  }
  if (typeof value != 'string') {
    return value === 0 ? value : +value;
  }
  value = value.replace(reTrim, '');
  var isBinary = reIsBinary.test(value);
  return (isBinary || reIsOctal.test(value))
    ? freeParseInt(value.slice(2), isBinary ? 2 : 8)
    : (reIsBadHex.test(value) ? NAN : +value);
}

module.exports = throttle;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvZW50cnkuanMiLCIuLi9tb2R1bGFyLXRocmVlL2Rpc3QvaW5kZXguanMiLCIuLi9tb2R1bGFyLXRocmVlL25vZGVfbW9kdWxlcy9sb2Rhc2gudGhyb3R0bGUvaW5kZXguanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdElBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FDdGpCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIid1c2Ugc3RyaWN0JztcblxudmFyIGNsYXNzQ2FsbENoZWNrID0gZnVuY3Rpb24gKGluc3RhbmNlLCBDb25zdHJ1Y3Rvcikge1xuICBpZiAoIShpbnN0YW5jZSBpbnN0YW5jZW9mIENvbnN0cnVjdG9yKSkge1xuICAgIHRocm93IG5ldyBUeXBlRXJyb3IoXCJDYW5ub3QgY2FsbCBhIGNsYXNzIGFzIGEgZnVuY3Rpb25cIik7XG4gIH1cbn07XG5cbnZhciBpbmhlcml0cyA9IGZ1bmN0aW9uIChzdWJDbGFzcywgc3VwZXJDbGFzcykge1xuICBpZiAodHlwZW9mIHN1cGVyQ2xhc3MgIT09IFwiZnVuY3Rpb25cIiAmJiBzdXBlckNsYXNzICE9PSBudWxsKSB7XG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcihcIlN1cGVyIGV4cHJlc3Npb24gbXVzdCBlaXRoZXIgYmUgbnVsbCBvciBhIGZ1bmN0aW9uLCBub3QgXCIgKyB0eXBlb2Ygc3VwZXJDbGFzcyk7XG4gIH1cblxuICBzdWJDbGFzcy5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKHN1cGVyQ2xhc3MgJiYgc3VwZXJDbGFzcy5wcm90b3R5cGUsIHtcbiAgICBjb25zdHJ1Y3Rvcjoge1xuICAgICAgdmFsdWU6IHN1YkNsYXNzLFxuICAgICAgZW51bWVyYWJsZTogZmFsc2UsXG4gICAgICB3cml0YWJsZTogdHJ1ZSxcbiAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxuICAgIH1cbiAgfSk7XG4gIGlmIChzdXBlckNsYXNzKSBPYmplY3Quc2V0UHJvdG90eXBlT2YgPyBPYmplY3Quc2V0UHJvdG90eXBlT2Yoc3ViQ2xhc3MsIHN1cGVyQ2xhc3MpIDogc3ViQ2xhc3MuX19wcm90b19fID0gc3VwZXJDbGFzcztcbn07XG5cbnZhciBwb3NzaWJsZUNvbnN0cnVjdG9yUmV0dXJuID0gZnVuY3Rpb24gKHNlbGYsIGNhbGwpIHtcbiAgaWYgKCFzZWxmKSB7XG4gICAgdGhyb3cgbmV3IFJlZmVyZW5jZUVycm9yKFwidGhpcyBoYXNuJ3QgYmVlbiBpbml0aWFsaXNlZCAtIHN1cGVyKCkgaGFzbid0IGJlZW4gY2FsbGVkXCIpO1xuICB9XG5cbiAgcmV0dXJuIGNhbGwgJiYgKHR5cGVvZiBjYWxsID09PSBcIm9iamVjdFwiIHx8IHR5cGVvZiBjYWxsID09PSBcImZ1bmN0aW9uXCIpID8gY2FsbCA6IHNlbGY7XG59O1xuXG52YXIgbW9kdWxhclRIUkVFJDIgPSByZXF1aXJlKCdtb2R1bGFyLXRocmVlJyk7XG5cbnZhciBDdWJlID0gZnVuY3Rpb24gKF9tb2R1bGFyVEhSRUUkTWVzaE9iaikge1xuICBpbmhlcml0cyhDdWJlLCBfbW9kdWxhclRIUkVFJE1lc2hPYmopO1xuXG4gIGZ1bmN0aW9uIEN1YmUoKSB7XG4gICAgY2xhc3NDYWxsQ2hlY2sodGhpcywgQ3ViZSk7XG4gICAgcmV0dXJuIHBvc3NpYmxlQ29uc3RydWN0b3JSZXR1cm4odGhpcywgX21vZHVsYXJUSFJFRSRNZXNoT2JqLmNhbGwodGhpcykpO1xuICB9XG5cbiAgQ3ViZS5wcm90b3R5cGUuaW5pdCA9IGZ1bmN0aW9uIGluaXQoKSB7XG4gICAgdmFyIGdlb21ldHJ5ID0gbmV3IFRIUkVFLkJveEJ1ZmZlckdlb21ldHJ5KDIwLCAyMCwgMjApO1xuICAgIHZhciBtYXRlcmlhbCA9IG5ldyBUSFJFRS5NZXNoQmFzaWNNYXRlcmlhbCh7XG4gICAgICAvL2NvbG9yOiAweGI2YjZiNixcbiAgICAgIC8vc2lkZTogVEhSRUUuRG91YmxlU2lkZSxcbiAgICAgIG1hcDogdGhpcy5sb2FkVGV4dHVyZSgnaW1hZ2VzL3RleHR1cmVzL2NyYXRlLmpwZycpXG4gICAgfSk7XG4gICAgdGhpcy5tZXNoID0gbmV3IFRIUkVFLk1lc2goZ2VvbWV0cnksIG1hdGVyaWFsKTtcbiAgfTtcblxuICByZXR1cm4gQ3ViZTtcbn0obW9kdWxhclRIUkVFJDIuTWVzaE9iamVjdCk7XG5cbnZhciBtb2R1bGFyVEhSRUUkMSA9IHJlcXVpcmUoJ21vZHVsYXItdGhyZWUnKTtcblxuLy8gVGhlIGZvbGxvd2luZyBzcGVjIG9iamVjdHMgYXJlIG9wdGlvbmFsIGFuZCBjYW4gYmUgb21pdHRlZFxuLy9mb3IgdGhlIGRlZmF1bHRzIHNob3duXG52YXIgcmVuZGVyZXJTcGVjID0ge1xuICBjYW52YXNJRDogJ3Rlc3REcmF3aW5nJywgLy9UT0RPOiBhZGQgdGhpcyBmdW5jdGlvbmFsaXR5LCBpbmNsdWRpbmcgY2hlY2sgdGhhdCBJRCBpcyB1bmlxdWVcbiAgYW50aWFsaWFzOiB0cnVlLFxuICBhbHBoYTogdHJ1ZSwgLy90cnVlIHJlcXVpcmVkIGZvciBtdWx0aXBsZSBzY2VuZXNcbiAgYXV0b0NsZWFyOiB0cnVlLCAvL2ZhbHNlIHJlcXVpcmVkIGZvciBtdWx0aXBsZSBzY2VuZXNcbiAgY2xlYXJDb2xvcjogMHgwMDAwMDAsXG4gIGNsZWFyQWxwaGE6IDEsXG4gIHdpZHRoOiBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIHdpbmRvdy5pbm5lcldpZHRoO1xuICB9LFxuICBoZWlnaHQ6IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gd2luZG93LmlubmVySGVpZ2h0O1xuICB9LFxuICBwaXhlbFJhdGlvOiB3aW5kb3cuZGV2aWNlUGl4ZWxSYXRpbyxcbiAgcG9zdHByb2Nlc3Npbmc6IGZhbHNlLFxuICB1c2VHU0FQOiBmYWxzZVxufTtcblxuLy8gT3B0aW9uYWxcbnZhciBjYW1lcmFTcGVjID0ge1xuICB0eXBlOiAnUGVyc3BlY3RpdmVDYW1lcmEnLCAvL09yICdPcnRob2dyYXBoaWNDYW1lcmEnXG4gIG5lYXI6IDEwLFxuICBmYXI6IC0xMCxcbiAgcG9zaXRpb246IG5ldyBUSFJFRS5WZWN0b3IzKDAsIDAsIDEwMCksXG4gIC8vUGVyc3BlY3RpdmVDYW1lcmEgb25seVxuICBmb3Y6IDQ1LFxuICBhc3BlY3Q6IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gd2luZG93LmlubmVyV2lkdGggLyB3aW5kb3cuaW5uZXJIZWlnaHQ7XG4gIH0sXG4gIC8vIE9ydGhvZ3JhcGhpY0NhbWVyYSBvbmx5XG4gIHdpZHRoOiBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIHdpbmRvdy5pbm5lcldpZHRoO1xuICB9LFxuICBoZWlnaHQ6IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gd2luZG93LmlubmVySGVpZ2h0O1xuICB9XG59O1xuXG52YXIgVGVzdERyYXdpbmcgPSBmdW5jdGlvbiAoX21vZHVsYXJUSFJFRSREcmF3aW5nKSB7XG4gIGluaGVyaXRzKFRlc3REcmF3aW5nLCBfbW9kdWxhclRIUkVFJERyYXdpbmcpO1xuXG4gIGZ1bmN0aW9uIFRlc3REcmF3aW5nKCkge1xuICAgIGNsYXNzQ2FsbENoZWNrKHRoaXMsIFRlc3REcmF3aW5nKTtcbiAgICByZXR1cm4gcG9zc2libGVDb25zdHJ1Y3RvclJldHVybih0aGlzLCBfbW9kdWxhclRIUkVFJERyYXdpbmcuY2FsbCh0aGlzLCByZW5kZXJlclNwZWMsIGNhbWVyYVNwZWMpKTtcbiAgfVxuXG4gIFRlc3REcmF3aW5nLnByb3RvdHlwZS5pbml0ID0gZnVuY3Rpb24gaW5pdCgpIHtcbiAgICB0aGlzLmN1YmUgPSBuZXcgQ3ViZSgpO1xuICAgIHRoaXMuc2NlbmUuYWRkKHRoaXMuY3ViZSk7XG5cbiAgICB0aGlzLmluaXRBbmltYXRpb25zKCk7XG4gIH07XG5cbiAgVGVzdERyYXdpbmcucHJvdG90eXBlLmluaXRBbmltYXRpb25zID0gZnVuY3Rpb24gaW5pdEFuaW1hdGlvbnMoKSB7XG4gICAgdmFyIF90aGlzMiA9IHRoaXM7XG5cbiAgICB2YXIgcm90YXRlQ3ViZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgIF90aGlzMi5jdWJlLnJvdGF0aW9uLnggKz0gMC4wMDU7XG4gICAgICBfdGhpczIuY3ViZS5yb3RhdGlvbi55ICs9IDAuMDE7XG4gICAgfTtcblxuICAgIHRoaXMucGVyRnJhbWVGdW5jdGlvbnMucHVzaChyb3RhdGVDdWJlKTtcbiAgfTtcblxuICByZXR1cm4gVGVzdERyYXdpbmc7XG59KG1vZHVsYXJUSFJFRSQxLkRyYXdpbmcpO1xuXG52YXIgbW9kdWxhclRIUkVFID0gcmVxdWlyZSgnbW9kdWxhci10aHJlZScpO1xuXG5tb2R1bGFyVEhSRUUuY29uZmlnLnNob3dTdGF0cyA9IHRydWU7XG5tb2R1bGFyVEhSRUUuY29uZmlnLnNob3dIZWFydGNvZGVMb2FkZXIgPSB0cnVlO1xuXG5tb2R1bGFyVEhSRUUuaW5pdCgpO1xuXG52YXIgdGVzdERyYXdpbmcgPSBuZXcgVGVzdERyYXdpbmcoKTtcbnRlc3REcmF3aW5nLnJlbmRlcigpOyIsInZhciB3YXJuSWZDb25maWdVcGRhdGVkQWZ0ZXJJbml0ID0gZnVuY3Rpb24gKCkge1xuICBjb25zb2xlLndhcm4oJ0NvbmZpZyBzZXR0aW5nIHNob3VsZCBiZSBzZXQgYmVmb3JlIGNhbGxpbmcgTW9kdWxhclRIUkVFLmluaXQoKScpO1xufTtcblxudmFyIGNvbmZpZyA9IHtcbiAgaW5pdENhbGxlZDogZmFsc2UsXG5cbiAgaGVhcnRjb2RlTG9hZGVyOiBmYWxzZSxcbiAgZ2V0IHNob3dIZWFydGNvZGVMb2FkZXIoKSB7XG4gICAgcmV0dXJuIHRoaXMuaGVhcnRjb2RlTG9hZGVyO1xuICB9LFxuICBzZXQgc2hvd0hlYXJ0Y29kZUxvYWRlcih2YWx1ZSkge1xuICAgIGlmICh0aGlzLmluaXRDYWxsZWQpIHdhcm5JZkNvbmZpZ1VwZGF0ZWRBZnRlckluaXQoKTtcbiAgICB0aGlzLmhlYXJ0Y29kZUxvYWRlciA9IHZhbHVlO1xuICB9LFxuXG4gIHN0YXRzOiBmYWxzZSxcbiAgZ2V0IHNob3dTdGF0cygpIHtcbiAgICByZXR1cm4gdGhpcy5zdGF0cztcbiAgfSxcbiAgc2V0IHNob3dTdGF0cyh2YWx1ZSkge1xuICAgIGlmICh0aGlzLmluaXRDYWxsZWQpIHdhcm5JZkNvbmZpZ1VwZGF0ZWRBZnRlckluaXQoKTtcbiAgICB0aGlzLnN0YXRzID0gdmFsdWU7XG4gIH1cbn07XG5cbi8vICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4vLyAgTE9BRElORyBNQU5BR0VSXG4vLyAgVG8gYmUgdXNlZCBieSBhbGwgb3RoZXIgbG9hZGVyc1xuLy8gKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbnZhciBsb2FkaW5nT3ZlcmxheSA9IHZvaWQgMDtcbnZhciBsb2FkaW5nSWNvbiA9IHZvaWQgMDtcblxudmFyIGFkZExvYWRlckVsZW0gPSBmdW5jdGlvbiAoKSB7XG4gIGxvYWRpbmdPdmVybGF5ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gIGxvYWRpbmdPdmVybGF5LmlkID0gJ2xvYWRpbmdPdmVybGF5JztcbiAgbG9hZGluZ092ZXJsYXkuc3R5bGUgPSAncG9zaXRpb246IGFic29sdXRlOyB0b3A6IDA7IGxlZnQ6IDA7IHdpZHRoOiAxMDAlOyBoZWlnaHQ6IDEwMCU7ei1pbmRleDogOTk5OyBiYWNrZ3JvdW5kLWNvbG9yOiBibGFjazsnO1xuICBsb2FkaW5nSWNvbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICBsb2FkaW5nSWNvbi5pZCA9ICdsb2FkaW5nSWNvbic7XG4gIGxvYWRpbmdJY29uLnN0eWxlID0gJ3Bvc2l0aW9uOiBmaXhlZDsgdG9wOiA1MCU7IGxlZnQ6IDUwJTsgLXdlYmtpdC10cmFuc2Zvcm06IHRyYW5zbGF0ZSgtNTAlLCAtNTAlKTsgLW1zLXRyYW5zZm9ybTogdHJhbnNsYXRlKC01MCUsIC01MCUpOyB0cmFuc2Zvcm06IHRyYW5zbGF0ZSgtNTAlLCAtNTAlKTsgfSc7XG5cbiAgbG9hZGluZ092ZXJsYXkuYXBwZW5kQ2hpbGQobG9hZGluZ0ljb24pO1xuICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKGxvYWRpbmdPdmVybGF5KTtcbn07XG5cbnZhciBpbml0SGVhcnRjb2RlTG9hZGVyID0gZnVuY3Rpb24gKCkge1xuICBhZGRMb2FkZXJFbGVtKCk7XG4gIGxvYWRpbmdJY29uID0gbmV3IENhbnZhc0xvYWRlcignbG9hZGluZ0ljb24nKTtcbiAgbG9hZGluZ0ljb24uc2V0Q29sb3IoJyM1YTZmNzAnKTtcbiAgbG9hZGluZ0ljb24uc2V0U2hhcGUoJ3NwaXJhbCcpOyAvLyBkZWZhdWx0IGlzICdvdmFsJ1xuICBsb2FkaW5nSWNvbi5zZXREaWFtZXRlcigxNTApOyAvLyBkZWZhdWx0IGlzIDQwXG4gIGxvYWRpbmdJY29uLnNldERlbnNpdHkoNTApOyAvLyBkZWZhdWx0IGlzIDQwXG4gIGxvYWRpbmdJY29uLnNldFJhbmdlKDAuNyk7IC8vIGRlZmF1bHQgaXMgMS4zXG4gIGxvYWRpbmdJY29uLnNldFNwZWVkKDEpOyAvLyBkZWZhdWx0IGlzIDJcbiAgbG9hZGluZ0ljb24uc2V0RlBTKDMwKTsgLy8gZGVmYXVsdCBpcyAyNFxuICBsb2FkaW5nSWNvbi5zaG93KCk7IC8vIEhpZGRlbiBieSBkZWZhdWx0XG59O1xuXG52YXIgbG9hZGluZ01hbmFnZXIgPSBuZXcgVEhSRUUuTG9hZGluZ01hbmFnZXIoKTtcblxubG9hZGluZ01hbmFnZXIub25Mb2FkID0gZnVuY3Rpb24gKCkge1xuICBpZiAobG9hZGluZ0ljb24pIHtcbiAgICBsb2FkaW5nSWNvbi5oaWRlKCk7XG4gICAgVHdlZW5MaXRlLnRvKGxvYWRpbmdPdmVybGF5LCAyLCB7XG4gICAgICBvcGFjaXR5OiAwLFxuICAgICAgb25Db21wbGV0ZTogZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gbG9hZGluZ092ZXJsYXkuY2xhc3NMaXN0LmFkZCgnaGlkZScpO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG59O1xuXG4vLyAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuLy8gIFRleHR1cmUgTG9hZGVyXG4vLyAgaW5jbHVkZXMgc2ltcGxlIG1lbW9pemF0aW9uIHRvIGVuc3VyZVxuLy8gIFRIUkVFLlRleHR1cmVMb2FkZXIoKSBhbmQgdGV4dHVyZXMgYXJlIG9ubHkgbG9hZGVkIG9uY2Vcbi8vICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG52YXIgbG9hZGVyID0gbnVsbDtcblxudmFyIHRleHR1cmVzID0ge307XG5cbmZ1bmN0aW9uIHRleHR1cmVMb2FkZXIodXJsKSB7XG4gIGlmICghbG9hZGVyKSBsb2FkZXIgPSBuZXcgVEhSRUUuVGV4dHVyZUxvYWRlcihsb2FkaW5nTWFuYWdlcik7XG5cbiAgaWYgKCF0ZXh0dXJlc1t1cmxdKSB0ZXh0dXJlc1t1cmxdID0gbG9hZGVyLmxvYWQodXJsKTtcblxuICByZXR1cm4gdGV4dHVyZXNbdXJsXTtcbn1cblxudmFyIGNsYXNzQ2FsbENoZWNrID0gZnVuY3Rpb24gKGluc3RhbmNlLCBDb25zdHJ1Y3Rvcikge1xuICBpZiAoIShpbnN0YW5jZSBpbnN0YW5jZW9mIENvbnN0cnVjdG9yKSkge1xuICAgIHRocm93IG5ldyBUeXBlRXJyb3IoXCJDYW5ub3QgY2FsbCBhIGNsYXNzIGFzIGEgZnVuY3Rpb25cIik7XG4gIH1cbn07XG5cbi8vICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4vLyBNRVNIIE9CSkVDVCBTVVBFUkNMQVNTXG4vLyBTdXBlcmNsYXNzIGZvciBhbnkgVEhSRUUuanMgbWVzaCBvYmplY3QuIFJldHVybnMgYSBUSFJFRSBtZXNoXG4vLyAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuLy9UT0RPOiByZW5hbWUgdGhpcyBjbGFzc1xudmFyIE1lc2hPYmplY3QgPSBmdW5jdGlvbiAoKSB7XG4gIGZ1bmN0aW9uIE1lc2hPYmplY3Qoc3BlYykge1xuICAgIGNsYXNzQ2FsbENoZWNrKHRoaXMsIE1lc2hPYmplY3QpO1xuXG4gICAgdGhpcy5zcGVjID0gc3BlYyB8fCB7fTtcblxuICAgIHRoaXMuaW5pdCgpO1xuICAgIGlmICh0aGlzLnNwZWMubGF5ZXIpIHtcbiAgICAgIHRoaXMubWVzaC5sYXllcnMuc2V0KHRoaXMuc3BlYy5sYXllcik7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXMubWVzaDtcbiAgfVxuXG4gIE1lc2hPYmplY3QucHJvdG90eXBlLmxvYWRUZXh0dXJlID0gZnVuY3Rpb24gbG9hZFRleHR1cmUodXJsKSB7XG4gICAgcmV0dXJuIHRleHR1cmVMb2FkZXIodXJsKTtcbiAgfTtcblxuICBNZXNoT2JqZWN0LnByb3RvdHlwZS51cGRhdGVUZXh0dXJlID0gZnVuY3Rpb24gdXBkYXRlVGV4dHVyZSh1cmwpIHtcbiAgICAvL1RPRE86IGltcGxlbWVudCB0aGlzXG4gIH07XG5cbiAgcmV0dXJuIE1lc2hPYmplY3Q7XG59KCk7XG5cbnZhciBzaG93U3RhdHMgPSBjb25maWcuc2hvd1N0YXRzO1xuLy8gaW1wb3J0IHtcbi8vICAgUG9zdHByb2Nlc3NpbmcsXG4vLyB9XG4vLyBmcm9tICcuL3Bvc3Rwcm9jZXNzaW5nJztcbi8vICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4vLyBSRU5ERVJFUiBDTEFTU1xuLy9cbi8vIENyZWF0ZSBhIFRIUkVFLmpzIHJlbmRlcmVyIGFuZCBhZGQgcG9zdHByb2Nlc3NpbmcgaWYgcmVxdWlyZWRcbi8vIEVhY2ggc2NlbmUgY3VycmVudGx5IG5lZWRzIGEgdW5pcXVlIHJlbmRlcmVyIGFuZCBhc3NvY2lhdGVkIEhUTUwgQ2FudmFzXG4vLyBlbGVtIGZvciB0aGUgY2FuY2VsUmVuZGVyIGZ1bmN0aW9uIHRvIHdvcmtcbi8vIFRoZSBjb250YWluZXIgZWxlbSBjYW4gYmUgb21pdHRlZCBpZiB1c2luZyBvbmx5IG9uZSBzY2VuZSBhcyB0aGUgZGVmYXVsdFxuLy8gd2lsbCBiZSBhdXRvbWF0aWNhbGx5IGFkZGVkXG4vLyBOT1RFOiBDdXJyZW50bHkgdXNpbmcgVHdlZW5NYXggdGlja2VyIGZvciBhbmltYXRpb24gc28gdGhlIGdzYXAgZmlsZXMgbXVzdFxuLy8gYmUgaW5jbHVkZWRcbi8vXG4vLyBUaGUgZm9sbG93aW5nIHNwZWMgb2JqZWN0IGNhbiBiZSBvbWl0dGVkIGZvciB0aGUgZm9sbG93aW5nIGRlZmF1bHRzXG4vLyBjb25zdCByZW5kZXJlclNwZWMgPSB7XG4vLyAgIGNvbnRhaW5lckVsZW06IGNhbnZhc0VsZW0sIC8vIG9taXQgZm9yIFRIUkVFIGpzIGRlZmF1bHRcbi8vICAgYW50aWFsaWFzOiB0cnVlLFxuLy8gICBhbHBoYTogZmFsc2UsIC8vdHJ1ZSByZXF1aXJlZCBmb3IgbXVsdGlwbGUgc2NlbmVzXG4vLyAgIGF1dG9DbGVhcjogdHJ1ZSwgLy9mYWxzZSByZXF1aXJlZCBmb3IgbXVsdGlwbGUgc2NlbmVzXG4vLyAgIGNsZWFyQ29sb3I6IDB4MDAwMDAwLFxuLy8gICBjbGVhckFscGhhOiAwLFxuLy8gICB3aWR0aDogd2luZG93LmlubmVyV2lkdGgsXG4vLyAgIGhlaWdodDogd2luZG93LmlubmVySGVpZ2h0LFxuLy8gICBwaXhlbFJhdGlvOiB3aW5kb3cuZGV2aWNlUGl4ZWxSYXRpbyxcbi8vIH07XG4vLyAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxudmFyIFJlbmRlcmVyID0gZnVuY3Rpb24gKCkge1xuICBmdW5jdGlvbiBSZW5kZXJlcihzcGVjKSB7XG4gICAgY2xhc3NDYWxsQ2hlY2sodGhpcywgUmVuZGVyZXIpO1xuXG4gICAgdGhpcy5zcGVjID0gc3BlYyB8fCB7fTtcbiAgICB0aGlzLmluaXQoKTtcbiAgfVxuXG4gIFJlbmRlcmVyLnByb3RvdHlwZS5pbml0ID0gZnVuY3Rpb24gaW5pdCgpIHtcbiAgICB0aGlzLmluaXRQYXJhbXMoKTtcbiAgICB0aGlzLmluaXRSZW5kZXJlcigpO1xuXG4gICAgdGhpcy5zZXRSZW5kZXJlcigpO1xuICB9O1xuXG4gIFJlbmRlcmVyLnByb3RvdHlwZS5pbml0UmVuZGVyZXIgPSBmdW5jdGlvbiBpbml0UmVuZGVyZXIoKSB7XG4gICAgdmFyIHJlbmRlcmVyT3B0aW9ucyA9IHtcbiAgICAgIGFudGlhbGlhczogdGhpcy5zcGVjLmFudGlhbGlhcyxcbiAgICAgIC8vcmVxdWlyZWQgZm9yIG11bHRpcGxlIHNjZW5lcyBhbmQgdmFyaW91cyBvdGhlciBlZmZlY3RzXG4gICAgICBhbHBoYTogdGhpcy5zcGVjLmFscGhhXG4gICAgfTtcblxuICAgIGlmICh0aGlzLnNwZWMuY2FudmFzSUQpIHtcbiAgICAgIHJlbmRlcmVyT3B0aW9ucy5jYW52YXMgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdjYW52YXMnKTtcbiAgICAgIHJlbmRlcmVyT3B0aW9ucy5jYW52YXMuaWQgPSB0aGlzLnNwZWMuY2FudmFzSUQ7XG4gICAgfVxuXG4gICAgdGhpcy5yZW5kZXJlciA9IG5ldyBUSFJFRS5XZWJHTFJlbmRlcmVyKHJlbmRlcmVyT3B0aW9ucyk7XG4gICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZCh0aGlzLnJlbmRlcmVyLmRvbUVsZW1lbnQpO1xuICB9O1xuXG4gIFJlbmRlcmVyLnByb3RvdHlwZS5pbml0UGFyYW1zID0gZnVuY3Rpb24gaW5pdFBhcmFtcygpIHtcbiAgICBpZiAoIXRoaXMuc3BlYy5wb3N0cHJvY2Vzc2luZykgdGhpcy5zcGVjLnBvc3Rwcm9jZXNzaW5nID0gZmFsc2U7XG4gICAgaWYgKCF0aGlzLnNwZWMuYW50aWFsaWFzKSB0aGlzLnNwZWMuYW50aWFsaWFzID0gdHJ1ZTtcbiAgICBpZiAoIXRoaXMuc3BlYy5hbHBoYSkgdGhpcy5zcGVjLmFscGhhID0gdHJ1ZTtcbiAgICBpZiAoIXRoaXMuc3BlYy5hdXRvQ2xlYXIpIHRoaXMuc3BlYy5hdXRvQ2xlYXIgPSBmYWxzZTtcbiAgICB0aGlzLnNwZWMuY2xlYXJDb2xvciA9IHRoaXMuc3BlYy5jbGVhckNvbG9yIHx8IDB4MDAwMDAwO1xuICAgIHRoaXMuc3BlYy5jbGVhckFscGhhID0gdGhpcy5zcGVjLmNsZWFyQWxwaGEgfHwgMS4wO1xuICAgIHZhciB3ID0gZnVuY3Rpb24gKCkge1xuICAgICAgcmV0dXJuIHdpbmRvdy5pbm5lcldpZHRoO1xuICAgIH07XG4gICAgdGhpcy5zcGVjLndpZHRoID0gdGhpcy5zcGVjLndpZHRoIHx8IHc7XG4gICAgdmFyIGggPSBmdW5jdGlvbiAoKSB7XG4gICAgICByZXR1cm4gd2luZG93LmlubmVySGVpZ2h0O1xuICAgIH07XG4gICAgdGhpcy5zcGVjLmhlaWdodCA9IHRoaXMuc3BlYy5oZWlnaHQgfHwgaDtcbiAgICB0aGlzLnNwZWMucGl4ZWxSYXRpbyA9IHRoaXMuc3BlYy5waXhlbFJhdGlvIHx8IHdpbmRvdy5kZXZpY2VQaXhlbFJhdGlvO1xuICB9O1xuXG4gIFJlbmRlcmVyLnByb3RvdHlwZS5zZXRTaXplID0gZnVuY3Rpb24gc2V0U2l6ZSgpIHtcbiAgICB2YXIgdyA9IGFyZ3VtZW50cy5sZW5ndGggPD0gMCB8fCBhcmd1bWVudHNbMF0gPT09IHVuZGVmaW5lZCA/IHRoaXMuc3BlYy53aWR0aCgpIDogYXJndW1lbnRzWzBdO1xuICAgIHZhciBoID0gYXJndW1lbnRzLmxlbmd0aCA8PSAxIHx8IGFyZ3VtZW50c1sxXSA9PT0gdW5kZWZpbmVkID8gdGhpcy5zcGVjLmhlaWdodCgpIDogYXJndW1lbnRzWzFdO1xuXG4gICAgdGhpcy5yZW5kZXJlci5zZXRTaXplKHcsIGgpO1xuICB9O1xuXG4gIFJlbmRlcmVyLnByb3RvdHlwZS5zZXRSZW5kZXJlciA9IGZ1bmN0aW9uIHNldFJlbmRlcmVyKCkge1xuICAgIHRoaXMucmVuZGVyZXIuYXV0b0NsZWFyID0gdGhpcy5zcGVjLmF1dG9DbGVhcjtcbiAgICB0aGlzLnJlbmRlcmVyLnNldENsZWFyQ29sb3IodGhpcy5zcGVjLmNsZWFyQ29sb3IsIHRoaXMuc3BlYy5jbGVhckFscGhhKTtcbiAgICB0aGlzLnJlbmRlcmVyLnNldFNpemUodGhpcy5zcGVjLndpZHRoLCB0aGlzLnNwZWMuaGVpZ2h0KTtcbiAgICB0aGlzLnJlbmRlcmVyLnNldFBpeGVsUmF0aW8odGhpcy5zcGVjLnBpeGVsUmF0aW8pO1xuICAgIHRoaXMuc2V0U2l6ZSh0aGlzLnNwZWMud2lkdGgoKSwgdGhpcy5zcGVjLmhlaWdodCgpKTtcbiAgfTtcblxuICBSZW5kZXJlci5wcm90b3R5cGUuaW5pdFN0YXRzID0gZnVuY3Rpb24gaW5pdFN0YXRzKCkge1xuICAgIGlmICh0aGlzLnN0YXRzKSByZXR1cm47IC8vZG9uJ3QgY3JlYXRlIHN0YXRzIG1vcmUgdGhhbiBvbmNlXG4gICAgdGhpcy5zdGF0cyA9IG5ldyBTdGF0cygpO1xuICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQodGhpcy5zdGF0cy5kb20pO1xuICB9O1xuXG4gIFJlbmRlcmVyLnByb3RvdHlwZS5yZW5kZXIgPSBmdW5jdGlvbiByZW5kZXIoc2NlbmUsIGNhbWVyYSwgcGVyRnJhbWVGdW5jdGlvbnMpIHtcbiAgICBpZiAoc2hvd1N0YXRzKSB0aGlzLmluaXRTdGF0cygpO1xuICAgIGlmICh0aGlzLnNwZWMucG9zdHByb2Nlc3NpbmcpIHRoaXMucG9zdFJlbmRlcmVyID0gbmV3IFBvc3Rwcm9jZXNzaW5nKHRoaXMucmVuZGVyZXIsIHNjZW5lLCBjYW1lcmEpO1xuXG4gICAgaWYgKHRoaXMuc3BlYy51c2VHU0FQICYmIHRoaXMuY2hlY2tHU0FQU2NyaXB0TG9hZGVkKCkpIHtcbiAgICAgIHRoaXMuYW5pbWF0ZVdpdGhHU0FQKHNjZW5lLCBjYW1lcmEsIHBlckZyYW1lRnVuY3Rpb25zKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5hbmltYXRlV2l0aFRIUkVFKHNjZW5lLCBjYW1lcmEsIHBlckZyYW1lRnVuY3Rpb25zKTtcbiAgICB9XG4gIH07XG5cbiAgUmVuZGVyZXIucHJvdG90eXBlLmFuaW1hdGVXaXRoR1NBUCA9IGZ1bmN0aW9uIGFuaW1hdGVXaXRoR1NBUChzY2VuZSwgY2FtZXJhLCBwZXJGcmFtZUZ1bmN0aW9ucykge1xuICAgIHZhciBfdGhpcyA9IHRoaXM7XG5cbiAgICB2YXIgcmVuZGVySGFuZGxlciA9IGZ1bmN0aW9uICgpIHtcbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgcGVyRnJhbWVGdW5jdGlvbnMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgcGVyRnJhbWVGdW5jdGlvbnNbaV0oKTtcbiAgICAgIH1cblxuICAgICAgaWYgKHNob3dTdGF0cykgX3RoaXMuc3RhdHMudXBkYXRlKCk7XG4gICAgICBpZiAoX3RoaXMuc3BlYy5wb3N0cHJvY2Vzc2luZykgX3RoaXMucG9zdFJlbmRlcmVyLmNvbXBvc2VyLnJlbmRlcigpO2Vsc2UgX3RoaXMucmVuZGVyZXIucmVuZGVyKHNjZW5lLCBjYW1lcmEpO1xuICAgIH07XG5cbiAgICBUd2VlbkxpdGUudGlja2VyLmFkZEV2ZW50TGlzdGVuZXIoJ3RpY2snLCByZW5kZXJIYW5kbGVyKTtcbiAgICB0aGlzLnVzaW5nR1NBUCA9IHRydWU7XG4gIH07XG5cbiAgUmVuZGVyZXIucHJvdG90eXBlLmFuaW1hdGVXaXRoVEhSRUUgPSBmdW5jdGlvbiBhbmltYXRlV2l0aFRIUkVFKHNjZW5lLCBjYW1lcmEsIHBlckZyYW1lRnVuY3Rpb25zKSB7XG4gICAgdmFyIF90aGlzMiA9IHRoaXM7XG5cbiAgICB2YXIgcmVuZGVySGFuZGxlciA9IGZ1bmN0aW9uICgpIHtcbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgcGVyRnJhbWVGdW5jdGlvbnMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgcGVyRnJhbWVGdW5jdGlvbnNbaV0oKTtcbiAgICAgIH1cblxuICAgICAgaWYgKHNob3dTdGF0cykgX3RoaXMyLnN0YXRzLnVwZGF0ZSgpO1xuICAgICAgaWYgKF90aGlzMi5zcGVjLnBvc3Rwcm9jZXNzaW5nKSBfdGhpczIucG9zdFJlbmRlcmVyLmNvbXBvc2VyLnJlbmRlcigpO2Vsc2UgX3RoaXMyLnJlbmRlcmVyLnJlbmRlcihzY2VuZSwgY2FtZXJhKTtcblxuICAgICAgX3RoaXMyLmFuaW1hdGlvbkZyYW1lID0gcmVxdWVzdEFuaW1hdGlvbkZyYW1lKHJlbmRlckhhbmRsZXIpO1xuICAgIH07XG5cbiAgICByZW5kZXJIYW5kbGVyKCk7XG4gIH07XG5cbiAgUmVuZGVyZXIucHJvdG90eXBlLmNhbmNlbFJlbmRlciA9IGZ1bmN0aW9uIGNhbmNlbFJlbmRlcigpIHtcbiAgICBpZiAodGhpcy51c2luZ0dTQVApIFR3ZWVuTGl0ZS50aWNrZXIucmVtb3ZlRXZlbnRMaXN0ZW5lcigndGljaycsIHRoaXMucmVuZGVySGFuZGxlcik7ZWxzZSBjYW5jZWxBbmltYXRpb25GcmFtZSh0aGlzLmFuaW1hdGlvbkZyYW1lKTtcbiAgICB0aGlzLnJlbmRlcmVyLmNsZWFyKCk7XG4gICAgdGhpcy51c2luZ0dTQVAgPSBmYWxzZTtcbiAgfTtcblxuICBSZW5kZXJlci5wcm90b3R5cGUuY2hlY2tHU0FQU2NyaXB0TG9hZGVkID0gZnVuY3Rpb24gY2hlY2tHU0FQU2NyaXB0TG9hZGVkKCkge1xuICAgIGlmICh0eXBlb2YgVHdlZW5MaXRlID09PSAndW5kZWZpbmVkJykge1xuICAgICAgdmFyIG1zZyA9ICdNb2R1bGFyVEhSRUUgRXJyb3I6IEdTQVAgbm90IGxvYWRlZC5cXG4nO1xuICAgICAgbXNnICs9ICdBdHRlbXB0aW5nIHRvIHVzZSBUSFJFRSBmb3IgYW5pbWF0aW9uLlxcbic7XG4gICAgICBtc2cgKz0gJ0lmIHlvdSBkbyBub3Qgd2lzaCB0byB1c2UgR1NBUCBzZXQgcmVuZGVyZXJTcGVjLnVzZUdTQVAgPSBmYWxzZVxcbic7XG4gICAgICBtc2cgKz0gJ090aGVyd2lzZSB0cnkgYWRkaW5nIDxzY3JpcHQgc3JjPVwiaHR0cHM6Ly9jZG5qcy5jbG91ZGZsYXJlLmNvbS9hamF4L2xpYnMvZ3NhcC8xLjE5LjAvVHdlZW5NYXgubWluLmpzXCI+JztcbiAgICAgIG1zZyArPSAnPC9zY3JpcHQ+IHRvIHlvdXIgPGhlYWQ+JztcbiAgICAgIGNvbnNvbGUuZXJyb3IobXNnKTtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgcmV0dXJuIHRydWU7XG4gIH07XG5cbiAgcmV0dXJuIFJlbmRlcmVyO1xufSgpO1xuXG4vLyAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuLy8gIENBTUVSQSBDTEFTU1xuLy9cbi8vICBVc2VkIGJ5IFNjZW5lIGNsYXNzIC0gZWFjaCBzY2VuZSB3aWxsIGhhdmUgYW4gYXNzb2NpYXRlZCBjYW1lcmEgY2xhc3Ncbi8vXG4vLyAgVGhlIGZvbGxvd2luZyBzcGVjIGlzIG9wdGlvbmFsIGFuZCBjYW4gYmUgb21pdHRlZCBmb3IgdGhlIGRlZmF1bHRzIHNob3duXG4vLyAgY29uc3QgY2FtZXJhU3BlYyA9IHtcbi8vICAgIHR5cGU6ICdQZXJzcGVjdGl2ZUNhbWVyYScsIC8vT3IgJ09ydGhvZ3JhcGhpY0NhbWVyYSdcbi8vICAgIG5lYXI6IDEwLFxuLy8gICAgZmFyOiAtMTAsXG4vLyAgICBwb3NpdGlvbjogbmV3IFRIUkVFLlZlY3RvcjMoMCwgMCwgMTAwKSxcbi8vICAgIC8vUGVyc3BlY3RpdmVDYW1lcmEgb25seVxuLy8gICAgZm92OiA0NSwgLy9QZXJzcGVjdGl2ZUNhbWVyYSBvbmx5XG4vLyAgICBhc3BlY3Q6IHdpbmRvdy5pbm5lcldpZHRoIC8gd2luZG93LmlubmVySGVpZ2h0LFxuLy8gICAgLy8gT3J0aG9ncmFwaGljQ2FtZXJhIG9ubHlcbi8vICAgIHdpZHRoOiB3aW5kb3cuaW5uZXJXaWR0aCxcbi8vICAgIGhlaWdodDogd2luZG93LmlubmVySGVpZ2h0LFxuLy8gIH07XG52YXIgQ2FtZXJhID0gZnVuY3Rpb24gKCkge1xuICBmdW5jdGlvbiBDYW1lcmEoc3BlYykge1xuICAgIGNsYXNzQ2FsbENoZWNrKHRoaXMsIENhbWVyYSk7XG5cbiAgICB0aGlzLnNwZWMgPSBzcGVjIHx8IHt9O1xuICAgIHRoaXMuaW5pdCgpO1xuICB9XG5cbiAgQ2FtZXJhLnByb3RvdHlwZS5pbml0ID0gZnVuY3Rpb24gaW5pdCgpIHtcbiAgICB0aGlzLmluaXRQYXJhbXMoKTtcblxuICAgIGlmICh0aGlzLnNwZWMudHlwZSA9PT0gJ1BlcnNwZWN0aXZlQ2FtZXJhJykge1xuICAgICAgdGhpcy5jYW0gPSBuZXcgVEhSRUUuUGVyc3BlY3RpdmVDYW1lcmEoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5jYW0gPSBuZXcgVEhSRUUuT3J0aG9ncmFwaGljQ2FtZXJhKCk7XG4gICAgfVxuICAgIHRoaXMuc2V0KCk7XG4gIH07XG5cbiAgQ2FtZXJhLnByb3RvdHlwZS5pbml0UGFyYW1zID0gZnVuY3Rpb24gaW5pdFBhcmFtcygpIHtcbiAgICB2YXIgcG9zaXRpb24gPSBmdW5jdGlvbiAoKSB7XG4gICAgICByZXR1cm4gbmV3IFRIUkVFLlZlY3RvcjMoKTtcbiAgICB9O1xuICAgIHRoaXMuc3BlYy5wb3NpdGlvbiA9IHRoaXMuc3BlYy5wb3NpdGlvbiB8fCBwb3NpdGlvbjtcbiAgICB0aGlzLnNwZWMubmVhciA9IHRoaXMuc3BlYy5uZWFyIHx8IDEwO1xuICAgIHRoaXMuc3BlYy5mYXIgPSB0aGlzLnNwZWMuZmFyIHx8IC0xMDtcbiAgICB0aGlzLnNwZWMudHlwZSA9IHRoaXMuc3BlYy50eXBlIHx8ICdQZXJzcGVjdGl2ZUNhbWVyYSc7XG4gICAgaWYgKHRoaXMuc3BlYy50eXBlID09PSAnUGVyc3BlY3RpdmVDYW1lcmEnKSB7XG4gICAgICB0aGlzLnNwZWMuZm92ID0gdGhpcy5zcGVjLmZvdiB8fCA0NTtcbiAgICAgIHZhciBhc3BlY3QgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiB3aW5kb3cuaW5uZXJXaWR0aCAvIHdpbmRvdy5pbm5lckhlaWdodDtcbiAgICAgIH07XG4gICAgICB0aGlzLnNwZWMuYXNwZWN0ID0gdGhpcy5zcGVjLmFzcGVjdCB8fCBhc3BlY3Q7XG4gICAgfSBlbHNlIHtcbiAgICAgIHZhciB3ID0gZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gd2luZG93LmlubmVyV2lkdGg7XG4gICAgICB9O1xuICAgICAgdGhpcy5zcGVjLndpZHRoID0gdGhpcy5zcGVjLndpZHRoIHx8IHc7XG4gICAgICB2YXIgaCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIHdpbmRvdy5pbm5lckhlaWdodDtcbiAgICAgIH07XG4gICAgICB0aGlzLnNwZWMuaGVpZ2h0ID0gdGhpcy5zcGVjLmhlaWdodCB8fCBoO1xuICAgIH1cbiAgfTtcblxuICBDYW1lcmEucHJvdG90eXBlLnNldCA9IGZ1bmN0aW9uIHNldCgpIHtcbiAgICBpZiAodGhpcy5zcGVjLnR5cGUgPT09ICdQZXJzcGVjdGl2ZUNhbWVyYScpIHtcbiAgICAgIHRoaXMuY2FtLmZvdiA9IHRoaXMuc3BlYy5mb3Y7XG4gICAgICB0aGlzLmNhbS5hc3BlY3QgPSB0aGlzLnNwZWMuYXNwZWN0KCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuY2FtLmxlZnQgPSAtdGhpcy5zcGVjLndpZHRoKCkgLyAyO1xuICAgICAgdGhpcy5jYW0ucmlnaHQgPSB0aGlzLnNwZWMud2lkdGgoKSAvIDI7XG4gICAgICB0aGlzLmNhbS50b3AgPSB0aGlzLnNwZWMuaGVpZ2h0KCkgLyAyO1xuICAgICAgdGhpcy5jYW0uYm90dG9tID0gLXRoaXMuc3BlYy5oZWlnaHQoKSAvIDI7XG4gICAgfVxuICAgIHRoaXMuY2FtLnBvc2l0aW9uLmNvcHkodGhpcy5zcGVjLnBvc2l0aW9uKTtcbiAgICB0aGlzLmNhbS5uZWFyID0gdGhpcy5zcGVjLm5lYXI7XG4gICAgdGhpcy5jYW0uZmFyID0gdGhpcy5zcGVjLmZhcjtcbiAgICB0aGlzLmNhbS51cGRhdGVQcm9qZWN0aW9uTWF0cml4KCk7XG4gIH07XG5cbiAgQ2FtZXJhLnByb3RvdHlwZS5lbmFibGVMYXllciA9IGZ1bmN0aW9uIGVuYWJsZUxheWVyKG4pIHtcbiAgICB0aGlzLmNhbS5sYXllcnMuZW5hYmxlKG4pO1xuICB9O1xuXG4gIENhbWVyYS5wcm90b3R5cGUuZGlzYWJsZUxheWVyID0gZnVuY3Rpb24gZGlzYWJsZUxheWVyKG4pIHtcbiAgICB0aGlzLmNhbS5sYXllcnMuZGlzYWJsZShuKTtcbiAgfTtcblxuICBDYW1lcmEucHJvdG90eXBlLnRvZ2dsZUxheWVyID0gZnVuY3Rpb24gdG9nZ2xlTGF5ZXIobikge1xuICAgIHRoaXMuY2FtLmxheWVycy50b2dnbGUobik7XG4gIH07XG5cbiAgcmV0dXJuIENhbWVyYTtcbn0oKTtcblxuLy8gKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbi8vICBTQ0VORSBDTEFTU1xuLy9cbi8vICBUSFJFRS5qcyBzY2VuZSBpcyB1c2VkIGJ5IERSQVdJTkcgY2xhc3Nlc1xuLy9cbi8vICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG52YXIgU2NlbmUgPSBmdW5jdGlvbiAoKSB7XG4gIGZ1bmN0aW9uIFNjZW5lKHJlbmRlcmVyU3BlYywgY2FtZXJhU3BlYykge1xuICAgIGNsYXNzQ2FsbENoZWNrKHRoaXMsIFNjZW5lKTtcblxuICAgIHRoaXMucmVuZGVyZXJTcGVjID0gcmVuZGVyZXJTcGVjO1xuICAgIHRoaXMuY2FtZXJhU3BlYyA9IGNhbWVyYVNwZWM7XG4gICAgdGhpcy5pbml0KCk7XG4gIH1cblxuICBTY2VuZS5wcm90b3R5cGUuaW5pdCA9IGZ1bmN0aW9uIGluaXQoKSB7XG4gICAgdGhpcy5zY2VuZSA9IG5ldyBUSFJFRS5TY2VuZSgpO1xuICAgIHRoaXMuY2FtZXJhID0gbmV3IENhbWVyYSh0aGlzLmNhbWVyYVNwZWMpO1xuICAgIHRoaXMuc2NlbmUuYWRkKHRoaXMuY2FtZXJhLmNhbSk7XG4gICAgdGhpcy5yZW5kZXJlciA9IG5ldyBSZW5kZXJlcih0aGlzLnJlbmRlcmVyU3BlYyk7XG4gIH07XG5cbiAgU2NlbmUucHJvdG90eXBlLmFkZCA9IGZ1bmN0aW9uIGFkZCgpIHtcbiAgICBmb3IgKHZhciBfbGVuID0gYXJndW1lbnRzLmxlbmd0aCwgb2JqZWN0cyA9IEFycmF5KF9sZW4pLCBfa2V5ID0gMDsgX2tleSA8IF9sZW47IF9rZXkrKykge1xuICAgICAgb2JqZWN0c1tfa2V5XSA9IGFyZ3VtZW50c1tfa2V5XTtcbiAgICB9XG5cbiAgICBmb3IgKHZhciBfaXRlcmF0b3IgPSBvYmplY3RzLCBfaXNBcnJheSA9IEFycmF5LmlzQXJyYXkoX2l0ZXJhdG9yKSwgX2kgPSAwLCBfaXRlcmF0b3IgPSBfaXNBcnJheSA/IF9pdGVyYXRvciA6IF9pdGVyYXRvcltTeW1ib2wuaXRlcmF0b3JdKCk7Oykge1xuICAgICAgdmFyIF9yZWY7XG5cbiAgICAgIGlmIChfaXNBcnJheSkge1xuICAgICAgICBpZiAoX2kgPj0gX2l0ZXJhdG9yLmxlbmd0aCkgYnJlYWs7XG4gICAgICAgIF9yZWYgPSBfaXRlcmF0b3JbX2krK107XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBfaSA9IF9pdGVyYXRvci5uZXh0KCk7XG4gICAgICAgIGlmIChfaS5kb25lKSBicmVhaztcbiAgICAgICAgX3JlZiA9IF9pLnZhbHVlO1xuICAgICAgfVxuXG4gICAgICB2YXIgb2JqZWN0ID0gX3JlZjtcblxuICAgICAgdGhpcy5zY2VuZS5hZGQob2JqZWN0KTtcbiAgICB9XG4gIH07XG5cbiAgU2NlbmUucHJvdG90eXBlLnJlc2V0ID0gZnVuY3Rpb24gcmVzZXQoKSB7XG4gICAgdGhpcy5jbGVhclNjZW5lKCk7XG4gICAgdGhpcy5jYW1lcmEuc2V0KCk7XG4gICAgdGhpcy5yZW5kZXJlci5zZXRTaXplKCk7XG4gIH07XG5cbiAgU2NlbmUucHJvdG90eXBlLmNsZWFyU2NlbmUgPSBmdW5jdGlvbiBjbGVhclNjZW5lKCkge1xuICAgIGZvciAodmFyIGkgPSB0aGlzLnNjZW5lLmNoaWxkcmVuLmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKSB7XG4gICAgICB0aGlzLnNjZW5lLnJlbW92ZSh0aGlzLnNjZW5lLmNoaWxkcmVuW2ldKTtcbiAgICB9XG4gIH07XG5cbiAgU2NlbmUucHJvdG90eXBlLmNhbmNlbFJlbmRlciA9IGZ1bmN0aW9uIGNhbmNlbFJlbmRlcigpIHtcbiAgICB0aGlzLnJlbmRlcmVyLmNhbmNlbFJlbmRlcigpO1xuICB9O1xuXG4gIFNjZW5lLnByb3RvdHlwZS5yZW5kZXIgPSBmdW5jdGlvbiByZW5kZXIocGVyRnJhbWVGdW5jdGlvbnMpIHtcbiAgICB0aGlzLnJlbmRlcmVyLnJlbmRlcih0aGlzLnNjZW5lLCB0aGlzLmNhbWVyYS5jYW0sIHBlckZyYW1lRnVuY3Rpb25zKTtcbiAgfTtcblxuICByZXR1cm4gU2NlbmU7XG59KCk7XG5cbnZhciB0aHJvdHRsZSA9IHJlcXVpcmUoJ2xvZGFzaC50aHJvdHRsZScpO1xuXG4vL2hvbGQgYSByZWZlcmVuY2UgdG8gYWxsIGRyYXdpbmdzIHNvIHRoYXQgdGhleSBjYW4gYmUgcmVzZXQgZWFzaWx5XG52YXIgZHJhd2luZ3MgPSB7fTtcblxudmFyIHJlc2V0RHJhd2luZ3MgPSBmdW5jdGlvbiAoKSB7XG4gIE9iamVjdC5rZXlzKGRyYXdpbmdzKS5mb3JFYWNoKGZ1bmN0aW9uIChrZXkpIHtcbiAgICBkcmF3aW5nc1trZXldLnJlc2V0KCk7XG4gIH0pO1xufTtcblxud2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3Jlc2l6ZScsIHRocm90dGxlKGZ1bmN0aW9uICgpIHtcbiAgcmVzZXREcmF3aW5ncygpO1xufSwgNTAwKSwgZmFsc2UpO1xuXG4vLyAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuLy9cbi8vICBEUkFXSU5HIENMQVNTXG4vL1xuLy8gKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbnZhciBEcmF3aW5nID0gZnVuY3Rpb24gKCkge1xuICBmdW5jdGlvbiBEcmF3aW5nKHJlbmRlcmVyU3BlYywgY2FtZXJhU3BlYykge1xuICAgIGNsYXNzQ2FsbENoZWNrKHRoaXMsIERyYXdpbmcpO1xuXG4gICAgdGhpcy5zY2VuZSA9IG5ldyBTY2VuZShyZW5kZXJlclNwZWMsIGNhbWVyYVNwZWMpO1xuICAgIHRoaXMuY2FtZXJhID0gdGhpcy5zY2VuZS5jYW1lcmE7XG5cbiAgICB0aGlzLnV1aWQgPSBUSFJFRS5NYXRoLmdlbmVyYXRlVVVJRCgpO1xuICAgIGRyYXdpbmdzW3RoaXMudXVpZF0gPSB0aGlzO1xuXG4gICAgdGhpcy5wZXJGcmFtZUZ1bmN0aW9ucyA9IFtdO1xuXG4gICAgdGhpcy5pbml0KCk7XG4gIH1cblxuICAvL2dldHMgY2FsbGVkIG9uIHdpbmRvdyByZXNpemUgb3Igb3RoZXIgZXZlbnRzIHRoYXQgcmVxdWlyZSByZWNhbGN1bGF0aW9uIG9mXG4gIC8vb2JqZWN0IGRpbWVuc2lvbnNcblxuXG4gIERyYXdpbmcucHJvdG90eXBlLnJlc2V0ID0gZnVuY3Rpb24gcmVzZXQoKSB7XG4gICAgdGhpcy5zY2VuZS5yZXNldCgpO1xuICAgIHRoaXMuaW5pdCgpO1xuICB9O1xuXG4gIERyYXdpbmcucHJvdG90eXBlLnJlbmRlciA9IGZ1bmN0aW9uIHJlbmRlcigpIHtcbiAgICB0aGlzLnNjZW5lLnJlbmRlcih0aGlzLnBlckZyYW1lRnVuY3Rpb25zKTtcbiAgfTtcblxuICBEcmF3aW5nLnByb3RvdHlwZS5jYW5jZWxSZW5kZXIgPSBmdW5jdGlvbiBjYW5jZWxSZW5kZXIoKSB7XG4gICAgdGhpcy5zY2VuZS5yZW5kZXJlci5jYW5jZWxSZW5kZXIoKTtcbiAgfTtcblxuICByZXR1cm4gRHJhd2luZztcbn0oKTtcblxuLy8gKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbi8vIFBlcmZvcm0gdmFyaW91cyBpbml0aWFsaXNhdGlvbiBjaGVja3MgYW5kIHNldHVwXG4vLyAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxudmFyIG1vZHVsZU5hbWUgPSAndW5uYW1lZFRIUkVFU2V0dXBNb2R1bGUnO1xuLy9UT0RPOiB0dXJuIGNoZWNrIGZ1bmN0aW9ucyBpbnRvIHByb3BlciBjaGVja3NcbnZhciBjaGVja1RIUkVFTG9hZGVkID0gZnVuY3Rpb24gKCkge1xuICBpZiAodHlwZW9mIFRIUkVFID09PSAndW5kZWZpbmVkJykge1xuICAgIHZhciBtc2cgPSBtb2R1bGVOYW1lICsgJyBFcnJvcjogVEhSRUUgbm90IGxvYWRlZC4gVEhSRUUuanMgbXVzdCBiZSBsb2FkZWQgYmVmb3JlIHRoaXMgbW9kdWxlXFxuJztcbiAgICBtc2cgKz0gJ1RyeSBhZGRpbmcgPHNjcmlwdCBzcmM9XCJodHRwczovL2NkbmpzLmNsb3VkZmxhcmUuY29tL2FqYXgvbGlicy90aHJlZS5qcy9yNzkvdGhyZWUubWluLmpzXCI+JztcbiAgICBtc2cgKz0gJzwvc2NyaXB0PiB0byB5b3VyIDxoZWFkPic7XG4gICAgY29uc29sZS5lcnJvcihtc2cpO1xuICB9XG59O1xuXG5jaGVja1RIUkVFTG9hZGVkKCk7XG5cbnZhciBjaGVja0hlYXJ0Y29kZUxvYWRlZCA9IGZ1bmN0aW9uICgpIHtcbiAgaWYgKHR5cGVvZiBDYW52YXNMb2FkZXIgPT09ICd1bmRlZmluZWQnKSB7XG4gICAgdmFyIG1zZyA9IG1vZHVsZU5hbWUgKyAnIEVycm9yOiBIZWFydGNvZGVMb2FkZXIgbm90IGxvYWRlZC5cXG4nO1xuICAgIG1zZyArPSAnSWYgeW91IGRvIG5vdCB3aXNoIHRvIHVzZSBIZWFydGNvZGVMb2FkZXIgc2V0ICcgKyBtb2R1bGVOYW1lICsgJy5jb25maWcudXNlSGVhcnRjb2RlTG9hZGVyID0gZmFsc2VcXG4nO1xuICAgIG1zZyArPSAnT3RoZXJ3aXNlIGdldCBodHRwczovL3Jhdy5naXRodWJ1c2VyY29udGVudC5jb20vaGVhcnRjb2RlLyc7XG4gICAgbXNnICs9ICdDYW52YXNMb2FkZXIvbWFzdGVyL2pzL2hlYXJ0Y29kZS1jYW52YXNsb2FkZXItbWluLmpzXFxuJztcbiAgICBtc2cgKz0gJ2FuZCBhZGQgPHNjcmlwdCBzcmM9XCJwYXRoLXRvLXNjcmlwdC9oZWFydGNvZGUtY2FudmFzbG9hZGVyLW1pbi5qc1wiPic7XG4gICAgbXNnICs9ICc8L3NjcmlwdD4gdG8geW91ciA8aGVhZD4nO1xuICAgIGNvbnNvbGUuZXJyb3IobXNnKTtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbiAgcmV0dXJuIHRydWU7XG59O1xuXG52YXIgY2hlY2tTdGF0c0xvYWRlZCA9IGZ1bmN0aW9uICgpIHtcbiAgaWYgKHR5cGVvZiBTdGF0cyA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICB2YXIgbXNnID0gbW9kdWxlTmFtZSArICcgRXJyb3I6IFN0YXRzIG5vdCBsb2FkZWQuXFxuJztcbiAgICBtc2cgKz0gJ0lmIHlvdSBkbyBub3Qgd2lzaCB0byBzaG93IFN0YXRzIHNldCAnICsgbW9kdWxlTmFtZSArICcuY29uZmlnLnNob3dTdGF0cyA9IGZhbHNlXFxuJztcbiAgICBtc2cgKz0gJ090aGVyd2lzZSBnZXQgaHR0cHM6Ly9yYXcuZ2l0aHVidXNlcmNvbnRlbnQuY29tL21yZG9vYi9zdGF0cy5qcy9tYXN0ZXIvYnVpbGQvc3RhdHMubWluLmpzXFxuJztcbiAgICBtc2cgKz0gJ2FuZCBhZGQgPHNjcmlwdCBzcmM9XCJwYXRoLXRvLXNjcmlwdC9zdGF0cy5taW4uanNcIj4nO1xuICAgIG1zZyArPSAnPC9zY3JpcHQ+IHRvIHlvdXIgPGhlYWQ+JztcbiAgICBjb25zb2xlLmVycm9yKG1zZyk7XG4gICAgY29uZmlnLnNob3dTdGF0cyA9IGZhbHNlO1xuICB9XG59O1xuXG52YXIgaW5pdCA9IGZ1bmN0aW9uICgpIHtcbiAgaWYgKGNvbmZpZy5zaG93SGVhcnRjb2RlTG9hZGVyKSB7XG4gICAgaWYgKGNoZWNrSGVhcnRjb2RlTG9hZGVkKCkpIHtcbiAgICAgIGluaXRIZWFydGNvZGVMb2FkZXIoKTtcbiAgICB9XG4gIH1cblxuICBpZiAoY29uZmlnLnNob3dTdGF0cykgY2hlY2tTdGF0c0xvYWRlZCgpO1xuXG4gIGNvbmZpZy5pbml0Q2FsbGVkID0gdHJ1ZTtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICBpbml0OiBpbml0LFxuICBjb25maWc6IGNvbmZpZyxcbiAgTWVzaE9iamVjdDogTWVzaE9iamVjdCxcbiAgRHJhd2luZzogRHJhd2luZ1xufTsiLCIvKipcbiAqIGxvZGFzaCAoQ3VzdG9tIEJ1aWxkKSA8aHR0cHM6Ly9sb2Rhc2guY29tLz5cbiAqIEJ1aWxkOiBgbG9kYXNoIG1vZHVsYXJpemUgZXhwb3J0cz1cIm5wbVwiIC1vIC4vYFxuICogQ29weXJpZ2h0IGpRdWVyeSBGb3VuZGF0aW9uIGFuZCBvdGhlciBjb250cmlidXRvcnMgPGh0dHBzOi8vanF1ZXJ5Lm9yZy8+XG4gKiBSZWxlYXNlZCB1bmRlciBNSVQgbGljZW5zZSA8aHR0cHM6Ly9sb2Rhc2guY29tL2xpY2Vuc2U+XG4gKiBCYXNlZCBvbiBVbmRlcnNjb3JlLmpzIDEuOC4zIDxodHRwOi8vdW5kZXJzY29yZWpzLm9yZy9MSUNFTlNFPlxuICogQ29weXJpZ2h0IEplcmVteSBBc2hrZW5hcywgRG9jdW1lbnRDbG91ZCBhbmQgSW52ZXN0aWdhdGl2ZSBSZXBvcnRlcnMgJiBFZGl0b3JzXG4gKi9cblxuLyoqIFVzZWQgYXMgdGhlIGBUeXBlRXJyb3JgIG1lc3NhZ2UgZm9yIFwiRnVuY3Rpb25zXCIgbWV0aG9kcy4gKi9cbnZhciBGVU5DX0VSUk9SX1RFWFQgPSAnRXhwZWN0ZWQgYSBmdW5jdGlvbic7XG5cbi8qKiBVc2VkIGFzIHJlZmVyZW5jZXMgZm9yIHZhcmlvdXMgYE51bWJlcmAgY29uc3RhbnRzLiAqL1xudmFyIE5BTiA9IDAgLyAwO1xuXG4vKiogYE9iamVjdCN0b1N0cmluZ2AgcmVzdWx0IHJlZmVyZW5jZXMuICovXG52YXIgc3ltYm9sVGFnID0gJ1tvYmplY3QgU3ltYm9sXSc7XG5cbi8qKiBVc2VkIHRvIG1hdGNoIGxlYWRpbmcgYW5kIHRyYWlsaW5nIHdoaXRlc3BhY2UuICovXG52YXIgcmVUcmltID0gL15cXHMrfFxccyskL2c7XG5cbi8qKiBVc2VkIHRvIGRldGVjdCBiYWQgc2lnbmVkIGhleGFkZWNpbWFsIHN0cmluZyB2YWx1ZXMuICovXG52YXIgcmVJc0JhZEhleCA9IC9eWy0rXTB4WzAtOWEtZl0rJC9pO1xuXG4vKiogVXNlZCB0byBkZXRlY3QgYmluYXJ5IHN0cmluZyB2YWx1ZXMuICovXG52YXIgcmVJc0JpbmFyeSA9IC9eMGJbMDFdKyQvaTtcblxuLyoqIFVzZWQgdG8gZGV0ZWN0IG9jdGFsIHN0cmluZyB2YWx1ZXMuICovXG52YXIgcmVJc09jdGFsID0gL14wb1swLTddKyQvaTtcblxuLyoqIEJ1aWx0LWluIG1ldGhvZCByZWZlcmVuY2VzIHdpdGhvdXQgYSBkZXBlbmRlbmN5IG9uIGByb290YC4gKi9cbnZhciBmcmVlUGFyc2VJbnQgPSBwYXJzZUludDtcblxuLyoqIERldGVjdCBmcmVlIHZhcmlhYmxlIGBnbG9iYWxgIGZyb20gTm9kZS5qcy4gKi9cbnZhciBmcmVlR2xvYmFsID0gdHlwZW9mIGdsb2JhbCA9PSAnb2JqZWN0JyAmJiBnbG9iYWwgJiYgZ2xvYmFsLk9iamVjdCA9PT0gT2JqZWN0ICYmIGdsb2JhbDtcblxuLyoqIERldGVjdCBmcmVlIHZhcmlhYmxlIGBzZWxmYC4gKi9cbnZhciBmcmVlU2VsZiA9IHR5cGVvZiBzZWxmID09ICdvYmplY3QnICYmIHNlbGYgJiYgc2VsZi5PYmplY3QgPT09IE9iamVjdCAmJiBzZWxmO1xuXG4vKiogVXNlZCBhcyBhIHJlZmVyZW5jZSB0byB0aGUgZ2xvYmFsIG9iamVjdC4gKi9cbnZhciByb290ID0gZnJlZUdsb2JhbCB8fCBmcmVlU2VsZiB8fCBGdW5jdGlvbigncmV0dXJuIHRoaXMnKSgpO1xuXG4vKiogVXNlZCBmb3IgYnVpbHQtaW4gbWV0aG9kIHJlZmVyZW5jZXMuICovXG52YXIgb2JqZWN0UHJvdG8gPSBPYmplY3QucHJvdG90eXBlO1xuXG4vKipcbiAqIFVzZWQgdG8gcmVzb2x2ZSB0aGVcbiAqIFtgdG9TdHJpbmdUYWdgXShodHRwOi8vZWNtYS1pbnRlcm5hdGlvbmFsLm9yZy9lY21hLTI2Mi83LjAvI3NlYy1vYmplY3QucHJvdG90eXBlLnRvc3RyaW5nKVxuICogb2YgdmFsdWVzLlxuICovXG52YXIgb2JqZWN0VG9TdHJpbmcgPSBvYmplY3RQcm90by50b1N0cmluZztcblxuLyogQnVpbHQtaW4gbWV0aG9kIHJlZmVyZW5jZXMgZm9yIHRob3NlIHdpdGggdGhlIHNhbWUgbmFtZSBhcyBvdGhlciBgbG9kYXNoYCBtZXRob2RzLiAqL1xudmFyIG5hdGl2ZU1heCA9IE1hdGgubWF4LFxuICAgIG5hdGl2ZU1pbiA9IE1hdGgubWluO1xuXG4vKipcbiAqIEdldHMgdGhlIHRpbWVzdGFtcCBvZiB0aGUgbnVtYmVyIG9mIG1pbGxpc2Vjb25kcyB0aGF0IGhhdmUgZWxhcHNlZCBzaW5jZVxuICogdGhlIFVuaXggZXBvY2ggKDEgSmFudWFyeSAxOTcwIDAwOjAwOjAwIFVUQykuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBzaW5jZSAyLjQuMFxuICogQGNhdGVnb3J5IERhdGVcbiAqIEByZXR1cm5zIHtudW1iZXJ9IFJldHVybnMgdGhlIHRpbWVzdGFtcC5cbiAqIEBleGFtcGxlXG4gKlxuICogXy5kZWZlcihmdW5jdGlvbihzdGFtcCkge1xuICogICBjb25zb2xlLmxvZyhfLm5vdygpIC0gc3RhbXApO1xuICogfSwgXy5ub3coKSk7XG4gKiAvLyA9PiBMb2dzIHRoZSBudW1iZXIgb2YgbWlsbGlzZWNvbmRzIGl0IHRvb2sgZm9yIHRoZSBkZWZlcnJlZCBpbnZvY2F0aW9uLlxuICovXG52YXIgbm93ID0gZnVuY3Rpb24oKSB7XG4gIHJldHVybiByb290LkRhdGUubm93KCk7XG59O1xuXG4vKipcbiAqIENyZWF0ZXMgYSBkZWJvdW5jZWQgZnVuY3Rpb24gdGhhdCBkZWxheXMgaW52b2tpbmcgYGZ1bmNgIHVudGlsIGFmdGVyIGB3YWl0YFxuICogbWlsbGlzZWNvbmRzIGhhdmUgZWxhcHNlZCBzaW5jZSB0aGUgbGFzdCB0aW1lIHRoZSBkZWJvdW5jZWQgZnVuY3Rpb24gd2FzXG4gKiBpbnZva2VkLiBUaGUgZGVib3VuY2VkIGZ1bmN0aW9uIGNvbWVzIHdpdGggYSBgY2FuY2VsYCBtZXRob2QgdG8gY2FuY2VsXG4gKiBkZWxheWVkIGBmdW5jYCBpbnZvY2F0aW9ucyBhbmQgYSBgZmx1c2hgIG1ldGhvZCB0byBpbW1lZGlhdGVseSBpbnZva2UgdGhlbS5cbiAqIFByb3ZpZGUgYG9wdGlvbnNgIHRvIGluZGljYXRlIHdoZXRoZXIgYGZ1bmNgIHNob3VsZCBiZSBpbnZva2VkIG9uIHRoZVxuICogbGVhZGluZyBhbmQvb3IgdHJhaWxpbmcgZWRnZSBvZiB0aGUgYHdhaXRgIHRpbWVvdXQuIFRoZSBgZnVuY2AgaXMgaW52b2tlZFxuICogd2l0aCB0aGUgbGFzdCBhcmd1bWVudHMgcHJvdmlkZWQgdG8gdGhlIGRlYm91bmNlZCBmdW5jdGlvbi4gU3Vic2VxdWVudFxuICogY2FsbHMgdG8gdGhlIGRlYm91bmNlZCBmdW5jdGlvbiByZXR1cm4gdGhlIHJlc3VsdCBvZiB0aGUgbGFzdCBgZnVuY2BcbiAqIGludm9jYXRpb24uXG4gKlxuICogKipOb3RlOioqIElmIGBsZWFkaW5nYCBhbmQgYHRyYWlsaW5nYCBvcHRpb25zIGFyZSBgdHJ1ZWAsIGBmdW5jYCBpc1xuICogaW52b2tlZCBvbiB0aGUgdHJhaWxpbmcgZWRnZSBvZiB0aGUgdGltZW91dCBvbmx5IGlmIHRoZSBkZWJvdW5jZWQgZnVuY3Rpb25cbiAqIGlzIGludm9rZWQgbW9yZSB0aGFuIG9uY2UgZHVyaW5nIHRoZSBgd2FpdGAgdGltZW91dC5cbiAqXG4gKiBJZiBgd2FpdGAgaXMgYDBgIGFuZCBgbGVhZGluZ2AgaXMgYGZhbHNlYCwgYGZ1bmNgIGludm9jYXRpb24gaXMgZGVmZXJyZWRcbiAqIHVudGlsIHRvIHRoZSBuZXh0IHRpY2ssIHNpbWlsYXIgdG8gYHNldFRpbWVvdXRgIHdpdGggYSB0aW1lb3V0IG9mIGAwYC5cbiAqXG4gKiBTZWUgW0RhdmlkIENvcmJhY2hvJ3MgYXJ0aWNsZV0oaHR0cHM6Ly9jc3MtdHJpY2tzLmNvbS9kZWJvdW5jaW5nLXRocm90dGxpbmctZXhwbGFpbmVkLWV4YW1wbGVzLylcbiAqIGZvciBkZXRhaWxzIG92ZXIgdGhlIGRpZmZlcmVuY2VzIGJldHdlZW4gYF8uZGVib3VuY2VgIGFuZCBgXy50aHJvdHRsZWAuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBzaW5jZSAwLjEuMFxuICogQGNhdGVnb3J5IEZ1bmN0aW9uXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBmdW5jIFRoZSBmdW5jdGlvbiB0byBkZWJvdW5jZS5cbiAqIEBwYXJhbSB7bnVtYmVyfSBbd2FpdD0wXSBUaGUgbnVtYmVyIG9mIG1pbGxpc2Vjb25kcyB0byBkZWxheS5cbiAqIEBwYXJhbSB7T2JqZWN0fSBbb3B0aW9ucz17fV0gVGhlIG9wdGlvbnMgb2JqZWN0LlxuICogQHBhcmFtIHtib29sZWFufSBbb3B0aW9ucy5sZWFkaW5nPWZhbHNlXVxuICogIFNwZWNpZnkgaW52b2tpbmcgb24gdGhlIGxlYWRpbmcgZWRnZSBvZiB0aGUgdGltZW91dC5cbiAqIEBwYXJhbSB7bnVtYmVyfSBbb3B0aW9ucy5tYXhXYWl0XVxuICogIFRoZSBtYXhpbXVtIHRpbWUgYGZ1bmNgIGlzIGFsbG93ZWQgdG8gYmUgZGVsYXllZCBiZWZvcmUgaXQncyBpbnZva2VkLlxuICogQHBhcmFtIHtib29sZWFufSBbb3B0aW9ucy50cmFpbGluZz10cnVlXVxuICogIFNwZWNpZnkgaW52b2tpbmcgb24gdGhlIHRyYWlsaW5nIGVkZ2Ugb2YgdGhlIHRpbWVvdXQuXG4gKiBAcmV0dXJucyB7RnVuY3Rpb259IFJldHVybnMgdGhlIG5ldyBkZWJvdW5jZWQgZnVuY3Rpb24uXG4gKiBAZXhhbXBsZVxuICpcbiAqIC8vIEF2b2lkIGNvc3RseSBjYWxjdWxhdGlvbnMgd2hpbGUgdGhlIHdpbmRvdyBzaXplIGlzIGluIGZsdXguXG4gKiBqUXVlcnkod2luZG93KS5vbigncmVzaXplJywgXy5kZWJvdW5jZShjYWxjdWxhdGVMYXlvdXQsIDE1MCkpO1xuICpcbiAqIC8vIEludm9rZSBgc2VuZE1haWxgIHdoZW4gY2xpY2tlZCwgZGVib3VuY2luZyBzdWJzZXF1ZW50IGNhbGxzLlxuICogalF1ZXJ5KGVsZW1lbnQpLm9uKCdjbGljaycsIF8uZGVib3VuY2Uoc2VuZE1haWwsIDMwMCwge1xuICogICAnbGVhZGluZyc6IHRydWUsXG4gKiAgICd0cmFpbGluZyc6IGZhbHNlXG4gKiB9KSk7XG4gKlxuICogLy8gRW5zdXJlIGBiYXRjaExvZ2AgaXMgaW52b2tlZCBvbmNlIGFmdGVyIDEgc2Vjb25kIG9mIGRlYm91bmNlZCBjYWxscy5cbiAqIHZhciBkZWJvdW5jZWQgPSBfLmRlYm91bmNlKGJhdGNoTG9nLCAyNTAsIHsgJ21heFdhaXQnOiAxMDAwIH0pO1xuICogdmFyIHNvdXJjZSA9IG5ldyBFdmVudFNvdXJjZSgnL3N0cmVhbScpO1xuICogalF1ZXJ5KHNvdXJjZSkub24oJ21lc3NhZ2UnLCBkZWJvdW5jZWQpO1xuICpcbiAqIC8vIENhbmNlbCB0aGUgdHJhaWxpbmcgZGVib3VuY2VkIGludm9jYXRpb24uXG4gKiBqUXVlcnkod2luZG93KS5vbigncG9wc3RhdGUnLCBkZWJvdW5jZWQuY2FuY2VsKTtcbiAqL1xuZnVuY3Rpb24gZGVib3VuY2UoZnVuYywgd2FpdCwgb3B0aW9ucykge1xuICB2YXIgbGFzdEFyZ3MsXG4gICAgICBsYXN0VGhpcyxcbiAgICAgIG1heFdhaXQsXG4gICAgICByZXN1bHQsXG4gICAgICB0aW1lcklkLFxuICAgICAgbGFzdENhbGxUaW1lLFxuICAgICAgbGFzdEludm9rZVRpbWUgPSAwLFxuICAgICAgbGVhZGluZyA9IGZhbHNlLFxuICAgICAgbWF4aW5nID0gZmFsc2UsXG4gICAgICB0cmFpbGluZyA9IHRydWU7XG5cbiAgaWYgKHR5cGVvZiBmdW5jICE9ICdmdW5jdGlvbicpIHtcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKEZVTkNfRVJST1JfVEVYVCk7XG4gIH1cbiAgd2FpdCA9IHRvTnVtYmVyKHdhaXQpIHx8IDA7XG4gIGlmIChpc09iamVjdChvcHRpb25zKSkge1xuICAgIGxlYWRpbmcgPSAhIW9wdGlvbnMubGVhZGluZztcbiAgICBtYXhpbmcgPSAnbWF4V2FpdCcgaW4gb3B0aW9ucztcbiAgICBtYXhXYWl0ID0gbWF4aW5nID8gbmF0aXZlTWF4KHRvTnVtYmVyKG9wdGlvbnMubWF4V2FpdCkgfHwgMCwgd2FpdCkgOiBtYXhXYWl0O1xuICAgIHRyYWlsaW5nID0gJ3RyYWlsaW5nJyBpbiBvcHRpb25zID8gISFvcHRpb25zLnRyYWlsaW5nIDogdHJhaWxpbmc7XG4gIH1cblxuICBmdW5jdGlvbiBpbnZva2VGdW5jKHRpbWUpIHtcbiAgICB2YXIgYXJncyA9IGxhc3RBcmdzLFxuICAgICAgICB0aGlzQXJnID0gbGFzdFRoaXM7XG5cbiAgICBsYXN0QXJncyA9IGxhc3RUaGlzID0gdW5kZWZpbmVkO1xuICAgIGxhc3RJbnZva2VUaW1lID0gdGltZTtcbiAgICByZXN1bHQgPSBmdW5jLmFwcGx5KHRoaXNBcmcsIGFyZ3MpO1xuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cblxuICBmdW5jdGlvbiBsZWFkaW5nRWRnZSh0aW1lKSB7XG4gICAgLy8gUmVzZXQgYW55IGBtYXhXYWl0YCB0aW1lci5cbiAgICBsYXN0SW52b2tlVGltZSA9IHRpbWU7XG4gICAgLy8gU3RhcnQgdGhlIHRpbWVyIGZvciB0aGUgdHJhaWxpbmcgZWRnZS5cbiAgICB0aW1lcklkID0gc2V0VGltZW91dCh0aW1lckV4cGlyZWQsIHdhaXQpO1xuICAgIC8vIEludm9rZSB0aGUgbGVhZGluZyBlZGdlLlxuICAgIHJldHVybiBsZWFkaW5nID8gaW52b2tlRnVuYyh0aW1lKSA6IHJlc3VsdDtcbiAgfVxuXG4gIGZ1bmN0aW9uIHJlbWFpbmluZ1dhaXQodGltZSkge1xuICAgIHZhciB0aW1lU2luY2VMYXN0Q2FsbCA9IHRpbWUgLSBsYXN0Q2FsbFRpbWUsXG4gICAgICAgIHRpbWVTaW5jZUxhc3RJbnZva2UgPSB0aW1lIC0gbGFzdEludm9rZVRpbWUsXG4gICAgICAgIHJlc3VsdCA9IHdhaXQgLSB0aW1lU2luY2VMYXN0Q2FsbDtcblxuICAgIHJldHVybiBtYXhpbmcgPyBuYXRpdmVNaW4ocmVzdWx0LCBtYXhXYWl0IC0gdGltZVNpbmNlTGFzdEludm9rZSkgOiByZXN1bHQ7XG4gIH1cblxuICBmdW5jdGlvbiBzaG91bGRJbnZva2UodGltZSkge1xuICAgIHZhciB0aW1lU2luY2VMYXN0Q2FsbCA9IHRpbWUgLSBsYXN0Q2FsbFRpbWUsXG4gICAgICAgIHRpbWVTaW5jZUxhc3RJbnZva2UgPSB0aW1lIC0gbGFzdEludm9rZVRpbWU7XG5cbiAgICAvLyBFaXRoZXIgdGhpcyBpcyB0aGUgZmlyc3QgY2FsbCwgYWN0aXZpdHkgaGFzIHN0b3BwZWQgYW5kIHdlJ3JlIGF0IHRoZVxuICAgIC8vIHRyYWlsaW5nIGVkZ2UsIHRoZSBzeXN0ZW0gdGltZSBoYXMgZ29uZSBiYWNrd2FyZHMgYW5kIHdlJ3JlIHRyZWF0aW5nXG4gICAgLy8gaXQgYXMgdGhlIHRyYWlsaW5nIGVkZ2UsIG9yIHdlJ3ZlIGhpdCB0aGUgYG1heFdhaXRgIGxpbWl0LlxuICAgIHJldHVybiAobGFzdENhbGxUaW1lID09PSB1bmRlZmluZWQgfHwgKHRpbWVTaW5jZUxhc3RDYWxsID49IHdhaXQpIHx8XG4gICAgICAodGltZVNpbmNlTGFzdENhbGwgPCAwKSB8fCAobWF4aW5nICYmIHRpbWVTaW5jZUxhc3RJbnZva2UgPj0gbWF4V2FpdCkpO1xuICB9XG5cbiAgZnVuY3Rpb24gdGltZXJFeHBpcmVkKCkge1xuICAgIHZhciB0aW1lID0gbm93KCk7XG4gICAgaWYgKHNob3VsZEludm9rZSh0aW1lKSkge1xuICAgICAgcmV0dXJuIHRyYWlsaW5nRWRnZSh0aW1lKTtcbiAgICB9XG4gICAgLy8gUmVzdGFydCB0aGUgdGltZXIuXG4gICAgdGltZXJJZCA9IHNldFRpbWVvdXQodGltZXJFeHBpcmVkLCByZW1haW5pbmdXYWl0KHRpbWUpKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHRyYWlsaW5nRWRnZSh0aW1lKSB7XG4gICAgdGltZXJJZCA9IHVuZGVmaW5lZDtcblxuICAgIC8vIE9ubHkgaW52b2tlIGlmIHdlIGhhdmUgYGxhc3RBcmdzYCB3aGljaCBtZWFucyBgZnVuY2AgaGFzIGJlZW5cbiAgICAvLyBkZWJvdW5jZWQgYXQgbGVhc3Qgb25jZS5cbiAgICBpZiAodHJhaWxpbmcgJiYgbGFzdEFyZ3MpIHtcbiAgICAgIHJldHVybiBpbnZva2VGdW5jKHRpbWUpO1xuICAgIH1cbiAgICBsYXN0QXJncyA9IGxhc3RUaGlzID0gdW5kZWZpbmVkO1xuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cblxuICBmdW5jdGlvbiBjYW5jZWwoKSB7XG4gICAgaWYgKHRpbWVySWQgIT09IHVuZGVmaW5lZCkge1xuICAgICAgY2xlYXJUaW1lb3V0KHRpbWVySWQpO1xuICAgIH1cbiAgICBsYXN0SW52b2tlVGltZSA9IDA7XG4gICAgbGFzdEFyZ3MgPSBsYXN0Q2FsbFRpbWUgPSBsYXN0VGhpcyA9IHRpbWVySWQgPSB1bmRlZmluZWQ7XG4gIH1cblxuICBmdW5jdGlvbiBmbHVzaCgpIHtcbiAgICByZXR1cm4gdGltZXJJZCA9PT0gdW5kZWZpbmVkID8gcmVzdWx0IDogdHJhaWxpbmdFZGdlKG5vdygpKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGRlYm91bmNlZCgpIHtcbiAgICB2YXIgdGltZSA9IG5vdygpLFxuICAgICAgICBpc0ludm9raW5nID0gc2hvdWxkSW52b2tlKHRpbWUpO1xuXG4gICAgbGFzdEFyZ3MgPSBhcmd1bWVudHM7XG4gICAgbGFzdFRoaXMgPSB0aGlzO1xuICAgIGxhc3RDYWxsVGltZSA9IHRpbWU7XG5cbiAgICBpZiAoaXNJbnZva2luZykge1xuICAgICAgaWYgKHRpbWVySWQgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICByZXR1cm4gbGVhZGluZ0VkZ2UobGFzdENhbGxUaW1lKTtcbiAgICAgIH1cbiAgICAgIGlmIChtYXhpbmcpIHtcbiAgICAgICAgLy8gSGFuZGxlIGludm9jYXRpb25zIGluIGEgdGlnaHQgbG9vcC5cbiAgICAgICAgdGltZXJJZCA9IHNldFRpbWVvdXQodGltZXJFeHBpcmVkLCB3YWl0KTtcbiAgICAgICAgcmV0dXJuIGludm9rZUZ1bmMobGFzdENhbGxUaW1lKTtcbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKHRpbWVySWQgPT09IHVuZGVmaW5lZCkge1xuICAgICAgdGltZXJJZCA9IHNldFRpbWVvdXQodGltZXJFeHBpcmVkLCB3YWl0KTtcbiAgICB9XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxuICBkZWJvdW5jZWQuY2FuY2VsID0gY2FuY2VsO1xuICBkZWJvdW5jZWQuZmx1c2ggPSBmbHVzaDtcbiAgcmV0dXJuIGRlYm91bmNlZDtcbn1cblxuLyoqXG4gKiBDcmVhdGVzIGEgdGhyb3R0bGVkIGZ1bmN0aW9uIHRoYXQgb25seSBpbnZva2VzIGBmdW5jYCBhdCBtb3N0IG9uY2UgcGVyXG4gKiBldmVyeSBgd2FpdGAgbWlsbGlzZWNvbmRzLiBUaGUgdGhyb3R0bGVkIGZ1bmN0aW9uIGNvbWVzIHdpdGggYSBgY2FuY2VsYFxuICogbWV0aG9kIHRvIGNhbmNlbCBkZWxheWVkIGBmdW5jYCBpbnZvY2F0aW9ucyBhbmQgYSBgZmx1c2hgIG1ldGhvZCB0b1xuICogaW1tZWRpYXRlbHkgaW52b2tlIHRoZW0uIFByb3ZpZGUgYG9wdGlvbnNgIHRvIGluZGljYXRlIHdoZXRoZXIgYGZ1bmNgXG4gKiBzaG91bGQgYmUgaW52b2tlZCBvbiB0aGUgbGVhZGluZyBhbmQvb3IgdHJhaWxpbmcgZWRnZSBvZiB0aGUgYHdhaXRgXG4gKiB0aW1lb3V0LiBUaGUgYGZ1bmNgIGlzIGludm9rZWQgd2l0aCB0aGUgbGFzdCBhcmd1bWVudHMgcHJvdmlkZWQgdG8gdGhlXG4gKiB0aHJvdHRsZWQgZnVuY3Rpb24uIFN1YnNlcXVlbnQgY2FsbHMgdG8gdGhlIHRocm90dGxlZCBmdW5jdGlvbiByZXR1cm4gdGhlXG4gKiByZXN1bHQgb2YgdGhlIGxhc3QgYGZ1bmNgIGludm9jYXRpb24uXG4gKlxuICogKipOb3RlOioqIElmIGBsZWFkaW5nYCBhbmQgYHRyYWlsaW5nYCBvcHRpb25zIGFyZSBgdHJ1ZWAsIGBmdW5jYCBpc1xuICogaW52b2tlZCBvbiB0aGUgdHJhaWxpbmcgZWRnZSBvZiB0aGUgdGltZW91dCBvbmx5IGlmIHRoZSB0aHJvdHRsZWQgZnVuY3Rpb25cbiAqIGlzIGludm9rZWQgbW9yZSB0aGFuIG9uY2UgZHVyaW5nIHRoZSBgd2FpdGAgdGltZW91dC5cbiAqXG4gKiBJZiBgd2FpdGAgaXMgYDBgIGFuZCBgbGVhZGluZ2AgaXMgYGZhbHNlYCwgYGZ1bmNgIGludm9jYXRpb24gaXMgZGVmZXJyZWRcbiAqIHVudGlsIHRvIHRoZSBuZXh0IHRpY2ssIHNpbWlsYXIgdG8gYHNldFRpbWVvdXRgIHdpdGggYSB0aW1lb3V0IG9mIGAwYC5cbiAqXG4gKiBTZWUgW0RhdmlkIENvcmJhY2hvJ3MgYXJ0aWNsZV0oaHR0cHM6Ly9jc3MtdHJpY2tzLmNvbS9kZWJvdW5jaW5nLXRocm90dGxpbmctZXhwbGFpbmVkLWV4YW1wbGVzLylcbiAqIGZvciBkZXRhaWxzIG92ZXIgdGhlIGRpZmZlcmVuY2VzIGJldHdlZW4gYF8udGhyb3R0bGVgIGFuZCBgXy5kZWJvdW5jZWAuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBzaW5jZSAwLjEuMFxuICogQGNhdGVnb3J5IEZ1bmN0aW9uXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBmdW5jIFRoZSBmdW5jdGlvbiB0byB0aHJvdHRsZS5cbiAqIEBwYXJhbSB7bnVtYmVyfSBbd2FpdD0wXSBUaGUgbnVtYmVyIG9mIG1pbGxpc2Vjb25kcyB0byB0aHJvdHRsZSBpbnZvY2F0aW9ucyB0by5cbiAqIEBwYXJhbSB7T2JqZWN0fSBbb3B0aW9ucz17fV0gVGhlIG9wdGlvbnMgb2JqZWN0LlxuICogQHBhcmFtIHtib29sZWFufSBbb3B0aW9ucy5sZWFkaW5nPXRydWVdXG4gKiAgU3BlY2lmeSBpbnZva2luZyBvbiB0aGUgbGVhZGluZyBlZGdlIG9mIHRoZSB0aW1lb3V0LlxuICogQHBhcmFtIHtib29sZWFufSBbb3B0aW9ucy50cmFpbGluZz10cnVlXVxuICogIFNwZWNpZnkgaW52b2tpbmcgb24gdGhlIHRyYWlsaW5nIGVkZ2Ugb2YgdGhlIHRpbWVvdXQuXG4gKiBAcmV0dXJucyB7RnVuY3Rpb259IFJldHVybnMgdGhlIG5ldyB0aHJvdHRsZWQgZnVuY3Rpb24uXG4gKiBAZXhhbXBsZVxuICpcbiAqIC8vIEF2b2lkIGV4Y2Vzc2l2ZWx5IHVwZGF0aW5nIHRoZSBwb3NpdGlvbiB3aGlsZSBzY3JvbGxpbmcuXG4gKiBqUXVlcnkod2luZG93KS5vbignc2Nyb2xsJywgXy50aHJvdHRsZSh1cGRhdGVQb3NpdGlvbiwgMTAwKSk7XG4gKlxuICogLy8gSW52b2tlIGByZW5ld1Rva2VuYCB3aGVuIHRoZSBjbGljayBldmVudCBpcyBmaXJlZCwgYnV0IG5vdCBtb3JlIHRoYW4gb25jZSBldmVyeSA1IG1pbnV0ZXMuXG4gKiB2YXIgdGhyb3R0bGVkID0gXy50aHJvdHRsZShyZW5ld1Rva2VuLCAzMDAwMDAsIHsgJ3RyYWlsaW5nJzogZmFsc2UgfSk7XG4gKiBqUXVlcnkoZWxlbWVudCkub24oJ2NsaWNrJywgdGhyb3R0bGVkKTtcbiAqXG4gKiAvLyBDYW5jZWwgdGhlIHRyYWlsaW5nIHRocm90dGxlZCBpbnZvY2F0aW9uLlxuICogalF1ZXJ5KHdpbmRvdykub24oJ3BvcHN0YXRlJywgdGhyb3R0bGVkLmNhbmNlbCk7XG4gKi9cbmZ1bmN0aW9uIHRocm90dGxlKGZ1bmMsIHdhaXQsIG9wdGlvbnMpIHtcbiAgdmFyIGxlYWRpbmcgPSB0cnVlLFxuICAgICAgdHJhaWxpbmcgPSB0cnVlO1xuXG4gIGlmICh0eXBlb2YgZnVuYyAhPSAnZnVuY3Rpb24nKSB7XG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcihGVU5DX0VSUk9SX1RFWFQpO1xuICB9XG4gIGlmIChpc09iamVjdChvcHRpb25zKSkge1xuICAgIGxlYWRpbmcgPSAnbGVhZGluZycgaW4gb3B0aW9ucyA/ICEhb3B0aW9ucy5sZWFkaW5nIDogbGVhZGluZztcbiAgICB0cmFpbGluZyA9ICd0cmFpbGluZycgaW4gb3B0aW9ucyA/ICEhb3B0aW9ucy50cmFpbGluZyA6IHRyYWlsaW5nO1xuICB9XG4gIHJldHVybiBkZWJvdW5jZShmdW5jLCB3YWl0LCB7XG4gICAgJ2xlYWRpbmcnOiBsZWFkaW5nLFxuICAgICdtYXhXYWl0Jzogd2FpdCxcbiAgICAndHJhaWxpbmcnOiB0cmFpbGluZ1xuICB9KTtcbn1cblxuLyoqXG4gKiBDaGVja3MgaWYgYHZhbHVlYCBpcyB0aGVcbiAqIFtsYW5ndWFnZSB0eXBlXShodHRwOi8vd3d3LmVjbWEtaW50ZXJuYXRpb25hbC5vcmcvZWNtYS0yNjIvNy4wLyNzZWMtZWNtYXNjcmlwdC1sYW5ndWFnZS10eXBlcylcbiAqIG9mIGBPYmplY3RgLiAoZS5nLiBhcnJheXMsIGZ1bmN0aW9ucywgb2JqZWN0cywgcmVnZXhlcywgYG5ldyBOdW1iZXIoMClgLCBhbmQgYG5ldyBTdHJpbmcoJycpYClcbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDAuMS4wXG4gKiBAY2F0ZWdvcnkgTGFuZ1xuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBhbiBvYmplY3QsIGVsc2UgYGZhbHNlYC5cbiAqIEBleGFtcGxlXG4gKlxuICogXy5pc09iamVjdCh7fSk7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5pc09iamVjdChbMSwgMiwgM10pO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNPYmplY3QoXy5ub29wKTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzT2JqZWN0KG51bGwpO1xuICogLy8gPT4gZmFsc2VcbiAqL1xuZnVuY3Rpb24gaXNPYmplY3QodmFsdWUpIHtcbiAgdmFyIHR5cGUgPSB0eXBlb2YgdmFsdWU7XG4gIHJldHVybiAhIXZhbHVlICYmICh0eXBlID09ICdvYmplY3QnIHx8IHR5cGUgPT0gJ2Z1bmN0aW9uJyk7XG59XG5cbi8qKlxuICogQ2hlY2tzIGlmIGB2YWx1ZWAgaXMgb2JqZWN0LWxpa2UuIEEgdmFsdWUgaXMgb2JqZWN0LWxpa2UgaWYgaXQncyBub3QgYG51bGxgXG4gKiBhbmQgaGFzIGEgYHR5cGVvZmAgcmVzdWx0IG9mIFwib2JqZWN0XCIuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBzaW5jZSA0LjAuMFxuICogQGNhdGVnb3J5IExhbmdcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgb2JqZWN0LWxpa2UsIGVsc2UgYGZhbHNlYC5cbiAqIEBleGFtcGxlXG4gKlxuICogXy5pc09iamVjdExpa2Uoe30pO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNPYmplY3RMaWtlKFsxLCAyLCAzXSk7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5pc09iamVjdExpa2UoXy5ub29wKTtcbiAqIC8vID0+IGZhbHNlXG4gKlxuICogXy5pc09iamVjdExpa2UobnVsbCk7XG4gKiAvLyA9PiBmYWxzZVxuICovXG5mdW5jdGlvbiBpc09iamVjdExpa2UodmFsdWUpIHtcbiAgcmV0dXJuICEhdmFsdWUgJiYgdHlwZW9mIHZhbHVlID09ICdvYmplY3QnO1xufVxuXG4vKipcbiAqIENoZWNrcyBpZiBgdmFsdWVgIGlzIGNsYXNzaWZpZWQgYXMgYSBgU3ltYm9sYCBwcmltaXRpdmUgb3Igb2JqZWN0LlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgNC4wLjBcbiAqIEBjYXRlZ29yeSBMYW5nXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlzIGEgc3ltYm9sLCBlbHNlIGBmYWxzZWAuXG4gKiBAZXhhbXBsZVxuICpcbiAqIF8uaXNTeW1ib2woU3ltYm9sLml0ZXJhdG9yKTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzU3ltYm9sKCdhYmMnKTtcbiAqIC8vID0+IGZhbHNlXG4gKi9cbmZ1bmN0aW9uIGlzU3ltYm9sKHZhbHVlKSB7XG4gIHJldHVybiB0eXBlb2YgdmFsdWUgPT0gJ3N5bWJvbCcgfHxcbiAgICAoaXNPYmplY3RMaWtlKHZhbHVlKSAmJiBvYmplY3RUb1N0cmluZy5jYWxsKHZhbHVlKSA9PSBzeW1ib2xUYWcpO1xufVxuXG4vKipcbiAqIENvbnZlcnRzIGB2YWx1ZWAgdG8gYSBudW1iZXIuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBzaW5jZSA0LjAuMFxuICogQGNhdGVnb3J5IExhbmdcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIHByb2Nlc3MuXG4gKiBAcmV0dXJucyB7bnVtYmVyfSBSZXR1cm5zIHRoZSBudW1iZXIuXG4gKiBAZXhhbXBsZVxuICpcbiAqIF8udG9OdW1iZXIoMy4yKTtcbiAqIC8vID0+IDMuMlxuICpcbiAqIF8udG9OdW1iZXIoTnVtYmVyLk1JTl9WQUxVRSk7XG4gKiAvLyA9PiA1ZS0zMjRcbiAqXG4gKiBfLnRvTnVtYmVyKEluZmluaXR5KTtcbiAqIC8vID0+IEluZmluaXR5XG4gKlxuICogXy50b051bWJlcignMy4yJyk7XG4gKiAvLyA9PiAzLjJcbiAqL1xuZnVuY3Rpb24gdG9OdW1iZXIodmFsdWUpIHtcbiAgaWYgKHR5cGVvZiB2YWx1ZSA9PSAnbnVtYmVyJykge1xuICAgIHJldHVybiB2YWx1ZTtcbiAgfVxuICBpZiAoaXNTeW1ib2wodmFsdWUpKSB7XG4gICAgcmV0dXJuIE5BTjtcbiAgfVxuICBpZiAoaXNPYmplY3QodmFsdWUpKSB7XG4gICAgdmFyIG90aGVyID0gdHlwZW9mIHZhbHVlLnZhbHVlT2YgPT0gJ2Z1bmN0aW9uJyA/IHZhbHVlLnZhbHVlT2YoKSA6IHZhbHVlO1xuICAgIHZhbHVlID0gaXNPYmplY3Qob3RoZXIpID8gKG90aGVyICsgJycpIDogb3RoZXI7XG4gIH1cbiAgaWYgKHR5cGVvZiB2YWx1ZSAhPSAnc3RyaW5nJykge1xuICAgIHJldHVybiB2YWx1ZSA9PT0gMCA/IHZhbHVlIDogK3ZhbHVlO1xuICB9XG4gIHZhbHVlID0gdmFsdWUucmVwbGFjZShyZVRyaW0sICcnKTtcbiAgdmFyIGlzQmluYXJ5ID0gcmVJc0JpbmFyeS50ZXN0KHZhbHVlKTtcbiAgcmV0dXJuIChpc0JpbmFyeSB8fCByZUlzT2N0YWwudGVzdCh2YWx1ZSkpXG4gICAgPyBmcmVlUGFyc2VJbnQodmFsdWUuc2xpY2UoMiksIGlzQmluYXJ5ID8gMiA6IDgpXG4gICAgOiAocmVJc0JhZEhleC50ZXN0KHZhbHVlKSA/IE5BTiA6ICt2YWx1ZSk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gdGhyb3R0bGU7XG4iXX0=
