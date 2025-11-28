import * as React from "react";
import { Link } from "react-router";
import { Navbar } from "./../../components/ui/navbar";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "~/components/ui/avatar";
import { ComportamentoTag } from "~/components/ui/comportamento-tag";
import { ComportamentoAlunoTag } from "~/components/ui/ComportamentoAlunoTag";
import { Grid3x3, Search, List, User, Building2, Plus, BookOpen, Loader2 } from "lucide-react";

import { adminService, type UsuarioCard, type PageResponse } from "~/services/admin.service";
import { alunoService } from "~/services/alunoService";
import { professorService } from "~/services/professorService";

export default function AdminRoute() {
  const [searchTerm, setSearchTerm] = React.useState("");
  const [selectedType, setSelectedType] = React.useState<"alunos" | "professores">("professores");
  const [selectedDepartment, setSelectedDepartment] = React.useState("Todos");
  const [selectedTurma, setSelectedTurma] = React.useState("Todas");
  const [viewMode, setViewMode] = React.useState<"grid" | "list">("grid");
  const [currentPage, setCurrentPage] = React.useState(0);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  const [usuarios, setUsuarios] = React.useState<PageResponse<UsuarioCard>>({
    content: [],
    totalElements: 0,
    totalPages: 0,
    size: 9,
    number: 0,
  });

  const departamentos = ["Todos", "Matemática", "Português", "Ciências", "História", "Geografia"];
  const turmas = ["Todas", "1º A", "1º B", "2º A", "2º B", "3º A"];

  React.useEffect(() => {
    carregarUsuarios();
  }, [currentPage, selectedType, searchTerm, selectedDepartment, selectedTurma]);

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setCurrentPage(0);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  async function carregarUsuarios() {
    setLoading(true);
    setError(null);

    try {
      const response = await adminService.listarUsuarios({
        page: currentPage,
        size: 9,
        tipo: selectedType === "professores" ? "PROFESSOR" : "ALUNO",
        busca: searchTerm || undefined,
      });

      setUsuarios(response);
    } catch (err: any) {
      setError(err.message || 'Erro ao carregar usuários');
      console.error('Erro ao carregar usuários:', err);
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

  return (
    <>
      <Navbar tipoPerfil="admin" />

      <section className="flex min-h-screen flex-col bg-background dark:bg-gray-900">
        {/* Top bar customizada (seguindo referência) */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-border bg-card dark:bg-gray-800 px-4 sm:px-6 md:px-8 py-4 sm:py-6 gap-4">
          <div className="min-w-0">
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Bem-vindo Administrador</h1>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1">Aqui você pode acessar as informações de todos os usuários cadastrados no sistema</p>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <Link to="/adduser" className="w-full sm:w-auto">
              <Button variant="secondary" size="sm" className="flex items-center gap-2 w-full sm:w-auto">
                <Plus className="h-4 w-4 shrink-0" />
                <span className="hidden sm:inline">Novo usuário</span>
                <span className="sm:hidden">Novo</span>
              </Button>
            </Link>
          </div>
        </div>

        {/* Filtros / Busca */}
        <div className="bg-card dark:bg-gray-800 border-b border-border px-4 sm:px-6 md:px-8 py-4 sm:py-6">
          <div className="flex flex-col gap-4">
            {/* Tipo de usuário */}
            <div className="flex items-center gap-2 overflow-x-auto">
              <Button
                variant={selectedType === "alunos" ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedType("alunos")}
                className="flex items-center gap-2 whitespace-nowrap shrink-0 text-xs sm:text-sm"
              >
                <User className="h-3 w-3 sm:h-4 sm:w-4" /> <span className="hidden sm:inline">Alunos</span><span className="sm:hidden">Alunos</span>
              </Button>
              <Button
                variant={selectedType === "professores" ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedType("professores")}
                className="flex items-center gap-2 whitespace-nowrap shrink-0 text-xs sm:text-sm"
              >
                <Building2 className="h-3 w-3 sm:h-4 sm:w-4" /> <span className="hidden sm:inline">Professores</span><span className="sm:hidden">Profs</span>
              </Button>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-stretch sm:items-center">
              <div className="flex-1 min-w-0">
                <div className="relative">
                  <Search className="absolute left-3 top-2.5 h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground shrink-0" />
                  <Input
                    placeholder={`Digite o nome do ${selectedType === "alunos" ? "aluno" : "professor"}`}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-9 sm:pl-10 text-sm"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <Button
                  variant={viewMode === "grid" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setViewMode("grid")}
                  className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm px-2 sm:px-3"
                  title="Visualizar em grade"
                >
                  <Grid3x3 className="h-3 w-3 sm:h-4 sm:w-4" /> <span className="hidden sm:inline">Grade</span>
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                  className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm px-2 sm:px-3"
                  title="Visualizar em lista"
                >
                  <List className="h-3 w-3 sm:h-4 sm:w-4" /> <span className="hidden sm:inline">Lista</span>
                </Button>
              </div>
            </div>

            <div className="flex items-center gap-2 overflow-x-auto flex-wrap">
              {selectedType === "professores" ? (
                <div className="w-full">
                  <label className="text-xs sm:text-sm font-medium mb-2 block text-foreground">Filtrar por Matéria</label>
                  <div className="flex gap-1 sm:gap-2 flex-wrap">
                    {departamentos.map((dep) => (
                      <Button
                        key={dep}
                        variant={selectedDepartment === dep ? "default" : "outline"}
                        size="sm"
                        onClick={() => setSelectedDepartment(dep)}
                        className="hover:bg-primary hover:text-primary-foreground hover:border-primary text-xs sm:text-sm px-2 sm:px-3 shrink-0"
                      >
                        {dep}
                      </Button>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="w-full">
                  <label className="text-xs sm:text-sm font-medium mb-2 block text-foreground">Filtrar por Turma</label>
                  <div className="flex gap-1 sm:gap-2 flex-wrap">
                    {turmas.map((turma) => (
                      <Button
                        key={turma}
                        variant={selectedTurma === turma ? "default" : "outline"}
                        size="sm"
                        onClick={() => setSelectedTurma(turma)}
                        className="hover:bg-primary hover:text-primary-foreground hover:border-primary text-xs sm:text-sm px-2 sm:px-3 shrink-0"
                      >
                        {turma}
                      </Button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Conteúdo principal */}
        <div className="flex-1 px-4 sm:px-6 md:px-8 py-6 sm:py-8 bg-background">
          {/* Loading */}
          {loading && (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <span className="ml-2 text-muted-foreground">Carregando...</span>
            </div>
          )}

          {/* Erro */}
          {error && !loading && (
            <div className="bg-destructive/10 border border-destructive text-destructive px-4 py-3 rounded-md mb-4">
              {error}
            </div>
          )}

          {/* Sem resultados */}
          {!loading && !error && usuarios.content.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground text-lg">
                Nenhum {selectedType === "professores" ? "professor" : "aluno"} encontrado
              </p>
            </div>
          )}

          {/* Grid/Lista de Usuários */}
          {!loading && !error && usuarios.content.length > 0 && (
            <>
              {selectedType === "professores" ? (
                // PROFESSORES
                viewMode === "grid" ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
                    {usuarios.content.map((usuario) => (
                      <Link key={usuario.id} to={`/perfilProfessor?professorId=${usuario.id}&from=admin`}>
                        <Card className="hover:shadow-lg transition-shadow border-border flex flex-col items-center text-center cursor-pointer h-full">
                          <CardHeader className="flex flex-col items-center w-full pb-2">
                            <Avatar className="h-12 w-12 sm:h-16 sm:w-16">
                              <AvatarImage src={professorService.getFotoUrl(usuario.foto)} />
                              <AvatarFallback className="bg-primary text-primary-foreground text-sm sm:text-lg">
                                {usuario.nome.split(" ")[0][0]}
                              </AvatarFallback>
                            </Avatar>
                          </CardHeader>
                          <CardContent className="flex flex-col items-center w-full pt-0">
                            <div className="space-y-1 w-full text-center px-2">
                              <CardTitle className="text-base sm:text-lg line-clamp-2">{usuario.nome}</CardTitle>
                              <CardDescription className="text-muted-foreground text-xs sm:text-sm">
                                {usuario.idade ? `Idade: ${usuario.idade}` : 'Idade não informada'}
                              </CardDescription>
                            </div>
                            <div className="text-muted-foreground text-xs sm:text-sm flex items-center justify-center gap-1 mt-2">
                              <Building2 className="h-3 w-3 sm:h-4 sm:w-4 shrink-0" /> {usuario.totalTurmas || 0} turmas
                            </div>
                            <div className="mt-2">
                              <span className={`px-2 sm:px-3 py-1 rounded-full text-xs font-medium inline-block ${
                                usuario.status?.toLowerCase() === "ativo" ? "bg-green-500/15 text-green-600" : "bg-red-500/15 text-red-600"
                              }`}>
                                {usuario.status || 'Ativo'}
                              </span>
                            </div>
                          </CardContent>
                        </Card>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-2 sm:space-y-3">
                    {usuarios.content.map((usuario) => (
                      <Link key={usuario.id} to={`/perfilProfessor?professorId=${usuario.id}&from=admin`}>
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 p-3 sm:p-4 bg-card border border-border rounded-lg hover:shadow-lg transition-shadow cursor-pointer">
                          <div className="flex items-center gap-3 min-w-0">
                            <Avatar className="h-10 w-10 sm:h-12 sm:w-12 shrink-0">
                              <AvatarImage src={professorService.getFotoUrl(usuario.foto)} />
                              <AvatarFallback className="bg-primary text-primary-foreground text-xs sm:text-sm">
                                {usuario.nome.split(" ")[0][0]}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1 min-w-0">
                              <p className="font-semibold text-foreground text-sm sm:text-base truncate">{usuario.nome}</p>
                              <div className="flex gap-2 text-xs text-muted-foreground">
                                <span className="flex items-center gap-1 shrink-0">
                                  <User className="h-3 w-3" /> 
                                  {usuario.idade ? `${usuario.idade} anos` : 'Idade não informada'}
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
                            <span className={`px-2 sm:px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap ${
                              usuario.status?.toLowerCase() === "ativo" ? "bg-green-500/15 text-green-600" : "bg-red-500/15 text-red-600"
                            }`}>
                              {usuario.status || 'Ativo'}
                            </span>
                            <div className="flex items-center gap-1 text-xs sm:text-sm text-muted-foreground whitespace-nowrap shrink-0">
                              <Building2 className="h-3 w-3 sm:h-4 sm:w-4" />
                              {usuario.totalTurmas || 0}
                            </div>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                )
              ) : (
                // ALUNOS
                viewMode === "grid" ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
                    {usuarios.content.map((usuario) => (
                      <Link key={usuario.id} to={`/perfilAluno?alunoId=${usuario.id}&from=admin`}>
                        <Card className="hover:shadow-lg transition-shadow border-border flex flex-col items-center text-center cursor-pointer h-full">
                          <CardHeader className="flex flex-col items-center w-full pb-2">
                            <Avatar className="h-12 w-12 sm:h-16 sm:w-16">
                              <AvatarImage src={alunoService.getFotoUrl(usuario.foto)} />
                              <AvatarFallback className="bg-primary text-primary-foreground text-sm sm:text-lg">
                                {usuario.nome.split(" ")[0][0]}
                              </AvatarFallback>
                            </Avatar>
                          </CardHeader>
                          <CardContent className="flex flex-col items-center w-full pt-0">
                            <div className="space-y-1 w-full text-center px-2">
                              <CardTitle className="text-base sm:text-lg line-clamp-2">{usuario.nome}</CardTitle>
                              <CardDescription className="text-muted-foreground text-xs sm:text-sm">
                                {usuario.idade ? `Idade: ${usuario.idade}` : 'Idade não informada'}
                              </CardDescription>
                            </div>
                            <div className="flex justify-center mt-2">
                              <ComportamentoAlunoTag alunoId={usuario.id} showMedia={false} />
                            </div>
                          </CardContent>
                        </Card>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-2 sm:space-y-3">
                    {usuarios.content.map((usuario) => (
                      <Link key={usuario.id} to={`/perfilAluno?alunoId=${usuario.id}&from=admin`}>
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 p-3 sm:p-4 bg-card border border-border rounded-lg hover:shadow-lg transition-shadow cursor-pointer">
                          <div className="flex items-center gap-3 min-w-0 flex-1">
                            <Avatar className="h-10 w-10 sm:h-12 sm:w-12 shrink-0">
                              <AvatarImage src={alunoService.getFotoUrl(usuario.foto)} />
                              <AvatarFallback className="bg-primary text-primary-foreground text-xs sm:text-sm">
                                {usuario.nome.split(" ")[0][0]}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1 min-w-0">
                              <p className="font-semibold text-foreground text-sm sm:text-base truncate">{usuario.nome}</p>
                              <div className="flex gap-2 text-xs text-muted-foreground">
                                <span className="flex items-center gap-1 shrink-0">
                                  <User className="h-3 w-3" /> 
                                  {usuario.idade ? `${usuario.idade} anos` : 'Idade não informada'}
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
                            <ComportamentoAlunoTag alunoId={usuario.id} showMedia={false} />
                            <span className={`px-2 sm:px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap ${
                              usuario.status?.toLowerCase() === "matriculado" ? "bg-green-500/15 text-green-600" : "bg-yellow-500/15 text-yellow-600"
                            }`}>
                              {usuario.status || 'Matriculado'}
                            </span>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                )
              )}

              {/* Paginação */}
              {usuarios.totalPages > 1 && (
                <div className="flex flex-col sm:flex-row justify-center items-center gap-2 sm:gap-4 mt-6 sm:mt-8">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(p => Math.max(0, p - 1))}
                    disabled={currentPage === 0}
                    className="w-full sm:w-auto text-xs sm:text-sm"
                  >
                    Anterior
                  </Button>
                  <span className="text-xs sm:text-sm text-muted-foreground order-first sm:order-0">
                    Página {currentPage + 1} de {usuarios.totalPages}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(p => Math.min(usuarios.totalPages - 1, p + 1))}
                    disabled={currentPage >= usuarios.totalPages - 1}
                    className="w-full sm:w-auto text-xs sm:text-sm"
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
