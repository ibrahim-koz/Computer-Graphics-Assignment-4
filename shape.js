import * as mat4 from './koz-matrix/mat4.js'
import {uuidv4} from './utils.js'
class Shape {
    constructor(gl) {
        this.modelMatrix = mat4.createIdentityMatrix()
        this.id = uuidv4()
        this.primitiveMode = gl.TRIANGLES
    }

    scale(x, y, z) {
        let scaleMatrix = mat4.createScaleMatrix(x, y, z)
        this.modelMatrix = mat4.multiply(scaleMatrix, this.modelMatrix)
    }

    rotate(thetaX, thetaY, thetaZ) {
        let rotationMatrix = mat4.createRotationMatrix(thetaX, thetaY, thetaZ)
        this.modelMatrix = mat4.multiply(rotationMatrix, this.modelMatrix)
    }

    translate(x, y, z) {
        let translationMatrix = mat4.createTranslationMatrix(x, y, z)
        this.modelMatrix = mat4.multiply(translationMatrix, this.modelMatrix)
    }

    addPositionVertices(positionVertices, positionVerticesItemSize) {
        this.positionVertices = positionVertices
        this.positionVertices.numItems = this.positionVertices.length / positionVerticesItemSize
        this.positionVertices.itemSize = positionVerticesItemSize
    }

    addColorVertices(colorVertices, colorVerticesItemSize){
        this.colorVertices = colorVertices
        this.colorVertices.numItems = this.colorVertices.length / colorVerticesItemSize
        this.colorVertices.itemSize = colorVerticesItemSize
    }

    addTextureVertices(textureVertices){
        this.textureVertices = textureVertices
        this.textureVertices.numItems = this.textureVertices.length / 2
        this.textureVertices.itemSize = 2
    }
}

// we'll go through it.
class Triangle extends Shape {
    constructor(positionVertices, gl) {
        super(gl)
        this.positionVertices = positionVertices
        this.positionVertices.numItems = this.positionVertices.length / this.positionVertices.itemSize
        this.primitiveMode = gl.TRIANGLES
    }
}

class Rectangle extends Shape {
    constructor(width, height, gl) {
        super(gl)
        this.positionVertices = this.computeVertices(width, height)
        this.positionVertices.itemSize = 2
        this.positionVertices.numItems = this.positionVertices.length / this.positionVertices.itemSize
        this.primitiveMode = gl.TRIANGLE_STRIP
    }

    computeVertices(width, height) {
        const w = width
        const h = height

        return [
            w / 2, h / 2,
            w / 2, -h / 2,
            -w / 2, -h / 2,
            w / 2, h / 2,
            -w / 2, -h / 2,
            -w / 2, h / 2
        ];
    }


}

class Circle extends Shape {
    constructor(radius, gl) {
        super(gl)
        this.positionVertices = this.computeVertices(radius)
        this.positionVertices.itemSize = 2
        this.positionVertices.numItems = this.positionVertices.length / this.positionVertices.itemSize
        this.primitiveMode = gl.TRIANGLE_FAN
    }

    computeVertices(radius) {
        const r = radius;
        const rad = Math.PI / 180.0;
        let positionVertices = [];
        for (let i = 0; i < 360; i += 1)
            positionVertices.push(r * Math.cos(i * rad), r * Math.sin(i * rad));
        return positionVertices;
    }
}




export {Shape, Triangle, Rectangle, Circle}
