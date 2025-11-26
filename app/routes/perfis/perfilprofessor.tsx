import * as React from "react";
import { useSearchParams, useNavigate } from "react-router";
import { BookOpen, ArrowLeft, Users, GraduationCap, Pencil, Loader2, AlertCircle } from "lucide-react";
import { perfilService, type ProfessorDetalhes } from "~/services/perfilService";

export default function PerfilProfessorRoute() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const professorId = searchParams.get('professorId');
  const from = searchParams.get('from') || 'admin';

  const [professor, setProfessor] = React.useState<ProfessorDetalhes | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (professorId) {
      carregarPerfil();
    } else {
      setError('ID do professor não fornecido');
      setLoading(false);
    }
  }, [professorId]);

  async function carregarPerfil() {
    if (!professorId) return;
    
    setLoading(true);
    setError(null);

    try {
      console.log('🔍 Tentando carregar perfil do professor:', professorId);
      const dados = await perfilService.buscarPerfilProfessor(Number(professorId));
      console.log('✅ Dados do professor recebidos:', dados);
      setProfessor(dados);
    } catch (err: any) {
      console.error('❌ Erro detalhado ao carregar perfil:', {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status,
        stack: err.stack
      });
      
      const mensagemErro = err.response?.data?.message || err.message || 'Erro ao carregar perfil do professor';
      setError(mensagemErro);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background dark:bg-gray-900 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
          <p className="text-muted-foreground">Carregando perfil do professor...</p>
        </div>
      </div>
    );
  }

  if (error || !professor) {
    return (
      <div className="min-h-screen bg-background dark:bg-gray-900 flex items-center justify-center">
        <div className="bg-destructive/10 border border-destructive text-destructive px-6 py-4 rounded-md max-w-md">
          <div className="flex items-center gap-2 mb-2">
            <AlertCircle className="h-5 w-5" />
            <h3 className="font-semibold">Erro ao carregar perfil</h3>
          </div>
          <p className="text-sm">{error || 'Professor não encontrado'}</p>
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
              src={perfilService.getFotoUrl(professor.foto, 'professor')}
              alt={professor.nome}
              className="w-10 h-10 rounded-full"
            />
            <div>
              <p className="text-sm font-semibold text-foreground">Perfil do Professor</p>
              <p className="text-xs text-muted-foreground">{professor.nome}</p>
            </div>
          </div>
        </div>

        {from === 'admin' && (
          <button
            onClick={() => console.log('Editar professor', professorId)}
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
            Perfil do Professor
          </h1>
          <p className="text-muted-foreground">
            Informações detalhadas sobre o professor
          </p>
        </div>

        <div className="grid grid-cols-12 gap-6 h-[calc(100%-8rem)]">
          {/* Sidebar */}
          <div className="col-span-3 h-full">
            <div className="bg-card dark:bg-gray-800 rounded-2xl shadow-sm border border-border p-6 flex flex-col items-center h-full">
              <img
                src={perfilService.getFotoUrl(professor.foto, 'professor')}
                alt={professor.nome}
                className="w-32 h-32 rounded-full mb-4"
              />
              <h2 className="text-xl font-bold text-foreground mb-1">{professor.nome}</h2>
              <p className="text-sm text-muted-foreground mb-4">{professor.departamento}</p>
              
              <div className={`px-3 py-1 rounded-full text-xs font-medium mb-6 ${
                professor.status?.toLowerCase() === "ativo" 
                  ? "bg-accent text-accent-foreground" 
                  : "bg-destructive/10 text-destructive"
              }`}>
                {professor.status || 'Ativo'}
              </div>

              <div className="w-full space-y-4">
                <div className="flex items-center gap-3 text-foreground">
                  <GraduationCap className="w-5 h-5 text-primary" />
                  <div>
                    <p className="text-xs text-muted-foreground">Idade</p>
                    <p className="text-sm font-medium">
                      {professor.idade ? `${professor.idade} anos` : 'Não informada'}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 text-foreground">
                  <Users className="w-5 h-5 text-primary" />
                  <div>
                    <p className="text-xs text-muted-foreground">Turmas</p>
                    <p className="text-sm font-medium">{professor.totalTurmas} turmas</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-foreground">
                  <BookOpen className="w-5 h-5 text-primary" />
                  <div>
                    <p className="text-xs text-muted-foreground">Departamento</p>
                    <p className="text-sm font-medium">{professor.departamento}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="col-span-9 space-y-6 overflow-auto">
            {/* Informações de Contato */}
            <div className="bg-card dark:bg-gray-800 rounded-2xl shadow-sm border border-border p-6">
              <h3 className="text-lg font-bold text-foreground mb-4">Informações de Contato</h3>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Email</p>
                  <p className="text-sm font-medium text-foreground">{professor.email}</p>
                </div>
                <div>
                </div>
              </div>
            </div>

            {/* Turmas Lecionadas */}
            <div className="bg-card dark:bg-gray-800 rounded-2xl shadow-sm border border-border p-6">
              <h3 className="text-lg font-bold text-foreground mb-4">Turmas Lecionadas</h3>
              <div className="grid grid-cols-4 gap-3">
                {professor.turmasLecionadas.map((turma, index) => (
                  <div
                    key={index}
                    className="bg-primary/10 border border-primary/20 rounded-lg p-4 text-center"
                  >
                    <p className="text-sm font-bold text-primary">{turma}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Estatísticas */}
            <div className="bg-card dark:bg-gray-800 rounded-2xl shadow-sm border border-border p-6">
              <h3 className="text-lg font-bold text-foreground mb-4">Estatísticas</h3>
              <div className="grid grid-cols-3 gap-6">
                <div className="bg-primary/10 border border-primary/30 rounded-lg p-4">
                  <p className="text-xs text-primary mb-1">Total de Alunos</p>
                  <p className="text-2xl font-bold text-primary">{professor.totalAlunos}</p>
                </div>
                <div className="bg-accent/20 border border-accent/40 rounded-lg p-4">
                  <p className="text-xs text-foreground mb-1">Turmas Ativas</p>
                  <p className="text-2xl font-bold text-foreground">{professor.totalTurmas}</p>
                </div>
                <div className="bg-muted/50 border border-border rounded-lg p-4">
                  <p className="text-xs text-muted-foreground mb-1">Departamento</p>
                  <p className="text-lg font-bold text-foreground">{professor.departamento}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
