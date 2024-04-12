export const vertex = /* glsl */`
    attribute vec4 a_Position; 
    attribute vec4 a_Color; 
    varying vec4 v_Color;
    void main() {
        gl_Position = a_Position;
        gl_PointSize = 10.0;
        v_Color = a_Color;
    }
`
// gl_Position = vec4(0.0, 0.0, 0.0, 1.0);
// gl_PointSize = 100.0;

export const fragment = /* glsl */`
    precision mediump float;
    varying vec4 v_Color;
    void main() {
        gl_FragColor = v_Color;
    }
`