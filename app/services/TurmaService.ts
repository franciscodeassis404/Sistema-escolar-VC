import { apiClient } from './api-client';

export interface TurmaSimplificada {
  id: number;
  nome: string;
}

export const turmaService = {
  listarTurmasDoProfessor: async (): Promise<TurmaSimplificada[]> => {
    try {
      const response = await apiClient.get<TurmaSimplificada[]>('/professor/dashboard/turmas');
      return response.data;
    } catch (error) {
      console.error('Erro ao carregar turmas:', error);
      return [];
    }
  }
};