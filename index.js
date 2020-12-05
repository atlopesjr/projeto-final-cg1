const canvas = document.getElementById('renderCanvas');
const engine = new BABYLON.Engine(canvas, true, { preserveDrawingBuffer: true, stencil: true });
const scene = new BABYLON.Scene(engine);
const physEngine = new BABYLON.CannonJSPlugin(false);
let startingPoint;
let ground;
let camera;
let disc;
let ia;

const createCameraAndLight = () => {
  camera = new BABYLON.FreeCamera('FreeCamera', new BABYLON.Vector3(0, 8, -12), scene);
  const light = new BABYLON.HemisphericLight('hemi', new BABYLON.Vector3(0, 1, 0), scene);
};

const createEnvironment = () => {
  var skybox = BABYLON.Mesh.CreateBox("skyBox", 800.0, scene);
  var skyboxMaterial = new BABYLON.StandardMaterial("skyBox", scene);
  skyboxMaterial.backFaceCulling = false;
  skyboxMaterial.reflectionTexture = new BABYLON.CubeTexture("textures/skybox", scene);
  skyboxMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
  skyboxMaterial.diffuseColor = new BABYLON.Color3(0, 0, 0);
  skyboxMaterial.specularColor = new BABYLON.Color3(0, 0, 0);
  skyboxMaterial.disableLighting = true;
  skybox.material = skyboxMaterial;
};

const createCornerFlags = () => {
  const spriteManagerFlags = new BABYLON.SpriteManager("flagsManager", "textures/flag.png", 2000, {width: 512, height: 1024});
  const flag1 = new BABYLON.Sprite("flag", spriteManagerFlags);
  flag1.width = 0.5;
  flag1.height = 1;
  flag1.position.y = 1.2;
  flag1.position.z = 6;
  flag1.position.x = -4;
  const flag2 = new BABYLON.Sprite("flag", spriteManagerFlags);
  flag2.width = 0.5;
  flag2.height = 1;
  flag2.position.y = 1.2;
  flag2.position.z = 6;
  flag2.position.x = 4.1;
  const flag3 = new BABYLON.Sprite("flag", spriteManagerFlags);
  flag3.width = 0.5;
  flag3.height = 1;
  flag3.position.y = 1.2;
  flag3.position.z = -7.5;
  flag3.position.x = 4.1;
  const flag4 = new BABYLON.Sprite("flag", spriteManagerFlags);
  flag4.width = 0.5;
  flag4.height = 1;
  flag4.position.y = 1.2;
  flag4.position.z = -7.5;
  flag4.position.x = -4;
};

const createScene = function () {
  createCameraAndLight();
  createEnvironment();
  createCornerFlags();
  createPhysics();
  createDisc();
  createTable();
  createInvisibleWalls();
  createPainel();
  createPlayer(new BABYLON.Vector3(0, 0, -3.5), 'player');
  ia = createPlayer(new BABYLON.Vector3(0, 0, 3.5), 'ia');
  watchMouseMoviment();
  watchKeyPress();
};

const watchKeyPress = () => {
  scene.actionManager = new BABYLON.ActionManager(scene);
  scene.actionManager.registerAction(
    new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnKeyDownTrigger, (evt) => {
      if (evt.sourceEvent.key === 'h' || evt.sourceEvent.key === 'H' || evt.sourceEvent.key === 'Escape') {
        createOrRemoveTutorial();
      }
    })
  );
};

const watchMouseMoviment = () => {
  const player = scene.getMeshByID('player');

  scene.onPointerDown = function (evt) {
    if (evt.button !== 0) {
      return;
    }
    var pickInfo = scene.pick(scene.pointerX, scene.pointerY, function (mesh) {
      return mesh !== ground;
    });
    if (pickInfo.hit && pickInfo.pickedMesh.id == 'boxCollider') {
      currentMesh = pickInfo.pickedMesh;
      startingPoint = getGroundPosition(evt);

      if (startingPoint) {
        setTimeout(function () {
          camera.detachControl(canvas);
        }, 0);
      }
    }
  };

  scene.onPointerMove = function (evt, a) {
    if (!startingPoint) {
      return;
    }

    var current = getGroundPosition(evt);
    if (!current) {
      return;
    }

    var diff = current.subtract(startingPoint);
    player.position.addInPlace(diff);
    player.getChildren()[3].physicsImpostor.forceUpdate();
    startingPoint = current;
  };

  scene.onPointerUp = function () {
    if (startingPoint) {
      camera.attachControl(canvas, true);
      startingPoint = null;
      return;
    }
  };
};

var getGroundPosition = function () {
  var pickinfo = scene.pick(scene.pointerX, scene.pointerY, function (mesh) {
    return mesh == ground;
  });
  if (pickinfo.hit) {
    return pickinfo.pickedPoint;
  }

  return null;
};

const createInvisibleWalls = () => {
  const materials = createMaterials();
  let actualWall;

  invisibleWallsConfig.forEach((wall, index) => {
    actualWall = BABYLON.MeshBuilder.CreateBox(`invisibleWall${index}`, { ...wall.size }, scene);
    actualWall.position = wall.position;
    actualWall.material = materials.transparent;
    actualWall.physicsImpostor = new BABYLON.PhysicsImpostor(
      actualWall,
      BABYLON.PhysicsImpostor.BoxImpostor,
      { mass: 0, restitution: 1 },
      scene
    );
  });
};

