import { api } from './api';

export interface NovoUsuarioAluno {
  tipo: 'ALUNO';
  nomeCompleto: string;
  email: string;
  senha: string;
  confirmarSenha: string;
  dataNascimento: string;
  idTurma: number;
}

export interface NovoUsuarioProfessor {
  tipo: 'PROFESSOR';
  nomeCompleto: string;
  email: string;
  senha: string;
  confirmarSenha: string;
  matricula: string;
  especialidade: string;
}

export interface NovoUsuarioAdmin {
  tipo: 'ADMIN';
  nomeCompleto: string;
  email: string;
  senha: string;
  confirmarSenha: string;
}

export type NovoUsuario = NovoUsuarioAluno | NovoUsuarioProfessor | NovoUsuarioAdmin;

export const adminService = {
  // Criar novo usuário através da rota API interna
  async createUsuario(usuario: NovoUsuario): Promise<any> {
    return api.post<any>('/api/usuarios', usuario);
  },
};
