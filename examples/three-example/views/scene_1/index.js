require('./index.less')

require('script-loader!@common/screen')  // rem

import * as THREE from '@three'
import { MTLLoader } from '@three/examples/jsm/loaders/MTLLoader';
import { OBJLoader } from '@three/examples/jsm/loaders/OBJLoader';
import { OrbitControls } from '@three/examples/jsm/controls/OrbitControls';

// import { DirectionalLightHelper } from '@three/examples/jsm/helpers'
import { DragControls } from '@three/examples/jsm/controls/DragControls.js';
import { TransformControls } from '@three/examples/jsm/controls/TransformControls.js';
// require('script-loader!@common/console.js')
import { Lensflare, LensflareElement } from '@three/examples/jsm/objects/Lensflare.js';

// import { DeviceOrientationControls } from './DeviceOrientationControls'

import { mergeVertices } from '@tjsm/utils/BufferGeometryUtils.js'

const threeConfig = {
    // mtlUrl :'static/model/鲸/鲸.mtl',
    // objUrl :'static/model/鲸/鲸.obj',
    // mtlUrl :'static/model/AX_ORI/3dshow.mtl',
    // objUrl :'static/model/AX_ORI/3dshow.obj',
    // mtlUrl :'static/model/cz/3dshow.mtl',
    // objUrl :'static/model/cz/3dshow.obj',
    mtlUrl :'static/model/t832/3dshow.mtl',
    objUrl :'static/model/t832/3dshow.obj',
    sceneWidth: 800,
    sceneHeight: 800,
    // lights: [
    //     {type: }
    // ]
}

