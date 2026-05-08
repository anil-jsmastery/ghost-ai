"use client";

import { useCallback } from "react";
import { useLiveblocksFlow } from "@liveblocks/react-flow";
import {
  ReactFlow,
  Background,
  BackgroundVariant,
  MiniMap,
  ConnectionMode,
  ReactFlowProvider,
  Panel,
  useReactFlow,
} from "@xyflow/react";
import type { CanvasNode, CanvasEdge } from "@/types/canvas";
import { CanvasNodeRenderer } from "@/components/editor/canvas-node";
import { ShapePanel } from "@/components/editor/shape-panel";
import "@xyflow/react/dist/style.css";

const nodeTypes = { canvasNode: CanvasNodeRenderer };

let dropCounter = 0;

function CanvasInner() {
  const { nodes, edges, onNodesChange, onEdgesChange, onConnect, onDelete } =
    useLiveblocksFlow<CanvasNode, CanvasEdge>({ suspense: true });

  const { screenToFlowPosition } = useReactFlow<CanvasNode, CanvasEdge>();

  const onDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "copy";
  }, []);

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      const raw = e.dataTransfer.getData("application/ghost-shape");
      if (!raw) return;
      const { shape, width, height } = JSON.parse(raw) as {
        shape: string;
        width: number;
        height: number;
      };
      const position = screenToFlowPosition({ x: e.clientX, y: e.clientY });
      const id = `${shape}-${Date.now()}-${++dropCounter}`;
      const newNode: CanvasNode = {
        id,
        type: "canvasNode",
        position: { x: position.x - width / 2, y: position.y - height / 2 },
        data: { label: "", color: "", shape },
        width,
        height,
      };
      onNodesChange([{ type: "add", item: newNode }]);
    },
    [screenToFlowPosition, onNodesChange]
  );

  return (
    <div className="absolute inset-0">
      <ReactFlow<CanvasNode, CanvasEdge>
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onDelete={onDelete}
        nodeTypes={nodeTypes}
        connectionMode={ConnectionMode.Loose}
        onDragOver={onDragOver}
        onDrop={onDrop}
        fitView
      >
        <Background
          variant={BackgroundVariant.Dots}
          color="#2e2e2e"
          gap={20}
          size={1.5}
        />
        <MiniMap
          style={{ background: "#1a1a1a" }}
          nodeColor="#404040"
          maskColor="rgba(0,0,0,0.65)"
        />
        <Panel position="bottom-center" className="mb-4">
          <ShapePanel />
        </Panel>
      </ReactFlow>
    </div>
  );
}

export function Canvas() {
  return (
    <ReactFlowProvider>
      <CanvasInner />
    </ReactFlowProvider>
  );
}
