import type { Connection, EdgeTypes } from "@xyflow/react";

import {
	addEdge,
	Background,
	Controls,
	MiniMap,
	Panel,
	ReactFlow,
	ReactFlowProvider,
	useEdgesState,
	useNodesState,
} from "@xyflow/react";
import {
	Activity,
	Braces,
	CheckCircle2,
	CirclePlus,
	Database,
	MousePointer2,
	Route,
	Send,
	Sparkles,
} from "lucide-react";
import { nanoid } from "nanoid";
import { useCallback, useMemo } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
	initialWorkflowEdges,
	initialWorkflowNodes,
	workflowNodeDefinitions,
} from "@/components/workflows/workflow-data";
import type { WorkflowEdge, WorkflowNode, WorkflowNodeCategory } from "@/components/workflows/types";
import { createWorkflowNodeData } from "@/components/workflows/workflow-data";
import { workflowNodeTypes } from "@/components/workflows/workflow-node";
import { cn } from "@/lib/utils";

const categoryIcons = {
	trigger: MousePointer2,
	transform: Braces,
	output: Send,
} satisfies Record<WorkflowNodeCategory, typeof MousePointer2>;

const edgeTypes: EdgeTypes = {};

function WorkflowBuilderCanvas() {
	const [nodes, setNodes, onNodesChange] =
		useNodesState<WorkflowNode>(initialWorkflowNodes);
	const [edges, setEdges, onEdgesChange] =
		useEdgesState<WorkflowEdge>(initialWorkflowEdges);

	const selectedNode = useMemo(
		() => nodes.find((node) => node.selected) ?? null,
		[nodes],
	);

	const stats = useMemo(
		() => ({
			triggers: nodes.filter((node) => node.data.category === "trigger").length,
			transforms: nodes.filter((node) => node.data.category === "transform").length,
			outputs: nodes.filter((node) => node.data.category === "output").length,
		}),
		[nodes],
	);

	const onConnect = useCallback(
		(connection: Connection) => {
			setEdges((currentEdges) =>
				addEdge(
					{
						...connection,
						id: `edge-${nanoid(8)}`,
						type: "workflow",
						data: {},
					},
					currentEdges,
				),
			);
		},
		[setEdges],
	);

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

			setNodes((currentNodes) =>
				currentNodes.map((currentNode) => ({
					...currentNode,
					selected: false,
				})).concat({ ...node, selected: true }),
			);
		},
		[nodes.length, setNodes],
	);

	return (
		<div className="flex h-screen min-h-[720px] bg-background text-foreground">
			<aside className="flex w-72 shrink-0 flex-col border-r bg-muted/20">
				<div className="border-b px-4 py-4">
					<div className="flex items-center gap-2">
						<div className="flex size-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
							<Route className="size-4" />
						</div>
						<div>
							<h1 className="text-sm font-semibold">Kato Workflows</h1>
							<p className="text-xs text-muted-foreground">
								Local graph editor
							</p>
						</div>
					</div>
				</div>

				<div className="space-y-3 px-4 py-4">
					<div className="flex items-center justify-between">
						<h2 className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
							Node Library
						</h2>
						<Badge variant="outline">{workflowNodeDefinitions.length}</Badge>
					</div>

					<div className="space-y-2">
						{workflowNodeDefinitions.map((definition) => {
							const Icon = categoryIcons[definition.category];

							return (
								<button
									key={definition.nodeId}
									type="button"
									className="group flex w-full items-start gap-3 rounded-md border bg-card p-3 text-left shadow-xs transition hover:border-ring/40 hover:bg-accent"
									onClick={() => addNode(definition)}
								>
									<span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-md border bg-muted">
										<Icon className="size-4" />
									</span>
									<span className="min-w-0 flex-1">
										<span className="block text-sm font-medium">
											{definition.label}
										</span>
										<span className="mt-1 line-clamp-2 block text-xs leading-5 text-muted-foreground">
											{definition.description}
										</span>
									</span>
									<CirclePlus className="mt-1 size-4 text-muted-foreground opacity-0 transition group-hover:opacity-100" />
								</button>
							);
						})}
					</div>
				</div>

				<div className="mt-auto border-t px-4 py-4">
					<div className="grid grid-cols-3 gap-2 text-center">
						<WorkflowStat label="Triggers" value={stats.triggers} />
						<WorkflowStat label="Steps" value={stats.transforms} />
						<WorkflowStat label="Outputs" value={stats.outputs} />
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
					defaultViewport={{ x: 120, y: 120, zoom: 0.88 }}
					fitView
					fitViewOptions={{ padding: 0.25 }}
					proOptions={{ hideAttribution: true }}
					deleteKeyCode={["Backspace", "Delete"]}
					className="bg-muted/10"
				>
					<Background gap={28} color="hsl(var(--border))" />
					<Controls position="bottom-left" />
					<MiniMap
						position="bottom-right"
						pannable
						zoomable
						className="overflow-hidden rounded-md border bg-card"
					/>
					<Panel position="top-left" className="m-4">
						<div className="flex items-center gap-2 rounded-md border bg-card/95 px-3 py-2 shadow-sm backdrop-blur">
							<Sparkles className="size-4 text-muted-foreground" />
							<span className="text-sm font-medium">Draft Workflow</span>
							<Badge variant="secondary">{nodes.length} nodes</Badge>
							<Badge variant="secondary">{edges.length} edges</Badge>
						</div>
					</Panel>
				</ReactFlow>
			</main>

			<aside className="flex w-80 shrink-0 flex-col border-l bg-card">
				<div className="border-b px-4 py-4">
					<h2 className="text-sm font-semibold">Inspector</h2>
					<p className="text-xs text-muted-foreground">
						React Flow state now, API later
					</p>
				</div>

				<div className="space-y-4 px-4 py-4">
					{selectedNode ? (
						<NodeInspector node={selectedNode} />
					) : (
						<div className="rounded-md border border-dashed p-4 text-sm text-muted-foreground">
							Select a node to inspect the normalized workflow data it will
							map to.
						</div>
					)}
				</div>

				<div className="mt-auto border-t px-4 py-4">
					<div className="space-y-3 rounded-md border bg-muted/30 p-3">
						<div className="flex items-center gap-2 text-sm font-medium">
							<Database className="size-4" />
							Backend mapping
						</div>
						<p className="text-xs leading-5 text-muted-foreground">
							Nodes map to <code>workflow_nodes</code>; edges map to{" "}
							<code>workflow_edges</code>. No API writes are active in this
							first pass.
						</p>
					</div>
				</div>
			</aside>
		</div>
	);
}

