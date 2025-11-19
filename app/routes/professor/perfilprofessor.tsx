import * as React from "react";
import type {Route} from "./+types/perfilprofessor";
import { useSearchParams, useNavigate } from "react-router";
import { BookOpen, LogOut, TrendingUp, GraduationCap, ArrowLeft } from "lucide-react";
import { ComportamentoTag } from "~/components/ui/comportamento-tag";

const comportamentoColor: Record<string, string> = {
  pessimo: "bg-red-500",
  ruim: "bg-orange-500",
  mediano: "bg-yellow-500",
  bom: "bg-blue-500",
  excelente: "bg-green-500",
};

export default function PerfilProfessorRoute() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const alunoId = searchParams.get('alunoId');

  // Dados simulados de alunos
  const todosAlunos = [
    { id: 1, nome: "João Silva", idade: 14, turma: "1º A", id_matricula: "#010101010101010", statusMatricula: "Matriculado", statusComportamento: "excelente", foto: "https://api.dicebear.com/7.x/avataaars/svg?seed=1", disciplinas: ["Matemática", "História", "Geografia", "Ciências", "Português", "Inglês"], comportamentoHistorico: [{ bimestre: "1 Bimestre", meses: "Jan - Mar", status: "excelente" }, { bimestre: "2 Bimestre", meses: "Abril - Jun", status: "bom" }] },
    { id: 2, nome: "Maria Santos", idade: 15, turma: "1º A", id_matricula: "#020202020202020", statusMatricula: "Matriculado", statusComportamento: "bom", foto: "https://api.dicebear.com/7.x/avataaars/svg?seed=2", disciplinas: ["Matemática", "História", "Geografia", "Ciências", "Português", "Inglês"], comportamentoHistorico: [{ bimestre: "1 Bimestre", meses: "Jan - Mar", status: "bom" }, { bimestre: "2 Bimestre", meses: "Abril - Jun", status: "excelente" }] },
    { id: 3, nome: "Pedro Oliveira", idade: 14, turma: "1º B", id_matricula: "#030303030303030", statusMatricula: "Matriculado", statusComportamento: "ruim", foto: "https://api.dicebear.com/7.x/avataaars/svg?seed=3", disciplinas: ["Matemática", "História", "Geografia", "Ciências", "Português", "Inglês"], comportamentoHistorico: [{ bimestre: "1 Bimestre", meses: "Jan - Mar", status: "bom" }, { bimestre: "2 Bimestre", meses: "Abril - Jun", status: "ruim" }] },
    { id: 4, nome: "Ana Costa", idade: 15, turma: "1º B", id_matricula: "#040404040404040", statusMatricula: "Matriculado", statusComportamento: "excelente", foto: "https://api.dicebear.com/7.x/avataaars/svg?seed=4", disciplinas: ["Matemática", "História", "Geografia", "Ciências", "Português", "Inglês"], comportamentoHistorico: [{ bimestre: "1 Bimestre", meses: "Jan - Mar", status: "excelente" }, { bimestre: "2 Bimestre", meses: "Abril - Jun", status: "excelente" }] },
    { id: 5, nome: "Lucas Ferreira", idade: 16, turma: "2º A", id_matricula: "#050505050505050", statusMatricula: "Matriculado", statusComportamento: "bom", foto: "https://api.dicebear.com/7.x/avataaars/svg?seed=5", disciplinas: ["Matemática", "História", "Geografia", "Ciências", "Português", "Inglês"], comportamentoHistorico: [{ bimestre: "1 Bimestre", meses: "Jan - Mar", status: "bom" }, { bimestre: "2 Bimestre", meses: "Abril - Jun", status: "bom" }] },
    { id: 6, nome: "Carla Souza", idade: 16, turma: "2º A", id_matricula: "#060606060606060", statusMatricula: "Matriculado", statusComportamento: "excelente", foto: "https://api.dicebear.com/7.x/avataaars/svg?seed=6", disciplinas: ["Matemática", "História", "Geografia", "Ciências", "Português", "Inglês"], comportamentoHistorico: [{ bimestre: "1 Bimestre", meses: "Jan - Mar", status: "excelente" }, { bimestre: "2 Bimestre", meses: "Abril - Jun", status: "excelente" }] },
    { id: 7, nome: "Bruno Costa", idade: 17, turma: "2º B", id_matricula: "#070707070707070", statusMatricula: "Matriculado", statusComportamento: "ruim", foto: "https://api.dicebear.com/7.x/avataaars/svg?seed=7", disciplinas: ["Matemática", "História", "Geografia", "Ciências", "Português", "Inglês"], comportamentoHistorico: [{ bimestre: "1 Bimestre", meses: "Jan - Mar", status: "ruim" }, { bimestre: "2 Bimestre", meses: "Abril - Jun", status: "bom" }] },
    { id: 8, nome: "Juliana Lima", idade: 17, turma: "2º B", id_matricula: "#080808080808080", statusMatricula: "Matriculado", statusComportamento: "bom", foto: "https://api.dicebear.com/7.x/avataaars/svg?seed=8", disciplinas: ["Matemática", "História", "Geografia", "Ciências", "Português", "Inglês"], comportamentoHistorico: [{ bimestre: "1 Bimestre", meses: "Jan - Mar", status: "bom" }, { bimestre: "2 Bimestre", meses: "Abril - Jun", status: "excelente" }] },
    { id: 9, nome: "Rafael Mendes", idade: 16, turma: "2º B", id_matricula: "#090909090909090", statusMatricula: "Matriculado", statusComportamento: "excelente", foto: "https://api.dicebear.com/7.x/avataaars/svg?seed=9", disciplinas: ["Matemática", "História", "Geografia", "Ciências", "Português", "Inglês"], comportamentoHistorico: [{ bimestre: "1 Bimestre", meses: "Jan - Mar", status: "excelente" }, { bimestre: "2 Bimestre", meses: "Abril - Jun", status: "excelente" }] },
  ];

  const aluno = todosAlunos.find(a => a.id === Number(alunoId)) || todosAlunos[0];

  const professor = {
    nome: aluno.nome,
    idade: aluno.idade,
    turma: aluno.turma,
    id: aluno.id_matricula,
    statusMatricula: aluno.statusMatricula,
    statusComportamento: aluno.statusComportamento,
    foto: aluno.foto,
    disciplinas: aluno.disciplinas,
    comportamentoHistorico: aluno.comportamentoHistorico,
  };

  const handleLogout = () => {
    console.log("Deslogando...");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="w-full bg-white border-b border-gray-200 px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <button
            onClick={() => navigate('/professor')}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            title="Voltar"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <div className="flex items-center gap-3">
          <img
            src={professor.foto}
            alt={professor.nome}
            className="w-10 h-10 rounded-full"
          />
          <div>
            <p className="text-sm font-semibold text-gray-800">Perfil do aluno</p>
            <p className="text-xs text-gray-500">{professor.nome}</p>
          </div>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          title="Sair"
        >
        </button>
      </nav>

      <div className="px-8 py-8 h-[calc(100vh-4rem)]">
        {/* Título */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Bem-vindo, Professor!
          </h1>
          <p className="text-gray-600">
            Aqui você pode visualizar as informações e notas de comportamento de seus alunos
          </p>
        </div>

    
        <div className="grid grid-cols-12 gap-6 h-[calc(100%-8rem)]">
          {/* Sidebar */}
          <div className="col-span-3 h-full">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 flex flex-col items-center h-full">
              <img
                src={professor.foto}
                alt={professor.nome}
                className="w-24 h-24 rounded-full mb-4"
              />
              
              <h2 className="text-lg font-semibold text-gray-900 text-center mb-1">
                {professor.nome}
              </h2>
              
              <p className="text-sm text-gray-500 mb-3">{professor.turma}</p>

              <div className="mb-4">
                <ComportamentoTag tipo={professor.statusComportamento as "bom" | "ruim" | "excelente"} />
              </div>

              <div className="flex items-center gap-2 text-sm text-gray-600">
                <BookOpen className="w-4 h-4" />
                <span>10 disciplinas</span>
              </div>
            </div>
          </div>

          <div className="col-span-9 flex flex-col gap-6 h-full overflow-y-auto">
            {/* INFORMAÇÕES PESSOAIS */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <h2 className="flex items-center gap-2 text-lg font-semibold text-gray-900 mb-6">
                <GraduationCap className="w-5 h-5 text-blue-600" />
                Informações pessoais
              </h2>

              <div className="grid grid-cols-3 gap-8">
                <div>
                  <p className="text-xs text-gray-500 mb-1">Idade</p>
                  <p className="text-base font-semibold text-gray-900">{professor.idade} anos</p>
                </div>

                <div>
                  <p className="text-xs text-gray-500 mb-1">Turma</p>
                  <p className="text-base font-semibold text-gray-900">{professor.turma}</p>
                </div>

                <div></div>

                <div>
                  <p className="text-xs text-gray-500 mb-1">ID aluno</p>
                  <p className="text-base font-semibold text-gray-900">{professor.id}</p>
                </div>

                <div>
                  <p className="text-xs text-gray-500 mb-1">Status</p>
                  <span className="inline-block bg-green-500 text-white text-xs font-medium px-3 py-1 rounded-full">
                    {professor.statusMatricula}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <h2 className="flex items-center gap-2 text-lg font-semibold text-gray-900 mb-6">
                <BookOpen className="w-5 h-5 text-blue-600" />
                Disciplinas Cadastradas
              </h2>

              <div className="grid grid-cols-3 gap-3">
                {professor.disciplinas.map((disciplina, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 bg-blue-50 text-blue-700 px-4 py-3 rounded-xl"
                  >
                    <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                      <BookOpen className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-sm font-medium">{disciplina}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* HISTÓRICO DE COMPORTAMENTO */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <h2 className="flex items-center gap-2 text-lg font-semibold text-gray-900 mb-6">
                <TrendingUp className="w-5 h-5 text-blue-600" />
                Histórico de comportamento
              </h2>

              <div className="space-y-3">
                {professor.comportamentoHistorico.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between bg-blue-50 px-6 py-4 rounded-xl"
                  >
                    <div>
                      <p className="text-sm font-semibold text-gray-900">{item.bimestre}</p>
                      <p className="text-xs text-gray-500">{item.meses}</p>
                    </div>
                    <ComportamentoTag tipo={item.status as "bom" | "ruim" | "excelente"} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}