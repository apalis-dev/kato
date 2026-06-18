import type { ComponentProps } from "react";
import { Handle, type HandleProps } from "@xyflow/react";

import { cn } from "@/lib/utils";

export type BaseHandleProps = HandleProps;

export function BaseHandle({
  className,
  children,
  ...props
}: ComponentProps<typeof Handle>) {
  return (
    <Handle
      {...props}
      className={cn(
        "h-2 w-2 rounded-full border border-border bg-muted-foreground/40 transition hover:bg-foreground hover:border-foreground",
        className,
      )}
    >
      {children}
    </Handle>
  );
}
