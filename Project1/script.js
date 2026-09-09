import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

const canvas = document.getElementById("canvas");

const scene = new THREE.Scene(); //scene
/**Camera */

const sizes = {
  width: canvas.clientWidth,
  height: canvas.clientHeight,
};
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  1000,
);
//light
const color = 0xffffff;
const intensity = 1;
const light = new THREE.AmbientLight(color, intensity);
scene.add(light);
const directionalLight = new THREE.DirectionalLight(0xffffff, 2);
directionalLight.position.set(0, 1, 1);
scene.add(directionalLight);
//glb loader
const loader = new GLTFLoader();
const clock = new THREE.Clock(); //making a clock to keep track of time for the animation mixer
let mixer;
loader.load(
  "./plane.glb",
  function (glb) {
    console.log(glb);

    scene.add(glb.scene);
    mixer = new THREE.AnimationMixer(glb.scene);

    const clip = THREE.AnimationClip.findByName(glb.animations, "Take 001"); //loading the animation clip by name

    const action = mixer.clipAction(clip); // creating an action from the clip

    action.play();
  },
  undefined,
  function (error) {
    console.error(error);
  },
);

//renderer
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  alpha: true,
  antialias: true,
});
renderer.setSize(sizes.width, sizes.height, false);
//orbit controls
const controls = new OrbitControls(camera, renderer.domElement);

//camera position
camera.position.z = 0.7;
camera.position.y = 0.8;
camera.position.x = -1;

function onWindowResize() {
  sizes.width = canvas.clientWidth;
  sizes.height = canvas.clientHeight;
  camera.aspect = canvas.clientWidth / canvas.clientHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(canvas.clientWidth, canvas.clientHeight, false);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // setting pixel ratio to 2 to avoid performance issues on high pixel density devices
}
window.addEventListener("resize", onWindowResize);

//render loop
function animate(time) {
  controls.update();
  const delta = clock.getDelta();
  if (mixer) mixer.update(delta);
  renderer.render(scene, camera);
}
renderer.setAnimationLoop(animate);
