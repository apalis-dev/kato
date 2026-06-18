import type { EdgeProps } from "@xyflow/react";

import {
	BaseEdge,
	EdgeLabelRenderer,
	getBezierPath,
	useReactFlow,
} from "@xyflow/react";
import { X } from "lucide-react";

import { Button } from "@/components/ui/button";

export function WorkflowEdge({
	id,
	sourceX,
	sourceY,
	targetX,
	targetY,
	sourcePosition,
	targetPosition,
	style = {},
	selected,
}: EdgeProps) {
	const { setEdges } = useReactFlow();
	const [edgePath, labelX, labelY] = getBezierPath({
		sourceX,
		sourceY,
		sourcePosition,
		targetX,
		targetY,
		targetPosition,
	});

	const handleDelete = () => {
		setEdges((edges) => edges.filter((edge) => edge.id !== id));
	};

	return (
		<>
			<BaseEdge
				id={id}
				path={edgePath}
				style={{
					...style,
					strokeWidth: selected ? 1.5 : 1,
					stroke: selected
						? "color-mix(in oklch, var(--foreground) 55%, transparent)"
						: "color-mix(in oklch, var(--muted-foreground) 45%, transparent)",
				}}
			/>
			<EdgeLabelRenderer>
				<div
					className="nodrag nopan"
					style={{
						position: "absolute",
						transform: `translate(-50%, -50%) translate(${labelX}px, ${labelY}px)`,
						pointerEvents: "all",
					}}
				>
					<Button
						type="button"
						variant="outline"
						size="icon"
						className="size-4 rounded-full p-0 shadow-sm"
						onClick={handleDelete}
						aria-label="Delete edge"
						title="Delete edge"
					>
						<X className="size-2.5" />
					</Button>
				</div>
			</EdgeLabelRenderer>
		</>
	);
}
