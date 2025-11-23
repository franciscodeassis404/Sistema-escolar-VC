import * as React from "react";
import type {Route} from "./+types/perfilProfessor";
import { useSearchParams, useNavigate } from "react-router";
import { BookOpen, ArrowLeft, Users, GraduationCap, Pencil } from "lucide-react";

export default function PerfilProfessorRoute() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const professorId = searchParams.get('professorId');
  const from = searchParams.get('from') || 'admin';

  // Dados simulados de professores
  const todosProfessores = [
    { id: 1, nome: "Carlos Almeida", idade: 35, departamento: "Matemática", turmas: 4, status: "ativo", foto: "https://api.dicebear.com/7.x/avataaars/svg?seed=prof1", email: "carlos.almeida@escola.com", telefone: "(11) 98765-4321", turmasLecionadas: ["1º A", "1º B", "2º A", "2º B"] },
    { id: 2, nome: "Fernanda Ribeiro", idade: 42, departamento: "Português", turmas: 5, status: "ativo", foto: "https://api.dicebear.com/7.x/avataaars/svg?seed=prof2", email: "fernanda.ribeiro@escola.com", telefone: "(11) 98765-4322", turmasLecionadas: ["1º A", "1º B", "2º A", "2º B", "3º A"] },
    { id: 3, nome: "Ricardo Souza", idade: 39, departamento: "História", turmas: 3, status: "inativo", foto: "https://api.dicebear.com/7.x/avataaars/svg?seed=prof3", email: "ricardo.souza@escola.com", telefone: "(11) 98765-4323", turmasLecionadas: ["1º A", "2º A", "3º A"] },
    { id: 4, nome: "Patrícia Gomes", idade: 33, departamento: "Ciências", turmas: 4, status: "ativo", foto: "https://api.dicebear.com/7.x/avataaars/svg?seed=prof4", email: "patricia.gomes@escola.com", telefone: "(11) 98765-4324", turmasLecionadas: ["1º A", "1º B", "2º A", "2º B"] },
    { id: 5, nome: "Marcos Lima", idade: 45, departamento: "Geografia", turmas: 2, status: "ativo", foto: "https://api.dicebear.com/7.x/avataaars/svg?seed=prof5", email: "marcos.lima@escola.com", telefone: "(11) 98765-4325", turmasLecionadas: ["2º A", "3º A"] },
  ];

  const professor = todosProfessores.find(p => p.id === Number(professorId)) || todosProfessores[0];

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
              src={professor.foto}
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
                src={professor.foto}
                alt={professor.nome}
                className="w-32 h-32 rounded-full mb-4"
              />
              <h2 className="text-xl font-bold text-foreground mb-1">{professor.nome}</h2>
              <p className="text-sm text-muted-foreground mb-4">{professor.departamento}</p>
              
              <div className={`px-3 py-1 rounded-full text-xs font-medium mb-6 ${
                professor.status === "ativo" 
                  ? "bg-accent text-accent-foreground" 
                  : "bg-destructive/10 text-destructive"
              }`}>
                {professor.status === "ativo" ? "Ativo" : "Inativo"}
              </div>

              <div className="w-full space-y-4">
                <div className="flex items-center gap-3 text-foreground">
                  <GraduationCap className="w-5 h-5 text-primary" />
                  <div>
                    <p className="text-xs text-muted-foreground">Idade</p>
                    <p className="text-sm font-medium">{professor.idade} anos</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 text-foreground">
                  <Users className="w-5 h-5 text-primary" />
                  <div>
                    <p className="text-xs text-muted-foreground">Turmas</p>
                    <p className="text-sm font-medium">{professor.turmas} turmas</p>
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
                  <p className="text-xs text-muted-foreground mb-1">Telefone</p>
                  <p className="text-sm font-medium text-foreground">{professor.telefone}</p>
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
                  <p className="text-2xl font-bold text-primary">{professor.turmas * 25}</p>
                </div>
                <div className="bg-accent/20 border border-accent/40 rounded-lg p-4">
                  <p className="text-xs text-foreground mb-1">Turmas Ativas</p>
                  <p className="text-2xl font-bold text-foreground">{professor.turmas}</p>
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
