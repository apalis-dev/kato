import { index, route, type RouteConfig } from "@react-router/dev/routes";

export default [
	index("routes/home.tsx"),
	route("workflows", "routes/workflows.tsx"),
] satisfies RouteConfig;
