import * as THREE from '@three';

import { OrbitControls } from '@three/examples/jsm/controls/OrbitControls';
import { OBJLoader } from '@three/examples/jsm/loaders/OBJLoader';

initThree()
function initThree (maxLengthGeo) {
    let T = {}   // ThreeInstance
    T.width = window.innerWidth;
    T.height = window.innerHeight;
    T.container = document.getElementById('container')
    T.scene = new THREE.Scene();

    T.renderer = new THREE.WebGLRenderer({antialias: true, alpha: true});

    // T.renderer.setClearColor(0xffffff, 0)

    T.camera = new THREE.PerspectiveCamera(60, T.width / T.height, .1, 100000)

    T.clockIns = new THREE.Clock()

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
        T.camera.position.set(0, 0, 80); //设置相机位置
        T.camera.lookAt(T.scene.position); //设置相机方向(指向的场景对象)
    }
    T.setCamera()

    T.setControls = function(){
        if (T.controls) return
        T.controls = new OrbitControls(T.camera, T.renderer.domElement);//创建控件对象
        T.controls.enablePan = false;//启用或禁用摄像机平移
        T.controls.enableZoom = true;//是否可缩放
        T.controls.zoomSpeed = 1.0;//缩放速度
        T.controls.enableDamping = true;//使动画循环使用时阻尼或自转
        T.controls.dampingFactor = 0.25;//阻尼系数
        T.controls.addEventListener('change', function(){
            // T.uniforms = T.controls.object.position
        });
    }
    T.setControls()

    
    T.setSprite = function(amount, radius) {
        const map = new THREE.TextureLoader().load( 'https://p5.ssl.qhimg.com/t012cefa254dcb1cf32.png' );
        let group = new THREE.Group();

				const materialC = new THREE.SpriteMaterial( { map: map, color: 0xFFC481, fog: false } );

				for ( let a = 0; a < amount; a ++ ) {


					const x = Math.random() - 0.5;
					const y = Math.random() - 0.5;
					const z = Math.random() - 0.5;

					let material;
                    material = materialC.clone();

					const sprite = new THREE.Sprite( material );

					sprite.position.set( x, y, z );
					sprite.position.normalize();
					sprite.position.multiplyScalar( radius );

                    let scale = Math.random();
                    sprite.scale.set(scale, scale, scale)

					group.add( sprite );

				}

				T.scene.add( group );

                return group


    }
    T.groupSprite = T.setSprite( 200, 150)
    T.groupSprite2 = T.setSprite( 200, 150)
    T.groupSprite3 = T.setSprite( 200, 150)


    let planeVertexShader = `
        void main() {
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.);
        }
    `
    console.info(planeVertexShader)

    let planeFragShader = `
        void main() {
            gl_FragColor = vec4(1.0, 0.0, 1.0, 1.0 );

        }
    `
    T.uniforms = {
        toKey: {
            value: 1
        },
        fromKey: {
            value: 0
        },
        cam_pos: {
            value: {
                x: 0, y: 6, z: 10
            }
        },
        u_time: {
            value: 0
        },
        u_timeStart: {
            value: 0
        },
        u_timeBetween: {
            value: 1000
        }
    }

    T.setFog = (fog)=> {
        T.uniforms.fogColor = { type: 'c', value: fog.color };
        T.uniforms.fogNear = { type: 'f', value: fog.near };
        T.uniforms.fogFar = { type: 'f', value: fog.far };
    }

    function makeWavePlane() {
        T.setFog({
            color: new THREE.Color(0,0,0),
            near: 0.0,
            far: 20.0
        })
        console.info('geo', maxLengthGeo)
        // let geometry = new THREE.PlaneGeometry(2, 2, 100, 100)
        const geometry = new THREE.RingGeometry( 0, 30, 32, 30, 0, Math.PI * 2 );
        let material = new THREE.ShaderMaterial({
            uniforms: T.uniforms,
            vertexShader: planeVertexShader,
            fragmentShader: planeFragShader,
            fog: true
        })
        material.onBeforeCompile = (shader)=>{
            console.info('shader', shader.vertexShader)
        }
        // let plane = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({color: '#ffff00'}));
        let plane = new THREE.Mesh(geometry, material);
        // let plane = new THREE.Points(maxLengthGeo, material);
        T.plane = plane;
        T.scene.add(plane);
    }
    makeWavePlane()

    T.loadObj = function() {
        let objloader = new OBJLoader()
        objloader.load('static/model/logo/wyj.obj', function(obj) {
            T.plane.geometry = obj.children[0].geometry
            console.info(obj.children[0].geometry.attributes.position)
        })
    }
    // T.loadObj()



    window.addEventListener('pointerdown',function() {

        T.uniforms.u_timeStart.value = T.clockIns.getElapsedTime()
        console.info(T.uniforms.u_timeStart.value)

        T.uniforms.fromKey.value = T.uniforms.fromKey.value >=3 ? 0 :  T.uniforms.fromKey.value + 1
        T.uniforms.toKey.value = T.uniforms.toKey.value >=3 ? 0 :  T.uniforms.toKey.value + 1

    })
        T.render = function(){
            requestAnimationFrame(T.render);
            T.uniforms.u_time.value = T.clockIns.getElapsedTime()
            // T.plane.rotateZ(.001);
        
            T.groupSprite.rotation.x += .001;
            T.groupSprite2.rotation.x += .0005;
            T.groupSprite3.rotation.y += .0005;
            // T.renderer.clearColor();
            T.controls.update();
            T.renderer.render(T.scene, T.camera);//执行渲染操作
            // composer.render();
        }
        T.render()

}
