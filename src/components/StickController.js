import * as THREE from "three";

export default class Stick {

  constructor(direction) {
    this.height = 100;
    this.width = 30;
    this.useGravity = false;
    this.movingRight = true;
    this.velocityX = 3;
    this.velocityY = 0;

    let geometry = new THREE.BoxGeometry(30, 100, 1);
    let material = new THREE.MeshBasicMaterial({ color: 0x000000 });
    let mesh = new THREE.Mesh(geometry, material);
    mesh.name = "Stick";

    this.mesh = mesh;
  }

  updateMovement() {

    if (this.useGravity) {
      this.velocityY -= -9.8;
    }

    this.mesh.position.x += this.velocityX;
    this.mesh.position.y += this.velocityY;
  }


  collisionTest(screenBorder, sceneObjects) {

    //View Borders
    if (this.velocityX > 0){
      if (this.mesh.position.x + this.width / 2 >= screenBorder.right) {
        this.velocityX = -this.velocityX;
      }

    } else {
      if (this.mesh.position.x - this.width / 2 <= screenBorder.left){
        this.velocityX = -this.velocityX;
      }
    }

    let stickCollider = new THREE.Box3().setFromObject(this.mesh);

    //Block
    let blocks = sceneObjects.filter( obj => obj.mesh.name === "Block");

    if (blocks.length > 0) {
      blocks.forEach((block) => {
        let blockCollider = new THREE.Box3().setFromObject(block.mesh);

        if (stickCollider.intersectsBox(blockCollider)) {
          this.velocityX = -this.velocityX;
        }
      });
    }


    //Houses
    let houses = sceneObjects.filter( obj => obj.mesh.name === "House");

    if (houses.length > 0){
      houses.forEach((house) => {
        let houseCollider = new THREE.Box3().setFromObject(house.mesh);
        houseCollider.set(houseCollider.min, new THREE.Vector3(houseCollider.max.x, (houseCollider.max.y - houseCollider.min.y) * 0.15 + houseCollider.min.y, 0));

        if (stickCollider.intersectsBox(houseCollider)) {
          this.velocityX = -this.velocityX;
        }
      });
    }
  }
}
