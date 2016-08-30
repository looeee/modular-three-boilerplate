import * as THREE from 'three/src/Three.js';
import * as modularTHREE from 'modular-three';
import Stats from 'three/examples/js/libs/stats.min';

export const setupGlobals = (function setupGlobals() {
  window.Stats = Stats;
  window.THREE = THREE;
  window.modularTHREE = modularTHREE;
}());
