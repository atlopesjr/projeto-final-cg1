const invisibleWallsConfig = [
  { position: new BABYLON.Vector3(-6.5, -2, 0), size: { width: 5, height: 6, depth: 14 } },
  { position: new BABYLON.Vector3(6.5, -2, 0), size: { width: 5, height: 6, depth: 14 } },
  { position: new BABYLON.Vector3(-5, -2, 9.5), size: { width: 8, height: 6, depth: 5 } },
  { position: new BABYLON.Vector3(5, -2, 9.5), size: { width: 8, height: 6, depth: 5 } },
  { position: new BABYLON.Vector3(-5, -2, -9.5), size: { width: 8, height: 6, depth: 5 } },
  { position: new BABYLON.Vector3(5, -2, -9.5), size: { width: 8, height: 6, depth: 5 } },
];

const wallsConfig = [
  { position: new BABYLON.Vector3(0, -2.5, 0), size: { width: 9, height: 5, depth: 15 }, color: 'ground' }, //Ground
  {
    position: new BABYLON.Vector3(-4.25, 0.5, 0), //Left
    size: { width: 0.5, height: 1, depth: 15 },
    color: 'green',
    restitution: 0,
  },
  { position: new BABYLON.Vector3(4.25, 0.5, 0), size: { width: 0.5, height: 1, depth: 15 }, color: 'green' }, //Right
  {
    position: new BABYLON.Vector3(-2.5, 0.5, 7.25), //Top Left
    size: { width: 3, height: 1, depth: 0.5 },
    color: 'green',
    restitution: 1,
  },
  {
    position: new BABYLON.Vector3(2.5, 0.5, 7.25), //Top Right
    size: { width: 3, height: 1, depth: 0.5 },
    color: 'green',
    restitution: 1,
  },
  {
    position: new BABYLON.Vector3(0, 0.75, 7.25), //Top Gol Top
    size: { width: 2, height: 0.5, depth: 0.5 },
    color: 'green',
    restitution: 1,
  },
  {
    position: new BABYLON.Vector3(-2.5, 0.5, -7.25), //Bottom Left
    size: { width: 3, height: 1, depth: 0.5 },
    color: 'green',
    restitution: 1,
  },
  {
    position: new BABYLON.Vector3(2.5, 0.5, -7.25), //Bottom Right
    size: { width: 3, height: 1, depth: 0.5 },
    color: 'green',
    restitution: 1,
  },
  {
    position: new BABYLON.Vector3(0, 0.75, -7.25), //Top Gol Bottom
    size: { width: 2, height: 0.5, depth: 0.5 },
    color: 'green',
    restitution: 1,
  },
  {
    position: new BABYLON.Vector3(0, 0.25, 7.75), //Gol Top
    size: { width: 2, height: 0.5, depth: 0.5 },
    color: 'transparent',
    restitution: 0,
    goal: 'Top',
  },
  {
    position: new BABYLON.Vector3(0, 0.25, -7.75), //Gol Bottom
    size: { width: 2, height: 0.5, depth: 0.5 },
    color: 'transparent',
    restitution: 0,
    goal: 'Bottom',
  },
];
