
  <template>
    <div :id="containerId" class="ez-3d-show" ></div>
  </template>
  
  <script>

    import * as THREE from 'three';
    
    import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
    import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader';
    import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
    import { mergeVertices } from 'three/examples/jsm/utils/BufferGeometryUtils.js'

    function THREE_WORLD (objUrl, mtlUrl, sceneWidth, sceneHeight, options={}) {
      function initThree () {
          let T = {}   // ThreeInstance
          T.width = sceneWidth || window.innerWidth;
          T.height = sceneHeight || window.innerHeight;
          debugger
          T.container = document.getElementById(options.id || 'ez_3d_show')
          console.info(22222222, T.container)
          T.scene = new THREE.Scene();
          T.renderer = new THREE.WebGLRenderer({antialias: true, alpha: true});
          T.camera = new THREE.PerspectiveCamera(60, T.width / T.height, .1, 100000)
          T.clockIns = new THREE.Clock()
          T.light = new THREE.AmbientLight(0xffffff, 3)
          T.scene.add(T.light)
          T.light2 = new THREE.DirectionalLight(0xffffff, 5)
          T.scene.add(T.light2)

          T.setRenderer = function(container,width, height){
              T.renderer.sortObjects = true;
              T.renderer.autoClear = false;
              T.renderer.setSize(width, height);//设置渲染区域尺寸
              console.info('devicePixelRatio', window.devicePixelRatio)
              T.renderer.setPixelRatio(1);//设置设备像素比例,常用于适配视网膜屏幕,防止输出到画布的图像模糊
              T.renderer.shadowMap.enabled = true;//是否渲染阴影
              T.renderer.shadowMap.type = THREE.PCFSoftShadowMap;//更改渲染器的投影类型，阴影边缘带有虚化效果。默认值是 THREE.PCFShadowMap
              container.appendChild(T.renderer.domElement); //body元素中插入canvas对象
          }
          T.setRenderer(T.container, T.width, T.height)

          T.setCamera = function(){
              /*透视摄像机*/
              T.camera.position.set(10, 10, 0);
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
                  console.info(mtl)
                  console.info(obj)
                  obj.traverse(function(child) {
                    if (child instanceof THREE.Mesh) {
                      child.geometry.deleteAttribute('normal')
                      child.geometry = mergeVertices(child.geometry);
                      child.geometry.computeVertexNormals();
                    }
                  })
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
      props: [
        'objURL', 'mtlURL', 'sceneWidth', 'sceneHeight', 'options'
      ],
      /**
       * options 可选内容
       * - id 设置canvas外容器id，用于多个组件同时展示，default为 ‘ez_3d_show’
       * - camera 设置场景中摄像机
       * --- {
       *    type: 'perspectiveCamera' default
       *    angle: 45,
       *    position: [100,100,100],
       *    lookAt: [0,0,0]
       * }
       * - control 设置场景中相机的控制器
       * --- {
       *    type: 'orbitControl' default,
       *    settings: {}
       * }
       * - children 设置场景内布置的物体，可以传列表
       * --- children中单个物体的数据结构:
       *        {
       *          name: '物体名称' *'',
       *          type: 'obj' *'obj',
       *          model: 'url' *''必填,
       *          material: 'url' *''必填,
       *          position: [x, y, z]，default 0，0，0
       *          rotation: [x, y, z]弧度，default 0，0，0
       *          scale: [x,y,z]default 1,1,1
       *        }
       * 
       * - light 设置场景内的灯光效果
       * --- light {
       *              name: '',
       *              type: 'directionalLight' 灯类型
       *              position: [x,y,z],
       *              lookAt: [x,y,z],
       *              power: 1,
       *              color: 0xffffff
       *           }
       * */ 
      data() {
        return {
            loaded: false,
            containerId: 'ez_3d_show'
        };
      },
      
      async mounted() {
        await this.options && this.options.id && (this.containerId = this.options.id);
        setTimeout(() => {
          THREE_WORLD(this.objURL, this.mtlURL, this.sceneWidth, this.sceneHeight, this.options)
        }, 0);
        
      }
    };
  </script>

  