function initThree () {
    let T = {}   // ThreeInstance
    T.width = window.innerWidth;
    T.height = window.innerHeight;
    T.container = document.getElementById('container')
    T.scene = new THREE.Scene();

    T.scene.background = new THREE.Color("#aaa");/*白色底色*/

    T.renderer = new THREE.WebGLRenderer({antialias: true});

    T.camera = new THREE.PerspectiveCamera(60, T.width / T.height, .1, 100000)

    T.manager = new THREE.LoadingManager();

    T.MTLLoader = new MTLLoader(T.manager)
    
    T.OBJLoader = new OBJLoader(T.manager)

    T.models = []

    // let bbb = new DeviceOrientationControls()

    // console.info(bbb)

    function getChannelTexture(texture) {
        // 获取原始纹理
        var originalTexture = texture;
        // 创建一个临时的canvas
        var canvas = document.createElement('canvas');
        canvas.width = originalTexture.image.width;
        canvas.height = originalTexture.image.height;
        var context = canvas.getContext('2d');
        context.drawImage(originalTexture.image, 0, 0, canvas.width, canvas.height);
        // 获取图像数据
        var imageData = context.getImageData(0, 0, canvas.width, canvas.height);
        var data = imageData.data;
        // 创建新的DataTexture
        var newTexture = new THREE.DataTexture(
            new Uint8Array(canvas.width * canvas.height * 4),
            canvas.width,
            canvas.height,
            THREE.RGBAFormat,
            THREE.UnsignedByteType
        );
        // 提取红色通道
        for (var i = 0, j = 0; i < data.length; i += 4, j += 4) {
            newTexture.image.data[j] = data[i +1];  // 红色通道
            newTexture.image.data[j + 1] = data[i + 1];  // 绿色通道
            newTexture.image.data[j + 2] = data[i + 1];  // 蓝色通道
            newTexture.image.data[j + 3] = 255;  // 蓝色通道
        }
        // 设置纹理参数
        newTexture.needsUpdate = true;
        newTexture.flipY = true;
        newTexture.colorSpace = "srgb";
        return newTexture
    }

    T.loadModel = function(MTLUrl, OBJUrl) {
        T.MTLLoader.load(MTLUrl, function(materials){
            materials.preload();
            T.OBJLoader.setMaterials(materials);
            T.OBJLoader.load(OBJUrl, function(obj) {
                

                console.info(THREE)

                

                obj.traverse(function(child) {
                    child.castShadow = true;/*允许阴影*/
                    child.receiveShadow = true;
                    if (!0 && child.geometry) {
                        child.geometry.deleteAttribute('normal');
                        child.geometry = mergeVertices(child.geometry);
                        child.geometry.computeVertexNormals();
                        if (child.material instanceof Array) {
                            child.material.forEach(function(item){
                                item.side = THREE.DoubleSide
                                item.shadowSide = THREE.BackSide
                                item.dithering = !0;
                            })
                        }else {
                            child.material.side = THREE.DoubleSide
                            child.material.shadowSide = THREE.BackSide
                            child.material.dithering = !0;

                            
                            let zzz = getChannelTexture(child.material.specularMap)
                            child.material.specularMap = zzz
                            child.material.specular = new THREE.Color(0xffffff);
                            child.material.shininess = 20;
                            child.material.alphaTest = 0.1;

                            
                        }
                        
                    }
                })
                console.info(obj)
                obj.rotateX(Math.PI / -2)
                obj.rotateZ(Math.PI);
                T.models.push(obj)
                T.scene.add(obj)

                // const controls = new DragControls( [obj], T.camera, T.renderer.domElement );
                // // add event listener to highlight dragged objects
                // controls.addEventListener( 'dragstart', function ( event ) {
                //     event.object.material.emissive.set( 0xaaaaaa );
                // } );
                // controls.addEventListener( 'dragend', function ( event ) {
                //     event.object.material.emissive.set( 0x000000 );
                // } );

                // const controls = new TransformControls(T.camera, T.renderer.domElement)
                // controls.attach( obj );
                // T.scene.add(controls)
				// controls.addEventListener( 'dragging-changed', function ( event ) {
				// 	T.controls.enabled = ! event.value;
				// } );

                
                // bbb.bindObject3D(obj)

            })
        })
    }

    T.setRenderer = function(container,width, height){
        T.renderer.sortObjects = true;
        T.renderer.autoClear = false;
        T.renderer.setSize(width, height);//设置渲染区域尺寸
        T.renderer.setPixelRatio(2);//设置设备像素比例,常用于适配视网膜屏幕,防止输出到画布的图像模糊
        // This.renderer.setPixelRatio(window.devicePixelRatio);//设置设备像素比例,常用于适配视网膜屏幕,防止输出到画布的图像模糊
        T.renderer.shadowMap.enabled = true;//是否渲染阴影
        T.renderer.shadowMap.type = THREE.PCFSoftShadowMap;//更改渲染器的投影类型，阴影边缘带有虚化效果。默认值是 THREE.PCFShadowMap
        container.appendChild(T.renderer.domElement); //body元素中插入canvas对象
    }

    T.loadModel(threeConfig.mtlUrl, threeConfig.objUrl)

    T.setRenderer(T.container, T.width, T.height)


    T.setCamera = function(width = T.width,height = T.height){
        /*透视摄像机*/
        T.camera.position.set(0, 6, 10); //设置相机位置
        T.camera.lookAt(T.scene.position); //设置相机方向(指向的场景对象)
    }

    T.setCamera()

    T.setControls = function(){
        if (T.controls) return
        T.controls = new OrbitControls(T.camera, T.renderer.domElement);//创建控件对象
        T.controls.enablePan = false;//启用或禁用摄像机平移
        T.controls.enableZoom = true;//是否可缩放
        T.controls.zoomSpeed = 1.0;//缩放速度
        // T.controls.minDistance = 190;//(景深相机)
        // T.controls.maxDistance = 350;//(景深相机)
        // T.controls.minPolarAngle = Math.PI * .1
        // T.controls.maxPolarAngle = Math.PI * .48
        T.controls.enableDamping = true;//使动画循环使用时阻尼或自转
        T.controls.dampingFactor = 0.25;//阻尼系数
        /*监听鼠标、键盘事件（摄像机轨迹球）*/
        T.controls.addEventListener('change', function(){
            // console.info(1)
        });
    }
    T.setControls()

    T.setLights = function() {
        if (T.ambient) return
        //环境光
        T.ambient = new THREE.AmbientLight(0xffffff, 1);
        T.scene.add(T.ambient);
        console.info(T.ambient)

        T.directionalLight = new THREE.DirectionalLight(0xffffff, 5)
        const helper = new THREE.DirectionalLightHelper( T.directionalLight, 5 );
        T.directionalLight.rotateX(Math.PI / 4)
        T.directionalLight.position.set(10, 10, 8)
        T.directionalLight.lookAt(0,0,0)
        T.directionalLight.castShadow = true;
        T.directionalLight.shadow.bias = -0.0002;
        T.scene.add(T.directionalLight)
        T.scene.add(helper)
        console.info(THREE.DirectionalLightHelper)

        // const light = new THREE.HemisphereLight( 0xff0000, 0xffffff, 1 );
        // const helper = new THREE.HemisphereLightHelper( light, 5 );
        // T.scene.add( helper );
        // T.scene.add( light );
        // console.info(THREE.HemisphereLightHelper)

        const pointLight = new THREE.PointLight( 0xff0000, 1, 100 );
        pointLight.position.set( 0, 20, 0 );
        T.scene.add( pointLight );
        const sphereSize = 1;
        const pointLightHelper = new THREE.PointLightHelper( pointLight, sphereSize );
        T.scene.add( pointLightHelper );
        console.info(THREE.PointLightHelper)

        // const spotLight = new THREE.SpotLight( 0xff0000, 100, 0, Math.PI / 6, 1 );
        // spotLight.position.set( 0, 8, 0 );
        // T.scene.add( spotLight );
        // const spotLightHelper = new THREE.SpotLightHelper( spotLight, 0xff0000 );
        // T.scene.add( spotLightHelper );


        // const light = new THREE.PointLight( 0x00ff00, 150, 2000 );
        // const textureLoader = new THREE.TextureLoader();
        // const textureFlare0 = textureLoader.load( "https://threejs.org/examples/textures/lensflare/lensflare0.png" );
        // const textureFlare1 = textureLoader.load( "https://threejs.org/examples/textures/lensflare/lensflare2.png" );
        // const textureFlare2 = textureLoader.load( "https://threejs.org/examples/textures/lensflare/lensflare3.png" );
        // const lensflare = new Lensflare();
        // lensflare.addElement( new LensflareElement( textureFlare0, 512, 0 ) );
        // lensflare.addElement( new LensflareElement( textureFlare1, 512, .2 ) );
        // lensflare.addElement( new LensflareElement( textureFlare2, 512, .4 ) );
        // lensflare.addElement( new LensflareElement( textureFlare2, 512, .6 ) );
        // lensflare.addElement( new LensflareElement( textureFlare2, 512, .8 ) );
        // lensflare.addElement( new LensflareElement( textureFlare2, 60, 1 ) );
        // light.add( lensflare );
        // light.position.set(0,0,10)
        // T.scene.add(light)

        // lensflares
				// const textureLoader = new THREE.TextureLoader();
				// const textureFlare0 = textureLoader.load( 'https://threejs.org/examples/textures/lensflare/lensflare0.png' );
				// const textureFlare3 = textureLoader.load( 'https://threejs.org/examples/textures/lensflare/lensflare3.png' );
				// // addLight( 0.55, 0.9, 0.5, 5000, 0, - 1000 );
				// // addLight( 0.08, 0.8, 0.5, 0, 0, - 1000 );
				// // addLight( 0.995, 0.5, 0.9, 5000, 5000, - 1000 );
				// addLight( 1, 1, 1, 0, 0, 1000 );
				// // addLight( 0.995, 0.5, 0.9, 1000, 0, 0 );
				// // addLight( 0.995, 0.5, 0.9, 100, 0, 0 );

				// function addLight( h, s, l, x, y, z ) {
				// 	const light = new THREE.PointLight( 0xffffff, 1.5, 2000, 0 );
				// 	light.color.setHSL( h, s, l );
				// 	light.position.set( x, y, z );
				// 	T.scene.add( light );

                //     console.info(light.color)

				// 	const lensflare = new Lensflare();
				// 	lensflare.addElement( new LensflareElement( textureFlare0, 100, 0, light.color ) );
				// 	lensflare.addElement( new LensflareElement( textureFlare3, 150, 0.1, new THREE.Color(1,0,0) ) );
				// 	lensflare.addElement( new LensflareElement( textureFlare3, 150, 0.2, new THREE.Color(1,0,1) ) );
				// 	lensflare.addElement( new LensflareElement( textureFlare3, 200, .5, new THREE.Color(0,1,0) ) );
				// 	lensflare.addElement( new LensflareElement( textureFlare3, 200, 1, new THREE.Color(1,1,0) ) );
				// 	// lensflare.addElement( new LensflareElement( textureFlare3, 70, 2.7 ) );
				// 	// lensflare.addElement( new LensflareElement( textureFlare3, 120, 3.9 ) );
				// 	// lensflare.addElement( new LensflareElement( textureFlare3, 70, 5 ) );
				// 	light.add( lensflare );
				// }



        // const size = 10;
        // const divisions = 10;
        // const gridHelper = new THREE.GridHelper( size, divisions );
        // T.scene.add( gridHelper );

        // const radius = 10;
        // const sectors = 16;
        // const rings = 8;
        // const divisions = 64;
        // const helper = new THREE.PolarGridHelper( radius, sectors, rings, divisions );
        // T.scene.add( helper );

        // const plane = new THREE.Plane( new THREE.Vector3( 0, 0, 0 ), 0 );
        // const helper = new THREE.PlaneHelper( plane, 1, 0xffff00 );
        // T.scene.add( helper );

        
    }    
    T.setLights()

    T.render = function(){
        requestAnimationFrame(T.render);

        T.controls.update();
        T.renderer.render(T.scene, T.camera);//执行渲染操作
    }
    T.render()

    

    
}
;(function(window, document){
    initThree()
})(window, document)
