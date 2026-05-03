"use client";

import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  addEdge,
  applyNodeChanges,
  applyEdgeChanges,
  Node,
  Edge,
  Connection,
  NodeChange,
  EdgeChange,
  Panel,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";

import { useCallback, useEffect, useState } from "react";
import NodeSelector from "./node-selector";
import { PlusIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEditor } from "../stores/node-store";
import { nodeTypes } from "../libs/node-registry";
import { useActiveWorkflow } from "@/features/workflows/components/workflow-provider";
import { Edges, Nodes } from "@/generated/prisma/client";
import { node_data } from "../types/node";
import { transformEdges, transformNodes } from "../libs/transform-data";
import SaveButton from "./save-button";


export default function Editor() {
  const data = useActiveWorkflow();
  const { nodes, edges, setEdges, setNodes } = useEditor();

  // ✅ Fix 1: Move setNodes/setEdges into useEffect to avoid infinite re-renders
  useEffect(() => {
    setNodes(transformNodes(data.nodes));
    setEdges(transformEdges(data.edges, data.nodes));
  }, [data.nodes, data.edges]);

  const onNodesChange = useCallback(
    (changes: NodeChange[]) => {
      // ✅ Fix 2: Cast to Node[] to satisfy applyNodeChanges signature
      const updated_nodes = applyNodeChanges(changes, nodes as Node[]);
      setNodes(updated_nodes as Node<node_data>[]);
    },
    [nodes, setNodes]
  );

  const onEdgesChange = useCallback(
    (changes: EdgeChange[]) => {
      const updated_edges = applyEdgeChanges(changes, [...edges]);
      setEdges(updated_edges);
    },
    [edges, setEdges]
  );

  const onConnect = useCallback(
    (connection: Connection) => {
      const updated_edges = addEdge(connection, [...edges]);
      setEdges(updated_edges);
    },
    [edges, setEdges]
  );

  return (
    <div style={{ width: "100%", height: "100vh" }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        fitView
        nodeTypes={nodeTypes}
      >
        <Controls showZoom />
        <Background />
        <Panel position="top-right">
          <NodeSelector>
            <Button className="rounded-lg" size={"lg"}>
              <PlusIcon /> Add Node
            </Button>
          </NodeSelector>
        </Panel>
        <Panel position="bottom-center">
          <SaveButton/>
        </Panel>
        <MiniMap />
      </ReactFlow>
    </div>
  );
}