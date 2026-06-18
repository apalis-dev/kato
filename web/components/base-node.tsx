import type { ComponentProps } from "react";

import { cn } from "@/lib/utils";

export function BaseNode({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "bg-card text-card-foreground relative rounded-lg border",
        "transition-colors duration-150",
        "hover:border-muted-foreground/40",
        "in-[.selected]:border-foreground/20",
        "in-[.selected]:ring-1 in-[.selected]:ring-foreground/15",
        className,
      )}
      {...props}
    />
  );
}

export function BaseNodeHeader({
  className,
  ...props
}: ComponentProps<"header">) {
  return (
    <header
      {...props}
      className={cn(
        "flex flex-row items-center justify-between gap-2 px-3 py-2.5",
        className,
      )}
    />
  );
}

export function BaseNodeHeaderTitle({
  className,
  ...props
}: ComponentProps<"h3">) {
  return (
    <h3
      data-slot="base-node-title"
      className={cn("user-select-none flex-1 text-[13px] font-medium", className)}
      {...props}
    />
  );
}

export function BaseNodeContent({
  className,
  ...props
}: ComponentProps<"div">) {
  return (
    <div
      data-slot="base-node-content"
      className={cn("flex flex-col gap-y-2 px-3 py-2.5", className)}
      {...props}
    />
  );
}

export function BaseNodeFooter({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      data-slot="base-node-footer"
      className={cn(
        "flex flex-col items-center gap-y-2 border-t border-border/50 px-3 pb-2.5 pt-2",
        className,
      )}
      {...props}
    />
  );
}
