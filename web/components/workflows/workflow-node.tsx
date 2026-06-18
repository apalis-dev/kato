import type { NodeProps } from "@xyflow/react";

import { Position, useReactFlow } from "@xyflow/react";
import { Braces, MousePointer2, Trash2 } from "lucide-react";
import { useCallback, useMemo } from "react";

import {
  BaseNode,
  BaseNodeContent,
  BaseNodeFooter,
  BaseNodeHeader,
  BaseNodeHeaderTitle,
} from "@/components/base-node";
import { LabeledHandle } from "@/components/labeled-handle";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type {
  WorkflowNode,
  WorkflowNodeCategory,
} from "@/components/workflows/types";
import { getWorkflowNodeDefinition } from "@/components/workflows/workflow-data";
import { cn } from "@/lib/utils";

const categoryIcons = {
  trigger: MousePointer2,
  action: Braces,
} satisfies Record<WorkflowNodeCategory, typeof MousePointer2>;

const categoryLabels = {
  trigger: "Trigger",
  action: "Action",
} satisfies Record<WorkflowNodeCategory, string>;

export function WorkflowNodeComponent({
  id,
  data,
  selected,
}: NodeProps<WorkflowNode>) {
  const { setEdges, setNodes } = useReactFlow<WorkflowNode>();
  const Icon = categoryIcons[data.category];

  const definition = useMemo(
    () => getWorkflowNodeDefinition(data.nodeId),
    [data.nodeId]
  );

  const handleDelete = useCallback(() => {
    if (!data.deletable) {
      return;
    }

    setNodes((nodes) => nodes.filter((node) => node.id !== id));
    setEdges((edges) =>
      edges.filter((edge) => edge.source !== id && edge.target !== id)
    );
  }, [data.deletable, id, setEdges, setNodes]);

  return (
    <BaseNode
      className={cn("w-72", selected && "ring-1 ring-foreground/15")}
    >
      {definition.inputs > 0 ? (
        <LabeledHandle
          id="input"
          type="target"
          position={Position.Left}
          title="in"
          className="absolute left-0 top-1/2 -translate-x-1/2 -translate-y-1/2"
          labelClassName="sr-only"
        />
      ) : null}

      <BaseNodeHeader>
        <div className="flex min-w-0 items-center gap-2.5">
          <Icon className="size-5 shrink-0 text-muted-foreground" />
          <div className="min-w-0">
            <BaseNodeHeaderTitle className="truncate text-sm font-semibold">
              {data.label}
            </BaseNodeHeaderTitle>
            <p className="truncate text-xs text-muted-foreground/70">
              {data.nodeId}
            </p>
          </div>
        </div>

        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          className="nodrag size-7 text-muted-foreground/60 hover:text-destructive"
          disabled={!data.deletable}
          onClick={handleDelete}
          aria-label="Delete node"
          title="Delete node"
        >
          <Trash2 className="size-4" />
        </Button>
      </BaseNodeHeader>

      <BaseNodeContent>
        <p className="line-clamp-2 text-sm leading-5 text-muted-foreground">
          {data.description}
        </p>
        <div className="flex flex-wrap gap-1.5">
          <Badge variant="secondary" className="text-[11px] font-medium">
            {categoryLabels[data.category]}
          </Badge>
        </div>
      </BaseNodeContent>

      {definition.outputs > 0 ? (
        <BaseNodeFooter className="items-end">
          <LabeledHandle
            id="output"
            type="source"
            position={Position.Right}
            title="out"
            className="justify-end"
            labelClassName="text-[10px] text-muted-foreground/60"
          />
        </BaseNodeFooter>
      ) : null}
    </BaseNode>
  );
}

export const workflowNodeTypes = {
  workflow: WorkflowNodeComponent,
};
