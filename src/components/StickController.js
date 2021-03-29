import * as THREE from "three";

export const SpawnStick = (scene, pos) => {
  let geometry = new THREE.BoxGeometry(30, 100, 0);
  let material = new THREE.MeshBasicMaterial({ color: 0x000000 });
  let mesh = new THREE.Mesh(geometry, material);
  mesh.position.set(pos.x, pos.y, 0);
  mesh.name = "Stick";
  scene.add(mesh);

  return mesh;
}


export const HouseSpawn = (scene, sceneObjs, boardObjs) => {
  let houses = boardObjs.filter( obj => obj.Name === "House" && !obj.StickSpawn);

  if (houses.length > 0) {
    for (let i=0; i<houses.length; i++) {
      //randomize

      SpawnStick(scene, {x: houses[i].X, y: houses[i].Y});
      houses[i].StickSpawn = true;
    }
  }
}


export const UpdateStickMovement = (stickObjects, sceneHeight, leftSideWall, rightSideWall, stickData) => {

  stickObjects.forEach((stick, index) => {

    //Check to see if the bottom part of the stick is grounded otherwise provide gravity
    if (stick.position.y - stickData[index].height / 2 > -sceneHeight){
      stickData[index].grounded = false;
    } else {
      stickData[index].grounded = true;
    }

    //Apply Gravity
    if (!stickData[index].grounded){
      stick.position.y -= 9.8;

    //Movement
    } else {

      if (stickData[index].direction === "right"){
        if (stick.position.x + stickData[index].width / 2 < rightSideWall) {
          stick.position.x += 5;
        } else {
          stickData[index].direction = "left";
        }

      } else {
        if (stick.position.x - stickData[index].width / 2 > leftSideWall){
          stick.position.x -= 5;
        } else {
          stickData[index].direction = "right";
        }
      }
    }
  });
}
