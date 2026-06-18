import type { MetaFunction } from "react-router";
import { Link, useNavigate } from "react-router";
import { ArrowRight, Workflow, Plus } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const meta: MetaFunction = () => [
  { title: "Workflows | Kato" },
  {
    name: "description",
    content: "Manage and build Kato workflows.",
  },
];

type WorkflowSummary = {
  id: string;
  name: string;
  description: string;
  status: "draft" | "active" | "archived";
  nodes: number;
  edges: number;
  updatedAt: string;
};

const mockWorkflows: WorkflowSummary[] = [
  {
    id: "wf-001",
    name: "Webhook → HTTP → Response",
    description:
      "Receives a webhook, calls an external API, returns the result.",
    status: "draft",
    nodes: 4,
    edges: 3,
    updatedAt: "2 hours ago",
  },
  {
    id: "wf-002",
    name: "Conditional routing demo",
    description: "Branches execution based on a payload expression.",
    status: "active",
    nodes: 5,
    edges: 4,
    updatedAt: "Yesterday",
  },
  {
    id: "wf-003",
    name: "Empty workflow",
    description: "A fresh workflow with no nodes yet.",
    status: "draft",
    nodes: 0,
    edges: 0,
    updatedAt: "3 days ago",
  },
];

const statusVariants = {
  draft: "secondary",
  active: "success",
  archived: "outline",
} satisfies Record<
  WorkflowSummary["status"],
  React.ComponentProps<typeof Badge>["variant"]
>;

export default function WorkflowsRoute() {
  const navigate = useNavigate();

  return (
    <div className="flex h-full flex-col">
      <header className="flex items-center justify-between border-b border-border/60 px-6 py-4">
        <div>
          <h1 className="text-[15px] font-semibold">Workflows</h1>
          <p className="text-xs text-muted-foreground/70">
            {mockWorkflows.length} workflows
          </p>
        </div>
        <Button
          variant="outline"
          onClick={() => navigate("/workflows/new")}
          className="gap-1.5"
        >
          <Plus className="size-3.5" />
          New workflow
        </Button>
      </header>

      <div className="flex-1 overflow-auto px-6 py-4">
        <div className="mx-auto max-w-4xl space-y-1.5">
          {mockWorkflows.map((workflow) => (
            <Link
              key={workflow.id}
              to={`/workflows/${workflow.id}`}
              className={cn(
                "group flex items-center gap-4 rounded-lg border border-border/60 bg-card px-4 py-3 transition",
                "hover:border-foreground/20 hover:bg-accent/40"
              )}
            >
              <div className="flex size-8 shrink-0 items-center justify-center rounded-md bg-muted/60">
                <Workflow className="size-4 text-muted-foreground" />
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="truncate text-[13px] font-medium">
                    {workflow.name}
                  </span>
                  <Badge
                    variant={statusVariants[workflow.status]}
                    className="text-[10px]"
                  >
                    {workflow.status}
                  </Badge>
                </div>
                <p className="mt-0.5 truncate text-xs text-muted-foreground/70">
                  {workflow.description}
                </p>
              </div>

              <div className="hidden shrink-0 items-center gap-4 text-xs text-muted-foreground/70 sm:flex">
                <span className="tabular-nums">{workflow.nodes} nodes</span>
                <span className="tabular-nums">{workflow.edges} edges</span>
                <span>{workflow.updatedAt}</span>
              </div>

              <ArrowRight className="size-4 shrink-0 text-muted-foreground/40 opacity-0 transition group-hover:opacity-100" />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
