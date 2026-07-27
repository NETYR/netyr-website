import type {
  AnchorHTMLAttributes,
  ButtonHTMLAttributes,
  ReactNode,
} from "react";

import { cn } from "@/lib/cn";

type ButtonVariant = "primary" | "secondary";

type SharedProps = {
  children: ReactNode;
  className?: string;
  variant?: ButtonVariant;
};

type LinkButtonProps = SharedProps &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href"> & {
    href: string;
  };

type NativeButtonProps = SharedProps &
  ButtonHTMLAttributes<HTMLButtonElement> & {
    href?: never;
  };

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "bg-brand-red-dark text-white shadow-sm hover:bg-red-800 focus-visible:outline-brand-red-dark",
  secondary:
    "border border-brand-navy/25 bg-white text-brand-navy hover:border-brand-blue hover:bg-blue-50 focus-visible:outline-brand-blue",
};

export function buttonStyles({
  className,
  variant = "primary",
}: {
  className?: string;
  variant?: ButtonVariant;
} = {}) {
  return cn(
    "inline-flex min-h-11 items-center justify-center rounded-sm px-5 py-2.5 text-center text-sm font-bold tracking-wider uppercase transition-colors focus-visible:outline-2 focus-visible:outline-offset-2",
    variantClasses[variant],
    className,
  );
}

export function Button(props: LinkButtonProps | NativeButtonProps) {
  const { children, className, variant = "primary" } = props;
  const classes = buttonStyles({ className, variant });

  if ("href" in props && props.href) {
    const linkProps = { ...(props as LinkButtonProps) };
    delete linkProps.children;
    delete linkProps.className;
    delete linkProps.variant;

    return (
      <a className={classes} {...linkProps}>
        {children}
      </a>
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
