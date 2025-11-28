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
        console.log('🔍 Carregando perfil do aluno autenticado');

        // Chama o novo método que não precisa de ID
        const dados = await perfilService.buscarMeuPerfilAluno();

        console.log('✅ Perfil do aluno carregado com sucesso:', dados);
        setStudent(dados);
      } catch (err: any) {
        console.error('❌ Erro completo ao carregar perfil:', {
          message: err.message,
          response: err.response?.data,
          status: err.response?.status,
          erro: err
        });

        let mensagemErro = err.message || 'Erro ao carregar perfil';

        if (err.response?.status === 404) {
          mensagemErro = 'Perfil do aluno não encontrado no sistema';
        } else if (err.response?.status === 500) {
          mensagemErro = 'Erro no servidor ao buscar perfil';
        }

        setError(mensagemErro);
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
        <div className="min-h-screen w-full bg-[#F4F7FA] dark:bg-[#0D1117] dark:text-white transition-colors duration-500">

          {/* NAVBAR AQUI */}
          <Navbar />

          {/* CONTEÚDO */}
          <div className="px-4 sm:px-6 md:px-10 py-6 sm:py-8 md:py-10 animate-fadeIn">

            <h1 className="text-2xl sm:text-3xl font-bold animate-fadeIn">
              Bem-vindo, {student.nome.split(" ")[0]}!
            </h1>

            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 mt-1 animate-fadeIn">
              Aqui você pode visualizar suas informações e notas de comportamento
            </p>

            {/* GRID */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 sm:gap-8 md:gap-10 mt-8 sm:mt-10 items-start">

              {/* COLUNA ESQUERDA */}
              <div className="col-span-1 md:col-span-1 animate-fadeIn">
                <div
                  className="
                    bg-card border border-border
                    shadow-sm
                    rounded-xl p-4 sm:p-6 text-center
                    h-full w-full min-h-fit md:min-h-[980px]
                    flex flex-col items-center justify-start
                    pop card-anim glow tilt
                  "
                >
                  <img
                    src={perfilService.getFotoUrl(student.foto, 'aluno')}
                    alt={student.nome}
                    className="w-20 sm:w-24 md:w-28 h-20 sm:h-24 md:h-28 rounded-full mx-auto border-4 border-primary shadow-lg animate-fadeIn"
                  />

                  <h2 className="text-lg sm:text-xl font-semibold mt-3 sm:mt-4 animate-fadeIn">
                    {student.nome}
                  </h2>

                  <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-300 animate-fadeIn">
                    {student.turma}
                  </p>

                  <div
                    className={`
                      mt-3 text-white rounded-full px-3 sm:px-4 py-1 text-xs sm:text-sm font-medium pulse animate-fadeIn
                      ${comportamentoColor[student.statusComportamento.toLowerCase()]}
                    `}
                  >
                    {student.statusComportamento.charAt(0).toUpperCase() +
                      student.statusComportamento.slice(1)}
                  </div>

                  <div className="flex items-center justify-center gap-2 mt-3 sm:mt-4 text-xs sm:text-sm text-gray-600 dark:text-gray-300 animate-fadeIn">
                    <BookOpen className="w-3 h-3 sm:w-4 sm:h-4" />
                    {student.disciplinas.length} disciplinas
                  </div>
                </div>
              </div>

              {/* COLUNA DIREITA */}
              <div className="col-span-1 md:col-span-3 flex flex-col gap-6 sm:gap-8 md:gap-10 animate-fadeIn">

                {/* INFORMAÇÕES PESSOAIS */}
                <div
                  className="
                    bg-card border border-border
                    shadow-sm
                    rounded-xl p-4 sm:p-6 min-h-fit
                    pop glow tilt card-anim
                  "
                >
                  <h2 className="flex items-center gap-2 text-base sm:text-lg font-semibold text-foreground animate-fadeIn">
                    <Info className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                    Informações pessoais
                  </h2>

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-4 animate-fadeIn">

                    <div>
                      <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-300">Idade</p>
                      <p className="font-semibold text-sm sm:text-base">{student.idade} anos</p>

                      <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-300 mt-4">
                        ID do aluno
                      </p>
                      <p className="font-semibold text-sm sm:text-base text-foreground">{student.idMatricula}</p>
                    </div>

                    <div>
                      <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-300">Turma</p>
                      <p className="font-semibold text-sm sm:text-base">{student.turma}</p>

                      <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-300 mt-4">Status</p>

                      <span
                        className={`
                          px-3 py-1 rounded-full text-xs sm:text-sm font-medium inline-block
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
                    rounded-xl p-4 sm:p-6 min-h-fit
                    pop glow tilt card-anim
                  "
                >
                  <h2 className="text-base sm:text-lg font-semibold text-foreground mb-4 flex items-center gap-2 animate-fadeIn">
                    <User className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                    Minhas disciplinas
                  </h2>

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 sm:gap-3 animate-fadeIn">
                    {student?.disciplinas && student.disciplinas.length > 0 ? (
                      student.disciplinas.map((disciplina, index) => (
                        <div
                          key={index}
                          className="
                            px-3 sm:px-4 py-2 rounded-lg
                            bg-muted
                            flex items-center gap-2
                            text-foreground text-xs sm:text-sm
                            pop glow transition
                          "
                        >
                          <BookOpen className="w-3 h-3 sm:w-4 sm:h-4 text-primary shrink-0" />
                          <span className="truncate">{disciplina}</span>
                        </div>
                      ))
                    ) : (
                      <p className="col-span-full text-muted-foreground text-xs sm:text-sm">
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
                    rounded-xl p-4 sm:p-6 min-h-fit
                    pop glow tilt card-anim
                  "
                >
                  <h2 className="text-base sm:text-lg font-semibold text-foreground mb-4 flex items-center gap-2 animate-fadeIn">
                    <Info className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                    Histórico de comportamento
                  </h2>

                  <div className="flex flex-col gap-3 sm:gap-4 animate-fadeIn">
                    {student.comportamentoHistorico.map((item, index) => (
                      <div
                        key={index}
                        className="
                          flex flex-col sm:flex-row sm:items-center sm:justify-between
                          px-3 sm:px-4 py-3 rounded-lg
                          bg-gray-100 dark:bg-gray-700
                          pop glow transition gap-2
                        "
                        >
                          <div>
                            <p className="font-semibold text-sm sm:text-base">{item.bimestre}</p>
                            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-300">
                              {item.meses}
                            </p>
                          </div>
  
                          <span
                            className={`
                              px-3 py-1 text-white rounded-full text-xs sm:text-sm font-medium inline-block
                              ${comportamentoColor[item.status.toLowerCase()]}
                            `}
                          >
                            {item.status}
                          </span>
                        </div>
                      ))}
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>
      </main>
    );
  }
