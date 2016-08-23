const modularTHREE = require('modular-three');

export class Cube extends modularTHREE.MeshObject {
  constructor() {
    super();
  }

  init() {
    const geometry = new THREE.BoxGeometry(5, 5, 5);
    const material = new THREE.MeshBasicMaterial({ color: 0xFF0000 });
    this.mesh = new THREE.Mesh(geometry, material);
  }
}
