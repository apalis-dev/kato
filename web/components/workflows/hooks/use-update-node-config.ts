import { useReactFlow } from "@xyflow/react";
import { useCallback } from "react";

import type { WorkflowNode } from "@/components/workflows/types";

export function useUpdateNodeConfig(nodeId: string) {
	const { setNodes } = useReactFlow<WorkflowNode>();

	return useCallback(
		(updates: Record<string, unknown>) => {
			setNodes((currentNodes) =>
				currentNodes.map((node) => {
					if (node.id !== nodeId) {
						return node;
					}

					return {
						...node,
						data: {
							...node.data,
							config: {
								...node.data.config,
								...updates,
							},
						},
					};
				}),
			);
		},
		[nodeId, setNodes],
	);
}
