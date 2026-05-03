import { NodeType } from "@/generated/prisma/enums";
import { Node } from "@xyflow/react";
import { node_data } from "./node";
import {createId} from '@paralleldrive/cuid2'
export const createDefaultNode  = (type:NodeType)=>{
    const data:node_data  = {
        _user_data:{},
  
        node_name:type,
    }
     const newNode: Node<node_data> = {
          id: createId(), // unique id or chaos
          position: {
            x: 50,
            y: 50,
          },
          data: data,
          type:type,
        };
        return newNode
}