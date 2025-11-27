import { apiClient } from './api-client';

export const uploadService = {
  /**
   * Upload de foto do aluno
   */
  uploadFotoAluno: async (idAluno: number, file: File): Promise<void> => {
    try {
      const formData = new FormData();
      formData.append('file', file);

      await apiClient.post(`/upload/aluno/${idAluno}/foto`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log('✅ Upload concluído com sucesso!');
    } catch (error: any) {
      console.error('❌ Erro no upload:', error);
      throw new Error(error.response?.data?.error || 'Erro ao fazer upload da foto');
    }
  },

  /**
   * Deletar foto do aluno
   */
  deletarFotoAluno: async (idAluno: number): Promise<void> => {
    try {
      await apiClient.delete(`/upload/aluno/${idAluno}/foto`);
      console.log('✅ Foto deletada com sucesso!');
    } catch (error: any) {
      console.error('❌ Erro ao deletar foto:', error);
      throw new Error(error.response?.data?.error || 'Erro ao deletar foto');
    }
  },

  /**
   * Buscar URL da foto do aluno
   */
  buscarFotoAluno: async (idAluno: number): Promise<string | null> => {
    try {
      const response = await apiClient.get(`/upload/aluno/${idAluno}/foto`);
      return response.data.fileUrl || null;
    } catch (error) {
      return null;
    }
  },
};