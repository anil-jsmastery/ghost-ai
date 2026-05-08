"use client";

import {
  Square,
  Diamond,
  Circle,
  Pill,
  Cylinder,
  Hexagon,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface ShapeConfig {
  name: string;
  icon: LucideIcon;
  width: number;
  height: number;
}

const SHAPES: ShapeConfig[] = [
  { name: "rectangle", icon: Square, width: 160, height: 80 },
  { name: "diamond", icon: Diamond, width: 130, height: 130 },
  { name: "circle", icon: Circle, width: 100, height: 100 },
  { name: "pill", icon: Pill, width: 160, height: 80 },
  { name: "cylinder", icon: Cylinder, width: 100, height: 120 },
  { name: "hexagon", icon: Hexagon, width: 120, height: 120 },
];

function startDrag(
  e: React.DragEvent,
  shape: string,
  width: number,
  height: number
) {
  e.dataTransfer.setData(
    "application/ghost-shape",
    JSON.stringify({ shape, width, height })
  );
  e.dataTransfer.effectAllowed = "copy";
}

export function ShapePanel() {
  return (
    <div className="flex items-center gap-1 rounded-full border border-border bg-card/90 px-3 py-2 shadow-lg backdrop-blur-sm">
      {SHAPES.map(({ name, icon: Icon, width, height }) => (
        <button
          key={name}
          className="flex h-8 w-8 cursor-grab items-center justify-center rounded-full hover:bg-muted active:cursor-grabbing"
          draggable
          onDragStart={(e) => startDrag(e, name, width, height)}
          title={name}
        >
          <Icon className="h-4 w-4 text-muted-foreground" />
        </button>
      ))}
    </div>
  );
}
