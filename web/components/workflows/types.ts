import type { Edge, Node } from "@xyflow/react";

export type WorkflowNodeCategory = "trigger" | "transform" | "output";

export type WorkflowNodeMetadata = {
	nodeId: string;
	label: string;
	category: WorkflowNodeCategory;
	description: string;
	defaultConfig: Record<string, unknown>;
};

export type WorkflowNodeData = {
	label: string;
	nodeId: string;
	category: WorkflowNodeCategory;
	description: string;
	config: Record<string, unknown>;
	deletable?: boolean;
};

export type WorkflowNode = Node<WorkflowNodeData, "workflow">;
export type WorkflowEdge = Edge<Record<string, never>, "workflow">;

export type WorkflowNodeRow = {
  id: string;
  workflow_id: string;
  node_id: string;
  label: string | null;
  config: string | null;
  pos_x: number;
  pos_y: number;
};

export type WorkflowEdgeRow = {
  id: string;
  workflow_id: string;
  from_node_id: string;
  from_handle: string;
  to_node_id: string;
  to_handle: string;
};

export function workflowNodeRowToReactFlowNode(
  row: WorkflowNodeRow
): WorkflowNode {
  return {
    id: row.id,
    type: "workflow",
    position: { x: row.pos_x, y: row.pos_y },
    data: {
      label: row.label ?? row.node_id,
      nodeId: row.node_id,
      category: "transform",
      description: "",
      config: row.config ? JSON.parse(row.config) : {},
      deletable: true,
    },
  };
}

export function workflowEdgeRowToReactFlowEdge(
  row: WorkflowEdgeRow
): WorkflowEdge {
  return {
    id: row.id,
    type: "workflow",
    source: row.from_node_id,
    sourceHandle: row.from_handle,
    target: row.to_node_id,
    targetHandle: row.to_handle,
    data: {},
  };
}

export function reactFlowNodeToWorkflowNodeRow(
  workflowId: string,
  node: WorkflowNode
): WorkflowNodeRow {
  return {
    id: node.id,
    workflow_id: workflowId,
    node_id: node.data.nodeId,
    label: node.data.label,
    config: JSON.stringify(node.data.config),
    pos_x: node.position.x,
    pos_y: node.position.y,
  };
}

export function reactFlowEdgeToWorkflowEdgeRow(
  workflowId: string,
  edge: WorkflowEdge
): WorkflowEdgeRow {
  return {
    id: edge.id,
    workflow_id: workflowId,
    from_node_id: edge.source,
    from_handle: edge.sourceHandle ?? "output",
    to_node_id: edge.target,
    to_handle: edge.targetHandle ?? "input",
  };
}
