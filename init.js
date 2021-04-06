import * as mat4 from './koz-matrix/mat4.js'

class Init {
    constructor(canvasID) {
        this.getCanvas(canvasID)
        this.initGL(this.canvas)
        this.initShaders()
        this.textures = []
        this.shapeBuffers = {};

    }

    getCanvas(canvasID) {
        this.canvas = document.getElementById(canvasID)
    }

    initGL(canvas) {
        this.gl = canvas.getContext('webgl')
        this.gl.width = this.canvas.width
        this.gl.height = this.canvas.height
    }

    initShaders() {
        let fragmentShader = this.getShader("fragment-shader")
        let vertexShader = this.getShader("vertex-shader")

        this.shaderProgram = this.gl.createProgram()
        this.gl.attachShader(this.shaderProgram, fragmentShader)
        this.gl.attachShader(this.shaderProgram, vertexShader)
        this.gl.linkProgram(this.shaderProgram)

        if (!this.gl.getProgramParameter(this.shaderProgram, this.gl.LINK_STATUS)) {
            alert("Could not initialise shaders")
        }

        this.gl.useProgram(this.shaderProgram)

        this.shaderProgram.vertexPositionAttribute = this.gl.getAttribLocation(this.shaderProgram, "aVertexPosition");
        this.gl.enableVertexAttribArray(this.shaderProgram.vertexPositionAttribute);

        //this.shaderProgram.vertexColorAttribute = this.gl.getAttribLocation(this.shaderProgram, "aVertexColor");
        //this.gl.enableVertexAttribArray(this.shaderProgram.vertexColorAttribute);

        this.shaderProgram.mvpMatrixUniform = this.gl.getUniformLocation(this.shaderProgram, "uMVPMatrix");
        //this.shaderProgram.uColor = this.gl.getUniformLocation(this.shaderProgram, "uColor");
    }



    initBuffer(vertices) {
        let newBuffer = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, newBuffer)
        this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(vertices), this.gl.STATIC_DRAW)
        newBuffer.itemSize = vertices.itemSize
        newBuffer.numItems = vertices.numItems
        return newBuffer
    }

    addPositionBuffer(shape) {
        const positionBuffer = this.initBuffer(shape.positionVertices)
        let newShapeBuffer = {};
        newShapeBuffer.positionBuffer = positionBuffer
        newShapeBuffer.modelMatrix = shape.modelMatrix
        newShapeBuffer.primitiveMode = shape.primitiveMode
        this.shapeBuffers[shape.id] = newShapeBuffer
    }

    addColorBuffer(shape) {
        if (this.shapeBuffers[shape.id] !== undefined) {
            this.shapeBuffers[shape.id].colorBuffer = this.initBuffer(shape.colorVertices)
        }
    }

    addTextureBuffer(shape) {
        if (this.shapeBuffers[shape.id] !== undefined) {
            this.shapeBuffers[shape.id].textureBuffer = this.initBuffer(shape.textureVertices)
        }
    }

    addTexture(){
        let newTexture = this.gl.createTexture()
        newTexture.image = new Image();
        newTexture.image.onload = function() {
            handleLoadedTexture(newTexture)
        }
        newTexture.image.src = "sample.jpg"

        function handleLoadedTexture(texture) {
            this.gl.bindTexture(this.gl.TEXTURE_2D, texture)
            this.gl.pixelStorei(this.gl.UNPACK_FLIP_Y_WEBGL, true)
            this.gl.texImage2D(this.gl.TEXTURE_2D, 0, this.gl.RGBA, this.gl.RGBA, this.gl.UNSIGNED_BYTE, texture.image);
            this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MAG_FILTER, this.gl.NEAREST);
            this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.gl.NEAREST);
            this.gl.bindTexture(this.gl.TEXTURE_2D, null);
        }
    }


    getShader(id) {
        const shaderScript = document.getElementById(id)
        if (!shaderScript) {
            return null
        }

        let str = ""
        let k = shaderScript.firstChild
        if (k) {
            if (k.nodeType === Node.TEXT_NODE) {
                str += k.textContent
            }
            k = k.nextSibling
        }

        let shader
        if (shaderScript.type === "x-shader/x-fragment") {
            shader = this.gl.createShader(this.gl.FRAGMENT_SHADER)
        } else if (shaderScript.type === "x-shader/x-vertex") {
            shader = this.gl.createShader(this.gl.VERTEX_SHADER)
        } else {
            return null
        }

        this.gl.shaderSource(shader, str)
        this.gl.compileShader(shader)

        if (!this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)) {
            alert(gl.getShaderInfoLog(shader))
            return null
        }
        return shader
    }

    setMatrixUniforms(modelMatrix, viewMatrix, projectionMatrix) {
        let mVMatrix = mat4.multiply(viewMatrix, modelMatrix)
        let mVPMatrix = mat4.multiply(projectionMatrix, mVMatrix)
        //mVPMatrix = mat4.transpose(mVPMatrix)
        let identity = mat4.createIdentityMatrix()
        this.gl.uniformMatrix4fv(this.shaderProgram.mvpMatrixUniform, false, mVPMatrix)
    }

/*    setColorUniforms(colorVertices) {
        this.gl.uniform4fv(this.shaderProgram.uColor, colorVertices)
    }*/

    drawScene(camera) {
        this.gl.clearColor(0.0, 0.0, 1.0, 0.5)
        this.gl.viewport(0, 0, this.gl.width, this.gl.height)
        this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT)

        Object.values(this.shapeBuffers).forEach(shapeBuffer => {
/*            this.gl.bindBuffer(this.gl.ARRAY_BUFFER, shapeBuffer.colorBuffer)
            this.gl.vertexAttribPointer(this.shaderProgram.vertexColorAttribute, shapeBuffer.colorBuffer.itemSize, this.gl.FLOAT, false, 0, 0)*/

            this.gl.bindBuffer(this.gl.ARRAY_BUFFER, shapeBuffer.positionBuffer);
            this.gl.vertexAttribPointer(this.shaderProgram.vertexPositionAttribute,
                shapeBuffer.positionBuffer.itemSize,
                this.gl.FLOAT, false, 0, 0)

            this.setMatrixUniforms(shapeBuffer.modelMatrix, camera.viewMatrix, camera.projectionMatrix)
            this.gl.drawArrays(shapeBuffer.primitiveMode, 0, shapeBuffer.positionBuffer.numItems)
        })

        //this.shapeBuffers = {}
    }
}

export {Init};