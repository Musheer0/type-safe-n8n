"use client"
import { useState, useCallback } from 'react';
import { ReactFlow, applyNodeChanges, applyEdgeChanges, addEdge, Background, ControlButton, Controls,Panel } from '@xyflow/react';
 
const nodeTypes = {
  http:HttpNode,
  email:EmailNode,
  webhook:WebhookNode,
  discord:DiscordNode,
  manual:ManualNode

  
};
import '@xyflow/react/dist/style.css';
import { Button } from '@/components/ui/button';
import { PlusIcon } from 'lucide-react';
import NodeSelector from './node-selector';
import { HttpNode } from './nodes/http-node';
import { EmailNode } from './nodes/email-node';
import { WebhookNode } from './nodes/webhook-node';
import { DiscordNode } from './nodes/discord-node';
import { ManualNode } from './nodes/manual-node';
const initialNodes = [
  // { id: 'n1', position: { x: 0, y: 0 }, data: { label: 'Node 1' } ,type:"http"},
  // { id: 'n2', position: { x: 0, y: 100 }, data: { label: 'Node 2' } ,type:"email"},
    { id: 'n3', position: { x: 50, y: 100 }, data: { label: 'Node 2' } ,type:"webhook"},
    // { id: 'n4', position: { x: 50, y: 140 }, data: { label: 'Node 2' } ,type:"discord"},
    //     { id: 'n5', position: { x: 150, y: 140 }, data: { label: 'Node 2' } ,type:"manual"},


];
const defaultNodes = [
  {
    id: "2",
    position: { x: 200, y: 200 },
    data: {},
    type: "trigger",
  },
];
 
const initialEdges = [];
 
export default function Editor({id}:{id:string}) {
  const [nodes, setNodes] = useState(initialNodes);
  const [edges, setEdges] = useState(initialEdges);
 
  const onNodesChange = useCallback(
    (changes) => setNodes((nodesSnapshot) => applyNodeChanges(changes, nodesSnapshot)),
    [],
  );
  const onEdgesChange = useCallback(
    (changes) => setEdges((edgesSnapshot) => applyEdgeChanges(changes, edgesSnapshot)),
    [],
  );
  const onConnect = useCallback(
    (params) => setEdges((edgesSnapshot) => addEdge(params, edgesSnapshot)),
    [],
  );
 
  return (
    <div className='w-full flex-1'>
      <ReactFlow
        nodes={nodes}
        edges={edges}
                nodeTypes={nodeTypes}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        fitView
        
      >
        <Controls showZoom/>
        <Background/>
        <Panel position='top-right'>
          <NodeSelector>
              <Button className='rounded-lg' size={"lg"}>
                <PlusIcon/>Add Node
            </Button>
          </NodeSelector>
        </Panel>
        </ReactFlow>
    </div>
  );
}