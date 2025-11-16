import * as React from "react";
import type {Route} from "./+types/professor";

import {Navbar} from "./../../components/ui/navbar";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "~/components/ui/avatar";
import { ComportamentoTag } from "~/components/ui/comportamento-tag";
import { Grid3x3, Search, BookOpen, List, User } from "lucide-react";

type Aluno = {
  id: number;
  nome: string;
  idade: string;
  turma: string;
  disciplinas: number;
  comportamento: "bom" | "ruim" | "excelente";
};

const normalizarTexto = (texto: string): string => {
  return texto.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
};

const filtrarPorTurma = (alunos: Aluno[], turma: string): Aluno[] => {
  if (turma === "Todas") return alunos;
  return alunos.filter((aluno) => aluno.turma === turma);
};

export default function ProfessorRoute() {
  const [searchTerm, setSearchTerm] = React.useState("");
  const [selectedClass, setSelectedClass] = React.useState("Todas");
  const [viewMode, setViewMode] = React.useState<"grid" | "list">("grid");

  // Dados de exemplo
  const turmas = ["Todas", "1º A", "1º B", "2º A", "2º B", "3º A"];
  const alunos: Aluno[] = [
    { id: 1, nome: "João Silva", idade: "14", turma: "1º A", disciplinas: 12, comportamento: "excelente" },
    { id: 2, nome: "Maria Santos", idade: "15", turma: "1º A", disciplinas: 12, comportamento: "bom" },
    { id: 3, nome: "Pedro Oliveira", idade: "14", turma: "1º B", disciplinas: 12, comportamento: "ruim" },
    { id: 4, nome: "Ana Costa", idade: "15", turma: "1º B", disciplinas: 12, comportamento: "excelente" },
    { id: 5, nome: "Lucas Ferreira", idade: "16", turma: "2º A", disciplinas: 12, comportamento: "bom" },
    { id: 6, nome: "Carla Souza", idade: "16", turma: "2º A", disciplinas: 12, comportamento: "excelente" },
    { id: 7, nome: "Bruno Costa", idade: "17", turma: "2º B", disciplinas: 12, comportamento: "ruim" },
    { id: 8, nome: "Juliana Lima", idade: "17", turma: "2º B", disciplinas: 12, comportamento: "bom" },
    { id: 9, nome: "Rafael Mendes", idade: "16", turma: "2º B", disciplinas: 12, comportamento: "excelente" },
  ];

  // Filtrar alunos
  const alunosFiltrados = React.useMemo(() => {
    const alunosPorTurma = filtrarPorTurma(alunos, selectedClass);
    const termoNormalizado = normalizarTexto(searchTerm);
    
    return alunosPorTurma.filter((aluno: Aluno) => {
      const nomeNormalizado = normalizarTexto(aluno.nome);
      return nomeNormalizado.includes(termoNormalizado);
    });
  }, [searchTerm, selectedClass]);

  return (
    <>
      <Navbar />
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
                    placeholder="Digite o nome ou matrícula do aluno..."
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
                  {turmas.map((turma) => (
                    <Button
                      key={turma}
                      variant={selectedClass === turma ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedClass(turma)}
                      className="hover:bg-primary hover:text-primary-foreground hover:border-primary"
                    >
                      {turma}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Botão Grid */}
              <div className="ml-auto flex gap-2">
                <Button
                  variant={viewMode === "grid" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setViewMode("grid")}
                  className="flex items-center gap-2 hover:bg-primary hover:text-primary-foreground"
                >
                  <Grid3x3 className="h-4 w-4" />
                  Grade
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                  className="flex items-center gap-2 hover:bg-primary hover:text-primary-foreground"
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
          {alunosFiltrados.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground text-lg">Nenhum aluno encontrado</p>
            </div>
          ) : viewMode === "grid" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {alunosFiltrados.map((aluno) => (
                <Card key={aluno.id} className="hover:shadow-lg transition-shadow border-border flex flex-col items-center text-center">
                  <CardHeader className="flex flex-col items-center w-full pb-2">
                    <Avatar className="h-16 w-16">
                      <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${aluno.id}`} />
                      <AvatarFallback className="bg-primary text-primary-foreground text-lg">{aluno.nome.split(" ")[0][0]}</AvatarFallback>
                    </Avatar>
                  </CardHeader>
                  <CardContent className="flex flex-col items-center w-full pt-0">
                    <div className="space-y-1 w-full text-center">
                      <div>
                        <CardTitle className="text-lg">{aluno.nome}</CardTitle>
                        <CardDescription className="text-muted-foreground text-sm mb-0">Idade: {aluno.idade}</CardDescription>
                        <p className="text-sm text-muted-foreground mt-0">Turma: {aluno.turma}</p>
                      </div>
                      <CardDescription className="text-muted-foreground text-sm flex items-center justify-center gap-1">
                          <BookOpen className="h-3 w-3" />
                          {aluno.disciplinas} Disciplinas
                        </CardDescription>
                        <div className="flex justify-center">
                          <ComportamentoTag tipo={aluno.comportamento} />
                        </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="space-y-3">
              {alunosFiltrados.map((aluno) => (
                <div key={aluno.id} className="flex items-center justify-between p-4 bg-card border border-border rounded-lg hover:shadow-lg transition-shadow">
                  <div className="flex items-center gap-4 flex-1">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${aluno.id}`} />
                      <AvatarFallback className="bg-primary text-primary-foreground">{aluno.nome.split(" ")[0][0]}</AvatarFallback>
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
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
