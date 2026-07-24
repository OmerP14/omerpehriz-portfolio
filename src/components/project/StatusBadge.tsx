import { Badge } from "@/components/ui/Badge";
import { cn } from "@/lib/utils";

type StatusStyle = {
  variant: "default" | "accent" | "success" | "outline";
  pulse?: boolean;
};

const STATUS_STYLES: Record<string, StatusStyle> = {
  "In Active Development": { variant: "success", pulse: true },
  "In Development": { variant: "outline", pulse: true },
  Prototype: { variant: "outline" },
  "Academic Project": { variant: "default" },
  "Graduation Project": { variant: "accent" },
  "Utility Project": { variant: "default" },
};

interface Props {
  status: string;
  className?: string;
}

export function StatusBadge({ status, className }: Props) {
  const style = STATUS_STYLES[status] ?? { variant: "default" as const };

  return (
    <Badge variant={style.variant} className={cn("whitespace-nowrap", className)}>
      {style.pulse && (
        <span className="relative flex w-1.5 h-1.5">
          <span className="absolute inline-flex h-full w-full rounded-full bg-current opacity-75 animate-ping" />
          <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-current" />
        </span>
      )}
      {status}
    </Badge>
  );
}
