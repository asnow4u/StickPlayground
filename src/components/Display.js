import './Display.css';
import React from 'react';
import * as THREE from "three";
import DragControls from "three-dragcontrols";


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

    //Grab info from file
    // if (props.file){
    //
      const circle = new THREE.CircleGeometry(50, 10);
      const mat = new THREE.MeshBasicMaterial({ color: 0xffff00 });
      const sphere = new THREE.Mesh(circle, mat);
      sphere.position.set(1000, 264, 0);
      scene.add(sphere);
    //
    // } else {

      const box = new THREE.BoxGeometry(100, 100, 0);
      const boxMat = new THREE.MeshBasicMaterial({ color: 0xff00ff });
      const cube = new THREE.Mesh(box, boxMat);
      cube.position.set(838, 264, 0);
      scene.add(cube);
    // }

    //TODO: rename object array
    const objects = [];
    objects.push(cube);
    objects.push(sphere);

    const dragControls = new DragControls( objects, camera, renderer.domElement);
    dragControls.addEventListener( 'dragstart', (event) => {

      //Create new box and attach to scene
      if (event.object.position.x > width * screenDivider){
        let newMesh = new THREE.Mesh(box, boxMat);
        newMesh.position.set(event.object.position.x, event.object.position.y, 0);
        scene.add(newMesh);
        objects.push(newMesh);
      }
    });

    dragControls.addEventListener( 'dragend', (event) => {
      if (event.object.position.x > width * screenDivider){
          event.object.geometry.dispose();
          event.object.material.dispose();
          scene.remove(event.object);
          console.log(scene);
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

    const animate = () => {

      // console.log(props.file);
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
