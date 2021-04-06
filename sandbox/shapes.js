import {Shape, Triangle, Rectangle, Circle} from "../shape.js"
// create shapes

export let shape_loader = {};
let boundContainer;
let boundRenderingContext;
shape_loader.addShape = function (shape) {
    boundContainer.push(shape)
}

shape_loader.bindContainer = function (container) {
    boundContainer = container
}

shape_loader.bindRenderingContext = function (renderingContext)
{
    boundRenderingContext = renderingContext
}


// create your shape instance here and add them to container.
shape_loader.createShapes = function () {
    let rectangle = new Rectangle(1, 1, boundRenderingContext.gl)
    boundContainer.push(rectangle)
}

