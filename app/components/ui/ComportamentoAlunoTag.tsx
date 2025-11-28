import React from "react";
import { ComportamentoTag } from "~/components/ui/comportamento-tag";
import { useAvaliacoes } from "~/hooks/useAvaliacoes";

interface ComportamentoAlunoTagProps {
  alunoId: string | number | null;
  showMedia?: boolean;
  className?: string;
}

export function ComportamentoAlunoTag({ alunoId, showMedia = true, className }: ComportamentoAlunoTagProps) {
  const { getMediaComportamentoGeral } = useAvaliacoes(String(alunoId));

  const mediaGeral = getMediaComportamentoGeral();

  if (!mediaGeral) {
    return (
      <div className={`text-xs text-muted-foreground text-center ${className}`}>
        Sem avaliações
      </div>
    );
  }

  return (
    <div className={`flex flex-col items-center gap-1 ${className}`}>
      <ComportamentoTag tipo={mediaGeral.tipo} />
      {showMedia && (
        <span className="text-xs text-muted-foreground font-medium">
          ({mediaGeral.media.toFixed(1)})
        </span>
      )}
    </div>
  );
}
