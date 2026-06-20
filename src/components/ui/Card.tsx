import { cn } from "@/lib/utils";

interface Props {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  glow?: boolean;
}

export function Card({ children, className, hover = false, glow = false }: Props) {
  return (
    <div
      className={cn(
        "bg-surface border border-border rounded-2xl p-6",
        hover &&
          "transition-all duration-300 hover:border-accent/30 hover:-translate-y-1 hover:shadow-xl hover:shadow-accent/5",
        glow && "hover:shadow-accent/10",
        className
      )}
    >
      {children}
    </div>
  );
}
