import { apiClient } from './api-client';

export interface ProfessorCard {
  id: number;
  nome: string;
  foto: string | null;
  idade: number | null;
  departamento: string;
  totalTurmas: number;
  status: string;
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

export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}

interface ListarProfessoresParams {
  page?: number;
  size?: number;
  departamento?: string;
  busca?: string;
}

export const professorService = {
  /**
   * Listar professores com paginação e filtros
   */
  listar: async (params: ListarProfessoresParams): Promise<PageResponse<ProfessorCard>> => {
    try {
      const response = await apiClient.get<PageResponse<ProfessorCard>>(
        '/admin/dashboard/professores',
        {
          params: {
            page: params.page || 0,
            size: params.size || 9,
            departamento: params.departamento,
            busca: params.busca
          }
        }
      );
      return response.data;
    } catch (error: any) {
      console.error('❌ Erro ao listar professores:', error);
      throw error;
    }
  },

  /**
   * Buscar detalhes de um professor específico
   */
  buscarPorId: async (id: number): Promise<ProfessorDetalhes> => {
    try {
      const response = await apiClient.get<ProfessorDetalhes>(
        `/admin/dashboard/professores/${id}`
      );
      return response.data;
    } catch (error: any) {
      console.error('❌ Erro ao buscar professor:', error);
      throw error;
    }
  },

  /**
   * Obter URL da foto do professor
   */
  getFotoUrl: (filename: string | null): string => {
    if (!filename) return 'https://api.dicebear.com/7.x/avataaars/svg?seed=professor';
    return `http://localhost:8080/uploads/${filename}`;
  }
};
