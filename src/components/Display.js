import './Display.css';
import React from 'react';
import * as THREE from "three";
import DragControls from "three-dragcontrols";
import {SpawnObj, UnSpawnObj} from './Function';
import {SpawnStick, HouseSpawn, UpdateStickMovement} from './StickController';

const Display = (props) => {

  const mount = React.useRef(null);
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

          console.log(jsonObj.Game.Board);
          console.log(sceneOjects);
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

    //TEMP
    let helperLineMaterial = new THREE.LineBasicMaterial({color: 0x000000, linewidth: 100}); //TODO get linewidth to work
    let helperLineGeometry = new THREE.Geometry();
    helperLineGeometry.vertices.push(new THREE.Vector3(-width, 0, 0));
    helperLineGeometry.vertices.push(new THREE.Vector3(width * screenDivider, 0, 0));
    let helperLine = new THREE.Line(helperLineGeometry, helperLineMaterial);
    scene.add(helperLine);

    let pos = {x: -1000, y: 0};
    stickObjects.push(SpawnStick(scene, pos));

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
      HouseSpawn(scene, sceneOjects, jsonObj.Game.Board);
      UpdateStickMovement(stickObjects, height, -width, width * screenDivider, jsonObj.Game.Sticks);
      renderScene();
      frameId = window.requestAnimationFrame(animate);
    }

    const start = () => {
      if (!frameId) {
        frameId = requestAnimationFrame(animate);
      }
    }

    const stop = () => {
      cancelAnimationFrame(frameId);
      frameId = null;
    }

    mount.current.appendChild(renderer.domElement)
    // window.addEventListener('resize', handleResize)
    start()

    return () => {
      stop();
      {
        // window.removeEventListener('resize', handleResize)
      }
      mount.current.removeChild(renderer.domElement);

      //TODO: will need to clean all the matterials and geometrys with dispose()
      while(scene.children.length > 0){
        scene.remove(scene.children[0]);
      }
    }

  }, [props.file])

  return (
    <div className="Display" ref={mount} />
  )
}


export default Display
