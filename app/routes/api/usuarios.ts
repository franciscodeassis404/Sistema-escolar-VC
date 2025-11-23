// API Route - Backend For Frontend (BFF)
import type { ActionFunctionArgs } from "react-router";

const API_BASE_URL = process.env.VITE_API_URL || 'http://localhost:8080/api';

export async function action({ request }: ActionFunctionArgs) {
  if (request.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  try {
    const formData = await request.json();

    // Fazer requisição ao backend Java
    const response = await fetch(`${API_BASE_URL}/admin/dashboard/usuarios`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // Token JWT pode ser pego de cookies httpOnly aqui
      },
      body: JSON.stringify(formData),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      return new Response(JSON.stringify({
        error: error.message || `Erro ${response.status}`,
      }), { 
        status: response.status,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const data = await response.json();
    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Erro no controller:', error);
    return new Response(JSON.stringify({
      error: error instanceof Error ? error.message : 'Erro ao processar requisição',
    }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
