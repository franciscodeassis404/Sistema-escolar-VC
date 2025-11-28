import * as React from "react";
import { useSearchParams, useNavigate } from "react-router";
import { BookOpen, TrendingUp, GraduationCap, ArrowLeft, Pencil, Loader2, AlertCircle } from "lucide-react";
import { ComportamentoTag } from "~/components/ui/comportamento-tag";
import { ComportamentoAlunoTag } from "~/components/ui/ComportamentoAlunoTag";
import { Button } from "~/components/ui/button";
import { ComportamentoModal, type AvaliacaoData } from "~/components/ui/comportamentoModal";
import { perfilService, type AlunoDetalhes } from "~/services/perfilService";
import { useAvaliacoes } from "~/hooks/useAvaliacoes";

export default function PerfilAlunoRoute() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const alunoId = searchParams.get('alunoId');
  const from = searchParams.get('from') || 'admin';

  const [aluno, setAluno] = React.useState<AlunoDetalhes | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [modalAberto, setModalAberto] = React.useState(false);
  const [bimestreAtual, setBimestreAtual] = React.useState<string>('');

  const { avaliacoes, getMediaComportamentoBimestre, getMediaComportamentoGeral, adicionarAvaliacao, zerarAvaliacao } = useAvaliacoes(alunoId);

  React.useEffect(() => {
    if (alunoId) {
      carregarPerfil();
    } else {
      setError('ID do aluno não fornecido');
      setLoading(false);
    }
  }, [alunoId]);

  async function carregarPerfil() {
    if (!alunoId) return;
    
    setLoading(true);
    setError(null);

    try {
      console.log('🔍 Tentando carregar perfil do aluno:', alunoId);
      const dados = await perfilService.buscarPerfilAluno(Number(alunoId));
      console.log('✅ Dados do aluno recebidos:', dados);
      setAluno(dados);
    } catch (err: any) {
      console.error(' Erro detalhado ao carregar perfil:', {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status,
        stack: err.stack
      });
      
      const mensagemErro = err.response?.data?.message || err.message || 'Erro ao carregar perfil do aluno';
      setError(mensagemErro);
    } finally {
      setLoading(false);
    }
  }

  const mapComportamento = (status: string): "bom" | "ruim" | "excelente" => {
    switch (status?.toLowerCase()) {
      case 'excelente': return 'excelente';
      case 'bom': return 'bom';
      case 'em risco': return 'ruim';
      default: return 'bom';
    }
  };

  const handleAbrirModalAvaliacao = (bimestre: string) => {
    setBimestreAtual(bimestre);
    setModalAberto(true);
  };

  const handleSalvarAvaliacao = async (avaliacaoData: AvaliacaoData) => {
    // Salvar avaliação localmente
    adicionarAvaliacao(bimestreAtual, avaliacaoData);

    console.log('Avaliação salva localmente:', {
      alunoId,
      bimestre: bimestreAtual,
      avaliacaoData,
    });
    
    setModalAberto(false);
  };

  const handleZerarAvaliacao = () => {
    zerarAvaliacao(bimestreAtual);
    console.log(`Avaliação de ${bimestreAtual} removida`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background dark:bg-gray-900 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
          <p className="text-muted-foreground">Carregando perfil do aluno...</p>
        </div>
      </div>
    );
  }

  if (error || !aluno) {
    return (
      <div className="min-h-screen bg-background dark:bg-gray-900 flex items-center justify-center">
        <div className="bg-destructive/10 border border-destructive text-destructive px-6 py-4 rounded-md max-w-md">
          <div className="flex items-center gap-2 mb-2">
            <AlertCircle className="h-5 w-5" />
            <h3 className="font-semibold">Erro ao carregar perfil</h3>
          </div>
          <p className="text-sm">{error || 'Aluno não encontrado'}</p>
          <button
            onClick={() => navigate(`/${from}`)}
            className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
          >
            Voltar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background dark:bg-gray-900">
      {/* Navbar */}
      <nav className="w-full bg-card dark:bg-gray-800 border-b border-border px-4 sm:px-6 md:px-8 py-3 sm:py-4 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 sm:gap-3 md:gap-6 min-w-0">
          <button
            onClick={() => navigate(`/${from}`)}
            className="p-2 hover:bg-accent rounded-lg transition-colors shrink-0"
            title="Voltar"
          >
            <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground" />
          </button>
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <img
              src={perfilService.getFotoUrl(aluno.foto, 'aluno')}
              alt={aluno.nome}
              className="w-8 h-8 sm:w-10 sm:h-10 rounded-full shrink-0"
            />
            <div className="min-w-0">
              <p className="text-xs sm:text-sm font-semibold text-foreground truncate">Perfil do Aluno</p>
              <p className="text-xs text-muted-foreground truncate">{aluno.nome}</p>
            </div>
          </div>
        </div>

        {from === 'admin' && (
          <button
            onClick={() => console.log('Editar aluno', alunoId)}
            className="flex items-center gap-1 sm:gap-2 px-2 sm:px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors shrink-0 text-xs sm:text-sm"
            title="Editar perfil"
          >
            <Pencil className="w-3 h-3 sm:w-4 sm:h-4" />
            <span className="hidden sm:inline">Editar</span>
          </button>
        )}
      </nav>

      <div className="px-4 sm:px-6 md:px-8 py-6 sm:py-8 min-h-[calc(100vh-4rem)] flex flex-col">
        {/* Título */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-1 sm:mb-2">
            Perfil do Aluno
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Aqui você pode visualizar as informações e notas de comportamento do aluno
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 flex-1">
          {/* Sidebar */}
          <div className="md:col-span-1">
            <div className="bg-card dark:bg-gray-800 rounded-2xl shadow-sm border border-border p-4 sm:p-6 flex flex-col items-center h-full sticky top-4">
              <img
                src={perfilService.getFotoUrl(aluno.foto, 'aluno')}
                alt={aluno.nome}
                className="w-20 h-20 sm:w-24 sm:h-24 rounded-full mb-3 sm:mb-4 border-4 border-primary/20"
              />
              
              <h2 className="text-base sm:text-lg font-semibold text-foreground text-center mb-1 line-clamp-2">
                {aluno.nome}
              </h2>
              
              <p className="text-xs sm:text-sm text-muted-foreground mb-3 truncate">{aluno.turma}</p>

              <div className="mb-4">
                <ComportamentoAlunoTag alunoId={alunoId} showMedia={true} />
              </div>

              <div className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground">
                <BookOpen className="w-3 h-3 sm:w-4 sm:h-4 shrink-0" />
                <span>{aluno.disciplinas.length} disciplinas</span>
              </div>
            </div>
          </div>

          <div className="md:col-span-2 lg:col-span-3 flex flex-col gap-4 sm:gap-6">
            {/* INFORMAÇÕES PESSOAIS */}
            <div className="bg-card dark:bg-gray-800 rounded-2xl shadow-sm border border-border p-4 sm:p-6">
              <h2 className="flex items-center gap-2 text-base sm:text-lg font-semibold text-foreground mb-4 sm:mb-6">
                <GraduationCap className="w-4 h-4 sm:w-5 sm:h-5 text-primary shrink-0" />
                Informações Pessoais
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-8">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Idade</p>
                  <p className="text-sm sm:text-base font-semibold text-foreground">
                    {aluno.idade ? `${aluno.idade} anos` : 'Não informada'}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-muted-foreground mb-1">Turma</p>
                  <p className="text-sm sm:text-base font-semibold text-foreground">{aluno.turma}</p>
                </div>

                <div>
                  <p className="text-xs text-muted-foreground mb-1">ID Matrícula</p>
                  <p className="text-sm sm:text-base font-semibold text-foreground">{aluno.idMatricula}</p>
                </div>

                <div>
                  <p className="text-xs text-muted-foreground mb-1">Status</p>
                  <span className={`inline-block text-white text-xs font-medium px-3 py-1 rounded-full whitespace-nowrap ${
                    aluno.statusMatricula?.toLowerCase() === "matriculado" 
                      ? "bg-green-500" 
                      : "bg-yellow-500"
                  }`}>
                    {aluno.statusMatricula || 'Matriculado'}
                  </span>
                </div>
              </div>
            </div>

            {/* DISCIPLINAS */}
            <div className="bg-card dark:bg-gray-800 rounded-2xl shadow-sm border border-border p-4 sm:p-6">
              <h2 className="flex items-center gap-2 text-base sm:text-lg font-semibold text-foreground mb-4 sm:mb-6">
                <BookOpen className="w-4 h-4 sm:w-5 sm:h-5 text-primary shrink-0" />
                Disciplinas Cadastradas
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3">
                {aluno.disciplinas.map((disciplina, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 bg-primary/10 text-primary dark:bg-primary/20 dark:text-blue-300 px-3 sm:px-4 py-2 sm:py-3 rounded-xl text-xs sm:text-sm"
                  >
                    <div className="w-6 h-6 sm:w-8 sm:h-8 bg-primary rounded-lg flex items-center justify-center shrink-0">
                      <BookOpen className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                    </div>
                    <span className="font-medium truncate">{disciplina}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* HISTÓRICO DE COMPORTAMENTO */}
            <div className="bg-card dark:bg-gray-800 rounded-2xl shadow-sm border border-border p-4 sm:p-6">
              <h2 className="flex items-center gap-2 text-base sm:text-lg font-semibold text-foreground mb-4 sm:mb-6">
                <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-primary shrink-0" />
                Histórico de Comportamento
              </h2>

              <div className="space-y-2 sm:space-y-3">
                {aluno.comportamentoHistorico.map((item, index) => {
                  const mediaData = getMediaComportamentoBimestre(item.bimestre);
                  const temNota = mediaData !== null;
                  const labelBotao = temNota ? 'Editar Comportamento' : 'Avaliar Comportamento';
                  const tituloAbas = temNota ? `Editar comportamento do ${item.bimestre}` : `Avaliar comportamento do ${item.bimestre}`;

                  return (
                    <div
                      key={index}
                      className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 bg-primary/10 text-gray-50 dark:bg-primary/20 px-4 sm:px-6 py-3 sm:py-4 rounded-xl"
                    >
                      <div>
                        <p className="text-xs sm:text-sm font-semibold text-foreground">{item.bimestre}</p>
                        <p className="text-xs text-muted-foreground">{item.meses}</p>
                      </div>
                      <div className="flex items-center gap-2 sm:gap-4 shrink-0">
                        {temNota && mediaData && (
                          <div className="flex items-center gap-1 sm:gap-2">
                            <ComportamentoTag tipo={mediaData.tipo} />
                            <span className="text-xs text-muted-foreground font-medium">
                              ({mediaData.media.toFixed(1)})
                            </span>
                          </div>
                        )}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleAbrirModalAvaliacao(item.bimestre)}
                          className="flex items-center gap-1 sm:gap-2 rounded-md bg-primary hover:bg-accent dark:bg-primary/30 dark:hover:bg-primary/40 text-xs sm:text-sm px-2 sm:px-3"
                          title={tituloAbas}
                        >
                          <Pencil className="w-3 h-3 sm:w-4 sm:h-4 shrink-0" />
                          {labelBotao}
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      <ComportamentoModal
        isOpen={modalAberto}
        onClose={() => setModalAberto(false)}
        bimestre={bimestreAtual}
        alunoId={Number(alunoId) || 0}
        onSubmit={handleSalvarAvaliacao}
        onZerar={handleZerarAvaliacao}
        isLoading={false}
      />
    </div>
  );
}
