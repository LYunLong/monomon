import * as THREE from '@three';

let FocusShader = {
    uniforms: {
        tDiffuse: { value: null },
        screenWidth: { value: 1024 },
        screenHeight: {  value: 1024 },
        sampleDistance: {  value: .794 },
        waveFactor: {  value: .00125 }
    },
    vertexShader: ["varying vec2 vUv;", "void main() {", "vUv = uv;", "gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );", "}"].join("\n"),
    fragmentShader: ["uniform float screenWidth;", "uniform float screenHeight;", "uniform float sampleDistance;", "uniform float waveFactor;", "uniform sampler2D tDiffuse;", "varying vec2 vUv;", "void main() {", "vec4 color, org, tmp, add;", "float sample_dist, f;", "vec2 vin;", "vec2 uv = vUv;", "add = color = org = texture2D( tDiffuse, uv );", "vin = ( uv - vec2( 0.5 ) ) * vec2( 1.4 );", "sample_dist = dot( vin, vin ) * 2.0;", "f = ( waveFactor * 100.0 + sample_dist ) * sampleDistance * 4.0;", "vec2 sampleSize = vec2(  1.0 / screenWidth, 1.0 / screenHeight ) * vec2( f );", "add += tmp = texture2D( tDiffuse, uv + vec2( 0.111964, 0.993712 ) * sampleSize );", "if( tmp.b < color.b ) color = tmp;", "add += tmp = texture2D( tDiffuse, uv + vec2( 0.846724, 0.532032 ) * sampleSize );", "if( tmp.b < color.b ) color = tmp;", "add += tmp = texture2D( tDiffuse, uv + vec2( 0.943883, -0.330279 ) * sampleSize );", "if( tmp.b < color.b ) color = tmp;", "add += tmp = texture2D( tDiffuse, uv + vec2( 0.330279, -0.943883 ) * sampleSize );", "if( tmp.b < color.b ) color = tmp;", "add += tmp = texture2D( tDiffuse, uv + vec2( -0.532032, -0.846724 ) * sampleSize );", "if( tmp.b < color.b ) color = tmp;", "add += tmp = texture2D( tDiffuse, uv + vec2( -0.993712, -0.111964 ) * sampleSize );", "if( tmp.b < color.b ) color = tmp;", "add += tmp = texture2D( tDiffuse, uv + vec2( -0.707107, 0.707107 ) * sampleSize );", "if( tmp.b < color.b ) color = tmp;", "color = color * vec4( 2.0 ) - ( add / vec4( 8.0 ) );", "color = color + ( add / vec4( 8.0 ) - color ) * ( vec4( 1.0 ) - vec4( sample_dist * 0.5 ) );", "gl_FragColor = vec4( color.rgb * color.rgb * vec3( 0.95 ) + color.rgb, 1.0 );", "}"].join("\n")
}

import { OrbitControls } from '@three/examples/jsm/controls/OrbitControls';
import { OBJLoader } from '@three/examples/jsm/loaders/OBJLoader';


            import { EffectComposer } from '@three/examples/jsm/postprocessing/EffectComposer.js';
			import { RenderPass } from '@three/examples/jsm/postprocessing/RenderPass.js';
			import { ShaderPass } from '@three/examples/jsm/postprocessing/ShaderPass.js';
			import { BloomPass } from '@three/examples/jsm/postprocessing/BloomPass.js';
			import { FilmPass } from '@three/examples/jsm/postprocessing/FilmPass.js';

			import { GlitchPass } from '@three/examples/jsm/postprocessing/GlitchPass.js';
			import { OutputPass } from '@three/examples/jsm/postprocessing/OutputPass.js';

            import { BokehPass } from '@three/examples/jsm/postprocessing/BokehPass.js';


import lottie from 'lottie-web';

console.info(lottie)

function initLottie() {
    let element = document.getElementById('lottie')
    lottie.loadAnimation({
        container: element, // the dom element that will contain the animation
        renderer: 'svg',
        loop: true,
        autoplay: true,
        path: 'https://s0.ssl.qhres2.com/static/e38e23777109309a.json' // the path to the animation json
      });
}
// initLottie()

