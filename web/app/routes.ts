import { index, layout, route, type RouteConfig } from "@react-router/dev/routes";

export default [
	index("routes/home.tsx"),
	layout("routes/layout.tsx", [
		route("workflows", "routes/workflows.tsx"),
		route("workflows/:id", "routes/workflow-builder.tsx"),
		route("executions", "routes/executions.tsx"),
		route("logs", "routes/logs.tsx"),
		route("agents", "routes/agents.tsx"),
	]),
] satisfies RouteConfig;
