"use client";

import { Component } from "react";
import type { ReactNode } from "react";
import { LiveObject, LiveMap } from "@liveblocks/client";
import {
  LiveblocksProvider,
  RoomProvider,
  ClientSideSuspense,
} from "@liveblocks/react";
import { Canvas } from "@/components/editor/canvas";

class ErrorBoundary extends Component<
  { children: ReactNode },
  { error: Error | null }
> {
  state = { error: null };

  static getDerivedStateFromError(error: Error) {
    return { error };
  }

  render() {
    if (this.state.error) {
      return (
        <div className="flex flex-1 items-center justify-center">
          <p className="text-sm text-destructive">
            Failed to connect to canvas. Please reload.
          </p>
        </div>
      );
    }
    return this.props.children;
  }
}

interface CanvasWrapperProps {
  roomId: string;
}

export function CanvasWrapper({ roomId }: CanvasWrapperProps) {
  return (
    <ErrorBoundary>
      <LiveblocksProvider authEndpoint="/api/liveblocks-auth">
        <RoomProvider
          id={roomId}
          initialPresence={{ cursor: null, isThinking: false }}
          initialStorage={{
            flow: new LiveObject({
              nodes: new LiveMap(),
              edges: new LiveMap(),
            }),
          }}
        >
          <ClientSideSuspense
            fallback={
              <div className="flex flex-1 items-center justify-center">
                <p className="text-sm text-muted-foreground">
                  Loading canvas…
                </p>
              </div>
            }
          >
            <Canvas />
          </ClientSideSuspense>
        </RoomProvider>
      </LiveblocksProvider>
    </ErrorBoundary>
  );
}
