import { cn } from "@/lib/utils";

interface Props {
  children: React.ReactNode;
  className?: string;
}

export function SectionLabel({ children, className }: Props) {
  return (
    <span
      className={cn(
        "inline-block text-accent text-xs font-bold tracking-[0.2em] uppercase mb-4",
        className
      )}
    >
      {children}
    </span>
  );
}
