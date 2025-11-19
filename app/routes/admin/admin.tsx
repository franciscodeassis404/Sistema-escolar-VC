import * as React from "react";
import { Navbar } from "./../../components/ui/navbar";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "~/components/ui/avatar";
import { Grid3x3, Search, List, User, Building2, Sun, Moon, Plus } from "lucide-react";

type Professor = {
  id: number;
  nome: string;
  idade: string;
  departamento: string;
  turmas: number;
  status: "ativo" | "inativo";
};

const normalizarTexto = (texto: string) =>
  texto.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

const filtrarPorDepartamento = (lista: Professor[], departamento: string) =>
  departamento === "Todos" ? lista : lista.filter((p) => p.departamento === departamento);

function ThemeToggle() {
  // Mantém tema no localStorage e aplica classe 'dark' no <html>
  const [isDark, setIsDark] = React.useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    const saved = localStorage.getItem("theme");
    if (saved) return saved === "dark";
    // fallback: prefer-color-scheme
    return window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
  });

  React.useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      root.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [isDark]);

  return (
    <Button
      onClick={() => setIsDark((s) => !s)}
      variant="ghost"
      size="sm"
      className="flex items-center gap-2"
      aria-label="Alternar tema"
    >
      <div className="relative w-12 h-6 rounded-full p-0.5 border border-border flex items-center">
        <div
          className={`absolute inset-0 rounded-full transition-colors ${isDark ? "bg-gray-700" : "bg-gray-200"}`}
        />
        <div
          className={`relative z-10 flex items-center justify-center w-5 h-5 rounded-full bg-white shadow transform transition-transform ${
            isDark ? "translate-x-6" : "translate-x-0"
          }`}
        >
          {isDark ? <Moon className="w-3 h-3 text-gray-700" /> : <Sun className="w-3 h-3 text-yellow-500" />}
        </div>
      </div>
    </Button>
  );
}

export default function AdminRoute() {
  const [searchTerm, setSearchTerm] = React.useState("");
  const [selectedType, setSelectedType] = React.useState<"alunos" | "professores">("alunos");
  const [selectedDepartment, setSelectedDepartment] = React.useState("Todos");
  const [viewMode, setViewMode] = React.useState<"grid" | "list">("grid");

  const departamentos = ["Todos", "Matemática", "Português", "Ciências", "História", "Geografia"];

  const professores: Professor[] = [
    { id: 1, nome: "Carlos Almeida", idade: "35", departamento: "Matemática", turmas: 4, status: "ativo" },
    { id: 2, nome: "Fernanda Ribeiro", idade: "42", departamento: "Português", turmas: 5, status: "ativo" },
    { id: 3, nome: "Ricardo Souza", idade: "39", departamento: "História", turmas: 3, status: "inativo" },
    { id: 4, nome: "Patrícia Gomes", idade: "33", departamento: "Ciências", turmas: 4, status: "ativo" },
    { id: 5, nome: "Marcos Lima", idade: "45", departamento: "Geografia", turmas: 2, status: "ativo" },
  ];

  const professoresFiltrados = React.useMemo(() => {
    const filtrados = filtrarPorDepartamento(professores, selectedDepartment);
    const termo = normalizarTexto(searchTerm);
    return filtrados.filter((prof) => normalizarTexto(prof.nome).includes(termo));
  }, [searchTerm, selectedDepartment]);

  return (
    <>
      <Navbar />

      <section className="flex min-h-screen flex-col bg-background dark:bg-gray-900">
        {/* Top bar customizada (seguindo referência) */}
        <div className="flex items-center justify-between border-b border-border bg-card dark:bg-gray-800 px-8 py-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Dashboard Admin</h1>
            <p className="text-muted-foreground">Bem-vindo (a)! Aqui você pode criar novos usuários e tem acesso às informações dos alunos e professores.</p>
          </div>

          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Button variant="ghost" size="sm" className="hidden md:flex items-center gap-2">
              <User className="h-4 w-4" />
              Admin
            </Button>
            <Button variant="secondary" size="sm" className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Novo usuário
            </Button>
          </div>
        </div>

        {/* Filtros / Busca */}
        <div className="bg-card dark:bg-gray-800 border-b border-border px-8 py-6">
          <div className="flex flex-col gap-4">
            <div className="flex gap-4 items-center">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                  <Input
                    placeholder="Digite o nome do aluno (a) ou professor (a)"
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
              <div>
                <label className="text-sm font-medium mb-2 block text-foreground">Filtrar por Matéria</label>
                <div className="flex gap-2 flex-wrap">
                  {departamentos.map((dep) => (
                    <Button
                      key={dep}
                      variant={selectedDepartment === dep ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedDepartment(dep)}
                    >
                      {dep}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Conteúdo principal */}
        <div className="flex-1 px-8 py-8 bg-background">
          {professoresFiltrados.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground text-lg">Nenhum usuário encontrado</p>
            </div>
          ) : viewMode === "grid" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {professoresFiltrados.map((prof) => (
                <Card key={prof.id} className="hover:shadow-lg transition-shadow border-border flex flex-col items-center text-center">
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
              ))}
            </div>
          ) : (
            <div className="space-y-3">
              {professoresFiltrados.map((prof) => (
                <div key={prof.id} className="flex items-center justify-between p-4 bg-card border border-border rounded-lg hover:shadow-lg transition-shadow">
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
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
