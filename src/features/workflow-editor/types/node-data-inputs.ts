import { nodeType } from "../libs/node-registry"

export  type baseInitialData  ={
    node_name: string|null,
    data:any,
     id: string,
    position: { x: number, y: number },
     type:nodeType
}
