import './Display.css';
import React from 'react';
import * as THREE from "three";
import DragControls from "three-dragcontrols";
import {SpawnObj, UnSpawnObj} from './Function';
import {SpawnStick, HouseSpawn, UpdateStickMovement} from './StickController';
import Stick from './StickController';
import PlaceableObject from './PlaceableObjectController';

const Display = (props) => {

  const mount = React.useRef(null);
  const controls = React.useRef(null);
  let screenDivider = 0.5;

  React.useEffect(() => {
    const width = mount.current.clientWidth;
    const height = mount.current.clientHeight;
    let frameId;

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera( -width, width, height, -height, 1, 1000);
    camera.position.z = 5;
    scene.add(camera);

    //TODO: create light obj if needed

    const renderer = new THREE.WebGLRenderer({ antialias: true });

    let pauseState = false;

    const stickObjects = []; //For all stick objects in the scene
    const sceneObjects = []; //For all objects in the scene
    const menuObjects = []; //For all objects in the menu



    //Load in local json (TODO: load json from server)
    let jsonObj = require('../data.json');
    // console.log(jsonObj);

    //Initilize selection Menu
    let homeObj = new PlaceableObject(new THREE.BoxGeometry(300, 200, 0), new THREE.MeshBasicMaterial({ color: 0xffff00 }), {x: 950, y:0, z:0}, "House");
    menuObjects.push(homeObj);
    let squareObj = new PlaceableObject(new THREE.BoxGeometry(100, 100, 0), new THREE.MeshBasicMaterial({ color: 0xffff00 }), {x:838, y:264, z:0}, "Block");
    menuObjects.push(squareObj);

    //Push all menu objects to the scene
    menuObjects.forEach((object) => {
      scene.add(object.mesh);
    });

    // Object.keys(jsonObj.Game.SelectionMenu).forEach((key) => {
    //   SpawnObj(key, jsonObj, scene, dragObjects);
    // });

    //Drag Controls
    const dragableObjects = [];
    menuObjects.forEach((object) => {
      dragableObjects.push(object.mesh);
    });

    const dragControls = new DragControls( dragableObjects, camera, renderer.domElement);

    dragControls.addEventListener( 'dragstart', (event) => {
      if (event.object.position.x > width * screenDivider){
        menuObjects.forEach((object, index) => {
          if (object.mesh === event.object){
            menuObjects.splice(index, 1);
            sceneObjects.push(object);
          }
        });

        let newObj = new PlaceableObject(event.object.geometry, event.object.material, event.object.position, event.object.name);
        menuObjects.push(newObj);
        scene.add(newObj.mesh);
        dragableObjects.push(newObj.mesh);
      }
    });

    dragControls.addEventListener( 'dragend', (event) => {
      if (event.object.position.x > width * screenDivider){

        let index = dragableObjects.indexOf(event.object);
        if ( index > -1) {
          dragableObjects.splice(index, 1);
        }

        sceneObjects.forEach((object, index) => {
          if (object.mesh === event.object){

            sceneObjects.splice(index, 1);

            object.mesh.geometry.dispose();
            object.mesh.material.dispose();
            scene.remove(object.mesh);

            object = null;
          }
        });

      } else {

        let eventObject = null;
        let toBePlaced = true;

        let boxA = new THREE.Box3().setFromObject(event.object);

        sceneObjects.forEach((object) => {
          if (object.mesh !== event.object){

            let boxB = new THREE.Box3().setFromObject(object.mesh);

            //If box colliders colide, object should not be placed to prevent game from starting and new material set to indicate action needed
            if (boxA.intersectsBox(boxB)) {
              toBePlaced = false;

              let newMat = event.object.material.clone();
              newMat.color.setHex(0xff0000);
              event.object.material = newMat;
            }
          } else {
            eventObject = object;
          }
        });

        eventObject.placed = toBePlaced;

        if (toBePlaced) {
          let newMat = event.object.material.clone();
          newMat.color.setHex(0xffff00);
          event.object.material = newMat;
        }
      }
    });

    //Draw objects

    //DividingLine
    const dividingLineMaterial = new THREE.LineBasicMaterial({color: 0x000000, linewidth: 100}); //TODO get linewidth to work
    const dividingLineGeometry = new THREE.Geometry();
    dividingLineGeometry.vertices.push(new THREE.Vector3(width * screenDivider, height, 0));
    dividingLineGeometry.vertices.push(new THREE.Vector3(width * screenDivider, -height, 0));
    const line = new THREE.Line(dividingLineGeometry, dividingLineMaterial);
    scene.add(line);

    renderer.setClearColor('#808080');
    renderer.setSize(width, height);

    const renderScene = () => {
      renderer.render(scene, camera);
    }

    // const handleResize = () => {
    //   width = mount.current.clientWidth
    //   height = mount.current.clientHeight
    //   renderer.setSize(width, height)
    //   camera.aspect = width / height
    //   camera.updateProjectionMatrix()
    //   renderScene()
    // }

    const spawnStick = (pos) => { //TODO move function else where
      let stick = new Stick("right"); //TODO: randomize direction
      stick.mesh.position.set(pos.x, pos.y, pos.z);
      scene.add(stick.mesh);
      stickObjects.push(stick);
    }

    const animate = () => {

      if (!pauseState) {

        //House Spawn
        let houses = sceneObjects.filter( obj => obj.mesh.name === "House" && obj.sticksAtHome > 0 && obj.placed); //TODO NOTE: obj.place will prevent the game from running so it will not be needed here

        if (houses.length > 0) {

          for (let i=0; i<houses.length; i++) {

            houses[i].sticksAtHome -= 1;
            let min = 1, max = 3; // 5, 120
            let rand = Math.floor(Math.random() * (max - min + 1)) + min;

            //Spawn stick after random time interval
            setTimeout(() => {
              spawnStick({x: houses[i].mesh.position.x, y: houses[i].mesh.position.y, z: 0});
            }, rand * 1000);
          }
        }

        //Stick Movement
        stickObjects.forEach((stick, index) => {
          stick.updateMovement();
        });

        //Collision Detection
        stickObjects.forEach((stick, index) => {
          stick.collisionTest({left: -width, right: width * screenDivider}, sceneObjects);
        });
      }

      renderScene();
      frameId = window.requestAnimationFrame(animate);
    }

    //Resume animations
    const start = () => {
      if (!frameId) {
        frameId = requestAnimationFrame(animate);
      }

      pauseState = false;

    }

    const pause = () => {
      pauseState = true;
      // cancelAnimationFrame(frameId);
      // frameId = null;
    }

    const reset = () => {
      //TODO: clear the screen
      cancelAnimationFrame(frameId);
      frameId = null;
      console.log("reset")
    }

    mount.current.appendChild(renderer.domElement)
    // window.addEventListener('resize', handleResize)
    start()

    controls.current = {start, pause, reset};

    //Clean Up
    // return () => {
    //   stop();
    //   {
    //     // window.removeEventListener('resize', handleResize)
    //   }
    //   mount.current.removeChild(renderer.domElement);
    //
    //   //TODO: will need to clean all the matterials and geometrys with dispose()
    //   while(scene.children.length > 0){
    //     scene.remove(scene.children[0]);
    //   }
    // }

  }, [])

  React.useEffect(() => {

    //Resume all animations
    if (props.state === "Play"){
      controls.current.start();
    }

    //Pause all animations (but allow drag and drop from selection menu?)
    else if (props.state === "Pause"){
      controls.current.pause();
    }

    //TODO: Reset everything to its original form
    else if (props.state === "Stop"){
      controls.current.reset();
    }

  }, [props.state])

  return (
    <div className="Display" ref={mount} />
  )
}


export default Display
