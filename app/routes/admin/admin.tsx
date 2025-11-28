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
        <div className="flex items-center justify-between border-b border-border bg-card dark:bg-gray-800 px-8 py-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Bem-vindo Administrador</h1>
            <p className="text-muted-foreground">Aqui você pode acessar as informações de todos os usuários cadastrados no sistema</p>
          </div>

          <div className="flex items-center gap-3">
            <Link to="/adduser">
              <Button variant="secondary" size="sm" className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Novo usuário
              </Button>
            </Link>
          </div>
        </div>

        {/* Filtros / Busca */}
        <div className="bg-card dark:bg-gray-800 border-b border-border px-8 py-6">
          <div className="flex flex-col gap-4">
            {/* Tipo de usuário */}
            <div className="flex items-center gap-2">
              <Button
                variant={selectedType === "alunos" ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedType("alunos")}
                className="flex items-center gap-2"
              >
                <User className="h-4 w-4" /> Alunos
              </Button>
              <Button
                variant={selectedType === "professores" ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedType("professores")}
                className="flex items-center gap-2"
              >
                <Building2 className="h-4 w-4" /> Professores
              </Button>
            </div>

            <div className="flex gap-4 items-center">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                  <Input
                    placeholder={`Digite o nome do ${selectedType === "alunos" ? "aluno" : "professor"}`}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant={viewMode === "grid" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setViewMode("grid")}
                  className="flex items-center gap-2"
                >
                  <Grid3x3 className="h-4 w-4" /> Grade
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                  className="flex items-center gap-2"
                >
                  <List className="h-4 w-4" /> Lista
                </Button>
              </div>
            </div>

            <div className="flex items-center gap-4 flex-wrap">
              {selectedType === "professores" ? (
                <div>
                  <label className="text-sm font-medium mb-2 block text-foreground">Filtrar por Matéria</label>
                  <div className="flex gap-2 flex-wrap">
                    {departamentos.map((dep) => (
                      <Button
                        key={dep}
                        variant={selectedDepartment === dep ? "default" : "outline"}
                        size="sm"
                        onClick={() => setSelectedDepartment(dep)}
                        className="hover:bg-primary hover:text-primary-foreground hover:border-primary"
                      >
                        {dep}
                      </Button>
                    ))}
                  </div>
                </div>
              ) : (
                <div>
                  <label className="text-sm font-medium mb-2 block text-foreground">Filtrar por Turma</label>
                  <div className="flex gap-2 flex-wrap">
                    {turmas.map((turma) => (
                      <Button
                        key={turma}
                        variant={selectedTurma === turma ? "default" : "outline"}
                        size="sm"
                        onClick={() => setSelectedTurma(turma)}
                        className="hover:bg-primary hover:text-primary-foreground hover:border-primary"
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
        <div className="flex-1 px-8 py-8 bg-background">
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
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {usuarios.content.map((usuario) => (
                      <Link key={usuario.id} to={`/perfilProfessor?professorId=${usuario.id}&from=admin`}>
                        <Card className="hover:shadow-lg transition-shadow border-border flex flex-col items-center text-center cursor-pointer">
                          <CardHeader className="flex flex-col items-center w-full pb-2">
                            <Avatar className="h-16 w-16">
                              <AvatarImage src={professorService.getFotoUrl(usuario.foto)} />
                              <AvatarFallback className="bg-primary text-primary-foreground text-lg">
                                {usuario.nome.split(" ")[0][0]}
                              </AvatarFallback>
                            </Avatar>
                          </CardHeader>
                          <CardContent className="flex flex-col items-center w-full pt-0">
                            <div className="space-y-1 w-full text-center">
                              <CardTitle className="text-lg">{usuario.nome}</CardTitle>
                              <CardDescription className="text-muted-foreground text-sm">
                                {usuario.idade ? `Idade: ${usuario.idade}` : 'Idade não informada'}
                              </CardDescription>
                            </div>
                            <div className="text-muted-foreground text-sm flex items-center justify-center gap-1 mt-2">
                              <Building2 className="h-4 w-4" /> {usuario.totalTurmas || 0} turmas
                            </div>
                            <div className="mt-2">
                              <span className={`px-3 py-1 rounded-full text-xs font-medium ${
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
                  <div className="space-y-3">
                    {usuarios.content.map((usuario) => (
                      <Link key={usuario.id} to={`/perfilProfessor?professorId=${usuario.id}&from=admin`}>
                        <div className="flex items-center justify-between p-4 bg-card border border-border rounded-lg hover:shadow-lg transition-shadow cursor-pointer">
                          <div className="flex items-center gap-4 flex-1">
                            <Avatar className="h-12 w-12">
                              <AvatarImage src={professorService.getFotoUrl(usuario.foto)} />
                              <AvatarFallback className="bg-primary text-primary-foreground">
                                {usuario.nome.split(" ")[0][0]}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                              <p className="font-semibold text-foreground">{usuario.nome}</p>
                              <div className="flex gap-4 text-xs text-muted-foreground">
                                <span className="flex items-center gap-1">
                                  <User className="h-3 w-3" /> 
                                  {usuario.idade ? `${usuario.idade} anos` : 'Idade não informada'}
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                              usuario.status?.toLowerCase() === "ativo" ? "bg-green-500/15 text-green-600" : "bg-red-500/15 text-red-600"
                            }`}>
                              {usuario.status || 'Ativo'}
                            </span>
                            <div className="flex items-center gap-1 text-sm text-muted-foreground">
                              <Building2 className="h-4 w-4" />
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
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {usuarios.content.map((usuario) => (
                      <Link key={usuario.id} to={`/perfilAluno?alunoId=${usuario.id}&from=admin`}>
                        <Card className="hover:shadow-lg transition-shadow border-border flex flex-col items-center text-center cursor-pointer">
                          <CardHeader className="flex flex-col items-center w-full pb-2">
                            <Avatar className="h-16 w-16">
                              <AvatarImage src={alunoService.getFotoUrl(usuario.foto)} />
                              <AvatarFallback className="bg-primary text-primary-foreground text-lg">
                                {usuario.nome.split(" ")[0][0]}
                              </AvatarFallback>
                            </Avatar>
                          </CardHeader>
                          <CardContent className="flex flex-col items-center w-full pt-0">
                            <div className="space-y-1 w-full text-center">
                              <CardTitle className="text-lg">{usuario.nome}</CardTitle>
                              <CardDescription className="text-muted-foreground text-sm">
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
                  <div className="space-y-3">
                    {usuarios.content.map((usuario) => (
                      <Link key={usuario.id} to={`/perfilAluno?alunoId=${usuario.id}&from=admin`}>
                        <div className="flex items-center justify-between p-4 bg-card border border-border rounded-lg hover:shadow-lg transition-shadow cursor-pointer">
                          <div className="flex items-center gap-4 flex-1">
                            <Avatar className="h-12 w-12">
                              <AvatarImage src={alunoService.getFotoUrl(usuario.foto)} />
                              <AvatarFallback className="bg-primary text-primary-foreground">
                                {usuario.nome.split(" ")[0][0]}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                              <p className="font-semibold text-foreground">{usuario.nome}</p>
                              <div className="flex gap-4 text-xs text-muted-foreground">
                                <span className="flex items-center gap-1">
                                  <User className="h-3 w-3" /> 
                                  {usuario.idade ? `${usuario.idade} anos` : 'Idade não informada'}
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <ComportamentoAlunoTag alunoId={usuario.id} showMedia={false} />
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
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
                    Página {currentPage + 1} de {usuarios.totalPages}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(p => Math.min(usuarios.totalPages - 1, p + 1))}
                    disabled={currentPage >= usuarios.totalPages - 1}
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
