import axios from 'axios';

// ANTES:
// const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

// DEPOIS (para Vite/React Router):
const API_BASE_URL = import.meta.env.VITE_API_URL;

export interface LoginRequest {
  email: string;
  senha: string;
}

export interface LoginResponse {
  token: string;
  tipo: string;
  idUsuario: number;
  nome: string;
  email: string;
  perfil: 'ALUNO' | 'PROFESSOR' | 'ADMIN';
}

export const authService = {
  login: async (credentials: LoginRequest): Promise<LoginResponse> => {
    try {
      console.log('Fazendo login com:', credentials.email);
      console.log('API URL:', API_BASE_URL); // Para debug

      const response = await axios.post<LoginResponse>(
        `${API_BASE_URL}/auth/login`,
        credentials,
        {
          headers: {
            'Content-Type': 'application/json',
            'ngrok-skip-browser-warning': 'true', 
          },
          timeout: 10000,
        }
      );

      console.log('Login bem-sucedido:', response.data);

      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data));

      return response.data;
    } catch (error: any) {
      console.error('Erro no login:', error);

      if (error.code === 'ECONNREFUSED') {
        throw new Error('Não foi possível conectar ao servidor');
      }

      if (error.response) {
        const status = error.response.status;
        const message = error.response.data?.error || error.response.data?.message;

        if (status === 401) {
          throw new Error(message || 'Email ou senha incorretos');
        }

        throw new Error(message || `Erro ${status}`);
      }

      if (error.request) {
        throw new Error('Servidor não respondeu');
      }

      throw new Error(error.message || 'Erro ao fazer login');
    }
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  getUser: (): LoginResponse | null => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  isAuthenticated: (): boolean => {
    return !!localStorage.getItem('token');
  },

  getToken: (): string | null => {
    return localStorage.getItem('token');
  }
};