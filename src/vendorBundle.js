import THREE from 'three';
window.THREE = THREE;

//ALTERNATELY: Import just what you need from THREE
//For simple scenes this can result in a saving (un-minified)
//of ~200kb
// import {
//   LoadingManager,
//   ObjectLoader,
//   TextureLoader,
//   PerspectiveCamera,
//   OrthographicCamera,
//   Scene,
//   Mesh,
//   Math as _Math,
//   WebGLRenderer,
//   WebGLRenderTarget,
//   Vector3,
//   BoxBufferGeometry,
//   MeshBasicMaterial,
//   ShaderMaterial,
//   UniformsUtils,
//   PlaneBufferGeometry,
//   DataTexture,
// } from 'three/src/THREE';
//
// window.THREE = {
//   LoadingManager,
//   ObjectLoader,
//   TextureLoader,
//   PerspectiveCamera,
//   OrthographicCamera,
//   Scene,
//   Mesh,
//   WebGLRenderer,
//   WebGLRenderTarget,
//   Vector3,
//   BoxBufferGeometry,
//   MeshBasicMaterial,
//   ShaderMaterial,
//   UniformsUtils,
//   PlaneBufferGeometry,
//   DataTexture,
// };

// window.THREE.Math = _Math;

import 'gsap/src/uncompressed/TimelineLite';
import 'gsap/src/uncompressed/easing/EasePack';

import modularTHREE from 'modular-three';
window.modularTHREE = modularTHREE;

import Stats from 'three/examples/js/libs/stats.min';
window.Stats = Stats;

import dat from 'dat-gui';
window.dat = dat;
