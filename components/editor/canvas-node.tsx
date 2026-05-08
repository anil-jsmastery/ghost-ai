"use client";

import { Handle, Position } from "@xyflow/react";
import type { NodeProps } from "@xyflow/react";
import type { CanvasNode } from "@/types/canvas";

export function CanvasNodeRenderer({
  data,
}: NodeProps<CanvasNode>) {
  return (
    <div
      className="flex min-h-10 min-w-20 items-center justify-center rounded border border-border bg-card px-3 py-2"
      style={data.color ? { borderColor: data.color } : undefined}
    >
      <Handle type="target" position={Position.Top} />
      <span className="select-none text-sm text-foreground">
        {data.label || " "}
      </span>
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
}
