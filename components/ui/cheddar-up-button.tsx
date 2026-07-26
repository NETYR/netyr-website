import { buttonStyles } from "@/components/ui/button";
import { cn } from "@/lib/cn";

type CheddarUpButtonProps = {
  className?: string;
  href?: string;
  label: string;
};

export function CheddarUpButton({
  className,
  href,
  label,
}: CheddarUpButtonProps) {
  if (!href) {
    return (
      <span
        aria-disabled="true"
        className={cn(
          buttonStyles(),
          "cursor-not-allowed bg-slate-400 text-white shadow-none",
          className,
        )}
        title="Payment link pending approval"
      >
        {label} — link pending
      </span>
    );
  }

  return (
    <a
      aria-label={`${label} through Cheddar Up (opens in a new tab)`}
      className={cn(buttonStyles(), className)}
      href={href}
      rel="noopener noreferrer"
      target="_blank"
    >
      {label}
      <svg
        aria-hidden="true"
        className="ml-2 size-4"
        fill="none"
        viewBox="0 0 24 24"
      >
        <path
          d="M14 5h5v5M19 5l-8 8M18 13v6H5V6h6"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
        />
      </svg>
    </a>
  );
}
