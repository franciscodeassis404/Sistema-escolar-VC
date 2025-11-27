import * as React from "react";
import {
  BookOpen,
  Info,
  User,
  ChevronRight,
  Moon,
  Sun,
  Loader2,
  AlertCircle,
} from "lucide-react";
import {Navbar} from "./../../components/ui/navbar";
import { authService } from "~/services/auth.service";
import { perfilService, type AlunoDetalhes } from "~/services/perfilService";

// CORES DE STATUS DE COMPORTAMENTO
const comportamentoColor: Record<string, string> = {
  pessimo: "bg-red-500",
  ruim: "bg-orange-500",
  mediano: "bg-yellow-500",
  bom: "bg-blue-500",
  excelente: "bg-green-500",
};

export default function AlunoDashboard() {
  const [darkMode, setDarkMode] = React.useState(false);
  const [showLogout, setShowLogout] = React.useState(false);
  const [student, setStudent] = React.useState<AlunoDetalhes | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    carregarMeuPerfil();
  }, []);

  async function carregarMeuPerfil() {
    setLoading(true);
    setError(null);

    try {
      const user = authService.getUser();
      
      if (!user || !user.idUsuario) {
        throw new Error('Usuário não autenticado');
      }

      console.log('🔍 Carregando perfil do aluno logado (ID:', user.idUsuario, ')');
      const dados = await perfilService.buscarPerfilAluno(user.idUsuario);
      console.log('✅ Perfil do aluno carregado:', dados);
      setStudent(dados);
    } catch (err: any) {
      console.error('❌ Erro ao carregar perfil:', err);
      setError(err.message || 'Erro ao carregar perfil');
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen w-full bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
          <p className="text-muted-foreground">Carregando seu perfil...</p>
        </div>
      </main>
    );
  }

  if (error || !student) {
    return (
      <main className="min-h-screen w-full bg-background flex items-center justify-center">
        <div className="bg-destructive/10 border border-destructive text-destructive px-6 py-4 rounded-md max-w-md">
          <div className="flex items-center gap-2 mb-2">
            <AlertCircle className="h-5 w-5" />
            <h3 className="font-semibold">Erro ao carregar perfil</h3>
          </div>
          <p className="text-sm">{error || 'Não foi possível carregar seu perfil'}</p>
          <button
            onClick={carregarMeuPerfil}
            className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
          >
            Tentar novamente
          </button>
        </div>
      </main>
    );
  }

  return (
      <main
        className={`min-h-screen w-full ${
          darkMode ? "dark" : ""
        } transition-colors duration-500`}
      >
        <div className="min-h-screen w-full bg-background text-foreground transition-colors duration-500">
  
          {/* NAVBAR AQUI */}
          <Navbar tipoPerfil="aluno" />
  
          {/* CONTEÚDO */}
          <div className="px-10 py-10 animate-fadeIn">
  
            <h1 className="text-3xl font-bold text-foreground animate-fadeIn">
              Bem-vindo, {student?.nome.split(" ")[0]}!
            </h1>
  
            <p className="text-muted-foreground mt-1 animate-fadeIn">
              Aqui você pode visualizar suas informações e notas de comportamento
            </p>
  
            {/* GRID */}
            <div className="grid grid-cols-4 gap-10 mt-10 items-start">
  
              {/* COLUNA ESQUERDA */}
              <div className="col-span-1 animate-fadeIn">
                <div
                  className="
                    bg-card border border-border
                    shadow-sm
                    rounded-xl p-6 text-center
                    h-full w-full min-h-[980px]
                    flex flex-col items-center justify-start
                    pop card-anim glow tilt
                  "
                >
                  <img
                    src={perfilService.getFotoUrl(student.foto, 'aluno')}
                    alt={student.nome}
                    className="w-28 h-28 rounded-full mx-auto border-4 border-primary shadow-lg animate-fadeIn"
                  />
  
                  <h2 className="text-xl font-semibold text-foreground mt-4 animate-fadeIn">
                    {student.nome}
                  </h2>
  
                  <p className="text-sm text-muted-foreground animate-fadeIn">
                    {student.turma}
                  </p>
  
                  <div
                    className={`
                      mt-3 text-white rounded-full px-4 py-1 text-sm font-medium pulse animate-fadeIn
                      ${comportamentoColor[student.statusComportamento.toLowerCase()]}
                    `}
                  >
                    {student.statusComportamento.charAt(0).toUpperCase() +
                      student.statusComportamento.slice(1)}
                  </div>
  
                  <div className="flex items-center justify-center gap-2 mt-4 text-sm text-muted-foreground animate-fadeIn">
                    <BookOpen className="w-4 h-4" />
                    {student.disciplinas.length} disciplinas
                  </div>
                </div>
              </div>
  
              {/* COLUNA DIREITA */}
              <div className="col-span-3 flex flex-col gap-10 animate-fadeIn">
  
                {/* INFORMAÇÕES PESSOAIS */}
                <div
                  className="
                    bg-card border border-border
                    shadow-sm
                    rounded-xl p-6 min-h-[300px]
                    pop glow tilt card-anim
                  "
                >
                  <h2 className="flex items-center gap-2 text-lg font-semibold text-foreground animate-fadeIn">
                    <Info className="w-5 h-5 text-primary" />
                    Informações pessoais
                  </h2>
  
                  <div className="grid grid-cols-3 gap-4 mt-4 animate-fadeIn">
  
                    <div>
                      <p className="text-muted-foreground text-sm">Idade</p>
                      <p className="font-semibold text-foreground">{student.idade ? `${student.idade} anos` : 'Não informada'}</p>
  
                      <p className="text-muted-foreground text-sm mt-4">
                        ID Matrícula
                      </p>
                      <p className="font-semibold text-foreground">{student.idMatricula}</p>
                    </div>
  
                    <div>
                      <p className="text-muted-foreground text-sm">Turma</p>
                      <p className="font-semibold text-foreground">{student.turma}</p>
  
                      <p className="text-muted-foreground text-sm mt-4">Status</p>
  
                      <span
                        className={`
                          px-3 py-1 rounded-full text-sm font-medium
                          ${
                            student.statusMatricula.toLowerCase() === "matriculado"
                              ? "bg-accent text-accent-foreground"
                              : "bg-destructive text-white"
                          }
                        `}
                      >
                        {student.statusMatricula}
                      </span>
                    </div>
  
                  </div>
                </div>
  
                {/* DISCIPLINAS */}
                <div
                  className="
                    bg-card border border-border
                    shadow-sm
                    rounded-xl p-6 min-h-[300px]
                    pop glow tilt card-anim
                  "
                >
                  <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2 animate-fadeIn">
                    <User className="w-5 h-5 text-primary" />
                    Minhas disciplinas
                  </h2>
  
                  <div className="grid grid-cols-3 gap-3 animate-fadeIn">
                    {student?.disciplinas && student.disciplinas.length > 0 ? (
                      student.disciplinas.map((disciplina, index) => (
                        <div
                          key={index}
                          className="
                            px-4 py-2 rounded-lg
                            bg-muted
                            flex items-center gap-2
                            text-foreground text-sm
                            pop glow transition
                          "
                        >
                          <BookOpen className="w-4 h-4 text-primary" />
                          {disciplina}
                        </div>
                      ))
                    ) : (
                      <p className="col-span-3 text-muted-foreground text-sm">
                        Nenhuma disciplina cadastrada
                      </p>
                    )}
                  </div>
                </div>
  
                {/* HISTÓRICO DE COMPORTAMENTO */}
                <div
                  className="
                    bg-card border border-border
                    shadow-sm
                    rounded-xl p-6 min-h-[300px]
                    pop glow tilt card-anim
                  "
                >
                  <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2 animate-fadeIn">
                    <Info className="w-5 h-5 text-primary" />
                    Histórico de comportamento
                  </h2>
  
                  <div className="flex flex-col gap-4 animate-fadeIn">
                    {student?.comportamentoHistorico && student.comportamentoHistorico.length > 0 ? (
                      student.comportamentoHistorico.map((item, index) => (
                        <div
                          key={index}
                          className="
                            flex items-center justify-between
                            px-4 py-3 rounded-lg
                            bg-muted
                            pop glow transition
                          "
                        >
                          <div>
                            <p className="font-semibold text-foreground">{item.bimestre}</p>
                            <p className="text-sm text-muted-foreground">
                              {item.meses}
                            </p>
                          </div>
  
                          <span
                            className={`
                              px-3 py-1 text-white rounded-full text-sm font-medium
                              ${comportamentoColor[item.status.toLowerCase()]}
                            `}
                          >
                            {item.status}
                          </span>
                        </div>
                      ))
                    ) : (
                      <p className="text-muted-foreground text-sm">
                        Nenhum histórico de comportamento disponível
                      </p>
                    )}
                  </div>
                </div>
  
              </div>
            </div>
          </div>
        </div>
      </main>
    );
  }
  