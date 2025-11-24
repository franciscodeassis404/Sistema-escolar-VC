import { apiClient } from './api-client';

export interface AlunoCard {
  id: number;
  nome: string;
  foto: string | null;
  idade: number | null;
  statusComportamento: string;
  statusCor: string;
  totalDisciplinas: number;
}

export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}

interface ListarAlunosParams {
  page?: number;
  size?: number;
  idTurma?: number | null;
  busca?: string;
  statusComportamento?: string;
}

export const alunoService = {
  listar: async (params: ListarAlunosParams): Promise<PageResponse<AlunoCard>> => {
    
    const response = await apiClient.get<PageResponse<AlunoCard>>(
      '/professor/dashboard/alunos',
      {
        params: {
          page: params.page || 0,
          size: params.size || 9,
          idTurma: params.idTurma,
          busca: params.busca,
          statusComportamento: params.statusComportamento
        }
      }
    );
    return response.data;
  },

  getFotoUrl: (filename: string | null): string => {
    if (!filename) return 'https://api.dicebear.com/7.x/avataaars/svg?seed=default';
    return `http://localhost:8080/uploads/${filename}`;
  }
};