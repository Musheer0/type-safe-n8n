import { NodeType } from "@/generated/prisma/enums";
import { createId } from "@paralleldrive/cuid2";
import { Edge, Node } from "@xyflow/react";
import { create } from "zustand";
import { createDefaultNode } from "../types/create-default-node";
interface store {
    nodes:Node[],
    edges:Edge[],
    setNodes:(nodes:Node[])=>void,
    setEdges:(edges:Edge[])=>void,
    addNode:(type:NodeType)=>void,
    deleteNode:(id:string)=>void,
}
export const useEditor = create<store>((set,get)=>({
    nodes:[],
    edges:[],
    setNodes(nodes) {
        set({nodes})
    },
    setEdges(edges) {
        set({edges})
    },
    addNode(type) {
        const newNode = createDefaultNode(type)
        set({nodes:[...get().nodes,newNode]})
    },
 deleteNode(id) {
  set((state) => ({
    nodes: state.nodes.filter((n) => n.id !== id),
    edges: state.edges.filter(
      (e) => e.source !== id && e.target !== id
    ),
  }));
}
}))