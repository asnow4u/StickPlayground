import * as THREE from "three";

export default class PlaceableObject {

  constructor(geometry, material, pos, name) {
    this.placed = false;

    let mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(pos.x, pos.y, pos.z);
    this.mesh = mesh;

    this.mesh.name = name;

    if (name === "House") {
      this.occupancy = 1; //Number of sticks that can live at this home
      this.sticksAtHome = 1; //Number of sticks currently inside
      this.level = 1; //Level of house (Higher lever means bigger house / occupancy)
    }
  }
}
