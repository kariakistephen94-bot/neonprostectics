import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
export const cn = (...inputs: Parameters<typeof clsx>) => twMerge(clsx(inputs));
const variants = cva("btn", {
  variants: {
    variant: {
      default: "primary",
      outline: "outline",
      ghost: "ghost",
      destructive: "danger",
    },
  },
  defaultVariants: { variant: "default" },
});
export function Button({
  className,
  variant,
  ...props
}: React.ComponentProps<"button"> & VariantProps<typeof variants>) {
  return <button className={cn(variants({ variant }), className)} {...props} />;
}
