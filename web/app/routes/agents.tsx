import type { MetaFunction } from "react-router";
import { Bot } from "lucide-react";

export const meta: MetaFunction = () => [{ title: "Agents | Kato" }];

export default function AgentsRoute() {
	return (
		<div className="flex h-full flex-col items-center justify-center text-center">
			<Bot className="size-6 text-muted-foreground/40" />
			<p className="mt-3 text-sm font-medium">Agents</p>
			<p className="mt-1 text-xs text-muted-foreground/70">
				Agent management will appear here.
			</p>
		</div>
	);
}
