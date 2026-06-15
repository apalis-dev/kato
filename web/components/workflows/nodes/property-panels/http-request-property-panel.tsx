import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { useUpdateNodeConfig } from "@/components/workflows/hooks/use-update-node-config";
import type { WorkflowNode } from "@/components/workflows/types";

const HTTP_METHODS = ["GET", "POST", "PUT", "DELETE", "PATCH"] as const;

export function HttpRequestPropertyPanel({ node }: { node: WorkflowNode }) {
	const updateConfig = useUpdateNodeConfig(node.id);
	const config = node.data.config as { method: string; url: string };

	return (
		<div className="space-y-3">
			<div className="space-y-1.5">
				<Label htmlFor={`${node.id}-method`}>Method</Label>
				<Select
					value={config.method}
					onValueChange={(value) => updateConfig({ method: value })}
				>
					<SelectTrigger id={`${node.id}-method`} className="w-full">
						<SelectValue placeholder="Select method" />
					</SelectTrigger>
					<SelectContent>
						{HTTP_METHODS.map((method) => (
							<SelectItem key={method} value={method}>
								{method}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
			</div>

			<div className="space-y-1.5">
				<Label htmlFor={`${node.id}-url`}>URL</Label>
				<Input
					id={`${node.id}-url`}
					value={config.url}
					onChange={(event) => updateConfig({ url: event.target.value })}
					placeholder="https://api.example.com"
				/>
			</div>
		</div>
	);
}
