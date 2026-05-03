import { Edges, Nodes, NodeType } from "@/generated/prisma/client";
import { Edge, Node } from "@xyflow/react";
import { node_data } from "../types/node";

export function transformNodes(nodes: Nodes[]): Node<node_data>[] {
  return nodes.map((n) => {
    const data: node_data = { ...(n.data as any), node_name: n.name };
    return {
      id: n.id,
      position: { x: n.xCord, y: n.yCord },
      data,
      type: n.type,
    };
  });
}

export function transformEdges(edges: Edges[], nodes: Nodes[]): Edge[] {
  return edges.map((e) => ({
    id: e.id,
    source: e.fromNode,
    target: e.nextNode,
    label: `${nodes.find((n) => n.id === e.fromNode)?.name}->${nodes.find((n) => n.id === e.nextNode)?.name}`,
  }));
}
export function ExtractImpDataFromNodes(nodes: Node<node_data>[],) {
return nodes
  .filter((n): n is typeof n & { type: string } => !!n.type)
  .map((n) => {
    const data: node_data = n.data;

    return {
      id: n.id,
      xCord: n.position.x,
      yCord: n.position.y,
      data,
      name: n.data.node_name || n.type,
      type: n.type as NodeType,
    };
  });
}

export function ExtractImpDataFromEdges(edges: Edge[]) {
  return edges.map((e) => ({
    id: e.id,
   fromNode:e.source,
   nextNode:e.target,

  }));
}
