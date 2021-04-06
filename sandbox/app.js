import {Init} from "../init.js"
import * as vec3 from "../koz-matrix/vec3.js"
import {Camera} from "../camera.js"
import * as Utils from "../utils.js"
import * as Functions from "./functions.js"
import StateMachine from "./state_machine.js"
import {shape_loader} from "./shapes.js"
import {downloadMeshes} from "./objects.js"
function init() {
    let renderingContext = new Init("scene");
    let camera = new Camera(vec3.createVector(0, 0.3, 0.3), vec3.createVector(0, -0.3, -0.3), vec3.createVector(0, +1, 0));
    let stateMachine = new StateMachine(4);
    let assets = []
    obj_utils.bindRenderingContext(renderingContext)
    obj_utils.bindContainer(assets)
    downloadMeshes()

    shape_loader.bindRenderingContext(renderingContext)
    shape_loader.bindContainer(assets)
    //shape_loader.createShapes()

    const startSpin = document.getElementById("start-spin")
    startSpin.addEventListener("click", ()=>Functions.start_spin(stateMachine))

    const stopSpin = document.getElementById("stop-spin")
    stopSpin.addEventListener("click", ()=>Functions.stop_spin(stateMachine))

    const spinSpeed = document.getElementById("spin-speed")
    spinSpeed.onchange = () => {
        Functions.spin_speed(stateMachine)
    }

    const startScale = document.getElementById("start-scale")
    startScale.addEventListener("click", ()=>Functions.start_scale(stateMachine))

    const stopScale = document.getElementById("stop-scale")
    stopScale.addEventListener("click", ()=>Functions.stop_scale(stateMachine))

    const startSpiral = document.getElementById("start-spiral")
    startSpiral.addEventListener("click", ()=>Functions.start_spiral(stateMachine))

    const stopSpiral = document.getElementById("stop-spiral")
    stopSpiral.addEventListener("click", ()=>Functions.stop_spiral(stateMachine))

    const spiralSpeed = document.getElementById("spiral-speed")
    spiralSpeed.onchange = () => {
        Functions.spiral_speed(stateMachine)
    }

    document.addEventListener("mousemove", (event) => (Functions.mouseMove(camera, event)))
    document.addEventListener("keydown", (event) => (Functions.keyDown(camera, event)))

/*    Utils.addEventListeners(
        [["start-spin",Functions.start_spin, [stateMachine], false],
            ["stop-spin", Functions.stop_spin, [stateMachine], false],
            ["spin-speed", Functions.spin_speed, [stateMachine], true],
            ["start-scale", Functions.start_scale, [stateMachine], false],
            ["stop-scale", Functions.stop_scale, [stateMachine], false],
            ["start-spiral", Functions.start_spiral, [stateMachine], false],
            ["stop-spiral", Functions.stop_spiral, [stateMachine], false],
            ["spiral-speed", Functions.spiral_speed, [stateMachine], true]]
    )*/

    animate(renderingContext, camera, stateMachine, assets);
}

function animate(renderingContext, camera, stateMachine, assets) {
    stateMachine.changeState(3, true)
    //console.log(stateMachine.getIndependentVar(3))
    camera.update();
    stateMachine.updateIndependentVariables()
    Functions.scaleAssets(assets, stateMachine.getIndependentVar(1))
    Functions.rotateAssets(assets, stateMachine.getIndependentVar(0))
    //Functions.translateAssets(assets, stateMachine.getIndependentVar(2))
    Functions.addAssetsToBuffer(assets, renderingContext)
    renderingContext.drawScene(camera)
    Functions.resetModelMatricesOfAssets(assets)
    requestAnimationFrame(function(){animate(renderingContext, camera, stateMachine, assets)});
}

window.onload = function () {
    init()
};
