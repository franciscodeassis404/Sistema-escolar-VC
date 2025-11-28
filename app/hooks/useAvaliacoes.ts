import { useState, useEffect } from 'react';

export type AvaliacaoData = {
  responsabilidade: number;
  participacao: number;
  comportamento: number;
};

export const useAvaliacoes = (alunoId: string | null) => {
  const [avaliacoes, setAvaliacoes] = useState<Record<string, AvaliacaoData>>({});

  const getStorageKey = () => `avaliacoes_aluno_${alunoId}`;

  // Carregar avaliações do localStorage ao montar o componente
  useEffect(() => {
    if (alunoId) {
      const avaliacoesArmazenadas = localStorage.getItem(getStorageKey());
      if (avaliacoesArmazenadas) {
        try {
          setAvaliacoes(JSON.parse(avaliacoesArmazenadas));
          console.log('✅ Avaliações carregadas do localStorage');
        } catch (err) {
          console.error('Erro ao parsear avaliações do localStorage:', err);
        }
      }
    }
  }, [alunoId]);

  // Salvar avaliações no localStorage sempre que mudam
  useEffect(() => {
    if (alunoId && Object.keys(avaliacoes).length > 0) {
      localStorage.setItem(getStorageKey(), JSON.stringify(avaliacoes));
      console.log('💾 Avaliações salvas no localStorage');
    }
  }, [avaliacoes, alunoId]);

  const calcularMediaComportamento = (media: number): "bom" | "ruim" | "excelente" | "insatisfatorio" | "precisa melhorar" | "satisfatorio" => {
    if (media >= 4.5) return 'excelente';
    if (media >= 3.5) return 'bom';
    if (media >= 2.5) return 'satisfatorio';
    if (media >= 1.5) return 'precisa melhorar';
    return 'insatisfatorio';
  };

  const getMediaComportamentoBimestre = (bimestre: string): { media: number; tipo: "bom" | "ruim" | "excelente" | "insatisfatorio" | "precisa melhorar" | "satisfatorio" } | null => {
    const avaliacao = avaliacoes[bimestre];
    if (!avaliacao) return null;

    const media = (avaliacao.responsabilidade + avaliacao.participacao + avaliacao.comportamento) / 3;
    const tipo = calcularMediaComportamento(media);

    return { media, tipo };
  };

  const getMediaComportamentoGeral = (): { media: number; tipo: "bom" | "ruim" | "excelente" | "insatisfatorio" | "precisa melhorar" | "satisfatorio" } | null => {
    const bimestresComAvaliacao = Object.keys(avaliacoes);
    if (bimestresComAvaliacao.length === 0) return null;

    let somaTotal = 0;
    let totalNotas = 0;

    bimestresComAvaliacao.forEach((bimestre) => {
      const avaliacao = avaliacoes[bimestre];
      if (avaliacao) {
        somaTotal += avaliacao.responsabilidade + avaliacao.participacao + avaliacao.comportamento;
        totalNotas += 3;
      }
    });

    const mediaGeral = somaTotal / totalNotas;
    const tipo = calcularMediaComportamento(mediaGeral);

    return { media: mediaGeral, tipo };
  };

  const adicionarAvaliacao = (bimestre: string, avaliacaoData: AvaliacaoData) => {
    setAvaliacoes((prevAvaliacoes) => ({
      ...prevAvaliacoes,
      [bimestre]: avaliacaoData,
    }));
  };

  return {
    avaliacoes,
    getMediaComportamentoBimestre,
    getMediaComportamentoGeral,
    adicionarAvaliacao,
  };
};
