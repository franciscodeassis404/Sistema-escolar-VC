import { apiClient } from './api-client';

// ============================================
// INTERFACES
// ============================================

export interface NovoUsuario {
  tipo: 'ALUNO' | 'PROFESSOR' | 'ADMIN';
  nomeCompleto: string;
  email: string;
  senha: string;
  confirmarSenha: string;
  // Campos específicos de Aluno
  dataNascimento?: string;
  idTurma?: number;
  // Campos específicos de Professor
  matricula?: string;
  especialidade?: string;
}

export interface UsuarioCard {
  id: number;
  nome: string;
  foto: string | null;
  tipo: 'ALUNO' | 'PROFESSOR';
  status: string;
  totalTurmas?: number;
  idade?: number;
}

export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}

// ============================================
// SERVICE
// ============================================

export const adminService = {
  /**
   * Criar novo usuário (Aluno, Professor ou Admin)
   */
  createUsuario: async (usuario: NovoUsuario): Promise<UsuarioCard> => {
    try {
      console.log('📤 Criando usuário:', usuario);

      const response = await apiClient.post<UsuarioCard>(
        '/admin/dashboard/usuarios',
        usuario
      );

      console.log('✅ Usuário criado com sucesso:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('❌ Erro ao criar usuário:', error);

      if (error.response) {
        console.error('Response data:', error.response.data);
        console.error('Response status:', error.response.status);

        if (error.response.status === 403) {
          throw new Error('Você não tem permissão para criar usuários. Verifique se está logado como ADMIN.');
        }

        if (error.response.status === 401) {
          throw new Error('Sessão expirada. Faça login novamente.');
        }

        if (error.response.status === 400) {
          const errorMsg = error.response.data?.error || error.response.data?.message;
          throw new Error(errorMsg || 'Dados inválidos. Verifique os campos do formulário.');
        }

        throw new Error(error.response.data?.error || error.response.data?.message || 'Erro ao criar usuário');
      }

      if (error.request) {
        throw new Error('Servidor não respondeu. Verifique se o back-end está rodando.');
      }

      throw new Error(error.message || 'Erro desconhecido ao criar usuário');
    }
  },

  /**
   * Listar usuários com paginação e filtros
   */
  listarUsuarios: async (params: {
    page?: number;
    size?: number;
    tipo?: string;
    busca?: string;
  }): Promise<PageResponse<UsuarioCard>> => {
    try {
      const response = await apiClient.get<PageResponse<UsuarioCard>>(
        '/admin/dashboard/usuarios',
        { params }
      );
      return response.data;
    } catch (error: any) {
      console.error('❌ Erro ao listar usuários:', error);
      throw error;
    }
  },

  /**
   * Buscar estatísticas do dashboard
   */
  buscarEstatisticas: async () => {
    try {
      const response = await apiClient.get('/admin/dashboard/estatisticas');
      return response.data;
    } catch (error: any) {
      console.error('❌ Erro ao buscar estatísticas:', error);
      throw error;
    }
  }
};
