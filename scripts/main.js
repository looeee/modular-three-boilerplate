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
    var geometry = new THREE.BoxGeometry(5, 5, 5);
    var material = new THREE.MeshBasicMaterial({ color: 0xFF0000 });
    this.mesh = new THREE.Mesh(geometry, material);
  };

  return Cube;
}(modularTHREE$2.MeshObject);

var modularTHREE$1 = require('modular-three');

// The following spec objects are optional and can be omitted
//for the defaults shown
var rendererSpec = {
  canvasID: '', //TODO: add this functionality, including check that ID is unique
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

// Optional
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

modularTHREE.config.showStats = true;

modularTHREE.init();

var testDrawing = new TestDrawing();
testDrawing.render();
},{"modular-three":2}],2:[function(require,module,exports){
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

var warnIfConfigUpdatedAfterInit = function () {
  console.warn('Config setting should be set before calling ModularTHREE.init()');
};

var config = {
  initCalled: false,

  GSAP: true,
  get useGSAP() {
    return this.GSAP;
  },
  set useGSAP(value) {
    if (this.initCalled) warnIfConfigUpdatedAfterInit();
    this.GSAP = value;
  },

  heartcodeLoader: true,
  get useHeartcodeLoader() {
    return this.heartcodeLoader;
  },
  set useHeartcodeLoader(value) {
    if (this.initCalled) warnIfConfigUpdatedAfterInit();
    this.heartcodeLoader = value;
  },

  stats: true,
  get showStats() {
    return this.stats;
  },
  set showStats(value) {
    if (this.initCalled) warnIfConfigUpdatedAfterInit();
    this.stats = value;
  }
};

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
    if (this.stats) return; //don't create stats more than once
    this.stats = new Stats();
    document.body.appendChild(this.stats.dom);
  };

  Renderer.prototype.render = function render(scene, camera) {
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
      if (showStats) _this.stats.update();
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

  Scene.prototype.render = function render() {
    this.renderer.render(this.scene, this.camera.cam);
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
  function Drawing(cameraSpec, rendererSpec) {
    classCallCheck(this, Drawing);

    this.scene = new Scene(cameraSpec, rendererSpec);
    this.camera = this.scene.camera;

    this.uuid = THREE.Math.generateUUID();
    drawings[this.uuid] = this;

    this.init();
  }

  //gets called on window resize or other events that require recalculation of
  //object dimensions


  Drawing.prototype.reset = function reset() {
    this.scene.reset();
    this.init();
  };

  Drawing.prototype.render = function render() {
    this.scene.render();
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
    config.showStats = false;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvZW50cnkuanMiLCIuLi8uLi9tb2R1bGFyLXRocmVlL2Rpc3QvaW5kZXguanMiLCIuLi8uLi9tb2R1bGFyLXRocmVlL25vZGVfbW9kdWxlcy9sb2Rhc2gudGhyb3R0bGUvaW5kZXguanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25IQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FDbGZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgY2xhc3NDYWxsQ2hlY2sgPSBmdW5jdGlvbiAoaW5zdGFuY2UsIENvbnN0cnVjdG9yKSB7XG4gIGlmICghKGluc3RhbmNlIGluc3RhbmNlb2YgQ29uc3RydWN0b3IpKSB7XG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcihcIkNhbm5vdCBjYWxsIGEgY2xhc3MgYXMgYSBmdW5jdGlvblwiKTtcbiAgfVxufTtcblxudmFyIGluaGVyaXRzID0gZnVuY3Rpb24gKHN1YkNsYXNzLCBzdXBlckNsYXNzKSB7XG4gIGlmICh0eXBlb2Ygc3VwZXJDbGFzcyAhPT0gXCJmdW5jdGlvblwiICYmIHN1cGVyQ2xhc3MgIT09IG51bGwpIHtcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKFwiU3VwZXIgZXhwcmVzc2lvbiBtdXN0IGVpdGhlciBiZSBudWxsIG9yIGEgZnVuY3Rpb24sIG5vdCBcIiArIHR5cGVvZiBzdXBlckNsYXNzKTtcbiAgfVxuXG4gIHN1YkNsYXNzLnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUoc3VwZXJDbGFzcyAmJiBzdXBlckNsYXNzLnByb3RvdHlwZSwge1xuICAgIGNvbnN0cnVjdG9yOiB7XG4gICAgICB2YWx1ZTogc3ViQ2xhc3MsXG4gICAgICBlbnVtZXJhYmxlOiBmYWxzZSxcbiAgICAgIHdyaXRhYmxlOiB0cnVlLFxuICAgICAgY29uZmlndXJhYmxlOiB0cnVlXG4gICAgfVxuICB9KTtcbiAgaWYgKHN1cGVyQ2xhc3MpIE9iamVjdC5zZXRQcm90b3R5cGVPZiA/IE9iamVjdC5zZXRQcm90b3R5cGVPZihzdWJDbGFzcywgc3VwZXJDbGFzcykgOiBzdWJDbGFzcy5fX3Byb3RvX18gPSBzdXBlckNsYXNzO1xufTtcblxudmFyIHBvc3NpYmxlQ29uc3RydWN0b3JSZXR1cm4gPSBmdW5jdGlvbiAoc2VsZiwgY2FsbCkge1xuICBpZiAoIXNlbGYpIHtcbiAgICB0aHJvdyBuZXcgUmVmZXJlbmNlRXJyb3IoXCJ0aGlzIGhhc24ndCBiZWVuIGluaXRpYWxpc2VkIC0gc3VwZXIoKSBoYXNuJ3QgYmVlbiBjYWxsZWRcIik7XG4gIH1cblxuICByZXR1cm4gY2FsbCAmJiAodHlwZW9mIGNhbGwgPT09IFwib2JqZWN0XCIgfHwgdHlwZW9mIGNhbGwgPT09IFwiZnVuY3Rpb25cIikgPyBjYWxsIDogc2VsZjtcbn07XG5cbnZhciBtb2R1bGFyVEhSRUUkMiA9IHJlcXVpcmUoJ21vZHVsYXItdGhyZWUnKTtcblxudmFyIEN1YmUgPSBmdW5jdGlvbiAoX21vZHVsYXJUSFJFRSRNZXNoT2JqKSB7XG4gIGluaGVyaXRzKEN1YmUsIF9tb2R1bGFyVEhSRUUkTWVzaE9iaik7XG5cbiAgZnVuY3Rpb24gQ3ViZSgpIHtcbiAgICBjbGFzc0NhbGxDaGVjayh0aGlzLCBDdWJlKTtcbiAgICByZXR1cm4gcG9zc2libGVDb25zdHJ1Y3RvclJldHVybih0aGlzLCBfbW9kdWxhclRIUkVFJE1lc2hPYmouY2FsbCh0aGlzKSk7XG4gIH1cblxuICBDdWJlLnByb3RvdHlwZS5pbml0ID0gZnVuY3Rpb24gaW5pdCgpIHtcbiAgICB2YXIgZ2VvbWV0cnkgPSBuZXcgVEhSRUUuQm94R2VvbWV0cnkoNSwgNSwgNSk7XG4gICAgdmFyIG1hdGVyaWFsID0gbmV3IFRIUkVFLk1lc2hCYXNpY01hdGVyaWFsKHsgY29sb3I6IDB4RkYwMDAwIH0pO1xuICAgIHRoaXMubWVzaCA9IG5ldyBUSFJFRS5NZXNoKGdlb21ldHJ5LCBtYXRlcmlhbCk7XG4gIH07XG5cbiAgcmV0dXJuIEN1YmU7XG59KG1vZHVsYXJUSFJFRSQyLk1lc2hPYmplY3QpO1xuXG52YXIgbW9kdWxhclRIUkVFJDEgPSByZXF1aXJlKCdtb2R1bGFyLXRocmVlJyk7XG5cbi8vIFRoZSBmb2xsb3dpbmcgc3BlYyBvYmplY3RzIGFyZSBvcHRpb25hbCBhbmQgY2FuIGJlIG9taXR0ZWRcbi8vZm9yIHRoZSBkZWZhdWx0cyBzaG93blxudmFyIHJlbmRlcmVyU3BlYyA9IHtcbiAgY2FudmFzSUQ6ICcnLCAvL1RPRE86IGFkZCB0aGlzIGZ1bmN0aW9uYWxpdHksIGluY2x1ZGluZyBjaGVjayB0aGF0IElEIGlzIHVuaXF1ZVxuICBhbnRpYWxpYXM6IHRydWUsXG4gIGFscGhhOiB0cnVlLCAvL3RydWUgcmVxdWlyZWQgZm9yIG11bHRpcGxlIHNjZW5lc1xuICBhdXRvQ2xlYXI6IHRydWUsIC8vZmFsc2UgcmVxdWlyZWQgZm9yIG11bHRpcGxlIHNjZW5lc1xuICBjbGVhckNvbG9yOiAweDAwMDAwMCxcbiAgY2xlYXJBbHBoYTogMSxcbiAgd2lkdGg6IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gd2luZG93LmlubmVyV2lkdGg7XG4gIH0sXG4gIGhlaWdodDogZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiB3aW5kb3cuaW5uZXJIZWlnaHQ7XG4gIH0sXG4gIHBpeGVsUmF0aW86IHdpbmRvdy5kZXZpY2VQaXhlbFJhdGlvLFxuICBwb3N0cHJvY2Vzc2luZzogZmFsc2Vcbn07XG5cbi8vIE9wdGlvbmFsXG52YXIgY2FtZXJhU3BlYyA9IHtcbiAgdHlwZTogJ1BlcnNwZWN0aXZlQ2FtZXJhJywgLy9PciAnT3J0aG9ncmFwaGljQ2FtZXJhJ1xuICBuZWFyOiAxMCxcbiAgZmFyOiAtMTAsXG4gIHBvc2l0aW9uOiBuZXcgVEhSRUUuVmVjdG9yMygwLCAwLCAxMDApLFxuICAvL1BlcnNwZWN0aXZlQ2FtZXJhIG9ubHlcbiAgZm92OiA0NSwgLy9QZXJzcGVjdGl2ZUNhbWVyYSBvbmx5XG4gIGFzcGVjdDogZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiB3aW5kb3cuaW5uZXJXaWR0aCAvIHdpbmRvdy5pbm5lckhlaWdodDtcbiAgfSxcbiAgLy8gT3J0aG9ncmFwaGljQ2FtZXJhIG9ubHlcbiAgd2lkdGg6IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gd2luZG93LmlubmVyV2lkdGg7XG4gIH0sXG4gIGhlaWdodDogZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiB3aW5kb3cuaW5uZXJIZWlnaHQ7XG4gIH1cbn07XG5cbnZhciBUZXN0RHJhd2luZyA9IGZ1bmN0aW9uIChfbW9kdWxhclRIUkVFJERyYXdpbmcpIHtcbiAgaW5oZXJpdHMoVGVzdERyYXdpbmcsIF9tb2R1bGFyVEhSRUUkRHJhd2luZyk7XG5cbiAgZnVuY3Rpb24gVGVzdERyYXdpbmcoKSB7XG4gICAgY2xhc3NDYWxsQ2hlY2sodGhpcywgVGVzdERyYXdpbmcpO1xuICAgIHJldHVybiBwb3NzaWJsZUNvbnN0cnVjdG9yUmV0dXJuKHRoaXMsIF9tb2R1bGFyVEhSRUUkRHJhd2luZy5jYWxsKHRoaXMsIGNhbWVyYVNwZWMsIHJlbmRlcmVyU3BlYykpO1xuICB9XG5cbiAgVGVzdERyYXdpbmcucHJvdG90eXBlLmluaXQgPSBmdW5jdGlvbiBpbml0KCkge1xuICAgIHZhciBjdWJlID0gbmV3IEN1YmUoKTtcbiAgICB0aGlzLnNjZW5lLmFkZChjdWJlKTtcbiAgfTtcblxuICByZXR1cm4gVGVzdERyYXdpbmc7XG59KG1vZHVsYXJUSFJFRSQxLkRyYXdpbmcpO1xuXG52YXIgbW9kdWxhclRIUkVFID0gcmVxdWlyZSgnbW9kdWxhci10aHJlZScpO1xuXG5tb2R1bGFyVEhSRUUuY29uZmlnLnNob3dTdGF0cyA9IHRydWU7XG5cbm1vZHVsYXJUSFJFRS5pbml0KCk7XG5cbnZhciB0ZXN0RHJhd2luZyA9IG5ldyBUZXN0RHJhd2luZygpO1xudGVzdERyYXdpbmcucmVuZGVyKCk7IiwidmFyIGNsYXNzQ2FsbENoZWNrID0gZnVuY3Rpb24gKGluc3RhbmNlLCBDb25zdHJ1Y3Rvcikge1xuICBpZiAoIShpbnN0YW5jZSBpbnN0YW5jZW9mIENvbnN0cnVjdG9yKSkge1xuICAgIHRocm93IG5ldyBUeXBlRXJyb3IoXCJDYW5ub3QgY2FsbCBhIGNsYXNzIGFzIGEgZnVuY3Rpb25cIik7XG4gIH1cbn07XG5cbi8vIGltcG9ydCB7XG4vLyAgIHRleHR1cmVMb2FkZXIsXG4vLyB9XG4vLyBmcm9tICcuL2xvYWRlcnMvdGV4dHVyZUxvYWRlcic7XG4vLyAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuLy8gTUVTSCBPQkpFQ1QgU1VQRVJDTEFTU1xuLy8gU3VwZXJjbGFzcyBmb3IgYW55IFRIUkVFLmpzIG1lc2ggb2JqZWN0LiBSZXR1cm5zIGEgVEhSRUUgbWVzaFxuLy8gKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbi8vVE9ETzogcmVuYW1lIHRoaXMgY2xhc3NcbnZhciBNZXNoT2JqZWN0ID0gZnVuY3Rpb24gKCkge1xuICBmdW5jdGlvbiBNZXNoT2JqZWN0KHNwZWMpIHtcbiAgICBjbGFzc0NhbGxDaGVjayh0aGlzLCBNZXNoT2JqZWN0KTtcblxuICAgIHRoaXMuc3BlYyA9IHNwZWMgfHwge307XG5cbiAgICB0aGlzLmluaXQoKTtcbiAgICBpZiAodGhpcy5zcGVjLmxheWVyKSB7XG4gICAgICB0aGlzLm1lc2gubGF5ZXJzLnNldCh0aGlzLnNwZWMubGF5ZXIpO1xuICAgIH1cblxuICAgIHJldHVybiB0aGlzLm1lc2g7XG4gIH1cblxuICBNZXNoT2JqZWN0LnByb3RvdHlwZS5jcmVhdGVNZXNoID0gZnVuY3Rpb24gY3JlYXRlTWVzaChnZW9tZXRyeSwgbWF0ZXJpYWwpIHtcbiAgICB2YXIgbWVzaCA9IG5ldyBUSFJFRS5NZXNoKGdlb21ldHJ5LCBtYXRlcmlhbCk7XG4gICAgcmV0dXJuIG1lc2g7XG4gIH07XG5cbiAgLy8gbG9hZFRleHR1cmUodXJsKSB7XG4gIC8vICAgcmV0dXJuIHRleHR1cmVMb2FkZXIodXJsKTtcbiAgLy8gfVxuXG5cbiAgcmV0dXJuIE1lc2hPYmplY3Q7XG59KCk7XG5cbnZhciB3YXJuSWZDb25maWdVcGRhdGVkQWZ0ZXJJbml0ID0gZnVuY3Rpb24gKCkge1xuICBjb25zb2xlLndhcm4oJ0NvbmZpZyBzZXR0aW5nIHNob3VsZCBiZSBzZXQgYmVmb3JlIGNhbGxpbmcgTW9kdWxhclRIUkVFLmluaXQoKScpO1xufTtcblxudmFyIGNvbmZpZyA9IHtcbiAgaW5pdENhbGxlZDogZmFsc2UsXG5cbiAgR1NBUDogdHJ1ZSxcbiAgZ2V0IHVzZUdTQVAoKSB7XG4gICAgcmV0dXJuIHRoaXMuR1NBUDtcbiAgfSxcbiAgc2V0IHVzZUdTQVAodmFsdWUpIHtcbiAgICBpZiAodGhpcy5pbml0Q2FsbGVkKSB3YXJuSWZDb25maWdVcGRhdGVkQWZ0ZXJJbml0KCk7XG4gICAgdGhpcy5HU0FQID0gdmFsdWU7XG4gIH0sXG5cbiAgaGVhcnRjb2RlTG9hZGVyOiB0cnVlLFxuICBnZXQgdXNlSGVhcnRjb2RlTG9hZGVyKCkge1xuICAgIHJldHVybiB0aGlzLmhlYXJ0Y29kZUxvYWRlcjtcbiAgfSxcbiAgc2V0IHVzZUhlYXJ0Y29kZUxvYWRlcih2YWx1ZSkge1xuICAgIGlmICh0aGlzLmluaXRDYWxsZWQpIHdhcm5JZkNvbmZpZ1VwZGF0ZWRBZnRlckluaXQoKTtcbiAgICB0aGlzLmhlYXJ0Y29kZUxvYWRlciA9IHZhbHVlO1xuICB9LFxuXG4gIHN0YXRzOiB0cnVlLFxuICBnZXQgc2hvd1N0YXRzKCkge1xuICAgIHJldHVybiB0aGlzLnN0YXRzO1xuICB9LFxuICBzZXQgc2hvd1N0YXRzKHZhbHVlKSB7XG4gICAgaWYgKHRoaXMuaW5pdENhbGxlZCkgd2FybklmQ29uZmlnVXBkYXRlZEFmdGVySW5pdCgpO1xuICAgIHRoaXMuc3RhdHMgPSB2YWx1ZTtcbiAgfVxufTtcblxudmFyIHNob3dTdGF0cyA9IGNvbmZpZy5zaG93U3RhdHM7XG4vLyBpbXBvcnQge1xuLy8gICBQb3N0cHJvY2Vzc2luZyxcbi8vIH1cbi8vIGZyb20gJy4vcG9zdHByb2Nlc3NpbmcnO1xuLy8gKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbi8vIFJFTkRFUkVSIENMQVNTXG4vL1xuLy8gQ3JlYXRlIGEgVEhSRUUuanMgcmVuZGVyZXIgYW5kIGFkZCBwb3N0cHJvY2Vzc2luZyBpZiByZXF1aXJlZFxuLy8gRWFjaCBzY2VuZSBjdXJyZW50bHkgbmVlZHMgYSB1bmlxdWUgcmVuZGVyZXIgYW5kIGFzc29jaWF0ZWQgSFRNTCBDYW52YXNcbi8vIGVsZW0gZm9yIHRoZSBjYW5jZWxSZW5kZXIgZnVuY3Rpb24gdG8gd29ya1xuLy8gVGhlIGNvbnRhaW5lciBlbGVtIGNhbiBiZSBvbWl0dGVkIGlmIHVzaW5nIG9ubHkgb25lIHNjZW5lIGFzIHRoZSBkZWZhdWx0XG4vLyB3aWxsIGJlIGF1dG9tYXRpY2FsbHkgYWRkZWRcbi8vIE5PVEU6IEN1cnJlbnRseSB1c2luZyBUd2Vlbk1heCB0aWNrZXIgZm9yIGFuaW1hdGlvbiBzbyB0aGUgZ3NhcCBmaWxlcyBtdXN0XG4vLyBiZSBpbmNsdWRlZFxuLy9cbi8vIFRoZSBmb2xsb3dpbmcgc3BlYyBvYmplY3QgY2FuIGJlIG9taXR0ZWQgZm9yIHRoZSBmb2xsb3dpbmcgZGVmYXVsdHNcbi8vIGNvbnN0IHJlbmRlcmVyU3BlYyA9IHtcbi8vICAgY29udGFpbmVyRWxlbTogY2FudmFzRWxlbSwgLy8gb21pdCBmb3IgVEhSRUUganMgZGVmYXVsdFxuLy8gICBhbnRpYWxpYXM6IHRydWUsXG4vLyAgIGFscGhhOiBmYWxzZSwgLy90cnVlIHJlcXVpcmVkIGZvciBtdWx0aXBsZSBzY2VuZXNcbi8vICAgYXV0b0NsZWFyOiB0cnVlLCAvL2ZhbHNlIHJlcXVpcmVkIGZvciBtdWx0aXBsZSBzY2VuZXNcbi8vICAgY2xlYXJDb2xvcjogMHgwMDAwMDAsXG4vLyAgIGNsZWFyQWxwaGE6IDAsXG4vLyAgIHdpZHRoOiB3aW5kb3cuaW5uZXJXaWR0aCxcbi8vICAgaGVpZ2h0OiB3aW5kb3cuaW5uZXJIZWlnaHQsXG4vLyAgIHBpeGVsUmF0aW86IHdpbmRvdy5kZXZpY2VQaXhlbFJhdGlvLFxuLy8gfTtcbi8vICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG52YXIgUmVuZGVyZXIgPSBmdW5jdGlvbiAoKSB7XG4gIGZ1bmN0aW9uIFJlbmRlcmVyKHNwZWMpIHtcbiAgICBjbGFzc0NhbGxDaGVjayh0aGlzLCBSZW5kZXJlcik7XG5cbiAgICB0aGlzLnNwZWMgPSBzcGVjIHx8IHt9O1xuICAgIHRoaXMuaW5pdCgpO1xuICB9XG5cbiAgUmVuZGVyZXIucHJvdG90eXBlLmluaXQgPSBmdW5jdGlvbiBpbml0KCkge1xuICAgIHRoaXMuaW5pdFBhcmFtcygpO1xuICAgIHZhciByZW5kZXJlck9wdGlvbnMgPSB7XG4gICAgICBhbnRpYWxpYXM6IHRoaXMuc3BlYy5hbnRpYWxpYXMsXG4gICAgICAvL3JlcXVpcmVkIGZvciBtdWx0aXBsZSBzY2VuZXMgYW5kIHZhcmlvdXMgb3RoZXIgZWZmZWN0c1xuICAgICAgYWxwaGE6IHRoaXMuc3BlYy5hbHBoYVxuICAgIH07XG4gICAgaWYgKHRoaXMuc3BlYy5jb250YWluZXJFbGVtKSB7XG4gICAgICByZW5kZXJlck9wdGlvbnMuY2FudmFzID0gdGhpcy5zcGVjLmNvbnRhaW5lckVsZW07XG4gICAgICB0aGlzLnJlbmRlcmVyID0gbmV3IFRIUkVFLldlYkdMUmVuZGVyZXIocmVuZGVyZXJPcHRpb25zKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5yZW5kZXJlciA9IG5ldyBUSFJFRS5XZWJHTFJlbmRlcmVyKHJlbmRlcmVyT3B0aW9ucyk7XG4gICAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKHRoaXMucmVuZGVyZXIuZG9tRWxlbWVudCk7XG4gICAgfVxuXG4gICAgdGhpcy5zZXRSZW5kZXJlcigpO1xuICB9O1xuXG4gIFJlbmRlcmVyLnByb3RvdHlwZS5pbml0UGFyYW1zID0gZnVuY3Rpb24gaW5pdFBhcmFtcygpIHtcbiAgICBpZiAoIXRoaXMuc3BlYy5wb3N0cHJvY2Vzc2luZykgdGhpcy5zcGVjLnBvc3Rwcm9jZXNzaW5nID0gZmFsc2U7XG4gICAgaWYgKCF0aGlzLnNwZWMuYW50aWFsaWFzKSB0aGlzLnNwZWMuYW50aWFsaWFzID0gdHJ1ZTtcbiAgICBpZiAoIXRoaXMuc3BlYy5hbHBoYSkgdGhpcy5zcGVjLmFscGhhID0gdHJ1ZTtcbiAgICBpZiAoIXRoaXMuc3BlYy5hdXRvQ2xlYXIpIHRoaXMuc3BlYy5hdXRvQ2xlYXIgPSBmYWxzZTtcbiAgICB0aGlzLnNwZWMuY2xlYXJDb2xvciA9IHRoaXMuc3BlYy5jbGVhckNvbG9yIHx8IDB4MDAwMDAwO1xuICAgIHRoaXMuc3BlYy5jbGVhckFscGhhID0gdGhpcy5zcGVjLmNsZWFyQWxwaGEgfHwgMS4wO1xuICAgIHZhciB3ID0gZnVuY3Rpb24gKCkge1xuICAgICAgcmV0dXJuIHdpbmRvdy5pbm5lcldpZHRoO1xuICAgIH07XG4gICAgdGhpcy5zcGVjLndpZHRoID0gdGhpcy5zcGVjLndpZHRoIHx8IHc7XG4gICAgdmFyIGggPSBmdW5jdGlvbiAoKSB7XG4gICAgICByZXR1cm4gd2luZG93LmlubmVySGVpZ2h0O1xuICAgIH07XG4gICAgdGhpcy5zcGVjLmhlaWdodCA9IHRoaXMuc3BlYy5oZWlnaHQgfHwgaDtcbiAgICB0aGlzLnNwZWMucGl4ZWxSYXRpbyA9IHRoaXMuc3BlYy5waXhlbFJhdGlvIHx8IHdpbmRvdy5kZXZpY2VQaXhlbFJhdGlvO1xuICB9O1xuXG4gIFJlbmRlcmVyLnByb3RvdHlwZS5zZXRTaXplID0gZnVuY3Rpb24gc2V0U2l6ZSgpIHtcbiAgICB2YXIgdyA9IGFyZ3VtZW50cy5sZW5ndGggPD0gMCB8fCBhcmd1bWVudHNbMF0gPT09IHVuZGVmaW5lZCA/IHRoaXMuc3BlYy53aWR0aCgpIDogYXJndW1lbnRzWzBdO1xuICAgIHZhciBoID0gYXJndW1lbnRzLmxlbmd0aCA8PSAxIHx8IGFyZ3VtZW50c1sxXSA9PT0gdW5kZWZpbmVkID8gdGhpcy5zcGVjLmhlaWdodCgpIDogYXJndW1lbnRzWzFdO1xuXG4gICAgdGhpcy5yZW5kZXJlci5zZXRTaXplKHcsIGgpO1xuICB9O1xuXG4gIFJlbmRlcmVyLnByb3RvdHlwZS5zZXRSZW5kZXJlciA9IGZ1bmN0aW9uIHNldFJlbmRlcmVyKCkge1xuICAgIHRoaXMucmVuZGVyZXIuYXV0b0NsZWFyID0gdGhpcy5zcGVjLmF1dG9DbGVhcjtcbiAgICB0aGlzLnJlbmRlcmVyLnNldENsZWFyQ29sb3IodGhpcy5zcGVjLmNsZWFyQ29sb3IsIHRoaXMuc3BlYy5jbGVhckFscGhhKTtcbiAgICB0aGlzLnJlbmRlcmVyLnNldFNpemUodGhpcy5zcGVjLndpZHRoLCB0aGlzLnNwZWMuaGVpZ2h0KTtcbiAgICB0aGlzLnJlbmRlcmVyLnNldFBpeGVsUmF0aW8odGhpcy5zcGVjLnBpeGVsUmF0aW8pO1xuICAgIHRoaXMuc2V0U2l6ZSh0aGlzLnNwZWMud2lkdGgoKSwgdGhpcy5zcGVjLmhlaWdodCgpKTtcbiAgfTtcblxuICBSZW5kZXJlci5wcm90b3R5cGUuc2hvd1N0YXRzID0gZnVuY3Rpb24gc2hvd1N0YXRzKCkge1xuICAgIGlmICh0aGlzLnN0YXRzKSByZXR1cm47IC8vZG9uJ3QgY3JlYXRlIHN0YXRzIG1vcmUgdGhhbiBvbmNlXG4gICAgdGhpcy5zdGF0cyA9IG5ldyBTdGF0cygpO1xuICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQodGhpcy5zdGF0cy5kb20pO1xuICB9O1xuXG4gIFJlbmRlcmVyLnByb3RvdHlwZS5yZW5kZXIgPSBmdW5jdGlvbiByZW5kZXIoc2NlbmUsIGNhbWVyYSkge1xuICAgIGlmIChzaG93U3RhdHMpIHRoaXMuc2hvd1N0YXRzKCk7XG4gICAgdGhpcy5yZW5kZXJlci5zZXRDbGVhckNvbG9yKHRoaXMuc3BlYy5jbGVhckNvbG9yLCB0aGlzLnNwZWMuY2xlYXJBbHBoYSk7XG4gICAgaWYgKHRoaXMuc3BlYy5wb3N0cHJvY2Vzc2luZykgdGhpcy5wb3N0UmVuZGVyZXIgPSBuZXcgUG9zdHByb2Nlc3NpbmcodGhpcy5yZW5kZXJlciwgc2NlbmUsIGNhbWVyYSk7XG4gICAgdGhpcy5hbmltYXRlKHNjZW5lLCBjYW1lcmEpO1xuICB9O1xuXG4gIFJlbmRlcmVyLnByb3RvdHlwZS5jYW5jZWxSZW5kZXIgPSBmdW5jdGlvbiBjYW5jZWxSZW5kZXIoKSB7XG4gICAgVHdlZW5MaXRlLnRpY2tlci5yZW1vdmVFdmVudExpc3RlbmVyKCd0aWNrJywgdGhpcy5yZW5kZXJIYW5kbGVyKTtcbiAgICB0aGlzLnJlbmRlcmVyLmNsZWFyKCk7XG4gIH07XG5cbiAgUmVuZGVyZXIucHJvdG90eXBlLmFuaW1hdGUgPSBmdW5jdGlvbiBhbmltYXRlKHNjZW5lLCBjYW1lcmEpIHtcbiAgICB2YXIgX3RoaXMgPSB0aGlzO1xuXG4gICAgdGhpcy5yZW5kZXJIYW5kbGVyID0gZnVuY3Rpb24gKCkge1xuICAgICAgaWYgKHNob3dTdGF0cykgX3RoaXMuc3RhdHMudXBkYXRlKCk7XG4gICAgICBpZiAoX3RoaXMuc3BlYy5wb3N0cHJvY2Vzc2luZykgX3RoaXMucG9zdFJlbmRlcmVyLmNvbXBvc2VyLnJlbmRlcigpO2Vsc2UgX3RoaXMucmVuZGVyZXIucmVuZGVyKHNjZW5lLCBjYW1lcmEpO1xuICAgIH07XG5cbiAgICBUd2VlbkxpdGUudGlja2VyLmFkZEV2ZW50TGlzdGVuZXIoJ3RpY2snLCB0aGlzLnJlbmRlckhhbmRsZXIpO1xuICB9O1xuXG4gIHJldHVybiBSZW5kZXJlcjtcbn0oKTtcblxuLy8gKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbi8vICBDQU1FUkEgQ0xBU1Ncbi8vXG4vLyAgVXNlZCBieSBTY2VuZSBjbGFzcyAtIGVhY2ggc2NlbmUgd2lsbCBoYXZlIGFuIGFzc29jaWF0ZWQgY2FtZXJhIGNsYXNzXG4vL1xuLy8gIFRoZSBmb2xsb3dpbmcgc3BlYyBpcyBvcHRpb25hbCBhbmQgY2FuIGJlIG9taXR0ZWQgZm9yIHRoZSBkZWZhdWx0cyBzaG93blxuLy8gIGNvbnN0IGNhbWVyYVNwZWMgPSB7XG4vLyAgICB0eXBlOiAnUGVyc3BlY3RpdmVDYW1lcmEnLCAvL09yICdPcnRob2dyYXBoaWNDYW1lcmEnXG4vLyAgICBuZWFyOiAxMCxcbi8vICAgIGZhcjogLTEwLFxuLy8gICAgcG9zaXRpb246IG5ldyBUSFJFRS5WZWN0b3IzKDAsIDAsIDEwMCksXG4vLyAgICAvL1BlcnNwZWN0aXZlQ2FtZXJhIG9ubHlcbi8vICAgIGZvdjogNDUsIC8vUGVyc3BlY3RpdmVDYW1lcmEgb25seVxuLy8gICAgYXNwZWN0OiB3aW5kb3cuaW5uZXJXaWR0aCAvIHdpbmRvdy5pbm5lckhlaWdodCxcbi8vICAgIC8vIE9ydGhvZ3JhcGhpY0NhbWVyYSBvbmx5XG4vLyAgICB3aWR0aDogd2luZG93LmlubmVyV2lkdGgsXG4vLyAgICBoZWlnaHQ6IHdpbmRvdy5pbm5lckhlaWdodCxcbi8vICB9O1xudmFyIENhbWVyYSA9IGZ1bmN0aW9uICgpIHtcbiAgZnVuY3Rpb24gQ2FtZXJhKHNwZWMpIHtcbiAgICBjbGFzc0NhbGxDaGVjayh0aGlzLCBDYW1lcmEpO1xuXG4gICAgdGhpcy5zcGVjID0gc3BlYyB8fCB7fTtcbiAgICB0aGlzLmluaXQoKTtcbiAgfVxuXG4gIENhbWVyYS5wcm90b3R5cGUuaW5pdCA9IGZ1bmN0aW9uIGluaXQoKSB7XG4gICAgdGhpcy5pbml0UGFyYW1zKCk7XG5cbiAgICBpZiAodGhpcy5zcGVjLnR5cGUgPT09ICdQZXJzcGVjdGl2ZUNhbWVyYScpIHtcbiAgICAgIHRoaXMuY2FtID0gbmV3IFRIUkVFLlBlcnNwZWN0aXZlQ2FtZXJhKCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuY2FtID0gbmV3IFRIUkVFLk9ydGhvZ3JhcGhpY0NhbWVyYSgpO1xuICAgIH1cbiAgICB0aGlzLnNldCgpO1xuICB9O1xuXG4gIENhbWVyYS5wcm90b3R5cGUuaW5pdFBhcmFtcyA9IGZ1bmN0aW9uIGluaXRQYXJhbXMoKSB7XG4gICAgdmFyIHBvc2l0aW9uID0gZnVuY3Rpb24gKCkge1xuICAgICAgcmV0dXJuIG5ldyBUSFJFRS5WZWN0b3IzKCk7XG4gICAgfTtcbiAgICB0aGlzLnNwZWMucG9zaXRpb24gPSB0aGlzLnNwZWMucG9zaXRpb24gfHwgcG9zaXRpb247XG4gICAgdGhpcy5zcGVjLm5lYXIgPSB0aGlzLnNwZWMubmVhciB8fCAxMDtcbiAgICB0aGlzLnNwZWMuZmFyID0gdGhpcy5zcGVjLmZhciB8fCAtMTA7XG4gICAgdGhpcy5zcGVjLnR5cGUgPSB0aGlzLnNwZWMudHlwZSB8fCAnUGVyc3BlY3RpdmVDYW1lcmEnO1xuICAgIGlmICh0aGlzLnNwZWMudHlwZSA9PT0gJ1BlcnNwZWN0aXZlQ2FtZXJhJykge1xuICAgICAgdGhpcy5zcGVjLmZvdiA9IHRoaXMuc3BlYy5mb3YgfHwgNDU7XG4gICAgICB2YXIgYXNwZWN0ID0gZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gd2luZG93LmlubmVyV2lkdGggLyB3aW5kb3cuaW5uZXJIZWlnaHQ7XG4gICAgICB9O1xuICAgICAgdGhpcy5zcGVjLmFzcGVjdCA9IHRoaXMuc3BlYy5hc3BlY3QgfHwgYXNwZWN0O1xuICAgIH0gZWxzZSB7XG4gICAgICB2YXIgdyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIHdpbmRvdy5pbm5lcldpZHRoO1xuICAgICAgfTtcbiAgICAgIHRoaXMuc3BlYy53aWR0aCA9IHRoaXMuc3BlYy53aWR0aCB8fCB3O1xuICAgICAgdmFyIGggPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiB3aW5kb3cuaW5uZXJIZWlnaHQ7XG4gICAgICB9O1xuICAgICAgdGhpcy5zcGVjLmhlaWdodCA9IHRoaXMuc3BlYy5oZWlnaHQgfHwgaDtcbiAgICB9XG4gIH07XG5cbiAgQ2FtZXJhLnByb3RvdHlwZS5zZXQgPSBmdW5jdGlvbiBzZXQoKSB7XG4gICAgaWYgKHRoaXMuc3BlYy50eXBlID09PSAnUGVyc3BlY3RpdmVDYW1lcmEnKSB7XG4gICAgICB0aGlzLmNhbS5mb3YgPSB0aGlzLnNwZWMuZm92O1xuICAgICAgdGhpcy5jYW0uYXNwZWN0ID0gdGhpcy5zcGVjLmFzcGVjdCgpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLmNhbS5sZWZ0ID0gLXRoaXMuc3BlYy53aWR0aCgpIC8gMjtcbiAgICAgIHRoaXMuY2FtLnJpZ2h0ID0gdGhpcy5zcGVjLndpZHRoKCkgLyAyO1xuICAgICAgdGhpcy5jYW0udG9wID0gdGhpcy5zcGVjLmhlaWdodCgpIC8gMjtcbiAgICAgIHRoaXMuY2FtLmJvdHRvbSA9IC10aGlzLnNwZWMuaGVpZ2h0KCkgLyAyO1xuICAgIH1cbiAgICB0aGlzLmNhbS5wb3NpdGlvbi5jb3B5KHRoaXMuc3BlYy5wb3NpdGlvbik7XG4gICAgdGhpcy5jYW0ubmVhciA9IHRoaXMuc3BlYy5uZWFyO1xuICAgIHRoaXMuY2FtLmZhciA9IHRoaXMuc3BlYy5mYXI7XG4gICAgdGhpcy5jYW0udXBkYXRlUHJvamVjdGlvbk1hdHJpeCgpO1xuICB9O1xuXG4gIENhbWVyYS5wcm90b3R5cGUuZW5hYmxlTGF5ZXIgPSBmdW5jdGlvbiBlbmFibGVMYXllcihuKSB7XG4gICAgdGhpcy5jYW0ubGF5ZXJzLmVuYWJsZShuKTtcbiAgfTtcblxuICBDYW1lcmEucHJvdG90eXBlLmRpc2FibGVMYXllciA9IGZ1bmN0aW9uIGRpc2FibGVMYXllcihuKSB7XG4gICAgdGhpcy5jYW0ubGF5ZXJzLmRpc2FibGUobik7XG4gIH07XG5cbiAgQ2FtZXJhLnByb3RvdHlwZS50b2dnbGVMYXllciA9IGZ1bmN0aW9uIHRvZ2dsZUxheWVyKG4pIHtcbiAgICB0aGlzLmNhbS5sYXllcnMudG9nZ2xlKG4pO1xuICB9O1xuXG4gIHJldHVybiBDYW1lcmE7XG59KCk7XG5cbi8vICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4vLyAgU0NFTkUgQ0xBU1Ncbi8vXG4vLyAgVEhSRUUuanMgc2NlbmUgaXMgdXNlZCBieSBEUkFXSU5HIGNsYXNzZXNcbi8vXG4vLyAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxudmFyIFNjZW5lID0gZnVuY3Rpb24gKCkge1xuICBmdW5jdGlvbiBTY2VuZShjYW1lcmFTcGVjLCByZW5kZXJlclNwZWMpIHtcbiAgICBjbGFzc0NhbGxDaGVjayh0aGlzLCBTY2VuZSk7XG5cbiAgICB0aGlzLmNhbWVyYVNwZWMgPSBjYW1lcmFTcGVjO1xuICAgIHRoaXMucmVuZGVyZXJTcGVjID0gcmVuZGVyZXJTcGVjO1xuICAgIHRoaXMuaW5pdCgpO1xuICB9XG5cbiAgU2NlbmUucHJvdG90eXBlLmluaXQgPSBmdW5jdGlvbiBpbml0KCkge1xuICAgIHRoaXMuc2NlbmUgPSBuZXcgVEhSRUUuU2NlbmUoKTtcbiAgICB0aGlzLmNhbWVyYSA9IG5ldyBDYW1lcmEodGhpcy5jYW1lcmFTcGVjKTtcbiAgICB0aGlzLnNjZW5lLmFkZCh0aGlzLmNhbWVyYS5jYW0pO1xuICAgIHRoaXMucmVuZGVyZXIgPSBuZXcgUmVuZGVyZXIodGhpcy5yZW5kZXJlclNwZWMpO1xuICB9O1xuXG4gIFNjZW5lLnByb3RvdHlwZS5hZGQgPSBmdW5jdGlvbiBhZGQoKSB7XG4gICAgZm9yICh2YXIgX2xlbiA9IGFyZ3VtZW50cy5sZW5ndGgsIG9iamVjdHMgPSBBcnJheShfbGVuKSwgX2tleSA9IDA7IF9rZXkgPCBfbGVuOyBfa2V5KyspIHtcbiAgICAgIG9iamVjdHNbX2tleV0gPSBhcmd1bWVudHNbX2tleV07XG4gICAgfVxuXG4gICAgZm9yICh2YXIgX2l0ZXJhdG9yID0gb2JqZWN0cywgX2lzQXJyYXkgPSBBcnJheS5pc0FycmF5KF9pdGVyYXRvciksIF9pID0gMCwgX2l0ZXJhdG9yID0gX2lzQXJyYXkgPyBfaXRlcmF0b3IgOiBfaXRlcmF0b3JbU3ltYm9sLml0ZXJhdG9yXSgpOzspIHtcbiAgICAgIHZhciBfcmVmO1xuXG4gICAgICBpZiAoX2lzQXJyYXkpIHtcbiAgICAgICAgaWYgKF9pID49IF9pdGVyYXRvci5sZW5ndGgpIGJyZWFrO1xuICAgICAgICBfcmVmID0gX2l0ZXJhdG9yW19pKytdO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgX2kgPSBfaXRlcmF0b3IubmV4dCgpO1xuICAgICAgICBpZiAoX2kuZG9uZSkgYnJlYWs7XG4gICAgICAgIF9yZWYgPSBfaS52YWx1ZTtcbiAgICAgIH1cblxuICAgICAgdmFyIG9iamVjdCA9IF9yZWY7XG5cbiAgICAgIHRoaXMuc2NlbmUuYWRkKG9iamVjdCk7XG4gICAgfVxuICB9O1xuXG4gIFNjZW5lLnByb3RvdHlwZS5yZXNldCA9IGZ1bmN0aW9uIHJlc2V0KCkge1xuICAgIHRoaXMuY2xlYXJTY2VuZSgpO1xuICAgIHRoaXMuY2FtZXJhLnNldCgpO1xuICAgIHRoaXMucmVuZGVyZXIuc2V0U2l6ZSgpO1xuICB9O1xuXG4gIFNjZW5lLnByb3RvdHlwZS5jbGVhclNjZW5lID0gZnVuY3Rpb24gY2xlYXJTY2VuZSgpIHtcbiAgICBmb3IgKHZhciBpID0gdGhpcy5zY2VuZS5jaGlsZHJlbi5sZW5ndGggLSAxOyBpID49IDA7IGktLSkge1xuICAgICAgdGhpcy5zY2VuZS5yZW1vdmUodGhpcy5zY2VuZS5jaGlsZHJlbltpXSk7XG4gICAgfVxuICB9O1xuXG4gIFNjZW5lLnByb3RvdHlwZS5jYW5jZWxSZW5kZXIgPSBmdW5jdGlvbiBjYW5jZWxSZW5kZXIoKSB7XG4gICAgdGhpcy5yZW5kZXJlci5jYW5jZWxSZW5kZXIoKTtcbiAgfTtcblxuICBTY2VuZS5wcm90b3R5cGUucmVuZGVyID0gZnVuY3Rpb24gcmVuZGVyKCkge1xuICAgIHRoaXMucmVuZGVyZXIucmVuZGVyKHRoaXMuc2NlbmUsIHRoaXMuY2FtZXJhLmNhbSk7XG4gIH07XG5cbiAgcmV0dXJuIFNjZW5lO1xufSgpO1xuXG52YXIgdGhyb3R0bGUgPSByZXF1aXJlKCdsb2Rhc2gudGhyb3R0bGUnKTtcblxuLy9ob2xkIGEgcmVmZXJlbmNlIHRvIGFsbCBkcmF3aW5ncyBzbyB0aGF0IHRoZXkgY2FuIGJlIHJlc2V0IGVhc2lseVxudmFyIGRyYXdpbmdzID0ge307XG5cbnZhciByZXNldERyYXdpbmdzID0gZnVuY3Rpb24gKCkge1xuICBPYmplY3Qua2V5cyhkcmF3aW5ncykuZm9yRWFjaChmdW5jdGlvbiAoa2V5KSB7XG4gICAgZHJhd2luZ3Nba2V5XS5yZXNldCgpO1xuICB9KTtcbn07XG5cbndpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdyZXNpemUnLCB0aHJvdHRsZShmdW5jdGlvbiAoKSB7XG4gIHJlc2V0RHJhd2luZ3MoKTtcbn0sIDUwMCksIGZhbHNlKTtcblxuLy8gKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbi8vXG4vLyAgRFJBV0lORyBDTEFTU1xuLy9cbi8vICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG52YXIgRHJhd2luZyA9IGZ1bmN0aW9uICgpIHtcbiAgZnVuY3Rpb24gRHJhd2luZyhjYW1lcmFTcGVjLCByZW5kZXJlclNwZWMpIHtcbiAgICBjbGFzc0NhbGxDaGVjayh0aGlzLCBEcmF3aW5nKTtcblxuICAgIHRoaXMuc2NlbmUgPSBuZXcgU2NlbmUoY2FtZXJhU3BlYywgcmVuZGVyZXJTcGVjKTtcbiAgICB0aGlzLmNhbWVyYSA9IHRoaXMuc2NlbmUuY2FtZXJhO1xuXG4gICAgdGhpcy51dWlkID0gVEhSRUUuTWF0aC5nZW5lcmF0ZVVVSUQoKTtcbiAgICBkcmF3aW5nc1t0aGlzLnV1aWRdID0gdGhpcztcblxuICAgIHRoaXMuaW5pdCgpO1xuICB9XG5cbiAgLy9nZXRzIGNhbGxlZCBvbiB3aW5kb3cgcmVzaXplIG9yIG90aGVyIGV2ZW50cyB0aGF0IHJlcXVpcmUgcmVjYWxjdWxhdGlvbiBvZlxuICAvL29iamVjdCBkaW1lbnNpb25zXG5cblxuICBEcmF3aW5nLnByb3RvdHlwZS5yZXNldCA9IGZ1bmN0aW9uIHJlc2V0KCkge1xuICAgIHRoaXMuc2NlbmUucmVzZXQoKTtcbiAgICB0aGlzLmluaXQoKTtcbiAgfTtcblxuICBEcmF3aW5nLnByb3RvdHlwZS5yZW5kZXIgPSBmdW5jdGlvbiByZW5kZXIoKSB7XG4gICAgdGhpcy5zY2VuZS5yZW5kZXIoKTtcbiAgfTtcblxuICBEcmF3aW5nLnByb3RvdHlwZS5jYW5jZWxSZW5kZXIgPSBmdW5jdGlvbiBjYW5jZWxSZW5kZXIoKSB7XG4gICAgdGhpcy5zY2VuZS5yZW5kZXJlci5jYW5jZWxSZW5kZXIoKTtcbiAgfTtcblxuICByZXR1cm4gRHJhd2luZztcbn0oKTtcblxuLy8gKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbi8vIFBlcmZvcm0gdmFyaW91cyBpbml0aWFsaXNhdGlvbiBjaGVja3MgYW5kIHNldHVwXG4vLyAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxudmFyIG1vZHVsZU5hbWUgPSAndW5uYW1lZFRIUkVFU2V0dXBNb2R1bGUnO1xuLy9UT0RPOiB0dXJuIGNoZWNrIGZ1bmN0aW9ucyBpbnRvIHByb3BlciBjaGVja3NcbnZhciBjaGVja1RIUkVFTG9hZGVkID0gZnVuY3Rpb24gKCkge1xuICBpZiAodHlwZW9mIFRIUkVFID09PSAndW5kZWZpbmVkJykge1xuICAgIHZhciBtc2cgPSBtb2R1bGVOYW1lICsgJyBFcnJvcjogVEhSRUUgbm90IGxvYWRlZC4gVEhSRUUuanMgbXVzdCBiZSBsb2FkZWQgYmVmb3JlIHRoaXMgbW9kdWxlXFxuJztcbiAgICBtc2cgKz0gJ1RyeSBhZGRpbmcgPHNjcmlwdCBzcmM9XCJodHRwczovL2NkbmpzLmNsb3VkZmxhcmUuY29tL2FqYXgvbGlicy90aHJlZS5qcy9yNzkvdGhyZWUubWluLmpzXCI+JztcbiAgICBtc2cgKz0gJzwvc2NyaXB0PiB0byB5b3VyIDxoZWFkPic7XG4gICAgY29uc29sZS5lcnJvcihtc2cpO1xuICB9XG59O1xuXG5jaGVja1RIUkVFTG9hZGVkKCk7XG5cbnZhciBjaGVja0dTQVBMb2FkZWQgPSBmdW5jdGlvbiAoKSB7XG4gIGlmICh0eXBlb2YgVHdlZW5MaXRlID09PSAndW5kZWZpbmVkJykge1xuICAgIHZhciBtc2cgPSBtb2R1bGVOYW1lICsgJyBFcnJvcjogR1NBUCBub3QgbG9hZGVkLlxcbic7XG4gICAgbXNnICs9ICdJZiB5b3UgZG8gbm90IHdpc2ggdG8gdXNlIEdTQVAgc2V0ICcgKyBtb2R1bGVOYW1lICsgJy5jb25maWcudXNlR1NBUCA9IGZhbHNlXFxuJztcbiAgICBtc2cgKz0gJ090aGVyd2lzZSB0cnkgYWRkaW5nIDxzY3JpcHQgc3JjPVwiaHR0cHM6Ly9jZG5qcy5jbG91ZGZsYXJlLmNvbS9hamF4L2xpYnMvZ3NhcC8xLjE5LjAvVHdlZW5NYXgubWluLmpzXCI+JztcbiAgICBtc2cgKz0gJzwvc2NyaXB0PiB0byB5b3VyIDxoZWFkPic7XG4gICAgY29uc29sZS5lcnJvcihtc2cpO1xuICB9XG59O1xuXG52YXIgY2hlY2tIZWFydGNvZGVMb2FkZWQgPSBmdW5jdGlvbiAoKSB7XG4gIGlmICh0eXBlb2YgQ2FudmFzTG9hZGVyID09PSAndW5kZWZpbmVkJykge1xuICAgIHZhciBtc2cgPSBtb2R1bGVOYW1lICsgJyBFcnJvcjogSGVhcnRjb2RlTG9hZGVyIG5vdCBsb2FkZWQuXFxuJztcbiAgICBtc2cgKz0gJ0lmIHlvdSBkbyBub3Qgd2lzaCB0byB1c2UgSGVhcnRjb2RlTG9hZGVyIHNldCAnICsgbW9kdWxlTmFtZSArICcuY29uZmlnLnVzZUhlYXJ0Y29kZUxvYWRlciA9IGZhbHNlXFxuJztcbiAgICBtc2cgKz0gJ090aGVyd2lzZSBnZXQgaHR0cHM6Ly9yYXcuZ2l0aHVidXNlcmNvbnRlbnQuY29tL2hlYXJ0Y29kZS8nO1xuICAgIG1zZyArPSAnQ2FudmFzTG9hZGVyL21hc3Rlci9qcy9oZWFydGNvZGUtY2FudmFzbG9hZGVyLW1pbi5qc1xcbic7XG4gICAgbXNnICs9ICdhbmQgYWRkIDxzY3JpcHQgc3JjPVwicGF0aC10by1zY3JpcHQvaGVhcnRjb2RlLWNhbnZhc2xvYWRlci1taW4uanNcIj4nO1xuICAgIG1zZyArPSAnPC9zY3JpcHQ+IHRvIHlvdXIgPGhlYWQ+JztcbiAgICBjb25zb2xlLmVycm9yKG1zZyk7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG4gIHJldHVybiB0cnVlO1xufTtcblxudmFyIGFkZExvYWRlckVsZW0gPSBmdW5jdGlvbiAoKSB7XG4gIHZhciBlbGVtID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI2xvYWRpbmdPdmVybGF5Jyk7XG4gIGlmIChlbGVtID09PSBudWxsKSB7XG4gICAgdmFyIGxvYWRpbmdPdmVybGF5ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgbG9hZGluZ092ZXJsYXkuaWQgPSAnbG9hZGluZ092ZXJsYXknO1xuICAgIGxvYWRpbmdPdmVybGF5LnN0eWxlID0gJ3Bvc2l0aW9uOiBhYnNvbHV0ZTsgdG9wOiAwOyBsZWZ0OiAwOyB3aWR0aDogMTAwJTsgaGVpZ2h0OiAxMDAlO3otaW5kZXg6IDk5OTsgYmFja2dyb3VuZC1jb2xvcjogYmxhY2s7JztcbiAgICB2YXIgbG9hZGluZ0ljb24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICBsb2FkaW5nSWNvbi5pZCA9ICdsb2FkaW5nSWNvbic7XG4gICAgbG9hZGluZ0ljb24uc3R5bGUgPSAncG9zaXRpb246IGZpeGVkOyB0b3A6IDUwJTsgbGVmdDogNTAlOyAtd2Via2l0LXRyYW5zZm9ybTogdHJhbnNsYXRlKC01MCUsIC01MCUpOyAtbXMtdHJhbnNmb3JtOiB0cmFuc2xhdGUoLTUwJSwgLTUwJSk7IHRyYW5zZm9ybTogdHJhbnNsYXRlKC01MCUsIC01MCUpOyB9JztcblxuICAgIGxvYWRpbmdPdmVybGF5LmFwcGVuZENoaWxkKGxvYWRpbmdJY29uKTtcbiAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKGxvYWRpbmdPdmVybGF5KTtcbiAgfVxufTtcblxudmFyIGNoZWNrU3RhdHNMb2FkZWQgPSBmdW5jdGlvbiAoKSB7XG4gIGlmICh0eXBlb2YgU3RhdHMgPT09ICd1bmRlZmluZWQnKSB7XG4gICAgdmFyIG1zZyA9IG1vZHVsZU5hbWUgKyAnIEVycm9yOiBTdGF0cyBub3QgbG9hZGVkLlxcbic7XG4gICAgbXNnICs9ICdJZiB5b3UgZG8gbm90IHdpc2ggdG8gc2hvdyBTdGF0cyBzZXQgJyArIG1vZHVsZU5hbWUgKyAnLmNvbmZpZy5zaG93U3RhdHMgPSBmYWxzZVxcbic7XG4gICAgbXNnICs9ICdPdGhlcndpc2UgZ2V0IGh0dHBzOi8vcmF3LmdpdGh1YnVzZXJjb250ZW50LmNvbS9tcmRvb2Ivc3RhdHMuanMvbWFzdGVyL2J1aWxkL3N0YXRzLm1pbi5qc1xcbic7XG4gICAgbXNnICs9ICdhbmQgYWRkIDxzY3JpcHQgc3JjPVwicGF0aC10by1zY3JpcHQvc3RhdHMubWluLmpzXCI+JztcbiAgICBtc2cgKz0gJzwvc2NyaXB0PiB0byB5b3VyIDxoZWFkPic7XG4gICAgY29uc29sZS5lcnJvcihtc2cpO1xuICAgIGNvbmZpZy5zaG93U3RhdHMgPSBmYWxzZTtcbiAgfVxufTtcblxudmFyIGluaXQgPSBmdW5jdGlvbiAoKSB7XG4gIGlmIChjb25maWcudXNlR1NBUCkgY2hlY2tHU0FQTG9hZGVkKCk7XG5cbiAgaWYgKGNvbmZpZy51c2VIZWFydGNvZGVMb2FkZXIpIHtcbiAgICBpZiAoY2hlY2tIZWFydGNvZGVMb2FkZWQoKSkge1xuICAgICAgYWRkTG9hZGVyRWxlbSgpO1xuICAgIH1cbiAgfVxuXG4gIGlmIChjb25maWcuc2hvd1N0YXRzKSBjaGVja1N0YXRzTG9hZGVkKCk7XG5cbiAgY29uZmlnLmluaXRDYWxsZWQgPSB0cnVlO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gIGluaXQ6IGluaXQsXG4gIGNvbmZpZzogY29uZmlnLFxuICBNZXNoT2JqZWN0OiBNZXNoT2JqZWN0LFxuICBEcmF3aW5nOiBEcmF3aW5nXG59OyIsIi8qKlxuICogbG9kYXNoIChDdXN0b20gQnVpbGQpIDxodHRwczovL2xvZGFzaC5jb20vPlxuICogQnVpbGQ6IGBsb2Rhc2ggbW9kdWxhcml6ZSBleHBvcnRzPVwibnBtXCIgLW8gLi9gXG4gKiBDb3B5cmlnaHQgalF1ZXJ5IEZvdW5kYXRpb24gYW5kIG90aGVyIGNvbnRyaWJ1dG9ycyA8aHR0cHM6Ly9qcXVlcnkub3JnLz5cbiAqIFJlbGVhc2VkIHVuZGVyIE1JVCBsaWNlbnNlIDxodHRwczovL2xvZGFzaC5jb20vbGljZW5zZT5cbiAqIEJhc2VkIG9uIFVuZGVyc2NvcmUuanMgMS44LjMgPGh0dHA6Ly91bmRlcnNjb3JlanMub3JnL0xJQ0VOU0U+XG4gKiBDb3B5cmlnaHQgSmVyZW15IEFzaGtlbmFzLCBEb2N1bWVudENsb3VkIGFuZCBJbnZlc3RpZ2F0aXZlIFJlcG9ydGVycyAmIEVkaXRvcnNcbiAqL1xuXG4vKiogVXNlZCBhcyB0aGUgYFR5cGVFcnJvcmAgbWVzc2FnZSBmb3IgXCJGdW5jdGlvbnNcIiBtZXRob2RzLiAqL1xudmFyIEZVTkNfRVJST1JfVEVYVCA9ICdFeHBlY3RlZCBhIGZ1bmN0aW9uJztcblxuLyoqIFVzZWQgYXMgcmVmZXJlbmNlcyBmb3IgdmFyaW91cyBgTnVtYmVyYCBjb25zdGFudHMuICovXG52YXIgTkFOID0gMCAvIDA7XG5cbi8qKiBgT2JqZWN0I3RvU3RyaW5nYCByZXN1bHQgcmVmZXJlbmNlcy4gKi9cbnZhciBzeW1ib2xUYWcgPSAnW29iamVjdCBTeW1ib2xdJztcblxuLyoqIFVzZWQgdG8gbWF0Y2ggbGVhZGluZyBhbmQgdHJhaWxpbmcgd2hpdGVzcGFjZS4gKi9cbnZhciByZVRyaW0gPSAvXlxccyt8XFxzKyQvZztcblxuLyoqIFVzZWQgdG8gZGV0ZWN0IGJhZCBzaWduZWQgaGV4YWRlY2ltYWwgc3RyaW5nIHZhbHVlcy4gKi9cbnZhciByZUlzQmFkSGV4ID0gL15bLStdMHhbMC05YS1mXSskL2k7XG5cbi8qKiBVc2VkIHRvIGRldGVjdCBiaW5hcnkgc3RyaW5nIHZhbHVlcy4gKi9cbnZhciByZUlzQmluYXJ5ID0gL14wYlswMV0rJC9pO1xuXG4vKiogVXNlZCB0byBkZXRlY3Qgb2N0YWwgc3RyaW5nIHZhbHVlcy4gKi9cbnZhciByZUlzT2N0YWwgPSAvXjBvWzAtN10rJC9pO1xuXG4vKiogQnVpbHQtaW4gbWV0aG9kIHJlZmVyZW5jZXMgd2l0aG91dCBhIGRlcGVuZGVuY3kgb24gYHJvb3RgLiAqL1xudmFyIGZyZWVQYXJzZUludCA9IHBhcnNlSW50O1xuXG4vKiogRGV0ZWN0IGZyZWUgdmFyaWFibGUgYGdsb2JhbGAgZnJvbSBOb2RlLmpzLiAqL1xudmFyIGZyZWVHbG9iYWwgPSB0eXBlb2YgZ2xvYmFsID09ICdvYmplY3QnICYmIGdsb2JhbCAmJiBnbG9iYWwuT2JqZWN0ID09PSBPYmplY3QgJiYgZ2xvYmFsO1xuXG4vKiogRGV0ZWN0IGZyZWUgdmFyaWFibGUgYHNlbGZgLiAqL1xudmFyIGZyZWVTZWxmID0gdHlwZW9mIHNlbGYgPT0gJ29iamVjdCcgJiYgc2VsZiAmJiBzZWxmLk9iamVjdCA9PT0gT2JqZWN0ICYmIHNlbGY7XG5cbi8qKiBVc2VkIGFzIGEgcmVmZXJlbmNlIHRvIHRoZSBnbG9iYWwgb2JqZWN0LiAqL1xudmFyIHJvb3QgPSBmcmVlR2xvYmFsIHx8IGZyZWVTZWxmIHx8IEZ1bmN0aW9uKCdyZXR1cm4gdGhpcycpKCk7XG5cbi8qKiBVc2VkIGZvciBidWlsdC1pbiBtZXRob2QgcmVmZXJlbmNlcy4gKi9cbnZhciBvYmplY3RQcm90byA9IE9iamVjdC5wcm90b3R5cGU7XG5cbi8qKlxuICogVXNlZCB0byByZXNvbHZlIHRoZVxuICogW2B0b1N0cmluZ1RhZ2BdKGh0dHA6Ly9lY21hLWludGVybmF0aW9uYWwub3JnL2VjbWEtMjYyLzcuMC8jc2VjLW9iamVjdC5wcm90b3R5cGUudG9zdHJpbmcpXG4gKiBvZiB2YWx1ZXMuXG4gKi9cbnZhciBvYmplY3RUb1N0cmluZyA9IG9iamVjdFByb3RvLnRvU3RyaW5nO1xuXG4vKiBCdWlsdC1pbiBtZXRob2QgcmVmZXJlbmNlcyBmb3IgdGhvc2Ugd2l0aCB0aGUgc2FtZSBuYW1lIGFzIG90aGVyIGBsb2Rhc2hgIG1ldGhvZHMuICovXG52YXIgbmF0aXZlTWF4ID0gTWF0aC5tYXgsXG4gICAgbmF0aXZlTWluID0gTWF0aC5taW47XG5cbi8qKlxuICogR2V0cyB0aGUgdGltZXN0YW1wIG9mIHRoZSBudW1iZXIgb2YgbWlsbGlzZWNvbmRzIHRoYXQgaGF2ZSBlbGFwc2VkIHNpbmNlXG4gKiB0aGUgVW5peCBlcG9jaCAoMSBKYW51YXJ5IDE5NzAgMDA6MDA6MDAgVVRDKS5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDIuNC4wXG4gKiBAY2F0ZWdvcnkgRGF0ZVxuICogQHJldHVybnMge251bWJlcn0gUmV0dXJucyB0aGUgdGltZXN0YW1wLlxuICogQGV4YW1wbGVcbiAqXG4gKiBfLmRlZmVyKGZ1bmN0aW9uKHN0YW1wKSB7XG4gKiAgIGNvbnNvbGUubG9nKF8ubm93KCkgLSBzdGFtcCk7XG4gKiB9LCBfLm5vdygpKTtcbiAqIC8vID0+IExvZ3MgdGhlIG51bWJlciBvZiBtaWxsaXNlY29uZHMgaXQgdG9vayBmb3IgdGhlIGRlZmVycmVkIGludm9jYXRpb24uXG4gKi9cbnZhciBub3cgPSBmdW5jdGlvbigpIHtcbiAgcmV0dXJuIHJvb3QuRGF0ZS5ub3coKTtcbn07XG5cbi8qKlxuICogQ3JlYXRlcyBhIGRlYm91bmNlZCBmdW5jdGlvbiB0aGF0IGRlbGF5cyBpbnZva2luZyBgZnVuY2AgdW50aWwgYWZ0ZXIgYHdhaXRgXG4gKiBtaWxsaXNlY29uZHMgaGF2ZSBlbGFwc2VkIHNpbmNlIHRoZSBsYXN0IHRpbWUgdGhlIGRlYm91bmNlZCBmdW5jdGlvbiB3YXNcbiAqIGludm9rZWQuIFRoZSBkZWJvdW5jZWQgZnVuY3Rpb24gY29tZXMgd2l0aCBhIGBjYW5jZWxgIG1ldGhvZCB0byBjYW5jZWxcbiAqIGRlbGF5ZWQgYGZ1bmNgIGludm9jYXRpb25zIGFuZCBhIGBmbHVzaGAgbWV0aG9kIHRvIGltbWVkaWF0ZWx5IGludm9rZSB0aGVtLlxuICogUHJvdmlkZSBgb3B0aW9uc2AgdG8gaW5kaWNhdGUgd2hldGhlciBgZnVuY2Agc2hvdWxkIGJlIGludm9rZWQgb24gdGhlXG4gKiBsZWFkaW5nIGFuZC9vciB0cmFpbGluZyBlZGdlIG9mIHRoZSBgd2FpdGAgdGltZW91dC4gVGhlIGBmdW5jYCBpcyBpbnZva2VkXG4gKiB3aXRoIHRoZSBsYXN0IGFyZ3VtZW50cyBwcm92aWRlZCB0byB0aGUgZGVib3VuY2VkIGZ1bmN0aW9uLiBTdWJzZXF1ZW50XG4gKiBjYWxscyB0byB0aGUgZGVib3VuY2VkIGZ1bmN0aW9uIHJldHVybiB0aGUgcmVzdWx0IG9mIHRoZSBsYXN0IGBmdW5jYFxuICogaW52b2NhdGlvbi5cbiAqXG4gKiAqKk5vdGU6KiogSWYgYGxlYWRpbmdgIGFuZCBgdHJhaWxpbmdgIG9wdGlvbnMgYXJlIGB0cnVlYCwgYGZ1bmNgIGlzXG4gKiBpbnZva2VkIG9uIHRoZSB0cmFpbGluZyBlZGdlIG9mIHRoZSB0aW1lb3V0IG9ubHkgaWYgdGhlIGRlYm91bmNlZCBmdW5jdGlvblxuICogaXMgaW52b2tlZCBtb3JlIHRoYW4gb25jZSBkdXJpbmcgdGhlIGB3YWl0YCB0aW1lb3V0LlxuICpcbiAqIElmIGB3YWl0YCBpcyBgMGAgYW5kIGBsZWFkaW5nYCBpcyBgZmFsc2VgLCBgZnVuY2AgaW52b2NhdGlvbiBpcyBkZWZlcnJlZFxuICogdW50aWwgdG8gdGhlIG5leHQgdGljaywgc2ltaWxhciB0byBgc2V0VGltZW91dGAgd2l0aCBhIHRpbWVvdXQgb2YgYDBgLlxuICpcbiAqIFNlZSBbRGF2aWQgQ29yYmFjaG8ncyBhcnRpY2xlXShodHRwczovL2Nzcy10cmlja3MuY29tL2RlYm91bmNpbmctdGhyb3R0bGluZy1leHBsYWluZWQtZXhhbXBsZXMvKVxuICogZm9yIGRldGFpbHMgb3ZlciB0aGUgZGlmZmVyZW5jZXMgYmV0d2VlbiBgXy5kZWJvdW5jZWAgYW5kIGBfLnRocm90dGxlYC5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDAuMS4wXG4gKiBAY2F0ZWdvcnkgRnVuY3Rpb25cbiAqIEBwYXJhbSB7RnVuY3Rpb259IGZ1bmMgVGhlIGZ1bmN0aW9uIHRvIGRlYm91bmNlLlxuICogQHBhcmFtIHtudW1iZXJ9IFt3YWl0PTBdIFRoZSBudW1iZXIgb2YgbWlsbGlzZWNvbmRzIHRvIGRlbGF5LlxuICogQHBhcmFtIHtPYmplY3R9IFtvcHRpb25zPXt9XSBUaGUgb3B0aW9ucyBvYmplY3QuXG4gKiBAcGFyYW0ge2Jvb2xlYW59IFtvcHRpb25zLmxlYWRpbmc9ZmFsc2VdXG4gKiAgU3BlY2lmeSBpbnZva2luZyBvbiB0aGUgbGVhZGluZyBlZGdlIG9mIHRoZSB0aW1lb3V0LlxuICogQHBhcmFtIHtudW1iZXJ9IFtvcHRpb25zLm1heFdhaXRdXG4gKiAgVGhlIG1heGltdW0gdGltZSBgZnVuY2AgaXMgYWxsb3dlZCB0byBiZSBkZWxheWVkIGJlZm9yZSBpdCdzIGludm9rZWQuXG4gKiBAcGFyYW0ge2Jvb2xlYW59IFtvcHRpb25zLnRyYWlsaW5nPXRydWVdXG4gKiAgU3BlY2lmeSBpbnZva2luZyBvbiB0aGUgdHJhaWxpbmcgZWRnZSBvZiB0aGUgdGltZW91dC5cbiAqIEByZXR1cm5zIHtGdW5jdGlvbn0gUmV0dXJucyB0aGUgbmV3IGRlYm91bmNlZCBmdW5jdGlvbi5cbiAqIEBleGFtcGxlXG4gKlxuICogLy8gQXZvaWQgY29zdGx5IGNhbGN1bGF0aW9ucyB3aGlsZSB0aGUgd2luZG93IHNpemUgaXMgaW4gZmx1eC5cbiAqIGpRdWVyeSh3aW5kb3cpLm9uKCdyZXNpemUnLCBfLmRlYm91bmNlKGNhbGN1bGF0ZUxheW91dCwgMTUwKSk7XG4gKlxuICogLy8gSW52b2tlIGBzZW5kTWFpbGAgd2hlbiBjbGlja2VkLCBkZWJvdW5jaW5nIHN1YnNlcXVlbnQgY2FsbHMuXG4gKiBqUXVlcnkoZWxlbWVudCkub24oJ2NsaWNrJywgXy5kZWJvdW5jZShzZW5kTWFpbCwgMzAwLCB7XG4gKiAgICdsZWFkaW5nJzogdHJ1ZSxcbiAqICAgJ3RyYWlsaW5nJzogZmFsc2VcbiAqIH0pKTtcbiAqXG4gKiAvLyBFbnN1cmUgYGJhdGNoTG9nYCBpcyBpbnZva2VkIG9uY2UgYWZ0ZXIgMSBzZWNvbmQgb2YgZGVib3VuY2VkIGNhbGxzLlxuICogdmFyIGRlYm91bmNlZCA9IF8uZGVib3VuY2UoYmF0Y2hMb2csIDI1MCwgeyAnbWF4V2FpdCc6IDEwMDAgfSk7XG4gKiB2YXIgc291cmNlID0gbmV3IEV2ZW50U291cmNlKCcvc3RyZWFtJyk7XG4gKiBqUXVlcnkoc291cmNlKS5vbignbWVzc2FnZScsIGRlYm91bmNlZCk7XG4gKlxuICogLy8gQ2FuY2VsIHRoZSB0cmFpbGluZyBkZWJvdW5jZWQgaW52b2NhdGlvbi5cbiAqIGpRdWVyeSh3aW5kb3cpLm9uKCdwb3BzdGF0ZScsIGRlYm91bmNlZC5jYW5jZWwpO1xuICovXG5mdW5jdGlvbiBkZWJvdW5jZShmdW5jLCB3YWl0LCBvcHRpb25zKSB7XG4gIHZhciBsYXN0QXJncyxcbiAgICAgIGxhc3RUaGlzLFxuICAgICAgbWF4V2FpdCxcbiAgICAgIHJlc3VsdCxcbiAgICAgIHRpbWVySWQsXG4gICAgICBsYXN0Q2FsbFRpbWUsXG4gICAgICBsYXN0SW52b2tlVGltZSA9IDAsXG4gICAgICBsZWFkaW5nID0gZmFsc2UsXG4gICAgICBtYXhpbmcgPSBmYWxzZSxcbiAgICAgIHRyYWlsaW5nID0gdHJ1ZTtcblxuICBpZiAodHlwZW9mIGZ1bmMgIT0gJ2Z1bmN0aW9uJykge1xuICAgIHRocm93IG5ldyBUeXBlRXJyb3IoRlVOQ19FUlJPUl9URVhUKTtcbiAgfVxuICB3YWl0ID0gdG9OdW1iZXIod2FpdCkgfHwgMDtcbiAgaWYgKGlzT2JqZWN0KG9wdGlvbnMpKSB7XG4gICAgbGVhZGluZyA9ICEhb3B0aW9ucy5sZWFkaW5nO1xuICAgIG1heGluZyA9ICdtYXhXYWl0JyBpbiBvcHRpb25zO1xuICAgIG1heFdhaXQgPSBtYXhpbmcgPyBuYXRpdmVNYXgodG9OdW1iZXIob3B0aW9ucy5tYXhXYWl0KSB8fCAwLCB3YWl0KSA6IG1heFdhaXQ7XG4gICAgdHJhaWxpbmcgPSAndHJhaWxpbmcnIGluIG9wdGlvbnMgPyAhIW9wdGlvbnMudHJhaWxpbmcgOiB0cmFpbGluZztcbiAgfVxuXG4gIGZ1bmN0aW9uIGludm9rZUZ1bmModGltZSkge1xuICAgIHZhciBhcmdzID0gbGFzdEFyZ3MsXG4gICAgICAgIHRoaXNBcmcgPSBsYXN0VGhpcztcblxuICAgIGxhc3RBcmdzID0gbGFzdFRoaXMgPSB1bmRlZmluZWQ7XG4gICAgbGFzdEludm9rZVRpbWUgPSB0aW1lO1xuICAgIHJlc3VsdCA9IGZ1bmMuYXBwbHkodGhpc0FyZywgYXJncyk7XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxuXG4gIGZ1bmN0aW9uIGxlYWRpbmdFZGdlKHRpbWUpIHtcbiAgICAvLyBSZXNldCBhbnkgYG1heFdhaXRgIHRpbWVyLlxuICAgIGxhc3RJbnZva2VUaW1lID0gdGltZTtcbiAgICAvLyBTdGFydCB0aGUgdGltZXIgZm9yIHRoZSB0cmFpbGluZyBlZGdlLlxuICAgIHRpbWVySWQgPSBzZXRUaW1lb3V0KHRpbWVyRXhwaXJlZCwgd2FpdCk7XG4gICAgLy8gSW52b2tlIHRoZSBsZWFkaW5nIGVkZ2UuXG4gICAgcmV0dXJuIGxlYWRpbmcgPyBpbnZva2VGdW5jKHRpbWUpIDogcmVzdWx0O1xuICB9XG5cbiAgZnVuY3Rpb24gcmVtYWluaW5nV2FpdCh0aW1lKSB7XG4gICAgdmFyIHRpbWVTaW5jZUxhc3RDYWxsID0gdGltZSAtIGxhc3RDYWxsVGltZSxcbiAgICAgICAgdGltZVNpbmNlTGFzdEludm9rZSA9IHRpbWUgLSBsYXN0SW52b2tlVGltZSxcbiAgICAgICAgcmVzdWx0ID0gd2FpdCAtIHRpbWVTaW5jZUxhc3RDYWxsO1xuXG4gICAgcmV0dXJuIG1heGluZyA/IG5hdGl2ZU1pbihyZXN1bHQsIG1heFdhaXQgLSB0aW1lU2luY2VMYXN0SW52b2tlKSA6IHJlc3VsdDtcbiAgfVxuXG4gIGZ1bmN0aW9uIHNob3VsZEludm9rZSh0aW1lKSB7XG4gICAgdmFyIHRpbWVTaW5jZUxhc3RDYWxsID0gdGltZSAtIGxhc3RDYWxsVGltZSxcbiAgICAgICAgdGltZVNpbmNlTGFzdEludm9rZSA9IHRpbWUgLSBsYXN0SW52b2tlVGltZTtcblxuICAgIC8vIEVpdGhlciB0aGlzIGlzIHRoZSBmaXJzdCBjYWxsLCBhY3Rpdml0eSBoYXMgc3RvcHBlZCBhbmQgd2UncmUgYXQgdGhlXG4gICAgLy8gdHJhaWxpbmcgZWRnZSwgdGhlIHN5c3RlbSB0aW1lIGhhcyBnb25lIGJhY2t3YXJkcyBhbmQgd2UncmUgdHJlYXRpbmdcbiAgICAvLyBpdCBhcyB0aGUgdHJhaWxpbmcgZWRnZSwgb3Igd2UndmUgaGl0IHRoZSBgbWF4V2FpdGAgbGltaXQuXG4gICAgcmV0dXJuIChsYXN0Q2FsbFRpbWUgPT09IHVuZGVmaW5lZCB8fCAodGltZVNpbmNlTGFzdENhbGwgPj0gd2FpdCkgfHxcbiAgICAgICh0aW1lU2luY2VMYXN0Q2FsbCA8IDApIHx8IChtYXhpbmcgJiYgdGltZVNpbmNlTGFzdEludm9rZSA+PSBtYXhXYWl0KSk7XG4gIH1cblxuICBmdW5jdGlvbiB0aW1lckV4cGlyZWQoKSB7XG4gICAgdmFyIHRpbWUgPSBub3coKTtcbiAgICBpZiAoc2hvdWxkSW52b2tlKHRpbWUpKSB7XG4gICAgICByZXR1cm4gdHJhaWxpbmdFZGdlKHRpbWUpO1xuICAgIH1cbiAgICAvLyBSZXN0YXJ0IHRoZSB0aW1lci5cbiAgICB0aW1lcklkID0gc2V0VGltZW91dCh0aW1lckV4cGlyZWQsIHJlbWFpbmluZ1dhaXQodGltZSkpO1xuICB9XG5cbiAgZnVuY3Rpb24gdHJhaWxpbmdFZGdlKHRpbWUpIHtcbiAgICB0aW1lcklkID0gdW5kZWZpbmVkO1xuXG4gICAgLy8gT25seSBpbnZva2UgaWYgd2UgaGF2ZSBgbGFzdEFyZ3NgIHdoaWNoIG1lYW5zIGBmdW5jYCBoYXMgYmVlblxuICAgIC8vIGRlYm91bmNlZCBhdCBsZWFzdCBvbmNlLlxuICAgIGlmICh0cmFpbGluZyAmJiBsYXN0QXJncykge1xuICAgICAgcmV0dXJuIGludm9rZUZ1bmModGltZSk7XG4gICAgfVxuICAgIGxhc3RBcmdzID0gbGFzdFRoaXMgPSB1bmRlZmluZWQ7XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxuXG4gIGZ1bmN0aW9uIGNhbmNlbCgpIHtcbiAgICBpZiAodGltZXJJZCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICBjbGVhclRpbWVvdXQodGltZXJJZCk7XG4gICAgfVxuICAgIGxhc3RJbnZva2VUaW1lID0gMDtcbiAgICBsYXN0QXJncyA9IGxhc3RDYWxsVGltZSA9IGxhc3RUaGlzID0gdGltZXJJZCA9IHVuZGVmaW5lZDtcbiAgfVxuXG4gIGZ1bmN0aW9uIGZsdXNoKCkge1xuICAgIHJldHVybiB0aW1lcklkID09PSB1bmRlZmluZWQgPyByZXN1bHQgOiB0cmFpbGluZ0VkZ2Uobm93KCkpO1xuICB9XG5cbiAgZnVuY3Rpb24gZGVib3VuY2VkKCkge1xuICAgIHZhciB0aW1lID0gbm93KCksXG4gICAgICAgIGlzSW52b2tpbmcgPSBzaG91bGRJbnZva2UodGltZSk7XG5cbiAgICBsYXN0QXJncyA9IGFyZ3VtZW50cztcbiAgICBsYXN0VGhpcyA9IHRoaXM7XG4gICAgbGFzdENhbGxUaW1lID0gdGltZTtcblxuICAgIGlmIChpc0ludm9raW5nKSB7XG4gICAgICBpZiAodGltZXJJZCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIHJldHVybiBsZWFkaW5nRWRnZShsYXN0Q2FsbFRpbWUpO1xuICAgICAgfVxuICAgICAgaWYgKG1heGluZykge1xuICAgICAgICAvLyBIYW5kbGUgaW52b2NhdGlvbnMgaW4gYSB0aWdodCBsb29wLlxuICAgICAgICB0aW1lcklkID0gc2V0VGltZW91dCh0aW1lckV4cGlyZWQsIHdhaXQpO1xuICAgICAgICByZXR1cm4gaW52b2tlRnVuYyhsYXN0Q2FsbFRpbWUpO1xuICAgICAgfVxuICAgIH1cbiAgICBpZiAodGltZXJJZCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICB0aW1lcklkID0gc2V0VGltZW91dCh0aW1lckV4cGlyZWQsIHdhaXQpO1xuICAgIH1cbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG4gIGRlYm91bmNlZC5jYW5jZWwgPSBjYW5jZWw7XG4gIGRlYm91bmNlZC5mbHVzaCA9IGZsdXNoO1xuICByZXR1cm4gZGVib3VuY2VkO1xufVxuXG4vKipcbiAqIENyZWF0ZXMgYSB0aHJvdHRsZWQgZnVuY3Rpb24gdGhhdCBvbmx5IGludm9rZXMgYGZ1bmNgIGF0IG1vc3Qgb25jZSBwZXJcbiAqIGV2ZXJ5IGB3YWl0YCBtaWxsaXNlY29uZHMuIFRoZSB0aHJvdHRsZWQgZnVuY3Rpb24gY29tZXMgd2l0aCBhIGBjYW5jZWxgXG4gKiBtZXRob2QgdG8gY2FuY2VsIGRlbGF5ZWQgYGZ1bmNgIGludm9jYXRpb25zIGFuZCBhIGBmbHVzaGAgbWV0aG9kIHRvXG4gKiBpbW1lZGlhdGVseSBpbnZva2UgdGhlbS4gUHJvdmlkZSBgb3B0aW9uc2AgdG8gaW5kaWNhdGUgd2hldGhlciBgZnVuY2BcbiAqIHNob3VsZCBiZSBpbnZva2VkIG9uIHRoZSBsZWFkaW5nIGFuZC9vciB0cmFpbGluZyBlZGdlIG9mIHRoZSBgd2FpdGBcbiAqIHRpbWVvdXQuIFRoZSBgZnVuY2AgaXMgaW52b2tlZCB3aXRoIHRoZSBsYXN0IGFyZ3VtZW50cyBwcm92aWRlZCB0byB0aGVcbiAqIHRocm90dGxlZCBmdW5jdGlvbi4gU3Vic2VxdWVudCBjYWxscyB0byB0aGUgdGhyb3R0bGVkIGZ1bmN0aW9uIHJldHVybiB0aGVcbiAqIHJlc3VsdCBvZiB0aGUgbGFzdCBgZnVuY2AgaW52b2NhdGlvbi5cbiAqXG4gKiAqKk5vdGU6KiogSWYgYGxlYWRpbmdgIGFuZCBgdHJhaWxpbmdgIG9wdGlvbnMgYXJlIGB0cnVlYCwgYGZ1bmNgIGlzXG4gKiBpbnZva2VkIG9uIHRoZSB0cmFpbGluZyBlZGdlIG9mIHRoZSB0aW1lb3V0IG9ubHkgaWYgdGhlIHRocm90dGxlZCBmdW5jdGlvblxuICogaXMgaW52b2tlZCBtb3JlIHRoYW4gb25jZSBkdXJpbmcgdGhlIGB3YWl0YCB0aW1lb3V0LlxuICpcbiAqIElmIGB3YWl0YCBpcyBgMGAgYW5kIGBsZWFkaW5nYCBpcyBgZmFsc2VgLCBgZnVuY2AgaW52b2NhdGlvbiBpcyBkZWZlcnJlZFxuICogdW50aWwgdG8gdGhlIG5leHQgdGljaywgc2ltaWxhciB0byBgc2V0VGltZW91dGAgd2l0aCBhIHRpbWVvdXQgb2YgYDBgLlxuICpcbiAqIFNlZSBbRGF2aWQgQ29yYmFjaG8ncyBhcnRpY2xlXShodHRwczovL2Nzcy10cmlja3MuY29tL2RlYm91bmNpbmctdGhyb3R0bGluZy1leHBsYWluZWQtZXhhbXBsZXMvKVxuICogZm9yIGRldGFpbHMgb3ZlciB0aGUgZGlmZmVyZW5jZXMgYmV0d2VlbiBgXy50aHJvdHRsZWAgYW5kIGBfLmRlYm91bmNlYC5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDAuMS4wXG4gKiBAY2F0ZWdvcnkgRnVuY3Rpb25cbiAqIEBwYXJhbSB7RnVuY3Rpb259IGZ1bmMgVGhlIGZ1bmN0aW9uIHRvIHRocm90dGxlLlxuICogQHBhcmFtIHtudW1iZXJ9IFt3YWl0PTBdIFRoZSBudW1iZXIgb2YgbWlsbGlzZWNvbmRzIHRvIHRocm90dGxlIGludm9jYXRpb25zIHRvLlxuICogQHBhcmFtIHtPYmplY3R9IFtvcHRpb25zPXt9XSBUaGUgb3B0aW9ucyBvYmplY3QuXG4gKiBAcGFyYW0ge2Jvb2xlYW59IFtvcHRpb25zLmxlYWRpbmc9dHJ1ZV1cbiAqICBTcGVjaWZ5IGludm9raW5nIG9uIHRoZSBsZWFkaW5nIGVkZ2Ugb2YgdGhlIHRpbWVvdXQuXG4gKiBAcGFyYW0ge2Jvb2xlYW59IFtvcHRpb25zLnRyYWlsaW5nPXRydWVdXG4gKiAgU3BlY2lmeSBpbnZva2luZyBvbiB0aGUgdHJhaWxpbmcgZWRnZSBvZiB0aGUgdGltZW91dC5cbiAqIEByZXR1cm5zIHtGdW5jdGlvbn0gUmV0dXJucyB0aGUgbmV3IHRocm90dGxlZCBmdW5jdGlvbi5cbiAqIEBleGFtcGxlXG4gKlxuICogLy8gQXZvaWQgZXhjZXNzaXZlbHkgdXBkYXRpbmcgdGhlIHBvc2l0aW9uIHdoaWxlIHNjcm9sbGluZy5cbiAqIGpRdWVyeSh3aW5kb3cpLm9uKCdzY3JvbGwnLCBfLnRocm90dGxlKHVwZGF0ZVBvc2l0aW9uLCAxMDApKTtcbiAqXG4gKiAvLyBJbnZva2UgYHJlbmV3VG9rZW5gIHdoZW4gdGhlIGNsaWNrIGV2ZW50IGlzIGZpcmVkLCBidXQgbm90IG1vcmUgdGhhbiBvbmNlIGV2ZXJ5IDUgbWludXRlcy5cbiAqIHZhciB0aHJvdHRsZWQgPSBfLnRocm90dGxlKHJlbmV3VG9rZW4sIDMwMDAwMCwgeyAndHJhaWxpbmcnOiBmYWxzZSB9KTtcbiAqIGpRdWVyeShlbGVtZW50KS5vbignY2xpY2snLCB0aHJvdHRsZWQpO1xuICpcbiAqIC8vIENhbmNlbCB0aGUgdHJhaWxpbmcgdGhyb3R0bGVkIGludm9jYXRpb24uXG4gKiBqUXVlcnkod2luZG93KS5vbigncG9wc3RhdGUnLCB0aHJvdHRsZWQuY2FuY2VsKTtcbiAqL1xuZnVuY3Rpb24gdGhyb3R0bGUoZnVuYywgd2FpdCwgb3B0aW9ucykge1xuICB2YXIgbGVhZGluZyA9IHRydWUsXG4gICAgICB0cmFpbGluZyA9IHRydWU7XG5cbiAgaWYgKHR5cGVvZiBmdW5jICE9ICdmdW5jdGlvbicpIHtcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKEZVTkNfRVJST1JfVEVYVCk7XG4gIH1cbiAgaWYgKGlzT2JqZWN0KG9wdGlvbnMpKSB7XG4gICAgbGVhZGluZyA9ICdsZWFkaW5nJyBpbiBvcHRpb25zID8gISFvcHRpb25zLmxlYWRpbmcgOiBsZWFkaW5nO1xuICAgIHRyYWlsaW5nID0gJ3RyYWlsaW5nJyBpbiBvcHRpb25zID8gISFvcHRpb25zLnRyYWlsaW5nIDogdHJhaWxpbmc7XG4gIH1cbiAgcmV0dXJuIGRlYm91bmNlKGZ1bmMsIHdhaXQsIHtcbiAgICAnbGVhZGluZyc6IGxlYWRpbmcsXG4gICAgJ21heFdhaXQnOiB3YWl0LFxuICAgICd0cmFpbGluZyc6IHRyYWlsaW5nXG4gIH0pO1xufVxuXG4vKipcbiAqIENoZWNrcyBpZiBgdmFsdWVgIGlzIHRoZVxuICogW2xhbmd1YWdlIHR5cGVdKGh0dHA6Ly93d3cuZWNtYS1pbnRlcm5hdGlvbmFsLm9yZy9lY21hLTI2Mi83LjAvI3NlYy1lY21hc2NyaXB0LWxhbmd1YWdlLXR5cGVzKVxuICogb2YgYE9iamVjdGAuIChlLmcuIGFycmF5cywgZnVuY3Rpb25zLCBvYmplY3RzLCByZWdleGVzLCBgbmV3IE51bWJlcigwKWAsIGFuZCBgbmV3IFN0cmluZygnJylgKVxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgMC4xLjBcbiAqIEBjYXRlZ29yeSBMYW5nXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlzIGFuIG9iamVjdCwgZWxzZSBgZmFsc2VgLlxuICogQGV4YW1wbGVcbiAqXG4gKiBfLmlzT2JqZWN0KHt9KTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzT2JqZWN0KFsxLCAyLCAzXSk7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5pc09iamVjdChfLm5vb3ApO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNPYmplY3QobnVsbCk7XG4gKiAvLyA9PiBmYWxzZVxuICovXG5mdW5jdGlvbiBpc09iamVjdCh2YWx1ZSkge1xuICB2YXIgdHlwZSA9IHR5cGVvZiB2YWx1ZTtcbiAgcmV0dXJuICEhdmFsdWUgJiYgKHR5cGUgPT0gJ29iamVjdCcgfHwgdHlwZSA9PSAnZnVuY3Rpb24nKTtcbn1cblxuLyoqXG4gKiBDaGVja3MgaWYgYHZhbHVlYCBpcyBvYmplY3QtbGlrZS4gQSB2YWx1ZSBpcyBvYmplY3QtbGlrZSBpZiBpdCdzIG5vdCBgbnVsbGBcbiAqIGFuZCBoYXMgYSBgdHlwZW9mYCByZXN1bHQgb2YgXCJvYmplY3RcIi5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDQuMC4wXG4gKiBAY2F0ZWdvcnkgTGFuZ1xuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBvYmplY3QtbGlrZSwgZWxzZSBgZmFsc2VgLlxuICogQGV4YW1wbGVcbiAqXG4gKiBfLmlzT2JqZWN0TGlrZSh7fSk7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5pc09iamVjdExpa2UoWzEsIDIsIDNdKTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzT2JqZWN0TGlrZShfLm5vb3ApO1xuICogLy8gPT4gZmFsc2VcbiAqXG4gKiBfLmlzT2JqZWN0TGlrZShudWxsKTtcbiAqIC8vID0+IGZhbHNlXG4gKi9cbmZ1bmN0aW9uIGlzT2JqZWN0TGlrZSh2YWx1ZSkge1xuICByZXR1cm4gISF2YWx1ZSAmJiB0eXBlb2YgdmFsdWUgPT0gJ29iamVjdCc7XG59XG5cbi8qKlxuICogQ2hlY2tzIGlmIGB2YWx1ZWAgaXMgY2xhc3NpZmllZCBhcyBhIGBTeW1ib2xgIHByaW1pdGl2ZSBvciBvYmplY3QuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBzaW5jZSA0LjAuMFxuICogQGNhdGVnb3J5IExhbmdcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgYSBzeW1ib2wsIGVsc2UgYGZhbHNlYC5cbiAqIEBleGFtcGxlXG4gKlxuICogXy5pc1N5bWJvbChTeW1ib2wuaXRlcmF0b3IpO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNTeW1ib2woJ2FiYycpO1xuICogLy8gPT4gZmFsc2VcbiAqL1xuZnVuY3Rpb24gaXNTeW1ib2wodmFsdWUpIHtcbiAgcmV0dXJuIHR5cGVvZiB2YWx1ZSA9PSAnc3ltYm9sJyB8fFxuICAgIChpc09iamVjdExpa2UodmFsdWUpICYmIG9iamVjdFRvU3RyaW5nLmNhbGwodmFsdWUpID09IHN5bWJvbFRhZyk7XG59XG5cbi8qKlxuICogQ29udmVydHMgYHZhbHVlYCB0byBhIG51bWJlci5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDQuMC4wXG4gKiBAY2F0ZWdvcnkgTGFuZ1xuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gcHJvY2Vzcy5cbiAqIEByZXR1cm5zIHtudW1iZXJ9IFJldHVybnMgdGhlIG51bWJlci5cbiAqIEBleGFtcGxlXG4gKlxuICogXy50b051bWJlcigzLjIpO1xuICogLy8gPT4gMy4yXG4gKlxuICogXy50b051bWJlcihOdW1iZXIuTUlOX1ZBTFVFKTtcbiAqIC8vID0+IDVlLTMyNFxuICpcbiAqIF8udG9OdW1iZXIoSW5maW5pdHkpO1xuICogLy8gPT4gSW5maW5pdHlcbiAqXG4gKiBfLnRvTnVtYmVyKCczLjInKTtcbiAqIC8vID0+IDMuMlxuICovXG5mdW5jdGlvbiB0b051bWJlcih2YWx1ZSkge1xuICBpZiAodHlwZW9mIHZhbHVlID09ICdudW1iZXInKSB7XG4gICAgcmV0dXJuIHZhbHVlO1xuICB9XG4gIGlmIChpc1N5bWJvbCh2YWx1ZSkpIHtcbiAgICByZXR1cm4gTkFOO1xuICB9XG4gIGlmIChpc09iamVjdCh2YWx1ZSkpIHtcbiAgICB2YXIgb3RoZXIgPSB0eXBlb2YgdmFsdWUudmFsdWVPZiA9PSAnZnVuY3Rpb24nID8gdmFsdWUudmFsdWVPZigpIDogdmFsdWU7XG4gICAgdmFsdWUgPSBpc09iamVjdChvdGhlcikgPyAob3RoZXIgKyAnJykgOiBvdGhlcjtcbiAgfVxuICBpZiAodHlwZW9mIHZhbHVlICE9ICdzdHJpbmcnKSB7XG4gICAgcmV0dXJuIHZhbHVlID09PSAwID8gdmFsdWUgOiArdmFsdWU7XG4gIH1cbiAgdmFsdWUgPSB2YWx1ZS5yZXBsYWNlKHJlVHJpbSwgJycpO1xuICB2YXIgaXNCaW5hcnkgPSByZUlzQmluYXJ5LnRlc3QodmFsdWUpO1xuICByZXR1cm4gKGlzQmluYXJ5IHx8IHJlSXNPY3RhbC50ZXN0KHZhbHVlKSlcbiAgICA/IGZyZWVQYXJzZUludCh2YWx1ZS5zbGljZSgyKSwgaXNCaW5hcnkgPyAyIDogOClcbiAgICA6IChyZUlzQmFkSGV4LnRlc3QodmFsdWUpID8gTkFOIDogK3ZhbHVlKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSB0aHJvdHRsZTtcbiJdfQ==
