import type { Connection, EdgeTypes, OnConnectStart } from "@xyflow/react";

import {
  addEdge,
  Background,
  BackgroundVariant,
  Controls,
  MiniMap,
  Panel,
  ReactFlow,
  ReactFlowProvider,
  useEdgesState,
  useNodesState,
  useReactFlow,
} from "@xyflow/react";
import { AddNodeFloatingMenu } from "@/components/workflows/components/add-node-floating-menu";
import { WorkflowEdge as WorkflowEdgeComponent } from "@/components/workflows/edges/workflow-edge";
import { useIsValidConnection } from "@/components/workflows/hooks/use-is-valid-connection";
import {
  Braces,
  CirclePlus,
  MousePointer2,
  Route,
  X,
} from "lucide-react";
import { nanoid } from "nanoid";
import { useCallback, useMemo, useRef, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  getWorkflowNodeDefinition,
  initialWorkflowEdges,
  initialWorkflowNodes,
  workflowNodeDefinitions,
} from "@/components/workflows/workflow-data";
import type {
  WorkflowEdge,
  WorkflowNode,
  WorkflowNodeCategory,
} from "@/components/workflows/types";
import { createWorkflowNodeData } from "@/components/workflows/workflow-data";
import { workflowNodeTypes } from "@/components/workflows/workflow-node";
import { cn } from "@/lib/utils";

const categoryIcons = {
  trigger: MousePointer2,
  action: Braces,
} satisfies Record<WorkflowNodeCategory, typeof MousePointer2>;

const edgeTypes: EdgeTypes = {
  workflow: WorkflowEdgeComponent,
};

