import type { NodeProps } from "@xyflow/react";

import { Position, useReactFlow } from "@xyflow/react";
import {
  Braces,
  EllipsisVertical,
  MousePointer2,
  Send,
  Trash2,
} from "lucide-react";
import { useCallback } from "react";

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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type {
  WorkflowNode,
  WorkflowNodeCategory,
} from "@/components/workflows/types";
import { cn } from "@/lib/utils";

const categoryIcons = {
  trigger: MousePointer2,
  transform: Braces,
  output: Send,
} satisfies Record<WorkflowNodeCategory, typeof MousePointer2>;

const categoryLabels = {
  trigger: "Trigger",
  transform: "Transform",
  output: "Output",
} satisfies Record<WorkflowNodeCategory, string>;

export function WorkflowNodeComponent({
  id,
  data,
  selected,
}: NodeProps<WorkflowNode>) {
  const { setEdges, setNodes } = useReactFlow<WorkflowNode>();
  const Icon = categoryIcons[data.category];

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
      className={cn("w-72 shadow-sm", selected && "ring-2 ring-ring/30")}
    >
      {data.category !== "trigger" ? (
        <LabeledHandle
          id="input"
          type="target"
          position={Position.Left}
          title="in"
          className="absolute left-0 top-1/2 -translate-x-1/2 -translate-y-1/2"
          labelClassName="sr-only"
        />
      ) : null}

      <BaseNodeHeader className="border-b">
        <div className="flex min-w-0 items-center gap-2">
          <div className="flex size-8 shrink-0 items-center justify-center rounded-md border bg-muted">
            <Icon className="size-4" />
          </div>
          <div className="min-w-0">
            <BaseNodeHeaderTitle className="truncate text-sm">
              {data.label}
            </BaseNodeHeaderTitle>
            <p className="truncate text-xs text-muted-foreground">
              {data.nodeId}
            </p>
          </div>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              className="nodrag"
              aria-label="Node actions"
              title="Node actions"
            >
              <EllipsisVertical className="size-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Node Actions</DropdownMenuLabel>
            <DropdownMenuItem
              disabled={!data.deletable}
              onSelect={handleDelete}
            >
              <Trash2 className="size-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </BaseNodeHeader>

      <BaseNodeContent>
        <p className="line-clamp-2 text-sm text-muted-foreground">
          {data.description}
        </p>
        <div className="flex flex-wrap gap-1.5">
          <Badge variant="secondary">{categoryLabels[data.category]}</Badge>
          <Badge variant="outline">
            {Object.keys(data.config).length} config fields
          </Badge>
        </div>
      </BaseNodeContent>

      {data.category !== "output" ? (
        <BaseNodeFooter className="items-end bg-muted/30 py-2">
          <LabeledHandle
            id="output"
            type="source"
            position={Position.Right}
            title="out"
            className="justify-end"
            labelClassName="text-xs text-muted-foreground"
          />
        </BaseNodeFooter>
      ) : null}
    </BaseNode>
  );
}

export const workflowNodeTypes = {
  workflow: WorkflowNodeComponent,
};
