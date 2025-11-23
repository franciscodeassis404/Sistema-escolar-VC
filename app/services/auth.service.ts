import { api } from './api';

export interface LoginCredentials {
  email: string;
  senha: string;
}

export interface AuthResponse {
  token: string;
  tipo: string;
  idUsuario: number;
  nome: string;
  email: string;
  perfil: 'ALUNO' | 'PROFESSOR' | 'ADMIN';
}

export const authService = {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/api/auth', credentials);
    
    // Salvar token e dados do usuário
    localStorage.setItem('authToken', response.token);
    localStorage.setItem('user', JSON.stringify({
      id: response.idUsuario,
      nome: response.nome,
      email: response.email,
      perfil: response.perfil,
    }));
    
    return response;
  },
  
  logout(): void {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
  },
  
  getCurrentUser(): { id: number; nome: string; email: string; perfil: string } | null {
    const userStr = localStorage.getItem('user');
    if (!userStr) return null;
    
    try {
      return JSON.parse(userStr);
    } catch {
      return null;
    }
  },
  
  isAuthenticated(): boolean {
    return !!localStorage.getItem('authToken');
  },
  
  getToken(): string | null {
    return localStorage.getItem('authToken');
  },
};
