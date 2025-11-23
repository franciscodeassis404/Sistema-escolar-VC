import api from './api';

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

export interface FiltroAlunos {
  page?: number;
  size?: number;
  idTurma?: number | null;
  busca?: string;
  statusComportamento?: string;
}

export const alunoService = {
  /**
   * Lista alunos com filtros e paginação
   */
  async listar(filtros: FiltroAlunos = {}): Promise<PageResponse<AlunoCard>> {
    try {
      const params = new URLSearchParams();

      if (filtros.page !== undefined) params.append('page', String(filtros.page));
      if (filtros.size !== undefined) params.append('size', String(filtros.size));
      if (filtros.idTurma) params.append('idTurma', String(filtros.idTurma));
      if (filtros.busca) params.append('busca', filtros.busca);
      if (filtros.statusComportamento) params.append('statusComportamento', filtros.statusComportamento);

      const response = await api.get<PageResponse<AlunoCard>>(
        `/professor/dashboard/alunos?${params.toString()}`
      );

      return response.data;
    } catch (error) {
      console.error('Erro ao listar alunos:', error);
      throw new Error('Erro ao carregar lista de alunos');
    }
  },
  async buscarPerfil(idAluno: number) {
    try {
      const response = await api.get(`/aluno/dashboard/perfil/${idAluno}`);
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar perfil do aluno:', error);
      throw new Error('Erro ao carregar perfil do aluno');
    }
  },
  async buscarHistoricoComportamento(idAluno: number) {
    try {
      const response = await api.get(`/aluno/dashboard/${idAluno}/comportamento`);
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar histórico:', error);
      throw new Error('Erro ao carregar histórico de comportamento');
    }
  },
  getFotoUrl(foto: string | null): string {
    if (!foto) return `https://api.dicebear.com/7.x/avataaars/svg?seed=default`;
    return `http://localhost:8080/uploads/${foto}`;
  },
};