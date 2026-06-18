import type { MetaFunction } from "react-router";
import { useParams, Link } from "react-router";
import { ArrowLeft } from "lucide-react";

import { WorkflowBuilder } from "@/components/workflows/workflow-builder";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

export const meta: MetaFunction = () => [
  { title: "Workflow Builder | Kato" },
  {
    name: "description",
    content: "Build and inspect a Kato workflow graph.",
  },
];

export default function WorkflowBuilderRoute() {
  const { id } = useParams();
  const workflowId = id ?? "new";

  return (
    <div className="flex h-full flex-col">
      <header className="flex items-center gap-3 border-b border-border/60 px-4 py-2.5">
        <Link
          to="/workflows"
          className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
        >
          <ArrowLeft className="size-3.5" />
          Back
        </Link>
        <div className="h-4 w-px bg-border/60" />
        <h1 className="truncate text-[13px] font-semibold">
          {workflowId === "new" ? "New workflow" : `Workflow ${workflowId}`}
        </h1>
      </header>

      <div className="min-h-0 flex-1">
        <WorkflowBuilder />
      </div>
    </div>
  );
}
