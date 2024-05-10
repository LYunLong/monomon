

<template>

    <div id="ez_3d_show" class="ez-3d-show" >
    </div>

  </template>
  
  <script>

    import * as THREE from 'three';
    
    import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
    import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader';
    import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';

    console.info(THREE)
    console.info('OrbitControls', OrbitControls)

    function THREE_WORLD () {

      const objUrl = 'https://cgdl.qihucdn.com/wargame/AX.obj'
      const mtlUrl = 'https://cgdl.qihucdn.com/wargame/AX2.mtl'
      console.info(objUrl)

      function initThree () {
          let T = {}   // ThreeInstance
          T.width = window.innerWidth;
          if (T.width>750) { T.width=750 }
          T.height = window.innerHeight;
          T.container = document.getElementById('ez_3d_show')
          T.scene = new THREE.Scene();

          T.renderer = new THREE.WebGLRenderer({antialias: true, alpha: true});

          T.camera = new THREE.PerspectiveCamera(60, T.width / T.height, .1, 100000)

          T.clockIns = new THREE.Clock()

          T.light = new THREE.AmbientLight(0xffffff, 2)
          T.scene.add(T.light)

          T.light2 = new THREE.DirectionalLight(0xffffff, 2)
          T.scene.add(T.light2)

          

          T.setRenderer = function(container,width, height){
              T.renderer.sortObjects = true;
              T.renderer.autoClear = false;
              T.renderer.setSize(width, height);//设置渲染区域尺寸
              // T.renderer.setPixelRatio(2);//设置设备像素比例,常用于适配视网膜屏幕,防止输出到画布的图像模糊
              console.info('devicePixelRatio', window.devicePixelRatio)
              // T.renderer.setPixelRatio(window.devicePixelRatio);//设置设备像素比例,常用于适配视网膜屏幕,防止输出到画布的图像模糊
              T.renderer.setPixelRatio(1);//设置设备像素比例,常用于适配视网膜屏幕,防止输出到画布的图像模糊
              T.renderer.shadowMap.enabled = true;//是否渲染阴影
              T.renderer.shadowMap.type = THREE.PCFSoftShadowMap;//更改渲染器的投影类型，阴影边缘带有虚化效果。默认值是 THREE.PCFShadowMap
              container.appendChild(T.renderer.domElement); //body元素中插入canvas对象
          }
          T.setRenderer(T.container, T.width, T.height)

          T.setCamera = function(width = T.width,height = T.height){
              /*透视摄像机*/
              T.camera.position.set(10, 10, 0); //设置相机位置
              // T.camera.lookAt(T.scene.position); //设置相机方向(指向的场景对象)
              // T.camera.lookAt(new THREE.Vector3(-20, 0, 0)); //设置相机方向(指向的场景对象)
          }
          T.setCamera()

          T.setControls = function(){
              if (T.controls) return
              T.controls = new OrbitControls(T.camera, T.renderer.domElement);//创建控件对象
              T.controls.enablePan = true;//启用或禁用摄像机平移
              T.controls.enableZoom = true;//是否可缩放
              T.controls.zoomSpeed = 1.0;//缩放速度
              T.controls.enableDamping = true;//使动画循环使用时阻尼或自转
              T.controls.dampingFactor = 0.25;//阻尼系数
              T.controls.addEventListener('change', function(){
              });
          }
          T.setControls()

          T.loadObj = function() {
              let mtlloader = new MTLLoader()
              let objloader = new OBJLoader()
              mtlloader.load(mtlUrl, function(mtl) {
                mtl.preload()
                objloader.setMaterials(mtl)
                objloader.load(objUrl, function(obj) {
                  // T.plane.geometry = obj.children[0].geometry
                  console.info(mtl)
                  console.info(obj)

                  T.scene.add(obj)
              })
              })
              
          }
          T.loadObj()
          
              T.render = function(){
                  T.controls.update();
                  T.renderer.render(T.scene, T.camera);//执行渲染操作
                  requestAnimationFrame(T.render);
              }
              T.render()


      }
      initThree()
    }
  
    export default {
      name: "ez_3d_show",
      components: {},
      data() {
        return {
            loaded: false,
        };
      },
      
      async mounted() {
        THREE_WORLD()
      }
    };
  </script>

  