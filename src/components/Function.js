import * as THREE from "three";

export const SpawnObj = (key, jsonObj, scene, dragObjects) => {

  //TODO: Bottom part will be changed to accompany a set material and mesh
  let geometry;
  if (key === "Square"){
    geometry = new THREE.BoxGeometry(100, 100, 0);
  } else if (key === "Circle") {
    geometry = new THREE.CircleGeometry(50, 10);
  } else {
    geometry = new THREE.BoxGeometry(300, 200, 0);
  }

  let material = new THREE.MeshBasicMaterial({ color: 0xffff00});

  let mesh = new THREE.Mesh(geometry, material);
  mesh.position.set(jsonObj.Game.SelectionMenu[key].X, jsonObj.Game.SelectionMenu[key].Y, 0);
  mesh.name = key;
  scene.add(mesh);
  dragObjects.push(mesh);
}


export const UnSpawnObj = (eventObj, scene, sceneObjs, dragObjs, boardObjs) => {
  let index = dragObjs.indexOf(eventObj);
  if (index > -1){
    dragObjs.splice(index, 1);
  }

  index = sceneObjs.indexOf(eventObj);
  if (index > -1){
    sceneObjs.splice(index, 1);
    boardObjs.splice(index, 1);
  }


  eventObj.geometry.dispose();
  eventObj.material.dispose();
  scene.remove(eventObj);
}
