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
   * Obter URL da foto
   */
  getFotoUrl: (filename: string | null, tipo: 'aluno' | 'professor' = 'aluno'): string => {
    if (!filename) {
      return `https://api.dicebear.com/7.x/avataaars/svg?seed=${tipo}`;
    }
    return `http://localhost:8080/uploads/${filename}`;
  }
};