import {timeToRadian} from "../utils.js"
import * as mat4 from "../koz-matrix/mat4.js"
export function scaleAssets(assets, iv) {
    const scaleRatio = Math.asin(Math.sin(iv)) * (1 / Math.PI) + 1
    for (let i = 0; i < assets.length; i++)
        assets[i].scale(scaleRatio, scaleRatio, 1)
}

export function rotateAssets(assets, iv) {
    let rotationAngle = timeToRadian(iv)
    for (let i = 0; i < assets.length; i++)
        assets[i].rotate(0, 0, rotationAngle)
}

export function translateAssets(assets, iv) {
    for (let i = 0; i < assets.length; i++)
        assets[i].translate(iv, iv, 0)
}

export function start_spin(stateMachine) {
    stateMachine.changeState(0, true)
}

export function stop_spin(stateMachine) {
    stateMachine.changeState(0, false)
}

export function spin_speed(stateMachine, takenSpeed) {
    stateMachine.setSpeedOfCounter(0, takenSpeed)
}

export function start_scale(stateMachine) {
    stateMachine.changeState(1, true)
}

export function stop_scale(stateMachine) {
    stateMachine.changeState(1, false)
}

export function start_spiral(stateMachine) {
    stateMachine.changeState(2, true)
}

export function stop_spiral(stateMachine) {
    stateMachine.changeState(2, false)
}

export function spiral_speed(stateMachine, takenSpeed) {
    stateMachine.setSpeedOfCounter(2, takenSpeed)
}

export function addAssetsToBuffer(assets, renderingContext){
    for (let i = 0; i < assets.length; i++)
        renderingContext.addPositionBuffer(assets[i])
}


export function resetModelMatricesOfAssets(assets){
    for (let i = 0; i < assets.length; i++){
        assets[i].modelMatrix = mat4.createIdentityMatrix()
    }
}

export function mouseMove(camera, event){
    camera.yawl += event.movementX * 0.1
    camera.pitch -= event.movementY * 0.1

    if(camera.pitch > 89.0)
        camera.pitch = 89.0;
    if(camera.pitch < -89.0)
        camera.pitch = -89.0;

    camera.cameraFront = mat4.lookAround(camera.pitch, camera.yawl)
}

export function keyDown(camera, event){
    if (event.key === "ArrowDown"){
        camera.cameraPosition[2] += 0.1
    }

    else if (event.key === "ArrowLeft"){
        camera.cameraPosition[0] -= 0.1
    }

    else if (event.key === "ArrowUp"){
        camera.cameraPosition[2] -= 0.1
    }

    else if (event.key === "ArrowRight"){
        camera.cameraPosition[0] += 0.1
    }

    else if (event.key === "PageUp"){
        camera.cameraPosition[1] += 0.1
    }

    else if (event.key === "PageDown"){
        camera.cameraPosition[1] -= 0.1
    }
}



