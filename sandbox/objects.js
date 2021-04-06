// load object files here
import {Shape} from "../shape.js";


export function downloadMeshes(){
    obj_utils.downloadMeshes({'meshDragon': './object_files/dragon_10k.obj'}, mapObject)
}


function mapObject(meshes, gl, boundContainer){
    for (const mesh of Object.values(meshes)) {
        mesh.vertices.forEach(function(part, index) {
            mesh.vertices[index] = parseFloat(mesh.vertices[index]);
        });
    }

    for (const mesh of Object.values(meshes)) {
        let shp = new Shape(gl)
        let vertices = []
        for (let i = 0; i < mesh.indices.length; i++) {
            vertices.push(mesh.vertices[mesh.indices[i] * 3], mesh.vertices[mesh.indices[i] * 3 + 1], mesh.vertices[mesh.indices[i] * 3 + 2])
        }
        shp.addPositionVertices(vertices, 3)
        // It is used to color it in one color.
/*        let colorVertices = []
        for (let i = 0; i < shp.positionVertices.numItems; i++){
            colorVertices.push(1, 0, 0, 1)
        }
        shp.addColorVertices(colorVertices, 4)*/
        boundContainer.push(shp)
    }


}


