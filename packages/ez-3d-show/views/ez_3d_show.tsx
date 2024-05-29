import { FC, ReactElement, useEffect } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
import { mergeVertices } from 'three/examples/jsm/utils/BufferGeometryUtils.js'

interface IThreeInstance {
    width: number;
    height: number;
    container: HTMLElement | null;
    scene: THREE.Scene;
    renderer: THREE.WebGLRenderer;
    camera: THREE.PerspectiveCamera;
    controls?: OrbitControls;
}

interface IThreeInitParamsOptions {
    id?: string
}

const containerId: string = 'ez_3d_show'

const Ez3dShow: FC<any> = ({objURL, mtlURL, sceneWidth, sceneHeight, options}): ReactElement=> {
    const THREE_WORLD = (objUrl: string, mtlUrl: string, sceneWidth: number, sceneHeight: number, options:IThreeInitParamsOptions={}) => {
        const initThree = ()=> {
            const width = sceneWidth || window.innerWidth
            const height = sceneHeight || window.innerHeight
            let T :IThreeInstance = {
                width : width,
                height : height,
                container : document.getElementById(options.id || containerId),
                scene : new THREE.Scene(),
                renderer : new THREE.WebGLRenderer({antialias: true, alpha: true}),
                camera : new THREE.PerspectiveCamera(60, width / height, .1, 100000)
            }  // ThreeInstance
            let light = new THREE.AmbientLight(0xffffff, 3)
            T.scene.add(light)
            let light2 = new THREE.DirectionalLight(0xffffff, 5)
            T.scene.add(light2)

            const setRenderer = (container: HTMLElement | null, width: number, height: number)=> {
                T.renderer.setSize(width, height);
                container?.appendChild(T.renderer.domElement);
            }
            setRenderer(T.container, T.width, T.height)

            const setControls = function(){
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
            setControls()
            const setCamera = function(){
                /*透视摄像机*/
                T.camera.position.set(10, 10, 0);
            }
            setCamera()
            const loadObj = function() {
                let mtlloader = new MTLLoader()
                let objloader = new OBJLoader()
                
                mtlloader.load(mtlUrl, function(mtl) {
                  mtl.preload()
                  objloader.setMaterials(mtl)
                  objloader.load(objUrl, function(obj) {
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
            loadObj()

            const render = function(){
                T.controls?.update();
                T.renderer.render(T.scene, T.camera);//执行渲染操作
                requestAnimationFrame(render);
            }
            render()
        }
        initThree()
    }

    const clearTHREEWorld = ()=> {
        let container = document.getElementById(containerId)
        container!.innerHTML = ''
    }

    useEffect(()=>{
        THREE_WORLD(objURL, mtlURL, sceneWidth, sceneHeight)
        return clearTHREEWorld;
    }, [])
    return (
        <div id={containerId} className="ez-3d-show" ></div>
    )
}

export default Ez3dShow;