import {
  LoadingManager,
  ObjectLoader,
  TextureLoader,
  PerspectiveCamera,
  OrthographicCamera,
  Scene,
  Mesh,
  Math as _Math,
  WebGLRenderer,
  Vector3,
  BoxBufferGeometry,
  MeshBasicMaterial,
} from 'three/src/THREE';

window.THREE = {
  LoadingManager,
  ObjectLoader,
  TextureLoader,
  PerspectiveCamera,
  OrthographicCamera,
  Scene,
  Mesh,
  WebGLRenderer,
  Vector3,
  BoxBufferGeometry,
  MeshBasicMaterial,
};

window.THREE.Math = _Math;

import 'gsap/src/uncompressed/TimelineLite';
import 'gsap/src/uncompressed/easing/EasePack';

import modularTHREE from 'modular-three';
window.modularTHREE = modularTHREE;

import Stats from 'three/examples/js/libs/stats.min';
window.Stats = Stats;

// import 'three/examples/js/postprocessing/EffectComposer.js';

// console.log(EffectComposer);
// import 'three/examples/js/postprocessing/ShaderPass.js';

// window.THREE.EffectComposer = EffectComposer;
// window.THREE.ShaderPass = ShaderPass;

// console.log(THREE.EffectComposer);
