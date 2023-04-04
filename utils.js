import * as THREE from "three";

// Create
export const creatMesh = ({
  name = "",
  x = 0,
  y = 0,
  z = 0,
  xOffset = 0,
  yOffset = 0,
  zOffset = 0,
  castShadow = false,
  material = {},
  receiveShadow = false,
}) => {
  const geometry = new THREE.BoxGeometry(x, y, z);
  const materials = new THREE.MeshStandardMaterial( material );
  const mesh = new THREE.Mesh(geometry, materials);
  mesh.name = name;
  mesh.position.set(xOffset, yOffset, zOffset);
  mesh.castShadow = castShadow;
  mesh.receiveShadow = receiveShadow;
  return mesh;
};

// CreatBoard
export const createBoard = () => {
  const board = new THREE.Group();
  const right = creatMesh({
    x: 0.6,
    y: 10,
    z: 0.5,
    xOffset: 2,
    yOffset: 0,
    zOffset: 0,
    material : {
        color: "#ff00ff",
    },
    castShadow: true,
  });
  const left = creatMesh({
    x: 0.6,
    y: 10,
    z: 0.5,
    xOffset: -2,
    yOffset: 0,
    zOffset: 0,
    material : {
        color: "#ff00ff",
    },
    castShadow: true,
  });
  const top = creatMesh({
    x: 10,
    y: 0.6,
    z: 0.5,
    xOffset: 0,
    yOffset: 2,
    zOffset: 0,
    material : {
        color: "#ff00ff",
    },
    castShadow: true,
  });
  const bottom = creatMesh({
    x: 10,
    y: 0.6,
    z: 0.5,
    xOffset: 0,
    yOffset: -2,
    zOffset: 0,
    material : {
        color: "#ff00ff",
    },
    castShadow: true,
  });
  board.add(right, left, top, bottom);
  return board;
};

// Add Cross
export const addCross = (xOffset, yOffset) => {
  const cross = new THREE.Group();
  const crossGeometry = new THREE.BoxGeometry(2, 0.3, 0.5);
  const crossMaterial = new THREE.MeshNormalMaterial({
    color: 0xff00ff,
  });
  const cross1 = new THREE.Mesh(crossGeometry, crossMaterial);
  const cross2 = new THREE.Mesh(crossGeometry, crossMaterial);
  cross1.rotation.z = Math.PI / 4;
  cross2.rotation.z = -Math.PI / 4;
  cross1.castShadow = true;
  cross2.castShadow = true;
  cross.add(cross1, cross2);
  cross.position.set(xOffset, yOffset, 0)
  // add for animation
  cross.scale.set(0,0,0);
  return cross;
};

// Add Circle
export const addCircle = (xOffset, yOffset) => {
  const r = 1;
  const height = 0.5;
  const cylinderGeometry = new THREE.CylinderGeometry(r, r, height, 100);
  const cylinderMaterial = new THREE.MeshNormalMaterial();
  const cylinder = new THREE.Mesh(cylinderGeometry, cylinderMaterial);
  cylinder.position.set(xOffset, yOffset, 0)
  cylinder.rotation.x = Math.PI / 2;
  cylinder.castShadow = true;
  // add for animation
  cylinder.scale.set(0,0,0);
  return cylinder;
};

// placementAxies
export const placementAxies = [
  {
    x: -4,
    y: 4,
    axis : [0,0],
    value: "one",
  },
  {
    x: 0,
    y: 4,
    axis : [0,1],
    value: "two",
  },
  {
    x: 4,
    y: 4,
    axis : [0,2],
    value: "three",
  },
  {
    x: -4,
    y: 0,
    axis : [1,0],
    value: "four",
  },
  {
    x: 0,
    y: 0,
    axis : [1,1],
    value: "five",
  },
  {
    x: 4,
    y: 0,
    axis : [1,2],
    value: "six",
  },
  {
    x: -4,
    y: -4,
    axis : [2,0],
    value: "seven",
  },
  {
    x: 0,
    y: -4,
    axis : [2,1],
    value: "eight",
  },
  {
    x: 4,
    y: -4,
    axis : [2,2],
    value: "nine",
  },
];

// boxMatric
export const boxMatrix =  [
    [1,2,3],
    [4,5,6],
    [7,8,9],
]

// ScaleUp
export const scaleUp = (obj) => {
  if (obj.scale.x < 1) {
    obj.scale.x += 0.04;
  }
  if (obj.scale.y < 1) {
    obj.scale.y += 0.04;
  }
  if (obj.scale.z < 1) {
    obj.scale.z += 0.04;
  }
};