let objList = {
    logo: {
        scale: 1,
        translate: {
            x: -1,
            y: 0, 
            z: 0
        },
        shaderKey: '0.0',
        url: 'static/model/logo/logo.obj',
        obj: null
    },

    maozi: {
        scale: .04,
        rotation: {
            x: 0,
            y: Math.PI,
            z: 0
        },
        translate: {
            x: 0,
            y: 0, 
            z: 0
        },
        shaderKey: '1.0',
        url: 'static/model/logo/wyj.obj',
        obj: null
    },
    tank: {
        scale: 4,
        shaderKey: '2.0',
        url: 'static/model/logo/tank.obj',
        obj: null
    },
    paodan: {
        scale: .1,
        rotation: {
            x: 0,
            y: 0,
            z: 45
        },
        translate: {
            x: 1,
            y: 0, 
            z: 0
        },
        shaderKey: '3.0',
        url: 'static/model/logo/paodan.obj',
        obj: null
    },
    jiangbei: {
        scale: .8,
        shaderKey: '4.0',
        url: 'static/model/logo/jiangbei.obj',
        obj: null
    },
    
}

loadObjList()

function loadObjList() {
    Object.keys(objList).forEach((objName)=>{
        if (!objList[objName].obj) {
            loadObj(objList[objName])
        }
    })
}

function checkObjLoaded() {
    let done = 1
    Object.keys(objList).forEach((objName)=>{ if (!objList[objName].obj) { done = 0 } })
    return done
}

