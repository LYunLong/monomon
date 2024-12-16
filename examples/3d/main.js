import * as THREE from "three";
import ShieldMaterial from "./ShieldMaterial";
console.info(ShieldMaterial);
// 创建一个场景
const scene = new THREE.Scene();

// 设置透视相机
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.set(0, 0, 5);

// 创建 WebGL 渲染器并设置其尺寸
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// 添加环境光和方向光到场景中
const ambientLight = new THREE.AmbientLight(0xcccccc, 0.4); // 柔和的环境光
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8); // 模拟太阳光的方向光
directionalLight.position.set(0, 5, 5);
scene.add(directionalLight);

// 创建护罩
const createShield = () => {
  // 创建球体几何体，表示护罩
  const geometry = new THREE.SphereGeometry(1.5, 64, 64); // 半径为1.5的球体，使用64段分割
  const material = new ShieldMaterial(); // 使用自定义的护罩材质

  // 创建网格并将几何体和材质绑定
  const shield = new THREE.Mesh(geometry, material);

  // 将护罩添加到场景中
  scene.add(shield);

  return shield;
};

const shield = createShield();

// 创建动画循环
const clock = new THREE.Clock(); // 用于追踪时间

const animate = () => {
  requestAnimationFrame(animate); // 不断调用 animate 函数
  const elapsedTime = clock.getElapsedTime(); // 获取流逝的时间

  // 更新护罩的时间，使其产生动态效果
  shield.material.update(elapsedTime);

  // 渲染场景
  renderer.render(scene, camera);
};

animate(); // 开始动画循环
