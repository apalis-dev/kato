import type { MetaFunction } from "react-router";
import { ScrollText } from "lucide-react";

export const meta: MetaFunction = () => [{ title: "Logs | Kato" }];

export default function LogsRoute() {
	return (
		<div className="flex h-full flex-col items-center justify-center text-center">
			<ScrollText className="size-6 text-muted-foreground/40" />
			<p className="mt-3 text-sm font-medium">Logs</p>
			<p className="mt-1 text-xs text-muted-foreground/70">
				Execution logs will appear here.
			</p>
		</div>
	);
}
