import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useUpdateNodeConfig } from "@/components/workflows/hooks/use-update-node-config";
import type { WorkflowNode } from "@/components/workflows/types";

export function WebhookResponsePropertyPanel({ node }: { node: WorkflowNode }) {
	const updateConfig = useUpdateNodeConfig(node.id);
	const config = node.data.config as { status: number };

	return (
		<div className="space-y-3">
			<div className="space-y-1.5">
				<Label htmlFor={`${node.id}-status`}>Status Code</Label>
				<Input
					id={`${node.id}-status`}
					type="number"
					value={config.status}
					onChange={(event) =>
						updateConfig({ status: Number(event.target.value) })
					}
					placeholder="200"
				/>
			</div>
		</div>
	);
}
