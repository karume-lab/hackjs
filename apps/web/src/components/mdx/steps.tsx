import { type ClassValue, clsx } from "clsx";
import type * as React from "react";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function Steps({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "[&>h3]:step relative mb-12 ml-4 border-l pl-8 [counter-reset:step]",
        "border-border",
        className,
      )}
      {...props}
    />
  );
}
