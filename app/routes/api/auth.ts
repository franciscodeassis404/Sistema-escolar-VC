// API Route para autenticação
import type { ActionFunctionArgs } from "react-router";

const API_BASE_URL = process.env.VITE_API_URL || 'http://localhost:8080/api';

export async function action({ request }: ActionFunctionArgs) {
  if (request.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  try {
    const credentials = await request.json();

    // Fazer login no backend Java
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      return new Response(JSON.stringify({
        error: error.message || 'Credenciais inválidas',
      }), { 
        status: response.status,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const data = await response.json();
    
    // Retornar dados incluindo token
    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { 
        'Content-Type': 'application/json',
        // Opcional: Definir cookie httpOnly aqui para mais segurança
        // 'Set-Cookie': `token=${data.token}; HttpOnly; Secure; SameSite=Strict`,
      },
    });

  } catch (error) {
    console.error('Erro no login:', error);
    return new Response(JSON.stringify({
      error: 'Erro ao conectar com o servidor',
    }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
