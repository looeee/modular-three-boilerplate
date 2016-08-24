const modularTHREE = require('modular-three');

export class Cube extends modularTHREE.MeshObject {
  constructor() {
    super();
  }

  init() {
    const geometry = new THREE.BoxBufferGeometry(20, 20, 20);
    const material = new THREE.MeshBasicMaterial({
      //color: 0xb6b6b6,
      //side: THREE.DoubleSide,
      map: this.loadTexture('images/textures/crate.jpg'),
    });
    this.mesh = new THREE.Mesh(geometry, material);
  }
}