function WorkflowStat({ label, value }: { label: string; value: number }) {
	return (
		<div className="rounded-md border bg-card px-2 py-2">
			<div className="text-base font-semibold">{value}</div>
			<div className="text-[11px] text-muted-foreground">{label}</div>
		</div>
	);
}

function NodeInspector({ node }: { node: WorkflowNode }) {
	const configEntries = Object.entries(node.data.config);

	return (
		<div className="space-y-4">
			<div>
				<div className="flex items-center gap-2">
					<Activity className="size-4 text-muted-foreground" />
					<h3 className="text-sm font-semibold">{node.data.label}</h3>
				</div>
				<p className="mt-2 text-sm leading-6 text-muted-foreground">
					{node.data.description}
				</p>
			</div>

			<Separator />

			<div className="grid grid-cols-2 gap-2 text-sm">
				<InspectorField label="Instance ID" value={node.id} />
				<InspectorField label="Node Type" value={node.data.nodeId} />
				<InspectorField
					label="Position X"
					value={Math.round(node.position.x).toString()}
				/>
				<InspectorField
					label="Position Y"
					value={Math.round(node.position.y).toString()}
				/>
			</div>

			<div className="space-y-2">
				<div className="flex items-center gap-2 text-sm font-medium">
					<CheckCircle2 className="size-4" />
					Config Preview
				</div>
				<div className="rounded-md border bg-muted/40 p-3 font-mono text-xs leading-5">
					{configEntries.length ? (
						configEntries.map(([key, value]) => (
							<div key={key} className="flex justify-between gap-4">
								<span className="text-muted-foreground">{key}</span>
								<span className="truncate text-right">
									{String(value)}
								</span>
							</div>
						))
					) : (
						<span className="text-muted-foreground">No config</span>
					)}
				</div>
			</div>
		</div>
	);
}

function InspectorField({ label, value }: { label: string; value: string }) {
	return (
		<div className={cn("rounded-md border bg-muted/30 p-2")}>
			<div className="text-[11px] text-muted-foreground">{label}</div>
			<div className="mt-1 truncate font-mono text-xs">{value}</div>
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
