
export function colorValueToColorArray(nColor, clrArray) {
            let r = (nColor & 0xff0000) >> 16
            let g = (nColor & 0x00ff00) >> 8
            let b = (nColor & 0x0000ff)
            clrArray[0] = r / 255
            clrArray[1] = g / 255
            clrArray[2] = b / 255;
}

export class pgl_axes {
    constructor (gl, a_Position, a_Color, length, nXColor, nYColor, nZColor, dat_gui) {
        this.gl = gl;
        this.a_Position = a_Position;
        this.a_Color = a_Color;
        this.length = length;
        this.nXColor = nXColor;
        this.nYColor = nYColor;
        this.nZColor = nZColor;
        this.dat_gui = dat_gui;

        this.axesCtrlObj = {
            length: length,
            xColor: nXColor,
            yColor: nYColor,
            zColor: nZColor
        }

        this.vertices = new Float32Array([
            0,0,0   ,this.axesCtrlObj.length,0,0,
            0,0,0   ,0,this.axesCtrlObj.length,0,
            0,0,0   ,0,0,this.axesCtrlObj.length, 
        ])

        let clrArrayX = new Float32Array([1.0, 1.0, 1.0, 1.0]);
        let clrArrayY = new Float32Array([1.0, 1.0, 1.0, 1.0]);
        let clrArrayZ = new Float32Array([1.0, 1.0, 1.0, 1.0]);
        colorValueToColorArray(nXColor, clrArrayX)
        colorValueToColorArray(nYColor, clrArrayY)
        colorValueToColorArray(nZColor, clrArrayZ)

        this.colors = new Float32Array([
            clrArrayX[0], clrArrayX[1], clrArrayX[2],   clrArrayX[0],clrArrayX[1],clrArrayX[2],
            clrArrayY[0], clrArrayY[1], clrArrayY[2],   clrArrayY[0],clrArrayY[1],clrArrayY[2],
            clrArrayZ[0], clrArrayZ[1], clrArrayZ[2],   clrArrayZ[0],clrArrayZ[1],clrArrayZ[2],
        ])

        clrArrayX = clrArrayY = clrArrayZ = null;

        this.vBuffer = gl.createBuffer();
        this.clrBuffer = gl.createBuffer();

        this.FSIZE = this.vertices.BYTES_PER_ELEMENT; 

        

        this.draw = function () {
            let gl = this.gl
            gl.bindBuffer(gl.ARRAY_BUFFER, this.vBuffer);
            gl.bufferData(gl.ARRAY_BUFFER, this.vertices, gl.STATIC_DRAW)
            gl.vertexAttribPointer (this.a_Position, 3, gl.FLOAT, false, this.FSIZE*3, 0);
            gl.enableVertexAttribArray(this.a_Position)
    
            gl.bindBuffer(gl.ARRAY_BUFFER, this.clrBuffer);
            gl.bufferData(gl.ARRAY_BUFFER, this.colors, gl.STATIC_DRAW)
            gl.vertexAttribPointer (this.a_Color, 3, gl.FLOAT, false, this.FSIZE*3, 0);
            gl.enableVertexAttribArray(this.a_Color)
    
            gl.drawArrays(gl.LINES, 0, 6)
        }

        // this.draw.bind(this)
        // this.draw()
        
    }
    
    
}