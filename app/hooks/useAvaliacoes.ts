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

  const getMediaComportamentoGeral = (): { media: number; tipo: "bom" | "ruim" | "excelente" | "insatisfatorio" | "precisa melhorar" | "satisfatorio"; origem: "media_4_bimestres" | "ultima_nota" } | null => {
    const bimestresComAvaliacao = Object.keys(avaliacoes);
    
    // Se não houver avaliações, retorna null
    if (bimestresComAvaliacao.length === 0) return null;

    // Se tiver 4 ou mais bimestres com avaliação, calcula a média geral
    if (bimestresComAvaliacao.length >= 4) {
      // Pega os 4 primeiros bimestres (ou todos se tiver mais de 4)
      const bimestresParaMedia = bimestresComAvaliacao.slice(0, 4);
      
      let somaMedias = 0;
      bimestresParaMedia.forEach((bimestre) => {
        const avaliacao = avaliacoes[bimestre];
        if (avaliacao) {
          const media = (avaliacao.responsabilidade + avaliacao.participacao + avaliacao.comportamento) / 3;
          somaMedias += media;
        }
      });

      const mediaGeral = somaMedias / 4;
      const tipo = calcularMediaComportamento(mediaGeral);


      return { media: mediaGeral, tipo, origem: "media_4_bimestres" };
    }

    // Se tiver menos de 4 bimestres, usa a última nota registrada
    const ultimoBimestre = bimestresComAvaliacao[bimestresComAvaliacao.length - 1];
    const avaliacaoUltima = avaliacoes[ultimoBimestre];
    
    if (avaliacaoUltima) {
      const media = (avaliacaoUltima.responsabilidade + avaliacaoUltima.participacao + avaliacaoUltima.comportamento) / 3;
      const tipo = calcularMediaComportamento(media);

      console.log(`📝 Última Nota (${ultimoBimestre}): ${media.toFixed(2)}`);

      return { media, tipo, origem: "ultima_nota" };
    }

    return null;
  };

  const adicionarAvaliacao = (bimestre: string, avaliacaoData: AvaliacaoData) => {
    setAvaliacoes((prevAvaliacoes) => ({
      ...prevAvaliacoes,
      [bimestre]: avaliacaoData,
    }));
  };

  const zerarAvaliacao = (bimestre: string) => {
    setAvaliacoes((prevAvaliacoes) => {
      const novasAvaliacoes = { ...prevAvaliacoes };
      delete novasAvaliacoes[bimestre];
      
      // Se ficar vazio, remove do localStorage também
      if (Object.keys(novasAvaliacoes).length === 0) {
        localStorage.removeItem(getStorageKey());
        console.log(`Avaliação do ${bimestre} removida (localStorage limpo)`);
      } else {
        localStorage.setItem(getStorageKey(), JSON.stringify(novasAvaliacoes));
        console.log(`Avaliação do ${bimestre} removida`);
      }
      
      return novasAvaliacoes;
    });
  };

  return {
    avaliacoes,
    getMediaComportamentoBimestre,
    getMediaComportamentoGeral,
    adicionarAvaliacao,
    zerarAvaliacao,
  };
};