const createPlayer = (position, id) => {
  const cilinder = BABYLON.MeshBuilder.CreateCylinder('cilinder', { width: 3, height: 0.3 }, scene);
  const torus = BABYLON.MeshBuilder.CreateTorus('torus', { thickness: 0.3, diameter: 0.7, tessellation: 50 }, scene);
  const cilinderTop = BABYLON.MeshBuilder.CreateCylinder('cilinder', { diameter: 0.3, height: 0.5 }, scene);
  const boxCollider = BABYLON.MeshBuilder.CreateBox('boxCollider', { width: 1, height: 4, depth: 1 }, scene);
  boxCollider.position.y = -0.5;
  boxCollider.physicsImpostor = new BABYLON.PhysicsImpostor(
    boxCollider,
    BABYLON.PhysicsImpostor.BoxImpostor,
    { mass: 0, restitution: 0 },
    scene
  );
  boxCollider.material = createMaterials().transparent;

  torus.position.y = 0.15;
  cilinderTop.position.y = 0.4;

  cilinder.material = createMaterials().black;
  torus.material = createMaterials().black;
  cilinderTop.material = createMaterials().white;

  const player = new BABYLON.Mesh(id, scene);
  player.addChild(cilinder);
  player.addChild(torus);
  player.addChild(cilinderTop);
  player.addChild(boxCollider);
  player.position = position;

  return player;
};

const createMaterials = () => {
  const red = new BABYLON.StandardMaterial('red', scene);
  red.diffuseColor = new BABYLON.Color3(1, 0, 0);

  const black = new BABYLON.StandardMaterial('black', scene);
  black.diffuseColor = new BABYLON.Color3(0, 0, 0);

  const white = new BABYLON.StandardMaterial('white', scene);
  white.diffuseColor = new BABYLON.Color3(1, 1, 1);

  const blue = new BABYLON.StandardMaterial('blue', scene);
  blue.diffuseColor = new BABYLON.Color3(0, 0, 1);

  const green = new BABYLON.StandardMaterial('green', scene);
  green.diffuseColor = new BABYLON.Color3(0, 1, 0);

  const ground = new BABYLON.StandardMaterial('groundTexture', scene);
  ground.diffuseTexture = new BABYLON.Texture('./textures/ground.jpg', scene);
  ground.diffuseTexture.wAng = Math.PI / 2;
  ground.diffuseTexture.uScale = 1;
  ground.diffuseTexture.vScale = 1;

  const transparent = new BABYLON.StandardMaterial('transparent', scene);
  transparent.diffuseColor = new BABYLON.Color3(1, 1, 1);
  transparent.alpha = 0;

  const mapMaterials = {
    red,
    black,
    white,
    blue,
    transparent,
    ground,
    green,
  };

  return mapMaterials;
};

const goal = (goal) => {
  disc.dispose();
  updateGoal(goal);
  createDisc();
};

const createTable = () => {
  const materials = createMaterials();

  ground = BABYLON.MeshBuilder.CreateGround('ground', { width: 8, height: 6.5 }, scene);
  ground.checkCollisions = true;
  ground.physicsImpostor = new BABYLON.PhysicsImpostor(
    ground,
    BABYLON.PhysicsImpostor.BoxImpostor,
    { mass: 0, friction: 0, restitution: 0 },
    scene
  );
  ground.position = new BABYLON.Vector3(0, -0.1, -3.2);

  let actualBox;

  wallsConfig.forEach((wall, index) => {
    actualBox = BABYLON.MeshBuilder.CreateBox(`walls${index}`, wall.size, scene);
    actualBox.position = wall.position;
    actualBox.material = materials[wall.color];
    actualBox.physicsImpostor = new BABYLON.PhysicsImpostor(
      actualBox,
      BABYLON.PhysicsImpostor.BoxImpostor,
      { mass: 0, friction: 0, restitution: wall.restitution },
      scene
    );
    if (wall.goal) {
      actualBox.physicsImpostor.onCollideEvent = () => goal(wall.goal);
    }
    if (index == 0) {
      camera.lockedTarget = actualBox;
    }
  });
};

const createDisc = () => {
  disc = BABYLON.MeshBuilder.CreateCylinder('disc', { diameter: 0.8, height: 0.4 }, scene);
  disc.checkCollisions = true;
  disc.applyGravity = true;
  disc.position = new BABYLON.Vector3(0, 0, 0.7);

  disc.physicsImpostor = new BABYLON.PhysicsImpostor(
    disc,
    BABYLON.PhysicsImpostor.BoxImpostor,
    { mass: 100000, restitution: 8, friction: 0, stiffness: 5 },
    scene
  );
  disc.material = createMaterials().red;
};

const createPhysics = () => {
  scene.enablePhysics(new BABYLON.Vector3(0, -20, 0), physEngine);
  scene.collisionsEnabled = true;
};

const animation = () => {
  if (disc && ia) {
    const speed = 0.04;
    let targetPosition = disc.absolutePosition.z > 0.5 ? disc.absolutePosition : new BABYLON.Vector3(0, 0, 4);
    let positionx = 0;
    let positiony = 0;
    let positionz = 0;

    if (ia.position.x - targetPosition.x > 0.4) {
      positionx = -speed;
    } else if (ia.position.x - targetPosition.x < 0.4) {
      positionx = speed;
    }
    if (ia.position.y - targetPosition.y > 0.4) {
      positiony = -speed;
    } else if (ia.position.y - targetPosition.y < 0.4) {
      positiony = speed;
    }
    if (ia.position.z - targetPosition.z > 0.4) {
      positionz = -speed;
    } else if (ia.position.z - targetPosition.z < 0.4) {
      positionz = speed;
    }

    if (positionx != 0 || positiony != 0 || positionz != 0) {
      ia.position.addInPlace(new BABYLON.Vector3(positionx, 0, positionz));
      ia.getChildren()[3].physicsImpostor.forceUpdate();
    }
  }
};

createScene();

engine.runRenderLoop(function () {
  if (scene) {
    scene.render();
    animation();
  }
});

window.addEventListener('resize', function () {
  engine.resize();
});
