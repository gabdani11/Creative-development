import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

const canvas = document.querySelector("canvas");
const scene = new THREE.Scene(); //creaing a scene

const sizes = {
  width: canvas.clientWidth,
  height: canvas.clientHeight,
};
const params = {
  exposure: 1.0,
  toneMapping: "Neutral",
  blurriness: 0.3,
  intensity: 1.0,
};

// const toneMappingOptions = {
//   None: THREE.NoToneMapping,
//   Linear: THREE.LinearToneMapping,
//   Reinhard: THREE.ReinhardToneMapping,
//   Cineon: THREE.CineonToneMapping,
//   ACESFilmic: THREE.ACESFilmicToneMapping,
//   AgX: THREE.AgXToneMapping,
//   Neutral: THREE.NeutralToneMapping,
//   Custom: THREE.CustomToneMapping,
// };
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  1000,
); //creating a camera with perspective view

//renderer
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  antialias: true,
  alpha: true,
}); //creating a renderer
renderer.setSize(sizes.width, sizes.height, false); //setting the size of the renderer to the size of the window
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1;

// Load the GLTF model
const loader = new GLTFLoader();

loader.load(
  "fantasy_island.glb",
  function (glb) {
    glb.scene.traverse(function (node) {
      if (node.isMesh) {
        node.castShadow = true;
        node.receiveShadow = true;
      }
    });

    scene.add(glb.scene);
  },
  undefined,
  function (error) {
    console.error(error);
  },
);

// light
const color1 = 0xffffff;
const intensity1 = 0.1;
const light = new THREE.AmbientLight(color1, intensity1);
scene.add(light);

// //Hemisphere light
const skyColor = 0x87ceeb; // light blue
const groundColor = 0x3b3025; // brownish orange
const himesphereLight = new THREE.HemisphereLight(skyColor, groundColor, 1.3);
scene.add(himesphereLight);

const color = 0xfff1d6;
const intensity = 1;
const directionalLight = new THREE.DirectionalLight(color, intensity);

directionalLight.position.set(-0, 200, -100);
directionalLight.target.position.set(-5, 0, 0);
directionalLight.castShadow = true;
directionalLight.shadow.mapSize.width = 2048;
directionalLight.shadow.mapSize.height = 2048;
directionalLight.shadow.camera.near = 0.5;
directionalLight.shadow.camera.far = 500;
directionalLight.shadow.camera.left = -100;
directionalLight.shadow.camera.right = 100;
directionalLight.shadow.camera.top = 100;
directionalLight.shadow.camera.bottom = -100;
directionalLight.shadow.normalBias = -0.01; // Adjust the bias to reduce shadow artifacts

scene.add(directionalLight);
scene.add(directionalLight.target);

const shadowHelper = new THREE.CameraHelper(directionalLight.shadow.camera);
scene.add(shadowHelper);

const directionalLightHelper = new THREE.DirectionalLightHelper(
  directionalLight,
  10,
);

scene.add(directionalLightHelper);

const controls = new OrbitControls(camera, canvas);
controls.target.set(0, 5, 0);

camera.position.x = -78;
camera.position.y = 75;
camera.position.z = -130;
function onWindowResize() {
  sizes.width = canvas.clientWidth;
  sizes.height = canvas.clientHeight;
  camera.aspect = canvas.clientWidth / canvas.clientHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(canvas.clientWidth, canvas.clientHeight, false);
}
window.addEventListener("resize", onWindowResize);
function animate(time) {
  controls.update();
  renderer.render(scene, camera);
}
renderer.setAnimationLoop(animate);
