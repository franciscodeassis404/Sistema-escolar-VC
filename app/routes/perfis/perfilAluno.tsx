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

  const { avaliacoes, getMediaComportamentoBimestre, getMediaComportamentoGeral, adicionarAvaliacao } = useAvaliacoes(alunoId);;

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
      console.error('❌ Erro detalhado ao carregar perfil:', {
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
      <nav className="w-full bg-card dark:bg-gray-800 border-b border-border px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <button
            onClick={() => navigate(`/${from}`)}
            className="p-2 hover:bg-accent rounded-lg transition-colors"
            title="Voltar"
          >
            <ArrowLeft className="w-5 h-5 text-muted-foreground" />
          </button>
          <div className="flex items-center gap-3">
            <img
              src={perfilService.getFotoUrl(aluno.foto, 'aluno')}
              alt={aluno.nome}
              className="w-10 h-10 rounded-full"
            />
            <div>
              <p className="text-sm font-semibold text-foreground">Perfil do Aluno</p>
              <p className="text-xs text-muted-foreground">{aluno.nome}</p>
            </div>
          </div>
        </div>

        {from === 'admin' && (
          <button
            onClick={() => console.log('Editar aluno', alunoId)}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
            title="Editar perfil"
          >
            <Pencil className="w-4 h-4" />
            Editar
          </button>
        )}
      </nav>

      <div className="px-8 py-8 h-[calc(100vh-4rem)]">
        {/* Título */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Perfil do Aluno
          </h1>
          <p className="text-muted-foreground">
            Aqui você pode visualizar as informações e notas de comportamento do aluno
          </p>
        </div>

        <div className="grid grid-cols-12 gap-6 h-[calc(100%-8rem)]">
          {/* Sidebar */}
          <div className="col-span-3 h-full">
            <div className="bg-card dark:bg-gray-800 rounded-2xl shadow-sm border border-border p-6 flex flex-col items-center h-full">
              <img
                src={perfilService.getFotoUrl(aluno.foto, 'aluno')}
                alt={aluno.nome}
                className="w-24 h-24 rounded-full mb-4 border-4 border-primary/20"
              />
              
              <h2 className="text-lg font-semibold text-foreground text-center mb-1">
                {aluno.nome}
              </h2>
              
              <p className="text-sm text-muted-foreground mb-3">{aluno.turma}</p>

              <div className="mb-4">
                <ComportamentoAlunoTag alunoId={alunoId} showMedia={true} />
              </div>

              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <BookOpen className="w-4 h-4" />
                <span>{aluno.disciplinas.length} disciplinas</span>
              </div>
            </div>
          </div>

          <div className="col-span-9 flex flex-col gap-6 h-full overflow-y-auto">
            {/* INFORMAÇÕES PESSOAIS */}
            <div className="bg-card dark:bg-gray-800 rounded-2xl shadow-sm border border-border p-6">
              <h2 className="flex items-center gap-2 text-lg font-semibold text-foreground mb-6">
                <GraduationCap className="w-5 h-5 text-primary" />
                Informações Pessoais
              </h2>

              <div className="grid grid-cols-3 gap-8">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Idade</p>
                  <p className="text-base font-semibold text-foreground">
                    {aluno.idade ? `${aluno.idade} anos` : 'Não informada'}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-muted-foreground mb-1">Turma</p>
                  <p className="text-base font-semibold text-foreground">{aluno.turma}</p>
                </div>

                <div></div>

                <div>
                  <p className="text-xs text-muted-foreground mb-1">ID Matrícula</p>
                  <p className="text-base font-semibold text-foreground">{aluno.idMatricula}</p>
                </div>

                <div>
                  <p className="text-xs text-muted-foreground mb-1">Status</p>
                  <span className={`inline-block text-white text-xs font-medium px-3 py-1 rounded-full ${
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
            <div className="bg-card dark:bg-gray-800 rounded-2xl shadow-sm border border-border p-6">
              <h2 className="flex items-center gap-2 text-lg font-semibold text-foreground mb-6">
                <BookOpen className="w-5 h-5 text-primary" />
                Disciplinas Cadastradas
              </h2>

              <div className="grid grid-cols-3 gap-3">
                {aluno.disciplinas.map((disciplina, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 bg-primary/10 text-primary dark:bg-primary/20 dark:text-blue-300 px-4 py-3 rounded-xl"
                  >
                    <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                      <BookOpen className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-sm font-medium">{disciplina}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* HISTÓRICO DE COMPORTAMENTO */}
            <div className="bg-card dark:bg-gray-800 rounded-2xl shadow-sm border border-border p-6">
              <h2 className="flex items-center gap-2 text-lg font-semibold text-foreground mb-6">
                <TrendingUp className="w-5 h-5 text-primary" />
                Histórico de Comportamento
              </h2>

              <div className="space-y-3">
                {aluno.comportamentoHistorico.map((item, index) => {
                  const mediaData = getMediaComportamentoBimestre(item.bimestre);
                  const temNota = mediaData !== null;
                  const labelBotao = temNota ? 'Editar Comportamento' : 'Avaliar Comportamento';
                  const tituloAbas = temNota ? `Editar comportamento do ${item.bimestre}` : `Avaliar comportamento do ${item.bimestre}`;

                  return (
                    <div
                      key={index}
                      className="flex items-center justify-between bg-primary/10 text-gray-50 dark:bg-primary/20 px-6 py-4 rounded-xl"
                    >
                      <div>
                        <p className="text-sm font-semibold text-foreground">{item.bimestre}</p>
                        <p className="text-xs text-muted-foreground">{item.meses}</p>
                      </div>
                      <div className="flex items-center gap-4">
                        {temNota && mediaData && (
                          <div className="flex items-center gap-2">
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
                          className="flex items-center gap-2 rounded-md bg-primary hoover:bg-accent dark:bg-primary/30 dark:hover:bg-primary/40"
                          title={tituloAbas}
                        >
                          <Pencil className="w-4 h-4" />
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
        isLoading={false}
      />
    </div>
  );
}
