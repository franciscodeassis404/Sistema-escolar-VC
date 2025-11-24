# Integração Backend - Sistema Escolar VC

## Resumo das Alterações

Este documento descreve as mudanças realizadas para integrar o frontend com o backend, substituindo dados fictícios por chamadas às APIs usando Axios.

## Arquivos Criados

### 1. `app/services/professorService.ts`
Serviço para gerenciar operações relacionadas a professores.

**Funcionalidades:**
- `listar()` - Lista professores com paginação e filtros
- `buscarPorId()` - Busca detalhes de um professor específico
- `getFotoUrl()` - Obtém URL da foto do professor

**Endpoints utilizados:**
- `GET /admin/dashboard/professores` - Listar professores
- `GET /admin/dashboard/professores/:id` - Buscar professor por ID

### 2. `app/services/perfilService.ts`
Serviço para buscar perfis completos de alunos e professores.

**Funcionalidades:**
- `buscarPerfilAluno()` - Busca perfil completo de um aluno
- `buscarPerfilProfessor()` - Busca perfil completo de um professor
- `getFotoUrl()` - Obtém URL da foto (aluno ou professor)

**Endpoints utilizados:**
- `GET /alunos/:id/perfil` - Perfil completo do aluno
- `GET /professores/:id/perfil` - Perfil completo do professor

## Arquivos Modificados

### 1. `app/routes/admin/admin.tsx`
**Mudanças principais:**
- ✅ Removidos dados fictícios (arrays `professores` e `alunos`)
- ✅ Adicionado estado de loading e error
- ✅ Implementada paginação com `currentPage`
- ✅ Integração com `adminService.listarUsuarios()`
- ✅ Renderização dinâmica baseada em `usuarios.content`
- ✅ Suporte a filtros por tipo (ALUNO/PROFESSOR)
- ✅ Integração com `alunoService.getFotoUrl()` e `professorService.getFotoUrl()`

**Novos imports:**
```typescript
import { adminService, type UsuarioCard, type PageResponse } from "~/services/admin.service";
import { alunoService } from "~/services/alunoService";
import { professorService } from "~/services/professorService";
```

### 2. `app/routes/professor/perfilAluno.tsx`
**Mudanças principais:**
- ✅ Removidos dados fictícios (array `todosAlunos`)
- ✅ Adicionado estado de loading e error
- ✅ Implementada chamada à API via `perfilService.buscarPerfilAluno()`
- ✅ Renderização condicional com loading e erro
- ✅ Mapeamento de comportamento (`mapComportamento`)
- ✅ Uso de `perfilService.getFotoUrl()` para fotos

**Novos imports:**
```typescript
import { perfilService, type AlunoDetalhes } from "~/services/perfilService";
```

### 3. `app/routes/professor/perfilprofessor.tsx`
**Mudanças principais:**
- ✅ Removidos dados fictícios (array `todosProfessores`)
- ✅ Adicionado estado de loading e error
- ✅ Implementada chamada à API via `perfilService.buscarPerfilProfessor()`
- ✅ Renderização condicional com loading e erro
- ✅ Uso de `perfilService.getFotoUrl()` para fotos
- ✅ Atualizado para usar `totalTurmas` e `totalAlunos` do backend

**Novos imports:**
```typescript
import { perfilService, type ProfessorDetalhes } from "~/services/perfilService";
```

## Estrutura de Dados

### UsuarioCard (Admin)
```typescript
interface UsuarioCard {
  id: number;
  nome: string;
  foto: string | null;
  tipo: 'ALUNO' | 'PROFESSOR';
  status: string;
  totalTurmas?: number;
  idade?: number;
}
```

### AlunoDetalhes (Perfil)
```typescript
interface AlunoDetalhes {
  id: number;
  nome: string;
  foto: string | null;
  idade: number | null;
  turma: string;
  idMatricula: string;
  statusMatricula: string;
  statusComportamento: string;
  disciplinas: string[];
  comportamentoHistorico: {
    bimestre: string;
    meses: string;
    status: string;
  }[];
}
```

