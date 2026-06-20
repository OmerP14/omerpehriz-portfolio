import { cn } from "@/lib/utils";

interface Props {
  id: string;
  children: React.ReactNode;
  className?: string;
  alt?: boolean;
}

export function SectionWrapper({ id, children, className, alt = false }: Props) {
  return (
    <section
      id={id}
      className={cn(
        "w-full py-24 lg:py-32 scroll-mt-16",
        alt && "bg-surface",
        className
      )}
    >
      <div className="layout-container">
        {children}
      </div>
    </section>
  );
}
