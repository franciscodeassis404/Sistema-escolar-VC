import * as React from "react";
import { cn } from "~/lib/utils";

type ComportamentoType = "bom" | "ruim" | "excelente" | "insatisfatorio" | "precisa melhorar" | "satisfatorio";

interface ComportamentoTagProps {
  tipo: ComportamentoType;
  className?: string;
}

const comportamentoStyles: Record<ComportamentoType, { bg: string; text: string; label: string }> = {
  insatisfatorio: {
    bg: "bg-red-100 dark:bg-red-900/30",
    text: "text-red-700 dark:text-red-300",
    label: "Insatisfatório",
  },
  "precisa melhorar": {
    bg: "bg-orange-100 dark:bg-orange-900/30",
    text: "text-orange-700 dark:text-orange-300",
    label: "Precisa Melhorar",
  },
  satisfatorio: {
    bg: "bg-yellow-100 dark:bg-yellow-900/30",
    text: "text-yellow-700 dark:text-yellow-300",
    label: "Satisfatório",
  },
  bom: {
    bg: "bg-blue-100 dark:bg-blue-900/30",
    text: "text-blue-700 dark:text-blue-300",
    label: "Bom",
  },
  excelente: {
    bg: "bg-green-100 dark:bg-green-900/30",
    text: "text-green-700 dark:text-green-300",
    label: "Excelente",
  },
  ruim: {
    bg: "bg-red-100 dark:bg-red-900/30",
    text: "text-red-700 dark:text-red-300",
    label: "Ruim",
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