### ProfessorDetalhes (Perfil)
```typescript
interface ProfessorDetalhes {
  id: number;
  nome: string;
  foto: string | null;
  idade: number | null;
  departamento: string;
  email: string;
  telefone: string | null;
  turmasLecionadas: string[];
  totalTurmas: number;
  totalAlunos: number;
  status: string;
}
```

## Endpoints da API

### Admin
- `GET /api/admin/dashboard/usuarios` - Listar todos os usuários (alunos e professores)
  - Query params: `page`, `size`, `tipo`, `busca`
- `GET /api/admin/dashboard/professores` - Listar professores
- `GET /api/admin/dashboard/professores/:id` - Detalhes do professor

### Alunos
- `GET /api/alunos/:id/perfil` - Perfil completo do aluno

### Professores
- `GET /api/professores/:id/perfil` - Perfil completo do professor
- `GET /api/professor/dashboard/alunos` - Listar alunos (já existente)

## Recursos Implementados

### Loading States
Todas as páginas agora exibem um indicador de carregamento enquanto buscam dados:
```tsx
{loading && (
  <div className="flex items-center justify-center py-12">
    <Loader2 className="h-8 w-8 animate-spin text-primary" />
    <span className="ml-2 text-muted-foreground">Carregando...</span>
  </div>
)}
```

### Error Handling
Tratamento de erros com mensagens amigáveis ao usuário:
```tsx
{error && !loading && (
  <div className="bg-destructive/10 border border-destructive text-destructive px-4 py-3 rounded-md mb-4">
    {error}
  </div>
)}
```

### Paginação
Implementada paginação na página admin:
```tsx
{usuarios.totalPages > 1 && (
  <div className="flex justify-center items-center gap-2 mt-8">
    <Button onClick={() => setCurrentPage(p => Math.max(0, p - 1))} disabled={currentPage === 0}>
      Anterior
    </Button>
    <span>Página {currentPage + 1} de {usuarios.totalPages}</span>
    <Button onClick={() => setCurrentPage(p => Math.min(usuarios.totalPages - 1, p + 1))}>
      Próxima
    </Button>
  </div>
)}
```

## Configuração da API

O cliente Axios está configurado em `app/services/api-client.ts`:
- Base URL: `http://localhost:8080/api`
- Timeout: 10 segundos
- Headers: `Content-Type: application/json`
- Interceptor de autenticação (adiciona token JWT automaticamente)
- Interceptor de resposta (trata erros 401)

## Como Testar

### 1. Certifique-se de que o backend está rodando
```bash
# Na pasta do backend
npm run dev
# ou
java -jar sistema-escolar-backend.jar
```

### 2. Inicie o frontend
```bash
npm run dev
```

### 3. Teste as funcionalidades:
- ✅ Login como admin
- ✅ Visualizar lista de alunos e professores
- ✅ Filtrar por tipo (aluno/professor)
- ✅ Buscar por nome
- ✅ Visualizar perfil de aluno
- ✅ Visualizar perfil de professor
- ✅ Navegação entre páginas (admin → perfil → admin)

## Observações Importantes

1. **Autenticação**: O token JWT é armazenado no `localStorage` e adicionado automaticamente a todas as requisições.

2. **Fotos**: As fotos são carregadas de duas fontes:
   - Backend: `http://localhost:8080/uploads/[filename]`
   - Fallback: DiceBear API (avatares gerados)

3. **Comportamento**: O mapeamento de status de comportamento converte:
   - "excelente" → `excelente`
   - "bom" → `bom`
   - "em risco" → `ruim`

4. **Tratamento de Erros**:
   - 401: Redireciona para login
   - 403: Sem permissão
   - 404: Não encontrado
   - 500: Erro no servidor

## Próximos Passos

- [ ] Implementar edição de perfis (botão "Editar" já existe)
- [ ] Adicionar validação de formulários
- [ ] Implementar upload de fotos
- [ ] Adicionar filtros avançados (departamento, turma, etc.)
- [ ] Implementar relatórios e estatísticas
- [ ] Adicionar busca avançada com múltiplos critérios
