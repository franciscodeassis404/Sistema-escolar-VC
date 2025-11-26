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
   * Buscar perfil completo de um aluno
   */
  buscarPerfilAluno: async (id: number): Promise<AlunoDetalhes> => {
    try {
      console.log(`📡 Buscando perfil do aluno ${id}`);
      console.log('🌐 URL da API:', apiClient.defaults.baseURL);
      
      // Tenta primeiro o endpoint de perfil
      try {
        console.log('🔗 Tentando endpoint:', `${apiClient.defaults.baseURL}/alunos/${id}/perfil`);
        const response = await apiClient.get<AlunoDetalhes>(`/alunos/${id}/perfil`);
        console.log('✅ Perfil do aluno carregado:', response.data);
        return response.data;
      } catch (perfilError: any) {
        // Se der erro 500, tenta endpoint alternativo
        if (perfilError.response?.status === 500) {
          console.log('⚠️ Erro 500 no endpoint /perfil, tentando endpoint alternativo...');
          console.log('🔗 Tentando endpoint:', `${apiClient.defaults.baseURL}/admin/dashboard/alunos/${id}`);
          const response = await apiClient.get<AlunoDetalhes>(`/admin/dashboard/alunos/${id}`);
          console.log('✅ Perfil do aluno carregado via endpoint alternativo:', response.data);
          return response.data;
        }
        throw perfilError;
      }
    } catch (error: any) {
      console.error('❌ Erro ao buscar perfil do aluno:', error);
      
      if (error.response?.status === 404) {
        throw new Error('Aluno não encontrado');
      }
      
      throw new Error(error.response?.data?.message || 'Erro ao carregar perfil do aluno');
    }
  },

  /**
   * Buscar perfil completo de um professor
   */
  buscarPerfilProfessor: async (id: number): Promise<ProfessorDetalhes> => {
    try {
      console.log(`📡 Buscando perfil do professor ${id}`);
      console.log('🌐 URL da API:', apiClient.defaults.baseURL);
      
      // Tenta primeiro o endpoint de perfil
      try {
        console.log('🔗 Tentando endpoint:', `${apiClient.defaults.baseURL}/professores/${id}/perfil`);
        const response = await apiClient.get<ProfessorDetalhes>(`/professores/${id}/perfil`);
        console.log('✅ Perfil do professor carregado:', response.data);
        return response.data;
      } catch (perfilError: any) {
        // Se der erro 500, tenta endpoint alternativo
        if (perfilError.response?.status === 500) {
          console.log('⚠️ Erro 500 no endpoint /perfil, tentando endpoint alternativo...');
          console.log('🔗 Tentando endpoint:', `${apiClient.defaults.baseURL}/admin/dashboard/professores/${id}`);
          const response = await apiClient.get<ProfessorDetalhes>(`/admin/dashboard/professores/${id}`);
          console.log('✅ Perfil do professor carregado via endpoint alternativo:', response.data);
          return response.data;
        }
        throw perfilError;
      }
    } catch (error: any) {
      console.error('❌ Erro ao buscar perfil do professor:', error);
      
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
