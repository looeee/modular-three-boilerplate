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
  WebGLRenderTarget,
  Vector3,
  BoxBufferGeometry,
  MeshBasicMaterial,
  ShaderMaterial,
  UniformsUtils,
  PlaneBufferGeometry,
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
  WebGLRenderTarget,
  Vector3,
  BoxBufferGeometry,
  MeshBasicMaterial,
  ShaderMaterial,
  UniformsUtils,
  PlaneBufferGeometry,
};

window.THREE.Math = _Math;

import 'gsap/src/uncompressed/TimelineLite';
import 'gsap/src/uncompressed/easing/EasePack';

import modularTHREE from 'modular-three';
window.modularTHREE = modularTHREE;

import Stats from 'three/examples/js/libs/stats.min';
window.Stats = Stats;
