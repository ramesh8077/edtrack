"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical } from "lucide-react";

export function SortableItem({
  id,
  children,
  className,
}: {
  id: string | number;
  children: React.ReactNode;
  className?: string;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 10 : 1,
    boxShadow: isDragging ? "0 10px 15px -3px rgb(0 0 0 / 0.1)" : "none",
  };

  return (
    <div ref={setNodeRef} style={style} className={`${className} flex group`}>
      <div
        {...attributes}
        {...listeners}
        className="w-10 flex cursor-grab items-center justify-center border-r border-border/40 bg-muted/40 group-hover:bg-muted/80 rounded-l-md transition-colors active:cursor-grabbing"
      >
        <GripVertical className="h-5 w-5 text-muted-foreground opacity-50 group-hover:opacity-100" />
      </div>
      <div className="flex-1 p-0 m-0">{children}</div>
    </div>
  );
}
