import * as React from "react";
import { cn } from "~/lib/utils";

type ComportamentoType = "bom" | "ruim" | "excelente";

interface ComportamentoTagProps {
  tipo: ComportamentoType;
  className?: string;
}

const comportamentoStyles: Record<ComportamentoType, { bg: string; text: string; label: string }> = {
  bom: {
    bg: "bg-blue-100 dark:bg-blue-900/30",
    text: "text-blue-700 dark:text-blue-300",
    label: "Bom",
  },
  ruim: {
    bg: "bg-red-100 dark:bg-red-900/30",
    text: "text-red-700 dark:text-red-300",
    label: "Ruim",
  },
  excelente: {
    bg: "bg-green-100 dark:bg-green-900/30",
    text: "text-green-700 dark:text-green-300",
    label: "Excelente",
  },
};

export function ComportamentoTag({ tipo, className }: ComportamentoTagProps) {
  const style = comportamentoStyles[tipo];

  if (!style) {
    console.error(`Tipo de comportamento inválido: ${tipo}`);
    return null;
  }

  return (
    <span
      className={cn(
        "inline-flex items-center px-3 py-1 rounded-full text-sm font-medium",
        style.bg,
        style.text,
        className
      )}
    >
      {style.label}
    </span>
  );
}
