import * as React from "react";
import { Link } from "react-router";
import { Navbar } from "./../../components/ui/navbar";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import ThemeToggle from "~/components/ui/theme";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "~/components/ui/avatar";
import { ComportamentoTag } from "~/components/ui/comportamento-tag";
import { Grid3x3, Search, List, User, Building2, Plus, BookOpen } from "lucide-react";

type Professor = {
  id: number;
  nome: string;
  idade: string;
  departamento: string;
  turmas: number;
  status: "ativo" | "inativo";
};

type Aluno = {
  id: number;
  nome: string;
  idade: string;
  turma: string;
  disciplinas: number;
  comportamento: "bom" | "ruim" | "excelente";
};

const normalizarTexto = (texto: string) =>
  texto.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

const filtrarPorDepartamento = (lista: Professor[], departamento: string) =>
  departamento === "Todos" ? lista : lista.filter((p) => p.departamento === departamento);

const filtrarPorTurma = (lista: Aluno[], turma: string) =>
  turma === "Todas" ? lista : lista.filter((a) => a.turma === turma);

export default function AdminRoute() {
  const [searchTerm, setSearchTerm] = React.useState("");
  const [selectedType, setSelectedType] = React.useState<"alunos" | "professores">("professores");
  const [selectedDepartment, setSelectedDepartment] = React.useState("Todos");
  const [selectedTurma, setSelectedTurma] = React.useState("Todas");
  const [viewMode, setViewMode] = React.useState<"grid" | "list">("grid");

  const departamentos = ["Todos", "Matemática", "Português", "Ciências", "História", "Geografia"];
  const turmas = ["Todas", "1º A", "1º B", "2º A", "2º B", "3º A"];

  const professores: Professor[] = [
    { id: 1, nome: "Carlos Almeida", idade: "35", departamento: "Matemática", turmas: 4, status: "ativo" },
    { id: 2, nome: "Fernanda Ribeiro", idade: "42", departamento: "Português", turmas: 5, status: "ativo" },
    { id: 3, nome: "Ricardo Souza", idade: "39", departamento: "História", turmas: 3, status: "inativo" },
    { id: 4, nome: "Patrícia Gomes", idade: "33", departamento: "Ciências", turmas: 4, status: "ativo" },
    { id: 5, nome: "Marcos Lima", idade: "45", departamento: "Geografia", turmas: 2, status: "ativo" },
  ];

  const alunos: Aluno[] = [
    { id: 1, nome: "João Silva", idade: "14", turma: "1º A", disciplinas: 12, comportamento: "excelente" },
    { id: 2, nome: "Maria Santos", idade: "15", turma: "1º A", disciplinas: 12, comportamento: "bom" },
    { id: 3, nome: "Pedro Oliveira", idade: "14", turma: "1º B", disciplinas: 12, comportamento: "ruim" },
    { id: 4, nome: "Ana Costa", idade: "15", turma: "1º B", disciplinas: 12, comportamento: "excelente" },
    { id: 5, nome: "Lucas Ferreira", idade: "16", turma: "2º A", disciplinas: 12, comportamento: "bom" },
    { id: 6, nome: "Carla Souza", idade: "16", turma: "2º A", disciplinas: 12, comportamento: "excelente" },
  ];

  const professoresFiltrados = React.useMemo(() => {
    const filtrados = filtrarPorDepartamento(professores, selectedDepartment);
    const termo = normalizarTexto(searchTerm);
    return filtrados.filter((prof) => normalizarTexto(prof.nome).includes(termo));
  }, [searchTerm, selectedDepartment]);

  const alunosFiltrados = React.useMemo(() => {
    const filtrados = filtrarPorTurma(alunos, selectedTurma);
    const termo = normalizarTexto(searchTerm);
    return filtrados.filter((aluno) => normalizarTexto(aluno.nome).includes(termo));
  }, [searchTerm, selectedTurma]);

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
          {selectedType === "professores" ? (
            // PROFESSORES
            professoresFiltrados.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground text-lg">Nenhum professor encontrado</p>
              </div>
            ) : viewMode === "grid" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {professoresFiltrados.map((prof) => (
                <Link key={prof.id} to={`/perfilProfessor?professorId=${prof.id}&from=admin`}>
                  <Card className="hover:shadow-lg transition-shadow border-border flex flex-col items-center text-center cursor-pointer">
                    <CardHeader className="flex flex-col items-center w-full pb-2">
                      <Avatar className="h-16 w-16">
                        <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=prof${prof.id}`} />
                        <AvatarFallback className="bg-primary text-primary-foreground text-lg">
                          {prof.nome.split(" ")[0][0]}
                        </AvatarFallback>
                      </Avatar>
                    </CardHeader>

                    <CardContent className="flex flex-col items-center w-full pt-0">
                    <div className="space-y-1 w-full text-center">
                      <CardTitle className="text-lg">{prof.nome}</CardTitle>
                      <CardDescription className="text-muted-foreground text-sm">Idade: {prof.idade}</CardDescription>
                      <p className="text-sm text-muted-foreground">Depto: {prof.departamento}</p>
                    </div>

                    <div className="text-muted-foreground text-sm flex items-center justify-center gap-1 mt-2">
                      <Building2 className="h-4 w-4" /> {prof.turmas} turmas
                    </div>

                    <div className="mt-2">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          prof.status === "ativo" ? "bg-green-500/15 text-green-600" : "bg-red-500/15 text-red-600"
                        }`}
                      >
                        {prof.status === "ativo" ? "Ativo" : "Inativo"}
                      </span>
                    </div>
                  </CardContent>
                </Card>
                </Link>
              ))}
            </div>
          ) : (
            <div className="space-y-3">
              {professoresFiltrados.map((prof) => (
                <Link key={prof.id} to={`/perfilProfessor?professorId=${prof.id}&from=admin`}>
                  <div className="flex items-center justify-between p-4 bg-card border border-border rounded-lg hover:shadow-lg transition-shadow cursor-pointer">
                    <div className="flex items-center gap-4 flex-1">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=prof${prof.id}`} />
                        <AvatarFallback className="bg-primary text-primary-foreground">
                          {prof.nome.split(" ")[0][0]}
                        </AvatarFallback>
                      </Avatar>

                      <div className="flex-1">
                        <p className="font-semibold text-foreground">{prof.nome}</p>
                        <div className="flex gap-4 text-xs text-muted-foreground">
                          <span>{prof.departamento}</span>
                          <span className="flex items-center gap-1"><User className="h-3 w-3" /> {prof.idade} anos</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          prof.status === "ativo" ? "bg-green-500/15 text-green-600" : "bg-red-500/15 text-red-600"
                        }`}
                      >
                        {prof.status === "ativo" ? "Ativo" : "Inativo"}
                      </span>

                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Building2 className="h-4 w-4" />
                        {prof.turmas}
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )
        ) : (
          // ALUNOS
          alunosFiltrados.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground text-lg">Nenhum aluno encontrado</p>
            </div>
          ) : viewMode === "grid" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {alunosFiltrados.map((aluno) => (
                <Link key={aluno.id} to={`/perfilAluno?alunoId=${aluno.id}&from=admin`}>
                  <Card className="hover:shadow-lg transition-shadow border-border flex flex-col items-center text-center cursor-pointer">
                    <CardHeader className="flex flex-col items-center w-full pb-2">
                      <Avatar className="h-16 w-16">
                        <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${aluno.id}`} />
                        <AvatarFallback className="bg-primary text-primary-foreground text-lg">
                          {aluno.nome.split(" ")[0][0]}
                        </AvatarFallback>
                      </Avatar>
                    </CardHeader>

                    <CardContent className="flex flex-col items-center w-full pt-0">
                      <div className="space-y-1 w-full text-center">
                        <CardTitle className="text-lg">{aluno.nome}</CardTitle>
                        <CardDescription className="text-muted-foreground text-sm">Idade: {aluno.idade}</CardDescription>
                        <p className="text-sm text-muted-foreground">Turma: {aluno.turma}</p>
                      </div>

                      <CardDescription className="text-muted-foreground text-sm flex items-center justify-center gap-1 mt-2">
                        <BookOpen className="h-3 w-3" />
                        {aluno.disciplinas} Disciplinas
                      </CardDescription>
                      
                      <div className="flex justify-center mt-2">
                        <ComportamentoTag tipo={aluno.comportamento} />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          ) : (
            <div className="space-y-3">
              {alunosFiltrados.map((aluno) => (
                <Link key={aluno.id} to={`/perfilAluno?alunoId=${aluno.id}&from=admin`}>
                  <div className="flex items-center justify-between p-4 bg-card border border-border rounded-lg hover:shadow-lg transition-shadow cursor-pointer">
                    <div className="flex items-center gap-4 flex-1">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${aluno.id}`} />
                        <AvatarFallback className="bg-primary text-primary-foreground">
                          {aluno.nome.split(" ")[0][0]}
                        </AvatarFallback>
                      </Avatar>

                      <div className="flex-1">
                        <p className="font-semibold text-foreground">{aluno.nome}</p>
                        <div className="flex gap-4 text-xs text-muted-foreground">
                          <span>{aluno.turma}</span>
                          <span className="flex items-center gap-1"><User className="h-3 w-3" /> {aluno.idade} anos</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <ComportamentoTag tipo={aluno.comportamento} />
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <BookOpen className="h-4 w-4" />
                        {aluno.disciplinas}
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )
        )}
        </div>
      </section>
    </>
  );
}
