import { apiClient } from './api-client';

export interface AlunoDetalhes {
  id: number;
  nome: string;
  foto: string | null;
  idade: number | null;
  turma: string;
  idMatricula: string;
  statusMatricula: string;
  statusComportamento: string;
  disciplinas: string[];
  comportamentoHistorico: {
    bimestre: string;
    meses: string;
    status: string;
  }[];
}

export interface ProfessorDetalhes {
  id: number;
  nome: string;
  foto: string | null;
  idade: number | null;
  departamento: string;
  email: string;
  telefone: string | null;
  turmasLecionadas: string[];
  totalTurmas: number;
  totalAlunos: number;
  status: string;
}

export const perfilService = {
  /**
   * Buscar perfil do ALUNO AUTENTICADO (novo - sem ID)
   */
  buscarMeuPerfilAluno: async (): Promise<AlunoDetalhes> => {
    try {
      console.log('Buscando meu perfil de aluno (usuário autenticado)');
      console.log('URL da API:', apiClient.defaults.baseURL);
      console.log('Tentando endpoint:', `${apiClient.defaults.baseURL}/meu-perfil/aluno`);

      const response = await apiClient.get<AlunoDetalhes>(`/meu-perfil/aluno`);
      console.log('Meu perfil de aluno carregado:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('Erro ao buscar meu perfil de aluno:', error);

      if (error.response?.status === 404) {
        throw new Error('Seu perfil de aluno não foi encontrado');
      }

      throw new Error(error.response?.data?.message || 'Erro ao carregar seu perfil');
    }
  },

  /**
   * Buscar perfil do PROFESSOR AUTENTICADO (novo - sem ID)
   */
  buscarMeuPerfilProfessor: async (): Promise<ProfessorDetalhes> => {
    try {
      console.log('Buscando meu perfil de professor (usuário autenticado)');
      console.log('URL da API:', apiClient.defaults.baseURL);
      console.log('Tentando endpoint:', `${apiClient.defaults.baseURL}/meu-perfil/professor`);

      const response = await apiClient.get<ProfessorDetalhes>(`/meu-perfil/professor`);
      console.log('Meu perfil de professor carregado:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('Erro ao buscar meu perfil de professor:', error);

      if (error.response?.status === 404) {
        throw new Error('Seu perfil de professor não foi encontrado');
      }

      throw new Error(error.response?.data?.message || 'Erro ao carregar seu perfil');
    }
  },

  /**
   * Buscar perfil completo de um aluno por ID (para admins)
   */
  buscarPerfilAluno: async (id: number): Promise<AlunoDetalhes> => {
    try {
      console.log(`Buscando perfil do aluno ${id}`);
      const response = await apiClient.get<AlunoDetalhes>(`/alunos/${id}/perfil`);
      console.log('Perfil do aluno carregado:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('Erro ao buscar perfil do aluno:', error);

      if (error.response?.status === 404) {
        throw new Error('Aluno não encontrado');
      }

      throw new Error(error.response?.data?.message || 'Erro ao carregar perfil do aluno');
    }
  },

  /**
   * Buscar perfil completo de um professor por ID (para admins)
   */
  buscarPerfilProfessor: async (id: number): Promise<ProfessorDetalhes> => {
    try {
      console.log(`Buscando perfil do professor ${id}`);
      const response = await apiClient.get<ProfessorDetalhes>(`/professores/${id}/perfil`);
      console.log('Perfil do professor carregado:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('Erro ao buscar perfil do professor:', error);

      if (error.response?.status === 404) {
        throw new Error('Professor não encontrado');
      }

      throw new Error(error.response?.data?.message || 'Erro ao carregar perfil do professor');
    }
  },

  /**
   * Salvar avaliação de comportamento de um aluno
   * Endpoint: POST /avaliar-comportamento
   */
  salvarAvaliacaoComportamento: async (
    alunoId: number,
    bimestre: string,
    avaliacoes: {
      responsabilidade: number;
      participacao: number;
      comportamento: number;
    }
  ): Promise<any> => {
    try {
      console.log('Salvando avaliação de comportamento');
      console.log('  alunoId:', alunoId);
      console.log('  bimestre:', bimestre);
      console.log('  avaliacoes:', avaliacoes);

      // Extrair número do bimestre se for string como "1º Bimestre"
      let bimestreNumerico = bimestre;
      const match = String(bimestre).match(/^(\d+)/);
      if (match) {
        bimestreNumerico = match[1];
      }

      const payload = {
        alunoId: Number(alunoId),
        bimestre: bimestreNumerico,
        responsabilidade: Number(avaliacoes.responsabilidade),
        participacao: Number(avaliacoes.participacao),
        comportamento: Number(avaliacoes.comportamento),
      };

      console.log('Enviando para /avaliar-comportamento:', payload);

      const response = await apiClient.post(`/avaliar-comportamento`, payload);

      console.log('Avaliação de comportamento salva com sucesso!');
      console.log('   Resposta:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('Erro ao salvar avaliação de comportamento:', error);
      console.error('   Status:', error.response?.status);
      console.error('   Mensagem:', error.response?.data?.message || error.message);

      throw new Error(
        error.response?.data?.message || error.message || 'Erro ao salvar avaliação de comportamento'
      );
    }
  },

  /**
   * Buscar avaliações de comportamento de um aluno
   */
  buscarAvaliacoes: async (alunoId: number): Promise<any> => {
    try {
      console.log(`Buscando avaliações de comportamento do aluno ${alunoId}`);

      const response = await apiClient.get(`/comportamento/aluno/${alunoId}`);

      console.log('Avaliações encontradas:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('Erro ao buscar avaliações:', error);

      if (error.response?.status === 404) {
        return [];
      }

      throw new Error(error.response?.data?.message || 'Erro ao buscar avaliações');
    }
  },

  /**
   * DEBUG: Testar o endpoint com diferentes formatos
   * Use no console: window.testarFormatos()
   */
  testarFormatos: async () => {
    const formatosTeste = [
      {
        nome: 'bimestre como número (1)',
        payload: {
          alunoId: 13,
          bimestre: 1,
          responsabilidade: 3,
          participacao: 3,
          comportamento: 3
        }
      },
      {
        nome: 'bimestre como string ("1")',
        payload: {
          alunoId: 13,
          bimestre: "1",
          responsabilidade: 3,
          participacao: 3,
          comportamento: 3
        }
      },
      {
        nome: 'bimestre como string ("1º Bimestre")',
        payload: {
          alunoId: 13,
          bimestre: "1º Bimestre",
          responsabilidade: 3,
          participacao: 3,
          comportamento: 3
        }
      },
    ];

    console.log('Testando formatos do endpoint /avaliar-comportamento\n');

    for (const teste of formatosTeste) {
      try {
        console.log(` ${teste.nome}`);
        console.log(`   Payload: ${JSON.stringify(teste.payload)}`);
        
        const response = await apiClient.post('/avaliar-comportamento', teste.payload);
        
        console.log(`SUCESSO! Formato correto: "${teste.nome}"`);
        console.log(`   Resposta: ${JSON.stringify(response.data)}\n`);
        return response.data;
      } catch (err: any) {
        console.log(`Falhou - Status: ${err.response?.status}\n`);
      }
    }

    console.log('Nenhum dos formatos funcionou!');
  },

  /**
   * Obter URL da foto
   */
  getFotoUrl: (filename: string | null, tipo: 'aluno' | 'professor' = 'aluno'): string => {
    if (!filename) {
      return `https://api.dicebear.com/7.x/avataaars/svg?seed=${tipo}`;
    }
    return `http://localhost:8080/uploads/${filename}`;
  }
};