function WorkflowBuilderCanvas() {
  const [nodes, setNodes, onNodesChange] =
    useNodesState<WorkflowNode>(initialWorkflowNodes);
  const [edges, setEdges, onEdgesChange] =
    useEdgesState<WorkflowEdge>(initialWorkflowEdges);

  const { screenToFlowPosition } = useReactFlow();

  const [floatingMenu, setFloatingMenu] = useState<{
    screenPosition: { x: number; y: number };
    source: string;
    sourceHandle: string;
  } | null>(null);

  const connectionSourceRef = useRef<{
    nodeId: string;
    handleId: string;
  } | null>(null);

  const [inspectedNodeId, setInspectedNodeId] = useState<string | null>(null);

  const selectedNode = useMemo(
    () => nodes.find((node) => node.id === inspectedNodeId) ?? null,
    [nodes, inspectedNodeId]
  );

  const stats = useMemo(
    () => ({
      triggers: nodes.filter((node) => node.data.category === "trigger").length,
      actions: nodes.filter((node) => node.data.category === "action").length,
    }),
    [nodes]
  );

  const onConnect = useCallback(
    (connection: Connection) => {
      connectionSourceRef.current = null;
      setEdges((currentEdges) =>
        addEdge(
          {
            ...connection,
            id: `edge-${nanoid(8)}`,
            type: "workflow",
            data: {},
          },
          currentEdges
        )
      );
    },
    [setEdges]
  );

  const onConnectStart = useCallback<OnConnectStart>(
    (_, { nodeId, handleId }) => {
      if (!nodeId) return;
      connectionSourceRef.current = {
        nodeId,
        handleId: handleId ?? "output",
      };
    },
    []
  );

  const onConnectEnd = useCallback(
    (event: MouseEvent | TouchEvent) => {
      const source = connectionSourceRef.current;
      connectionSourceRef.current = null;

      if (!source) return;

      const clientX =
        "changedTouches" in event && event.changedTouches.length > 0
          ? event.changedTouches[0].clientX
          : (event as MouseEvent).clientX;
      const clientY =
        "changedTouches" in event && event.changedTouches.length > 0
          ? event.changedTouches[0].clientY
          : (event as MouseEvent).clientY;

      setFloatingMenu({
        screenPosition: { x: clientX, y: clientY },
        source: source.nodeId,
        sourceHandle: source.handleId,
      });
    },
    []
  );

  const handleAddConnectedNode = useCallback(
    (definition: (typeof workflowNodeDefinitions)[number]) => {
      if (!floatingMenu) return;

      const flowPosition = screenToFlowPosition({
        x: floatingMenu.screenPosition.x,
        y: floatingMenu.screenPosition.y,
      });

      const newNode: WorkflowNode = {
        id: `node-${definition.nodeId}-${nanoid(6)}`,
        type: "workflow",
        position: flowPosition,
        data: createWorkflowNodeData(definition),
      };

      setNodes((currentNodes) => [
        ...currentNodes.map((currentNode) => ({ ...currentNode, selected: false })),
        newNode,
      ]);
      setInspectedNodeId(newNode.id);

      setEdges((currentEdges) =>
        addEdge(
          {
            id: `edge-${nanoid(8)}`,
            type: "workflow",
            source: floatingMenu.source,
            sourceHandle: floatingMenu.sourceHandle,
            target: newNode.id,
            targetHandle: "input",
            data: {},
          },
          currentEdges
        )
      );

      setFloatingMenu(null);
    },
    [floatingMenu, screenToFlowPosition, setEdges, setNodes]
  );

  const closeFloatingMenu = useCallback(() => {
    setFloatingMenu(null);
  }, []);

  const isValidConnection = useIsValidConnection(nodes, edges);

  const addNode = useCallback(
    (definition: (typeof workflowNodeDefinitions)[number]) => {
      const offset = nodes.length * 28;
      const node: WorkflowNode = {
        id: `node-${definition.nodeId}-${nanoid(6)}`,
        type: "workflow",
        position: {
          x: 160 + offset,
          y: 120 + offset,
        },
        data: createWorkflowNodeData(definition),
      };

      setNodes((currentNodes) => [
        ...currentNodes.map((currentNode) => ({
          ...currentNode,
          selected: false,
        })),
        node,
      ]);
      setInspectedNodeId(node.id);
    },
    [nodes.length, setNodes]
  );

  return (
    <div className="relative flex h-full min-h-[720px] bg-background text-foreground">
      <aside className="flex w-64 shrink-0 flex-col border-r border-border/60 bg-muted/30">
        <div className="border-b border-border/60 px-4 py-3">
          <div className="flex items-center gap-2">
            <div className="flex size-6 items-center justify-center rounded-md bg-foreground text-background">
              <Route className="size-3.5" />
            </div>
            <div>
              <h1 className="text-[13px] font-semibold">Kato Workflows</h1>
              <p className="text-[11px] text-muted-foreground/70">
                Graph editor
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-3 px-3 py-3">
          {(["trigger", "action"] as const).map((category) => {
            const groupDefinitions = workflowNodeDefinitions.filter(
              (d) => d.category === category,
            );
            if (groupDefinitions.length === 0) return null;

            return (
              <div key={category} className="space-y-1.5">
                <div className="flex items-center justify-between px-1">
                  <h2 className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground/70">
                    {category === "trigger" ? "Triggers" : "Actions"}
                  </h2>
                  <Badge variant="outline" className="text-[10px]">
                    {groupDefinitions.length}
                  </Badge>
                </div>

                <div className="space-y-0.5">
                  {groupDefinitions.map((definition) => {
                    const Icon = categoryIcons[definition.category];

                    return (
                      <Button
                        key={definition.nodeId}
                        variant="ghost"
                        className="group h-auto w-full justify-start gap-2.5 px-2.5 py-2 text-left font-normal"
                        onClick={() => addNode(definition)}
                      >
                        <Icon className="size-4 shrink-0 text-muted-foreground" />
                        <span className="min-w-0 flex-1">
                          <span className="block text-[13px] font-medium">
                            {definition.label}
                          </span>
                          <span className="mt-0.5 line-clamp-1 block text-[11px] leading-4 text-muted-foreground/70">
                            {definition.description}
                          </span>
                        </span>
                        <CirclePlus className="size-3.5 shrink-0 text-muted-foreground/50 opacity-0 transition group-hover:opacity-100" />
                      </Button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-auto border-t border-border/60 px-3 py-3">
          <div className="grid grid-cols-2 gap-1.5 text-center">
            <WorkflowStat label="Triggers" value={stats.triggers} />
            <WorkflowStat label="Actions" value={stats.actions} />
          </div>
        </div>
      </aside>

      <main className="min-w-0 flex-1">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          nodeTypes={workflowNodeTypes}
          edgeTypes={edgeTypes}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onConnectStart={onConnectStart}
          onConnectEnd={onConnectEnd}
          onNodeClick={(_, node) => setInspectedNodeId(node.id)}
          onPaneClick={() => setInspectedNodeId(null)}
          isValidConnection={isValidConnection}
          defaultViewport={{ x: 120, y: 120, zoom: 0.88 }}
          fitView
          fitViewOptions={{ padding: 0.25 }}
          proOptions={{ hideAttribution: true }}
          deleteKeyCode={["Backspace", "Delete"]}
          className="bg-muted/10"
        >
          <Background
            variant={BackgroundVariant.Dots}
            gap={24}
            size={1.5}
            color="color-mix(in oklch, var(--muted-foreground) 30%, transparent)"
          />
          <Controls position="bottom-left" />
          <MiniMap
            position="bottom-right"
            pannable
            zoomable
            className="overflow-hidden rounded-md border bg-card"
          />
          <Panel position="top-left" className="m-4">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span className="font-medium text-foreground">Draft</span>
              <span className="text-muted-foreground/40">·</span>
              <span className="tabular-nums">{nodes.length} nodes</span>
              <span className="text-muted-foreground/40">·</span>
              <span className="tabular-nums">{edges.length} edges</span>
            </div>
          </Panel>
        </ReactFlow>
      </main>

      {selectedNode && (
        <div className="absolute right-0 top-0 z-20 flex h-full w-80 flex-col border-l border-border/60 bg-card shadow-lg">
          <div className="flex items-center justify-between border-b border-border/60 px-4 py-3">
            <div>
              <h2 className="text-[13px] font-semibold">Inspector</h2>
              <p className="text-[11px] text-muted-foreground/70">
                Edit node configuration
              </p>
            </div>
            <Button
              variant="ghost"
              size="icon-sm"
              className="size-7 text-muted-foreground/60 hover:text-foreground"
              onClick={() => setInspectedNodeId(null)}
              aria-label="Close inspector"
              title="Close inspector"
            >
              <X className="size-4" />
            </Button>
          </div>

          <div className="flex-1 space-y-4 overflow-auto px-4 py-3">
            <NodeInspector node={selectedNode} />
          </div>
        </div>
      )}

      {floatingMenu && (
        <AddNodeFloatingMenu
          position={floatingMenu.screenPosition}
          definitions={workflowNodeDefinitions}
          onSelect={handleAddConnectedNode}
          onClose={closeFloatingMenu}
        />
      )}
    </div>
  );
}

function WorkflowStat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-md bg-muted/50 px-2 py-1.5">
      <div className="text-sm font-semibold tabular-nums">{value}</div>
      <div className="text-[10px] text-muted-foreground/70">{label}</div>
    </div>
  );
}

function NodeInspector({ node }: { node: WorkflowNode }) {
  const configEntries = Object.entries(node.data.config);
  const metadata = getWorkflowNodeDefinition(node.data.nodeId);
  const PropertyPanel = metadata.propertyPanel;

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-[13px] font-semibold">{node.data.label}</h3>
        <p className="mt-1 text-xs leading-5 text-muted-foreground/80">
          {node.data.description}
        </p>
      </div>

      <div>
        <h4 className="mb-2 text-[10px] font-medium uppercase tracking-wider text-muted-foreground/60">
          Details
        </h4>
        <div className="grid grid-cols-2 gap-1.5">
          <InspectorField label="ID" value={node.id} />
          <InspectorField label="Type" value={node.data.nodeId} />
          <InspectorField
            label="X"
            value={Math.round(node.position.x).toString()}
          />
          <InspectorField
            label="Y"
            value={Math.round(node.position.y).toString()}
          />
        </div>
      </div>

      {PropertyPanel ? (
        <div className="space-y-2">
          <h4 className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground/60">
            Config
          </h4>
          <PropertyPanel node={node} />
        </div>
      ) : (
        <div className="space-y-2">
          <h4 className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground/60">
            Config Preview
          </h4>
          <div className="rounded-md bg-muted/40 p-2.5 font-mono text-[11px] leading-5">
            {configEntries.length ? (
              configEntries.map(([key, value]) => (
                <div key={key} className="flex justify-between gap-4">
                  <span className="text-muted-foreground/70">{key}</span>
                  <span className="truncate text-right">{String(value)}</span>
                </div>
              ))
            ) : (
              <span className="text-muted-foreground/70">No config</span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function InspectorField({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md bg-muted/50 px-2 py-1.5">
      <div className="text-[10px] text-muted-foreground/60">{label}</div>
      <div className="mt-0.5 truncate font-mono text-[11px]">{value}</div>
    </div>
  );
}

export function WorkflowBuilder() {
  return (
    <ReactFlowProvider>
      <WorkflowBuilderCanvas />
    </ReactFlowProvider>
  );
}
