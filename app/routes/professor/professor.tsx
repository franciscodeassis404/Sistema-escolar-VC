import * as React from "react";
import { Link } from "react-router";
import { Navbar } from "./../../components/ui/navbar";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "~/components/ui/avatar";
import { ComportamentoTag } from "~/components/ui/comportamento-tag";
import { Grid3x3, Search, BookOpen, List, User, Loader2 } from "lucide-react";

import { alunoService, type AlunoCard, type PageResponse } from "~/services/alunoService";
import { turmaService, type TurmaSimplificada } from "~/services/TurmaService";

export default function ProfessorRoute() {
  const [searchTerm, setSearchTerm] = React.useState("");
  const [selectedClass, setSelectedClass] = React.useState<number | null>(null);
  const [viewMode, setViewMode] = React.useState<"grid" | "list">("grid");
  const [currentPage, setCurrentPage] = React.useState(0);
  const [turmas, setTurmas] = React.useState<TurmaSimplificada[]>([]);
  const [alunos, setAlunos] = React.useState<PageResponse<AlunoCard>>({
    content: [],
    totalElements: 0,
    totalPages: 0,
    size: 9,
    number: 0,
  });
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    carregarTurmas();
  }, []);

  React.useEffect(() => {
    carregarAlunos();
  }, [currentPage, selectedClass, searchTerm]);

  async function carregarTurmas() {
    try {
      const turmasData = await turmaService.listarTurmasDoProfessor();
      setTurmas(turmasData);
    } catch (err) {
      console.error('Erro ao carregar turmas:', err);
    }
  }

  async function carregarAlunos() {
    setLoading(true);
    setError(null);

    try {
      const response = await alunoService.listar({
        page: currentPage,
        size: 9,
        idTurma: selectedClass,
        busca: searchTerm || undefined,
      });

      setAlunos(response);
    } catch (err: any) {
      setError(err.message || 'Erro ao carregar alunos');
    } finally {
      setLoading(false);
    }
  }

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setCurrentPage(0);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  const mapComportamento = (status: string): "bom" | "ruim" | "excelente" => {
    switch (status.toLowerCase()) {
      case 'excelente': return 'excelente';
      case 'bom': return 'bom';
      case 'em risco': return 'ruim';
      default: return 'bom';
    }
  };

  return (
    <>
      <Navbar tipoPerfil="professor" />
      <section className="flex min-h-screen flex-col bg-background dark:bg-gray-900">
        {/* Cabeçalho */}
        <div className="border-b border-border bg-card dark:bg-gray-800 px-8 py-6">
          <h1 className="text-3xl font-bold text-foreground mb-2">Dashboard Professor</h1>
          <p className="text-muted-foreground">Bem-vindo (a)! Aqui você tem acesso as informações dos alunos.</p>
        </div>

        {/* Filtros e Busca */}
        <div className="bg-card dark:bg-gray-800 border-b border-border px-8 py-6">
          <div className="flex flex-col gap-4">
            {/* Barra de Pesquisa */}
            <div className="flex gap-4 items-end">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                  <Input
                    placeholder="Digite o nome do aluno..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
            </div>

            {/* Filtro por Turma */}
            <div className="flex gap-2 items-end flex-wrap">
              <div>
                <label className="text-sm font-medium mb-2 block text-foreground">Filtrar por Turma</label>
                <div className="flex gap-2 flex-wrap">
                  <Button
                    variant={selectedClass === null ? "default" : "outline"}
                    size="sm"
                    onClick={() => {
                      setSelectedClass(null);
                      setCurrentPage(0);
                    }}
                    className="hover:bg-primary hover:text-primary-foreground hover:border-primary"
                  >
                    Todas
                  </Button>
                  {turmas.map((turma) => (
                    <Button
                      key={turma.id}
                      variant={selectedClass === turma.id ? "default" : "outline"}
                      size="sm"
                      onClick={() => {
                        setSelectedClass(turma.id);
                        setCurrentPage(0);
                      }}
                      className="hover:bg-primary hover:text-primary-foreground hover:border-primary"
                    >
                      {turma.nome}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Botão Grid/Lista */}
              <div className="ml-auto flex gap-2">
                <Button
                  variant={viewMode === "grid" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setViewMode("grid")}
                  className="flex items-center gap-2"
                >
                  <Grid3x3 className="h-4 w-4" />
                  Grade
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                  className="flex items-center gap-2"
                >
                  <List className="h-4 w-4" />
                  Lista
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Grid/Lista de Alunos */}
        <div className="flex-1 px-8 py-8 bg-background">
          {/* Loading */}
          {loading && (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <span className="ml-2 text-muted-foreground">Carregando alunos...</span>
            </div>
          )}

          {/* Erro */}
          {error && !loading && (
            <div className="bg-destructive/10 border border-destructive text-destructive px-4 py-3 rounded-md mb-4">
              {error}
            </div>
          )}

          {/* Sem resultados */}
          {!loading && !error && alunos.content.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground text-lg">Nenhum aluno encontrado</p>
            </div>
          )}

          {/* Grid View */}
          {!loading && !error && alunos.content.length > 0 && viewMode === "grid" && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {alunos.content.map((aluno) => (
                  <Link key={aluno.id} to={`/perfilAluno?alunoId=${aluno.id}&from=professor`}>
                    <Card className="hover:shadow-lg transition-shadow border-border flex flex-col items-center text-center cursor-pointer">
                      <CardHeader className="flex flex-col items-center w-full pb-2">
                        <Avatar className="h-16 w-16">
                          <AvatarImage src={alunoService.getFotoUrl(aluno.foto)} />
                          <AvatarFallback className="bg-primary text-primary-foreground text-lg">
                            {aluno.nome.split(" ")[0][0]}
                          </AvatarFallback>
                        </Avatar>
                      </CardHeader>
                      <CardContent className="flex flex-col items-center w-full pt-0">
                        <div className="space-y-1 w-full text-center">
                          <CardTitle className="text-lg">{aluno.nome}</CardTitle>
                          <CardDescription className="text-muted-foreground text-sm mb-0">
                            {aluno.idade ? `Idade: ${aluno.idade}` : 'Idade não informada'}
                          </CardDescription>
                          <CardDescription className="text-muted-foreground text-sm flex items-center justify-center gap-1 mt-2">
                            <BookOpen className="h-3 w-3" />
                            {aluno.totalDisciplinas} Disciplinas
                          </CardDescription>
                          <div className="flex justify-center mt-2">
                            <ComportamentoTag tipo={mapComportamento(aluno.statusComportamento)} />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>

              {/* Paginação */}
              {alunos.totalPages > 1 && (
                <div className="flex justify-center items-center gap-2 mt-8">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(p => Math.max(0, p - 1))}
                    disabled={currentPage === 0}
                  >
                    Anterior
                  </Button>
                  <span className="text-sm text-muted-foreground">
                    Página {currentPage + 1} de {alunos.totalPages}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(p => Math.min(alunos.totalPages - 1, p + 1))}
                    disabled={currentPage >= alunos.totalPages - 1}
                  >
                    Próxima
                  </Button>
                </div>
              )}
            </>
          )}

          {/* List View */}
          {!loading && !error && alunos.content.length > 0 && viewMode === "list" && (
            <>
              <div className="space-y-3">
                {alunos.content.map((aluno) => (
                  <Link key={aluno.id} to={`/perfilAluno?alunoId=${aluno.id}&from=professor`}>
                    <div className="flex items-center justify-between p-4 bg-card border border-border rounded-lg hover:shadow-lg transition-shadow cursor-pointer">
                      <div className="flex items-center gap-4 flex-1">
                        <Avatar className="h-12 w-12">
                          <AvatarImage src={alunoService.getFotoUrl(aluno.foto)} />
                          <AvatarFallback className="bg-primary text-primary-foreground">
                            {aluno.nome.split(" ")[0][0]}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <p className="font-semibold text-foreground">{aluno.nome}</p>
                          <div className="flex gap-4 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <User className="h-3 w-3" /> 
                              {aluno.idade ? `${aluno.idade} anos` : 'Idade não informada'}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <ComportamentoTag tipo={mapComportamento(aluno.statusComportamento)} />
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <BookOpen className="h-4 w-4" />
                          {aluno.totalDisciplinas}
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>

              {/* Paginação */}
              {alunos.totalPages > 1 && (
                <div className="flex justify-center items-center gap-2 mt-8">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(p => Math.max(0, p - 1))}
                    disabled={currentPage === 0}
                  >
                    Anterior
                  </Button>
                  <span className="text-sm text-muted-foreground">
                    Página {currentPage + 1} de {alunos.totalPages}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(p => Math.min(alunos.totalPages - 1, p + 1))}
                    disabled={currentPage >= alunos.totalPages - 1}
                  >
                    Próxima
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </>
  );
}