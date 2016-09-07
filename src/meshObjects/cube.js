export class Cube extends modularTHREE.MeshObject {
  constructor() {
    super();
  }

  init() {
    const texture = this.loadTexture('images/textures/crate.jpg');
    const geometry = new THREE.BoxBufferGeometry(20, 20, 20);
    const material = new THREE.MeshBasicMaterial({
      map: texture,
    });
    this.mesh = new THREE.Mesh(geometry, material);
  }
}