function calcObjSize() {
    let maxLengthGeo
    Object.keys(objList).forEach((objName)=>{ 
        let geo = objList[objName].obj.children[0].geometry
        if (!maxLengthGeo) {
            maxLengthGeo = objList[objName].obj.children[0].geometry
        }else if (maxLengthGeo.attributes.position.count < geo.attributes.position.count) {
            maxLengthGeo = objList[objName].obj.children[0].geometry
        }
     })
     return maxLengthGeo
}
function loadObj(objItem) {
    let objloader = new OBJLoader()
    objloader.load(objItem.url, function(obj) {

        obj.children[0].geometry.scale(objItem.scale, objItem.scale, objItem.scale)
        
        objItem.rotation && (obj.children[0].geometry.rotateX(objItem.rotation.x) )
        && (obj.children[0].geometry.rotateY(objItem.rotation.y) )
        && (obj.children[0].geometry.rotateZ(objItem.rotation.z) )
        objItem.translate && (obj.children[0].geometry.translate(objItem.translate.x, objItem.translate.y, objItem.translate.z ) )

        objItem.obj = obj
        
        if (checkObjLoaded()) {
            console.info('全部加载')
            console.info(objList)
            let maxLengthGeo = calcObjSize()
            console.log(maxLengthGeo);
            let indexShow = new Float32Array(maxLengthGeo.attributes.position.count)  //最大模型的点位索引index

            let randomDelay = new Float32Array(maxLengthGeo.attributes.position.count)  //每个点有一个随机数
            let randomSpeed = new Float32Array(maxLengthGeo.attributes.position.count)  //每个点有一个随机数

            let model_logo_Vertex = new Float32Array(maxLengthGeo.attributes.position.array.length)
            let model_maozi_Vertex = new Float32Array(maxLengthGeo.attributes.position.array.length)
            let model_tank_Vertex = new Float32Array(maxLengthGeo.attributes.position.array.length)
            let model_paodan_Vertex = new Float32Array(maxLengthGeo.attributes.position.array.length)
            let model_jiangbei_Vertex = new Float32Array(maxLengthGeo.attributes.position.array.length)

            for (let i = 0; i< indexShow.length; i++) {
                indexShow[i] = i / indexShow.length;
                randomDelay[i] = Math.random();
                randomSpeed[i] = Math.random();
            }
            for (let i = 0; i< model_logo_Vertex.length; i++) {
                let pos0 = objList['logo'].obj.children[0].geometry.attributes.position
                model_logo_Vertex[i] = pos0.array[i % pos0.array.length]

                let pos1 = objList['maozi'].obj.children[0].geometry.attributes.position
                model_maozi_Vertex[i] = pos1.array[i % pos1.array.length]

                let pos2 = objList['tank'].obj.children[0].geometry.attributes.position
                model_tank_Vertex[i] = pos2.array[i % pos2.array.length]

                let pos3 = objList['paodan'].obj.children[0].geometry.attributes.position
                model_paodan_Vertex[i] = pos3.array[i % pos3.array.length]

                let pos4 = objList['jiangbei'].obj.children[0].geometry.attributes.position
                model_jiangbei_Vertex[i] = pos4.array[i % pos4.array.length]
                
            }

            maxLengthGeo.setAttribute('indexShow', new THREE.BufferAttribute(indexShow, 1))
            maxLengthGeo.setAttribute('randomDelay', new THREE.BufferAttribute(randomDelay, 1))
            maxLengthGeo.setAttribute('randomSpeed', new THREE.BufferAttribute(randomSpeed, 1))

            maxLengthGeo.setAttribute('model_logo_Vertex', new THREE.BufferAttribute(model_logo_Vertex, 3))
            maxLengthGeo.setAttribute('model_maozi_Vertex', new THREE.BufferAttribute(model_maozi_Vertex, 3))
            maxLengthGeo.setAttribute('model_tank_Vertex', new THREE.BufferAttribute(model_tank_Vertex, 3))
            maxLengthGeo.setAttribute('model_paodan_Vertex', new THREE.BufferAttribute(model_paodan_Vertex, 3))
            maxLengthGeo.setAttribute('model_jiangbei_Vertex', new THREE.BufferAttribute(model_jiangbei_Vertex, 3))

            initThree(maxLengthGeo)
        }
        
    })
}



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



    const effectBloom = new BloomPass( .75 );
	const effectFilm = new FilmPass( .5,.5,1500,!1 );

    let composer = T.composer = new EffectComposer( T.renderer );
    composer.addPass( new RenderPass( T.scene, T.camera ) );
    let glitchPass = new GlitchPass();
    // composer.addPass( glitchPass );
    const outputPass = new OutputPass();
    let P = new ShaderPass(FocusShader)
    P.uniforms.screenWidth.value = window.innerWidth
    P.uniforms.screenHeight.value = window.innerHeight
    P.renderToScreen = !0
    const bokehPass = new BokehPass( T.scene, T.camera, {
        focus: 1.0,
        aperture: 0.05,
        maxblur: .004
    } );

    composer.addPass( effectBloom );
    composer.addPass( effectFilm );
    composer.addPass( outputPass );
    composer.addPass( P );
    composer.addPass( bokehPass );


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

        #define showMe(n) n

        uniform vec3 cam_pos;
        uniform float u_time;
        uniform float u_timeStart;
        varying float pxy;
        varying vec3 v_position;

        attribute float indexShow;
        varying float v_indexShow;

        attribute float randomSpeed;

        attribute float randomDelay;
        varying float v_randomDelay;

        ${

            `attribute vec3 model_logo_Vertex;   ` +
            //0
            `attribute vec3 model_maozi_Vertex;   ` +
            //1
            `attribute vec3 model_tank_Vertex; `   +
            //2
            `attribute vec3 model_paodan_Vertex;  ` +
            //3
            `attribute vec3 model_jiangbei_Vertex;  `
            //4
            

        }
        varying float v_timeCenterDistancePercent;

        uniform float toKey;
        uniform float fromKey;

        float timePassProgress() {
            
            float delayLimited = clamp(randomDelay * 2., 0., 2.);
            float timeCircle = .15;
            float timePassPercent = (u_time - u_timeStart) / timeCircle;
            float timeCenterDistancePercent = timePassPercent <= .5 ? timePassPercent * 2. : (1. - timePassPercent) * 2. ;
            float speedLimited = clamp( (randomSpeed + .2) * timeCenterDistancePercent, .5, 1.2);
            float tpgOrigin = timePassPercent * speedLimited - delayLimited;
            // float tpgOrigin = timePassPercent * speedLimited;
            float tpg = clamp( tpgOrigin ,0., 1. );
            //此次运动进程
            return tpg;
        }
        
        
        void main() {
            vec3 model_3_Vertex = position;
            v_position = position;
            v_indexShow = indexShow;
            v_randomDelay = randomDelay;
            vec2 positionXY = position.xy;
            float lPXY = length(position.xy) / 30.;
            pxy = lPXY;
            float offsetZ = log(lPXY );
            float waveZ =  lPXY * sin(20.*lPXY - u_time * 3.);
            // gl_Position = projectionMatrix * modelViewMatrix * vec4(position.x, position.y, position.z + offsetZ - waveZ , 1.0);
            // gl_PointSize = 10. - length((projectionMatrix * modelViewMatrix * vec4(position, 1.)).xyz) / 1.;


            //position + pow((u_time - u_timeStart), 2) / 2 * .5


            float tpg = timePassProgress();

            vec3 fromModelPoint = position;
            vec3 toModelPoint = position;

            ${
                `if (fromKey == 0.0) {
                    fromModelPoint = model_logo_Vertex;
                }` +

                `
                if (fromKey == 1.0) {
                    fromModelPoint = model_maozi_Vertex;
                }
                `+

                `
                if (fromKey == 2.0) {
                    fromModelPoint = model_tank_Vertex;
                }
                `+

                `
                if (fromKey == 3.0) {
                    fromModelPoint = model_paodan_Vertex;
                }
                ` +

                `
                if (fromKey == 4.0) {
                    fromModelPoint = model_jiangbei_Vertex;
                }
                ` 

            }

            ${
                `if (toKey == 0.0) {
                    toModelPoint = model_logo_Vertex;
                }` +

                `
                if (toKey == 1.0) {
                    toModelPoint = model_maozi_Vertex;
                }
                `+

                `
                if (toKey == 2.0) {
                    toModelPoint = model_tank_Vertex;
                }
                `+

                `
                if (toKey == 3.0) {
                    toModelPoint = model_paodan_Vertex;
                }
                ` +

                `
                if (toKey == 4.0) {
                    toModelPoint = model_jiangbei_Vertex;
                }
                ` 
            }
            
            vec3 betweenTwoPoint =   toModelPoint - fromModelPoint;

            vec3 nowPoint = fromModelPoint + ( betweenTwoPoint * tpg );

            gl_Position = projectionMatrix * modelViewMatrix * vec4(nowPoint, 1.);
            gl_PointSize = 3.;

        }
    `
    console.info(planeVertexShader)

    let planeFragShader = `
        varying float pxy;
        varying vec3 v_position;

        varying float v_indexShow;
        varying float v_randomDelay;

        uniform vec3 fogColor;
        uniform float fogFar;
        uniform float fogNear;

        void main() {
            // float d = length(gl_PointCoord - v_position.xy);
            float d=distance(gl_PointCoord, vec2(0.5, 0.5));
            if(d>0.5) discard;
            // gl_FragColor = vec4(v_indexShow ,v_randomDelay ,v_randomDelay ,1.);
            // gl_FragColor = vec4(v_randomDelay ,.5, .5 ,1.);
            // gl_FragColor = d < .01 ? vec4(1.,1.,1., 1.0) : vec4(0.,0.,0.,0.);
            // gl_FragColor = vec4(1.,1.,1.,1.);

            // float depth = gl_FragCoord.z / gl_FragCoord.w;  //越近越小
            // float fogFactor = smoothstep( fogNear, fogFar, depth );   //根据near和far输出0-1
            // gl_FragColor.rgb = mix( vec3(1., 1. ,1.), fogColor, fogFactor ); 
            // gl_FragColor.a = 1.;
               //z越小,颜色越暗

            gl_FragColor = vec4(1., .77, .5, 1. );

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
        // let plane = new THREE.Mesh(geometry, material);
        let plane = new THREE.Points(maxLengthGeo, material);
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
            // T.renderer.render(T.scene, T.camera);//执行渲染操作
            composer.render();
        }
        T.render()

}
