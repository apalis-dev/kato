import type {
	WorkflowEdge,
	WorkflowNode,
	WorkflowNodeData,
	WorkflowNodeMetadata,
} from "@/components/workflows/types";

const nodeModules = import.meta.glob<{
	metadata: WorkflowNodeMetadata;
}>("./nodes/*.node.ts", { eager: true });

export const workflowNodeDefinitions: WorkflowNodeMetadata[] = Object.values(
	nodeModules,
).map((module) => module.metadata);

export const workflowNodeDefinitionMap = new Map(
	workflowNodeDefinitions.map((definition) => [definition.nodeId, definition]),
);

export function getWorkflowNodeDefinition(
	nodeId: string,
): WorkflowNodeMetadata {
	const definition = workflowNodeDefinitionMap.get(nodeId);
	if (!definition) {
		throw new Error(`Workflow node definition "${nodeId}" not found`);
	}
	return definition;
}

export function createWorkflowNodeData(
	definition: WorkflowNodeMetadata,
	overrides: Partial<WorkflowNodeData> = {},
): WorkflowNodeData {
	return {
		label: definition.label,
		nodeId: definition.nodeId,
		category: definition.category,
		description: definition.description,
		config: definition.defaultConfig,
		deletable: true,
		...overrides,
	};
}

export const initialWorkflowNodes: WorkflowNode[] = [
	{
		id: "node-trigger",
		type: "workflow",
		position: { x: 0, y: 80 },
		data: createWorkflowNodeData(getWorkflowNodeDefinition("manual-trigger"), {
			deletable: false,
		}),
	},
	{
		id: "node-http",
		type: "workflow",
		position: { x: 340, y: 10 },
		data: createWorkflowNodeData(getWorkflowNodeDefinition("http-request")),
	},
	{
		id: "node-condition",
		type: "workflow",
		position: { x: 340, y: 190 },
		data: createWorkflowNodeData(getWorkflowNodeDefinition("condition")),
	},
	{
		id: "node-output",
		type: "workflow",
		position: { x: 700, y: 100 },
		data: createWorkflowNodeData(getWorkflowNodeDefinition("webhook-response"), {
			deletable: false,
		}),
	},
];

export const initialWorkflowEdges: WorkflowEdge[] = [
	{
		id: "edge-trigger-http",
		type: "workflow",
		source: "node-trigger",
		sourceHandle: "output",
		target: "node-http",
		targetHandle: "input",
		data: {},
	},
	{
		id: "edge-trigger-condition",
		type: "workflow",
		source: "node-trigger",
		sourceHandle: "output",
		target: "node-condition",
		targetHandle: "input",
		data: {},
	},
	{
		id: "edge-http-output",
		type: "workflow",
		source: "node-http",
		sourceHandle: "output",
		target: "node-output",
		targetHandle: "input",
		data: {},
	},
];
