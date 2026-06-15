import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useUpdateNodeConfig } from "@/components/workflows/hooks/use-update-node-config";
import type { WorkflowNode } from "@/components/workflows/types";

export function ConditionPropertyPanel({ node }: { node: WorkflowNode }) {
	const updateConfig = useUpdateNodeConfig(node.id);
	const config = node.data.config as { expression: string };

	return (
		<div className="space-y-3">
			<div className="space-y-1.5">
				<Label htmlFor={`${node.id}-expression`}>Expression</Label>
				<Textarea
					id={`${node.id}-expression`}
					value={config.expression}
					onChange={(event) =>
						updateConfig({ expression: event.target.value })
					}
					placeholder="payload.ok === true"
					rows={3}
				/>
			</div>
		</div>
	);
}
