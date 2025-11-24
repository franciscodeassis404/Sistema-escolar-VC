import axios from 'axios';

// URL do back-end
const API_BASE_URL = 'http://localhost:8080/api';

// Criar instância do axios
export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, 
});

// Interceptor para adicionar token JWT em TODAS as requisições
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log('🔑 Token adicionado à requisição');
    } else {
      console.warn('⚠️ Nenhum token encontrado');
    }

    console.log(`📡 ${config.method?.toUpperCase()} ${config.url}`);

    return config;
  },
  (error) => {
    console.error('❌ Erro no interceptor de request:', error);
    return Promise.reject(error);
  }
);

// Interceptor para tratar respostas
apiClient.interceptors.response.use(
  (response) => {
    console.log(`✅ Resposta: ${response.status}`, response.data);
    return response;
  },
  (error) => {
    console.error('❌ Erro na resposta:', error);

    if (error.response?.status === 401) {
      console.error('🚫 Token inválido ou expirado - redirecionando para login');
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/';
    }

    return Promise.reject(error);
  }
);