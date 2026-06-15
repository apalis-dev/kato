import { MousePointer2, Braces, Send } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type {
  WorkflowNodeCategory,
  WorkflowNodeMetadata,
} from "@/components/workflows/types";

const categoryIcons = {
  trigger: MousePointer2,
  transform: Braces,
  output: Send,
} satisfies Record<WorkflowNodeCategory, typeof MousePointer2>;

type AddNodeFloatingMenuProps = {
  position: { x: number; y: number };
  definitions: WorkflowNodeMetadata[];
  onSelect: (definition: WorkflowNodeMetadata) => void;
  onClose: () => void;
};

export function AddNodeFloatingMenu({
  position,
  definitions,
  onSelect,
  onClose,
}: AddNodeFloatingMenuProps) {
  return (
    <Card
      className="fixed z-50 w-56 py-2 shadow-lg"
      style={{
        left: position.x,
        top: position.y,
        transform: "translate(-50%, 12px)",
      }}
    >
      <CardHeader className="flex-row items-center justify-between space-y-0 px-3 pb-2 pt-0">
        <CardTitle className="text-xs font-medium text-muted-foreground">
          Add node
        </CardTitle>
        <Button type="button" variant="ghost" size="sm" onClick={onClose}>
          Cancel
        </Button>
      </CardHeader>

      <CardContent className="space-y-1 px-2 pb-2 pt-0">
        {definitions.map((definition) => {
          const Icon = categoryIcons[definition.category];

          return (
            <Button
              key={definition.nodeId}
              type="button"
              variant="ghost"
              className="h-auto w-full justify-start gap-2 px-2 py-1.5 text-sm font-normal"
              onClick={() => onSelect(definition)}
            >
              <Icon className="size-4 shrink-0 text-muted-foreground" />
              <span className="truncate text-sm">{definition.label}</span>
            </Button>
          );
        })}
      </CardContent>
    </Card>
  );
}
