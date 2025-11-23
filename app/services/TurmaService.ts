import api from './api';

export interface TurmaSimplificada {
  id: number;
  nome: string;
}

export const turmaService = {
  async listarTurmasDoProfessor(): Promise<TurmaSimplificada[]> {
    try {
      const response = await api.get<TurmaSimplificada[]>('/professor/dashboard/turmas');
      return response.data;
    } catch (error) {
      console.error('Erro ao listar turmas:', error);
      return [
        { id: 1, nome: "1º A" },
        { id: 2, nome: "1º B" },
        { id: 3, nome: "2º A" },
        { id: 4, nome: "2º B" },
      ];
    }
  },
};