"use client"

import * as React from "react"
import { X, Loader2 } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "~/components/ui/dialog"
import { Button } from "~/components/ui/button"

interface ComportamentoModalProps {
  isOpen: boolean
  onClose: () => void
  bimestre: string
  alunoId: number
  onSubmit: (avaliacoes: AvaliacaoData) => Promise<void>
  isLoading?: boolean
}

export interface AvaliacaoData {
  responsabilidade: number
  participacao: number
  comportamento: number
}

const escalas = [
  { valor: 1, emoji: "😞", label: "Insatisfatório" },
  { valor: 2, emoji: "😕", label: "Precisa melhorar" },
  { valor: 3, emoji: "😐", label: "Satisfatório" },
  { valor: 4, emoji: "😊", label: "Bom" },
  { valor: 5, emoji: "🤩", label: "Excelente" },
]

type CriterioType = "responsabilidade" | "participacao" | "comportamento"

const criterios: { tipo: CriterioType; label: string; descricao: string }[] = [
  {
    tipo: "responsabilidade",
    label: "Responsabilidade",
    descricao: "Cumpre com compromissos e atividades propostas",
  },
  {
    tipo: "participacao",
    label: "Participação",
    descricao: "Engajamento e contribuição nas aulas",
  },
  {
    tipo: "comportamento",
    label: "Comportamento",
    descricao: "Respeito e conduta em sala de aula",
  },
]

export function ComportamentoModal({
  isOpen,
  onClose,
  bimestre,
  alunoId,
  onSubmit,
  isLoading = false,
}: ComportamentoModalProps) {
  const [avaliacoes, setAvaliacoes] = React.useState<AvaliacaoData>({
    responsabilidade: 0,
    participacao: 0,
    comportamento: 0,
  })

  const handleAvaliar = (criterio: CriterioType, valor: number) => {
    setAvaliacoes((prev) => ({
      ...prev,
      [criterio]: prev[criterio] === valor ? 0 : valor,
    }))
  }

  const handleSubmit = async () => {
    // Validar se todas as avaliações foram preenchidas
    if (
      avaliacoes.responsabilidade === 0 ||
      avaliacoes.participacao === 0 ||
      avaliacoes.comportamento === 0
    ) {
      alert("Por favor, avalie todos os critérios")
      return
    }

    try {
      await onSubmit(avaliacoes)
      setAvaliacoes({
        responsabilidade: 0,
        participacao: 0,
        comportamento: 0,
      })
      onClose()
    } catch (error) {
      console.error("Erro ao enviar avaliação:", error)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl bg-background dark:bg-gray-800 border-border">
        <DialogHeader>
          <div className="flex items-center justify-between w-full">
            <div>
              <DialogTitle className="text-2xl font-bold text-foreground">
                Avaliar Comportamento
              </DialogTitle>
              <p className="text-sm text-muted-foreground mt-1">{bimestre}</p>
            </div>
            <DialogClose asChild>
              <button className="p-1 hover:bg-accent rounded-lg transition-colors">
                <X className="w-5 h-5" />
              </button>
            </DialogClose>
          </div>
        </DialogHeader>

        <div className="space-y-8 py-6">
          {criterios.map((criterio) => (
            <div key={criterio.tipo} className="space-y-3">
              <div>
                <label className="text-base font-semibold text-foreground">
                  {criterio.label}
                </label>
                <p className="text-sm text-muted-foreground mt-1">
                  {criterio.descricao}
                </p>
              </div>

              <div className="flex gap-2">
                {escalas.map((escala) => (
                  <button
                    key={escala.valor}
                    onClick={() => handleAvaliar(criterio.tipo, escala.valor)}
                    disabled={isLoading}
                    className={`flex flex-col  items-center gap-1 p-5 rounded-lg transition-all ${
                      avaliacoes[criterio.tipo] === escala.valor
                        ? "bg-primary/20 border-2 border-primary scale-110"
                        : "bg-muted border-2 border-transparent hover:bg-muted/80"
                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                    title={escala.label}
                  >
                    <span className="text-3xl">{escala.emoji}</span>
                    <span className="text-xs font-medium text-foreground text-center">
                      {escala.valor}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="flex gap-3 justify-end pt-6 border-t border-border">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isLoading}
            className="rounded-md"
          >
            Cancelar
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={
              isLoading ||
              avaliacoes.responsabilidade === 0 ||
              avaliacoes.participacao === 0 ||
              avaliacoes.comportamento === 0
            }
            className="rounded-md bg-primary text-primary-foreground hover:bg-primary/90"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Salvando...
              </>
            ) : (
              "Salvar Avaliação"
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
