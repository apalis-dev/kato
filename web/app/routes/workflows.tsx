import type { MetaFunction } from "react-router";

import { WorkflowBuilder } from "@/components/workflows/workflow-builder";

export const meta: MetaFunction = () => [
	{ title: "Workflows | Kato" },
	{
		name: "description",
		content: "Build and inspect Kato workflow graphs.",
	},
];

export default function WorkflowsRoute() {
	return <WorkflowBuilder />;
}
