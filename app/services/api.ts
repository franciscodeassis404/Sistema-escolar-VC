
const API_BASE_URL = 'http://localhost:8080/api';

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  // Método genérico para fazer as requisições
  private async request<T>(
    endpoint: string,
    options?: RequestInit
  ): Promise<T> {
    // 1. Pega o token (Padronizado com o nome que ela usou: 'authToken')
    const token = localStorage.getItem('authToken');

    // Garante que a URL não fique com barras duplas (ex: http://...//auth)
    const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
    const url = `${this.baseUrl}${cleanEndpoint}`;

    console.log('[API Request]', {
      method: options?.method || 'GET',
      url,
      hasToken: !!token,
    });

    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          // Adiciona o Token se existir (Lógica do seu interceptor)
          ...(token && { Authorization: `Bearer ${token}` }),
          ...options?.headers,
        },
      });

      console.log('[API Response]', {
        status: response.status,
        url,
      });

      // 2. Tratamento de Erros Globais (Sua lógica do axios trazida para o fetch)
      if (!response.ok) {
        // Erro 401: Token expirado ou inválido -> Logout forçado
        if (response.status === 401) {
          console.warn('Sessão expirada. Redirecionando para login...');
          localStorage.removeItem('authToken');
          localStorage.removeItem('usuario');
          window.location.href = '/'; // Redireciona para a home/login
          throw new Error('Sessão expirada');
        }

        // Erro 403: Sem permissão
        if (response.status === 403) {
          console.error('Você não tem permissão para acessar este recurso');
        }

        // Tenta pegar a mensagem de erro do JSON do Back-end
        const error = await response.json().catch(() => ({}));
        throw new Error(error.message || `Erro ${response.status}: ${response.statusText}`);
      }

      // Se for 204 (No Content), retorna null, senão faz o parse do JSON
      if (response.status === 204) return {} as T;
      return response.json();

    } catch (error) {
      console.error('[API Error]', {
        url,
        error: error instanceof Error ? error.message : 'Unknown error',
      });
      throw error;
    }
  }

  // Métodos públicos (Mantendo a estrutura dela para não quebrar o projeto)

  async get<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint);
  }

  async post<T>(endpoint: string, data: unknown): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async put<T>(endpoint: string, data: unknown): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'DELETE',
    });
  }

  // Método específico para Upload (Mantendo a lógica dela mas com sua URL)
  async uploadFile<T>(endpoint: string, formData: FormData): Promise<T> {
    const token = localStorage.getItem('authToken');
    const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;

    const response = await fetch(`${this.baseUrl}${cleanEndpoint}`, {
      method: 'POST',
      headers: {
        // Nota: Não setamos 'Content-Type' aqui para o browser definir o boundary do Multipart
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: formData,
    });

    if (!response.ok) {
        if (response.status === 401) {
            localStorage.removeItem('authToken');
            window.location.href = '/';
        }
        const error = await response.json().catch(() => ({}));
        throw new Error(error.message || `Erro no upload: ${response.status}`);
    }

    return response.json();
  }
}

// Exporta a instância pronta para uso
export const api = new ApiClient(API_BASE_URL);