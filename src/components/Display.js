import './Display.css';
import React from 'react';
import * as THREE from "three";
import DragControls from "three-dragcontrols";
import {SpawnObj, UnSpawnObj} from './Function';
import {SpawnStick, HouseSpawn, UpdateStickMovement} from './StickController';
import Stick from './StickController';

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
    const renderer = new THREE.WebGLRenderer({ antialias: true });

    let pauseState = false;

    const stickObjects = [];
    const sceneOjects = [];
    const dragObjects = [];

    //Load in local json (TODO: load json from server)
    let jsonObj = require('../data.json');
    // console.log(jsonObj);

    Object.keys(jsonObj.Game.SelectionMenu).forEach((key) => {
      SpawnObj(key, jsonObj, scene, dragObjects);
    });

    const dragControls = new DragControls( dragObjects, camera, renderer.domElement);
    dragControls.addEventListener( 'dragstart', (event) => {
      if (event.object.position.x > width * screenDivider){
        let key = Object.keys(jsonObj.Game.SelectionMenu).find(key => key === event.object.name);
        SpawnObj(key, jsonObj, scene, dragObjects);
      }
    });

    dragControls.addEventListener( 'dragend', (event) => {
      if (event.object.position.x > width * screenDivider){
        UnSpawnObj(event.object, scene, sceneOjects, dragObjects, jsonObj.Game.Board);

      } else {
        if (sceneOjects.indexOf(event.object) === -1) {
          sceneOjects.push(event.object);
          if (event.object.name === "house"){
            jsonObj.Game.Board.push({
              "Name": event.object.name,
              "X": event.object.position.x,
              "Y": event.object.position.y,
              "StickSpawn": false
            });
          } else {
            jsonObj.Game.Board.push({
              "Name": event.object.name,
              "X": event.object.position.x,
              "Y": event.object.position.y
            });
          }

          // console.log(jsonObj.Game.Board);
          // console.log(sceneOjects);
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

    // //TEMP
    // let helperLineMaterial = new THREE.LineBasicMaterial({color: 0x000000, linewidth: 100}); //TODO get linewidth to work
    // let helperLineGeometry = new THREE.Geometry();
    // helperLineGeometry.vertices.push(new THREE.Vector3(-width, 0, 0));
    // helperLineGeometry.vertices.push(new THREE.Vector3(width * screenDivider, 0, 0));
    // let helperLine = new THREE.Line(helperLineGeometry, helperLineMaterial);
    // scene.add(helperLine);


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

    const animate = () => {

      if (!pauseState) {
        let houses = jsonObj.Game.Board.filter( obj => obj.Name === "House" && !obj.StickSpawn);

        if (houses.length > 0) {
          for (let i=0; i<houses.length; i++) {
            //randomize

            let stick = new Stick("right"); //TODO: randomize direction
            stick.mesh.position.set(houses[i].X, houses[i].Y, 0);
            scene.add(stick.mesh);
            stickObjects.push(stick);
            houses[i].StickSpawn = true;
          }
        }

        stickObjects.forEach((stick, index) => {
          stick.updateMovement(height, -width, width * screenDivider);
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
