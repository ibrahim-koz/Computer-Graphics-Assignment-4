import * as mat4 from "./koz-matrix/mat4.js";
import * as vec3 from "./koz-matrix/vec3.js";

class Camera{
    constructor(cameraPosition, cameraFront, upVector) {
        this.cameraPosition = cameraPosition
        this.cameraFront = cameraFront
        this.upVector = upVector

        this.yawl = -90;
        this.pitch = 0;
        this.update()
    }
    update(){
        this.viewMatrix = mat4.lookAt(this.cameraPosition, vec3.add(this.cameraPosition, this.cameraFront), this.upVector)
        this.projectionMatrix = mat4.perspective(90, 1, 0.001, 1000)
    }
}



export {Camera}