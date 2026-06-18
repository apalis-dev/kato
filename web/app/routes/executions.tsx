import type { MetaFunction } from "react-router";
import { Activity } from "lucide-react";

export const meta: MetaFunction = () => [{ title: "Executions | Kato" }];

export default function ExecutionsRoute() {
	return (
		<div className="flex h-full flex-col items-center justify-center text-center">
			<Activity className="size-6 text-muted-foreground/40" />
			<p className="mt-3 text-sm font-medium">Executions</p>
			<p className="mt-1 text-xs text-muted-foreground/70">
				Workflow run history will appear here.
			</p>
		</div>
	);
}
