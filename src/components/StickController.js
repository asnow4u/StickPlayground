import * as THREE from "three";

export default class Stick {

  constructor(direction) {
    this.height = 100;
    this.width = 30;
    this.grounded = false;
    this.direction = direction;

    let geometry = new THREE.BoxGeometry(30, 100, 0);
    let material = new THREE.MeshBasicMaterial({ color: 0x000000 });
    let mesh = new THREE.Mesh(geometry, material);
    mesh.name = "Stick";

    this.mesh = mesh;
  }

  updateMovement(sceneHeight, leftWidth, rightWidth) {

    //Check to see if the bottom part of the stick is grounded otherwise provide gravity
    if (this.mesh.position.y - this.height / 2 > -sceneHeight){
      this.grounded = false;
    } else {
      this.grounded = true;
    }

    //Apply Gravity
    if (!this.grounded){
      this.mesh.position.y -= 9.8;
    }

    //Movement
    else {
      if (this.direction === "right"){
        if (this.mesh.position.x + this.width / 2 < rightWidth) {
          this.mesh.position.x += 5;
        } else {
          this.direction = "left";
        }

      } else {
        if (this.mesh.position.x - this.width / 2 > leftWidth){
          this.mesh.position.x -= 5;
        } else {
          this.direction = "right";
        }
      }
    }
  }

}



// export const HouseSpawn = (scene, sceneObjs, boardObjs, stickObjects) => {
//   let houses = boardObjs.filter( obj => obj.Name === "House" && !obj.StickSpawn);
//
//   if (houses.length > 0) {
//     for (let i=0; i<houses.length; i++) {
//       //randomize
//
//       // SpawnStick(scene, {x: houses[i].X, y: houses[i].Y});
//       let test = new Stick();
//       let spawnedStick = new Stick(false, "right", scene, {x: houses[i].X, y: houses[i].Y});
//       console.log(spawnedStick);
//
//       houses[i].StickSpawn = true;
//     }
//   }
// }
