import * as THREE from 'three';
// 创建护罩的自定义 Shader 材质
class ShieldMaterial extends THREE.ShaderMaterial {
    constructor() {
      super({
        uniforms: {
          time: { value: 0 }, // 动态变化的时间
          color: { value: new THREE.Color(0xff0000) } // 护罩的颜色
        },
        vertexShader: `
          varying vec3 vNormal;
          void main() {
            vNormal = normalize(normalMatrix * normal);
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `,
        fragmentShader: `
          uniform float time;
          uniform vec3 color;
          varying vec3 vNormal;
          void main() {
            float intensity = pow(0.5 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 2.0);
            gl_FragColor = vec4(color * intensity, 1.0);
            // gl_FragColor = vec4(color * sin(time), 1.0);
          }
        `,
        transparent: true, // 设置材质为透明
        blending: THREE.AdditiveBlending, // 使用叠加效果
      });
    }
  
    update(time) {
      this.uniforms.time.value = time;
    }
  }

  export default ShieldMaterial;