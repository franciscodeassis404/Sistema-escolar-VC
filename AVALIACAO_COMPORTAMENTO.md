# Sistema de Avaliação de Comportamento

## Resumo

Implementação completa do sistema de avaliação de comportamento de alunos com integração ao backend via endpoint `/api/comportamento`.

## Funcionalidades Implementadas

### 1. Modal de Avaliação de Comportamento

**Arquivo:** `app/components/ui/comportamentoModal.tsx`

Componente de modal que permite avaliar o comportamento do aluno em 3 critérios:

- **Responsabilidade**: Cumpre com compromissos e atividades propostas
- **Participação**: Engajamento e contribuição nas aulas
- **Comportamento**: Respeito e conduta em sala de aula

#### Sistema de Notas com Emojis (1-5)

| Nota | Emoji | Label | Significado |
|------|-------|-------|-------------|
| 1 | 😞 | Insatisfatório | Comportamento insatisfatório |
| 2 | 😕 | Precisa melhorar | Necessita de melhorias |
| 3 | 😐 | Satisfatório | Atende ao esperado |
| 4 | 😊 | Bom | Bom comportamento |
| 5 | 🤩 | Excelente | Comportamento excelente |

#### Características do Modal

- ✅ Interface intuitiva com emojis grandes
- ✅ Validação para garantir que todos os critérios sejam avaliados
- ✅ Feedback visual (destaque com borda e escala ao selecionar)
- ✅ Estado de carregamento durante envio
- ✅ Botões de Cancelar e Salvar Avaliação
- ✅ Responsivo e acessível

### 2. Integração com Backend

**Arquivo:** `app/services/perfilService.ts`

Novos métodos implementados:

#### `salvarAvaliacaoComportamento(alunoId, bimestre, avaliacoes)`

```typescript
await perfilService.salvarAvaliacaoComportamento(
  123,  // alunoId
  '1º Bimestre',  // bimestre
  {
    responsabilidade: 4,
    participacao: 5,
    comportamento: 4
  }
);
```

**Endpoint:** `POST /api/comportamento`

**Payload:**
```json
{
  "alunoId": 123,
  "bimestre": "1º Bimestre",
  "responsabilidade": 4,
  "participacao": 5,
  "comportamento": 4
}
```

#### `buscarAvaliacoes(alunoId)`

```typescript
const avaliacoes = await perfilService.buscarAvaliacoes(123);
```

**Endpoint:** `GET /api/comportamento/aluno/{alunoId}`

**Resposta esperada:**
```json
{
  "alunoId": 123,
  "avaliacoes": [
    {
      "bimestre": "1º Bimestre",
      "responsabilidade": 4,
      "participacao": 5,
      "comportamento": 4,
      "media": 4.33
    }
  ]
}
```

### 3. Integração na Página de Perfil do Aluno

**Arquivo:** `app/routes/perfis/perfilAluno.tsx`

#### Estados Adicionados

```typescript
const [modalAberto, setModalAberto] = React.useState(false);
const [bimestreAtual, setBimestreAtual] = React.useState<string>('');
const [salvarAvaliacao, setSalvarAvaliacao] = React.useState(false);
```

#### Funções Implementadas

##### `handleAbrirModalAvaliacao(bimestre)`
Abre o modal quando o professor clica em "Avaliar Comportamento" ou "Editar Comportamento"

##### `handleSalvarAvaliacao(avaliacoes)`
- Chama `perfilService.salvarAvaliacaoComportamento()`
- Recarrega o perfil do aluno
- Mostra mensagem de sucesso ou erro

#### Fluxo de Funcionamento

1. Professor/Admin clica no botão "Avaliar Comportamento"
2. Modal é aberto mostrando os 3 critérios
3. Professor seleciona uma nota de 1-5 para cada critério
4. Professor clica em "Salvar Avaliação"
5. Dados são enviados ao backend via POST `/api/comportamento`
6. Backend calcula a média das 3 avaliações
7. Perfil é recarregado e a tag de comportamento é atualizada

### 4. Tag de Comportamento Atualizada

A tag de comportamento (componente `ComportamentoTag`) exibe:

```
Comportamento: [EXCELENTE] [BOM] [RUIM]
```

Baseado na média calculada pelo backend.

#### Mapeamento de Status

| Média | Status | Classe CSS |
|-------|--------|-----------|
| 4.5 - 5.0 | excelente | bg-green-500 text-white |
| 2.5 - 4.4 | bom | bg-blue-500 text-white |
| 0 - 2.4 | ruim | bg-yellow-500 text-white |

## Estrutura de Dados

### Interface AvaliacaoData

```typescript
interface AvaliacaoData {
  responsabilidade: number;  // 1-5
  participacao: number;      // 1-5
  comportamento: number;     // 1-5
}
```

## Fluxo Completo

```
Professor/Admin visualiza perfil do aluno
        ↓
Clica em "Avaliar Comportamento" no bimestre
        ↓
Modal abre com 3 critérios de avaliação
        ↓
Professor seleciona notas (1-5 com emojis)
        ↓
Clica "Salvar Avaliação"
        ↓
POST /api/comportamento com dados
        ↓
Backend processa e calcula média
        ↓
Backend retorna resposta
        ↓
Frontend recarrega perfil do aluno
        ↓
Tag de comportamento é atualizada com a nova média
```

## Tratamento de Erros

O sistema implementa tratamento robusto de erros:

- ✅ Validação de dados obrigatórios
- ✅ Mensagens de erro amigáveis ao usuário
- ✅ Logs detalhados no console
- ✅ Retry de operações com feedback visual
- ✅ Fallback para lista vazia se endpoint retorna 404

## Próximas Implementações (Opcional)

- [ ] Histórico de avaliações anteriores
- [ ] Gráfico de evolução de comportamento
- [ ] Envio de notificações ao aluno
- [ ] Relatório de comportamento por período
- [ ] Exportação de avaliações em PDF

## Como Testar

1. Certifique-se de que o backend está rodando com o endpoint `/api/comportamento`
2. Acesse a página de perfil de um aluno
3. Clique no botão "Avaliar Comportamento" em um bimestre
4. Selecione notas para cada critério
5. Clique em "Salvar Avaliação"
6. Verifique se a tag de comportamento foi atualizada
7. Recarregue a página e confirme que a avaliação persiste

## Notas Técnicas

- O endpoint espera `POST /api/comportamento` com campos: `alunoId`, `bimestre`, `responsabilidade`, `participacao`, `comportamento`
- O backend deve calcular a média dos 3 critérios e retornar o status correspondente
- A página recarrega automaticamente após salvar para refletir as mudanças
- O estado de carregamento impede submissão duplicada
