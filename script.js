import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

import {
  creatMesh,
  createBoard,
  addCross,
  addCircle,
  placementAxies,
  boxMatrix,
  scaleUp,
} from "./utils.js";

const canvas = document.querySelector(".webgl");
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
  radio: window.innerWidth / window.innerHeight,
};

// Group creation
const hiddenTiles = new THREE.Group();
const playerGroup = new THREE.Group();
let crossMesh;


// Render basic elements

// SCENE
const scene = new THREE.Scene();
// LIGHT
const light = new THREE.DirectionalLight(0xffffff, 1);
light.castShadow = true;
light.position.set(0, 20, 20);
scene.add(light);
// ADDING AMBIENTLIGHT
scene.add(new THREE.AmbientLight(0xffffff, 0.2));
// HELPER
// const helper = new THREE.DirectionalLightHelper(light);
// scene.add(helper);
// CAMERA
const camera = new THREE.PerspectiveCamera(72, sizes.radio, 0.1, 1000);
camera.position.set(4, 2, 15);
scene.add(camera);
// CONTROL
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;
// RENDERER
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  antialias: true,
});
renderer.setSize(sizes.width, sizes.height);
renderer.shadowMap.enabled = true;

// Ground
const ground = creatMesh({
  x: 30,
  y: 0.5,
  z: 40,
  xOffset: 0,
  yOffset: -10,
  zOffset: 0,
  material: {
    color: "#ffffff",
  },
  receiveShadow: true,
});
scene.add(ground);

// Creating the board Border
const board = createBoard();
scene.add(board);

// Adding HiddenTile
placementAxies.forEach((ele, index) => {
  const tile = creatMesh({
    name: index,
    x: 2.6,
    y: 2.6,
    z: 0.2,
    xOffset: ele.x / 1.1,
    yOffset: ele.y / 1.1,
    zOffset: 0.2,
    material: {
      color: "#0x0000ff",
      transparent: true,
      opacity: 0,
    },
  });
  hiddenTiles.add(tile);
});
scene.add(hiddenTiles);

// addCrossOrCircle
let player = "0";
const addCrossOrCircle = (xOffset, yOffset, id) => {
  player = player == "x" ? "o" : "x";
  if (player == "x") {
    playerGroup.add(addCross(xOffset, yOffset));
  } else if (player == "o") {
    playerGroup.add(addCircle(xOffset, yOffset));
  }
  scene.add(playerGroup);
  // modify the boxMatrix Value
  boxMatrix[placementAxies[id].axis[0]][placementAxies[id].axis[1]] = player;
};

// checkWinConditions
const checkWinConditions = () => {
  // check row
  const row1 =
    boxMatrix[0][0] + boxMatrix[0][1] + boxMatrix[0][2] == "xxx" ||
    boxMatrix[0][0] + boxMatrix[0][1] + boxMatrix[0][2] == "ooo";
  const row2 =
    boxMatrix[1][0] + boxMatrix[1][1] + boxMatrix[1][2] == "xxx" ||
    boxMatrix[1][0] + boxMatrix[1][1] + boxMatrix[1][2] == "ooo";
  const row3 =
    boxMatrix[2][0] + boxMatrix[2][1] + boxMatrix[2][2] == "xxx" ||
    boxMatrix[2][0] + boxMatrix[2][1] + boxMatrix[2][2] == "ooo";
  // check Column
  const col1 =
    boxMatrix[0][0] + boxMatrix[1][0] + boxMatrix[2][0] == "xxx" ||
    boxMatrix[0][0] + boxMatrix[1][0] + boxMatrix[2][0] == "ooo";
  const col2 =
    boxMatrix[0][1] + boxMatrix[1][1] + boxMatrix[2][1] == "xxx" ||
    boxMatrix[0][1] + boxMatrix[1][1] + boxMatrix[2][1] == "ooo";
  const col3 =
    boxMatrix[0][2] + boxMatrix[1][2] + boxMatrix[2][2] == "xxx" ||
    boxMatrix[0][2] + boxMatrix[1][2] + boxMatrix[2][2] == "ooo";
  // check diagonal
  const diagonalRight =
    boxMatrix[0][0] + boxMatrix[1][1] + boxMatrix[2][2] == "xxx" ||
    boxMatrix[0][0] + boxMatrix[1][1] + boxMatrix[2][2] == "ooo";
  const diagonalLeft =
    boxMatrix[0][2] + boxMatrix[1][1] + boxMatrix[2][0] == "xxx" ||
    boxMatrix[0][2] + boxMatrix[1][1] + boxMatrix[2][0] == "ooo";

  const row = row1 || row2 || row3;
  const col = col1 || col2 || col3;
  const diagonal = diagonalRight || diagonalLeft;


  if (row || col || diagonal) {
    // validate position of cross
    if (row) {
      // create mesh
      crossMesh = creatMesh({
        x: 11,
        y: 0.6,
        z: 0.4,
        material: {
          color: "#ff00ff",
        },
        castShadow: true,
      });
      // positioning
      row1 ? crossMesh.position.y = 3.5 : row2 ? crossMesh.position.y = 0 : crossMesh.position.y = -3.5;
    }
    else if(col) {
      // create mesh
      crossMesh = creatMesh({
        x: 0.6,
        y: 11,
        z: 0.4,
        material : {
            color: "#ff00ff",
        },
        castShadow: true,
      });
      // positioning
      col1 ? crossMesh.position.x = -3.5 : col2 ? crossMesh.position.x = 0 : crossMesh.position.x = 3.5;
    }
    else {
      // create mesh
      crossMesh = creatMesh({
        x: 11,
        y: 0.6,
        z: 0.4,
        material : {
            color: "#ff00ff",
        },
        castShadow: true,
      });
      // positioning
      diagonalRight ? crossMesh.rotation.z = -Math.PI / 4 : crossMesh.rotation.z = Math.PI / 4;
    }
    // Add cross to the scene
    crossMesh.scale.set(0,0,0);
    scene.add(crossMesh);
    document.querySelector("#result").innerHTML = `player ${player.toUpperCase()} Win the Game`;
  }
  else if(hiddenTiles.children.length == 1) {
    document.querySelector("#result").innerHTML = "Game Draw";
  } 
  return false;
};

// Handle Mouse Events
const mouse = new THREE.Vector2();
const raycaster = new THREE.Raycaster();

function onMouseDown(event) {
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
  // console.log(mouse.x, mouse.y);
  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObjects(hiddenTiles.children);
  // console.log("intersects", intersects);
  if (intersects.length > 0) {
    const xOffset = intersects[0].object.position.x;
    const yOffset = intersects[0].object.position.y;
    const id = intersects[0].object.name;
    // add x & o
    addCrossOrCircle(xOffset, yOffset, id);
    checkWinConditions();
    const index = hiddenTiles.children.findIndex(
      (c) => c.uuid === intersects[0].object.uuid
    );
    hiddenTiles.children.splice(index, 1);
  }
}
window.addEventListener("mousedown", onMouseDown, false);

function animate() {
  playerGroup.children.forEach(scaleUp);
  crossMesh && scaleUp(crossMesh)

  controls.update(); // Update controls
  renderer.render(scene, camera);
  const animateId = requestAnimationFrame(animate);
}
animate();
