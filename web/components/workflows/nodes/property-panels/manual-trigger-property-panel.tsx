import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useUpdateNodeConfig } from "@/components/workflows/hooks/use-update-node-config";
import type { WorkflowNode } from "@/components/workflows/types";

export function ManualTriggerPropertyPanel({ node }: { node: WorkflowNode }) {
	const updateConfig = useUpdateNodeConfig(node.id);
	const config = node.data.config as { event: string };

	return (
		<div className="space-y-3">
			<div className="space-y-1.5">
				<Label htmlFor={`${node.id}-event`}>Event</Label>
				<Input
					id={`${node.id}-event`}
					value={config.event}
					onChange={(event) => updateConfig({ event: event.target.value })}
					placeholder="manual"
				/>
			</div>
		</div>
	);
}
