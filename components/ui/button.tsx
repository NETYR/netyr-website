import Link from "next/link";
import type { ButtonHTMLAttributes, ReactNode } from "react";

import { cn } from "@/lib/cn";

type ButtonVariant = "primary" | "secondary";

type SharedProps = {
  children: ReactNode;
  className?: string;
  variant?: ButtonVariant;
};

type LinkButtonProps = SharedProps & {
  href: string;
};

type NativeButtonProps = SharedProps &
  ButtonHTMLAttributes<HTMLButtonElement> & {
    href?: never;
  };

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "bg-blue-800 text-white hover:bg-blue-900 focus-visible:outline-blue-800",
  secondary:
    "border border-slate-300 bg-white text-slate-950 hover:bg-slate-50 focus-visible:outline-blue-700",
};

export function Button(props: LinkButtonProps | NativeButtonProps) {
  const { children, className, variant = "primary" } = props;
  const classes = cn(
    "inline-flex min-h-11 items-center justify-center rounded-md px-5 py-2.5 text-center font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2",
    variantClasses[variant],
    className,
  );

  if ("href" in props && props.href) {
    return (
      <Link className={classes} href={props.href}>
        {children}
      </Link>
    );
  }

  const buttonProps = { ...(props as NativeButtonProps) };
  delete buttonProps.children;
  delete buttonProps.className;
  delete buttonProps.variant;

  return (
    <button className={classes} {...buttonProps}>
      {children}
    </button>
  );
}
