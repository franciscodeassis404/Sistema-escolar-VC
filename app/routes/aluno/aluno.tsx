import * as React from "react";
import { BookOpen, Info, User, ChevronRight, Moon, Sun } from "lucide-react";

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

  const student = {
    nome: "Francisco de Assis Silva Passos",
    idade: 15,
    turma: "9 ano A",
    id: "#010101010101010",
    statusMatricula: "matriculado",
    statusComportamento: "excelente",
    foto: "/gatitu.jpg",
    disciplinas: [
      "Matemática",
      "História",
      "Geografia",
      "Ciências",
      "Português",
      "Inglês",
    ],
    comportamentoHistorico: [
      { bimestre: "1º Bimestre", meses: "Jan - Mar", status: "excelente" },
      { bimestre: "2º Bimestre", meses: "Abril - Jun", status: "bom" },
    ],
  };

  return (
    <main className={`min-h-screen w-full ${darkMode ? "dark" : ""}`}>
      <div className="min-h-screen w-full bg-[#F4F7FA] dark:bg-[#0D1117] dark:text-white transition">

        {/* TOPO */}
        <header className="w-full border-b bg-white dark:bg-[#161B22] dark:border-gray-700 h-20 flex items-center justify-between px-10 shadow-sm">
          <div className="flex items-center gap-3">
            <img
              src={student.foto}
              className="w-10 h-10 rounded-full border border-gray-300 dark:border-gray-600"
            />
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Meu Perfil</p>
              <p className="font-medium">{student.nome}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">

            {/* INTERRUPTOR FODA DE TEMA */}
            <button
              onClick={() => setDarkMode(!darkMode)}
              className={`
                w-20 h-10 rounded-full flex items-center px-1 transition-all duration-300 relative
                ${darkMode ? "bg-[#09121C]" : "bg-gray-300"}
              `}
            >
              {/* DESLIZADAS DELICIOSAS */}
              <div
                className={`
                  w-8 h-8 rounded-full bg-white shadow flex items-center justify-center absolute transition-all duration-300
                  ${darkMode ? "translate-x-10" : "translate-x-0"}
                `}
              >
                {darkMode ? (
                  <Moon className="w-5 h-5 text-blue-300" />
                ) : (
                  <Sun className="w-5 h-5 text-yellow-500" />
                )}
              </div>
            </button>

            <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition">
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </header>

        {/* CONTEÚDO */}
        <div className="px-10 py-10">
          <h1 className="text-3xl font-bold">
            Bem-vindo, {student.nome.split(" ")[0]}!
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mt-1">
            Aqui você pode visualizar suas informações e notas de comportamento
          </p>

          {/* GRID AJUSTADA */}
          <div className="grid grid-cols-4 gap-10 mt-10 items-start">

            {/* COLUNA ESQUERDA */}
            <div className="col-span-1 h-full">
              <div
                className="
                  bg-white dark:bg-[#161B22] 
                  shadow-[0_4px_20px_rgba(0,0,0,0.08)]
                  dark:shadow-[0_4px_20px_rgba(0,0,0,0.4)]
                  rounded-xl 
                  p-6 text-center 
                  h-full w-full 
                  min-h-[900px] 
                  flex flex-col items-center justify-start
                "
              >
                <img
                  src={student.foto}
                  className="w-28 h-28 rounded-full mx-auto border-4 border-blue-400 shadow"
                />

                <h2 className="text-xl font-semibold mt-4">{student.nome}</h2>
                <p className="text-sm text-gray-500 dark:text-gray-300">{student.turma}</p>

                <div
                  className={`mt-3 text-white rounded-full px-4 py-1 text-sm font-medium ${comportamentoColor[student.statusComportamento]}`}
                >
                  {student.statusComportamento.charAt(0).toUpperCase() +
                    student.statusComportamento.slice(1)}
                </div>

                <div className="flex items-center justify-center gap-2 mt-4 text-sm text-gray-600 dark:text-gray-300">
                  <BookOpen className="w-4 h-4" />
                  {student.disciplinas.length} disciplinas
                </div>
              </div>
            </div>

            {/* COLUNA DIREITA */}
            <div className="col-span-3 flex flex-col gap-10">

              {/* INFORMAÇÕES PESSOAIS */}
              <div className="
                bg-white dark:bg-[#161B22] 
                shadow-[0_4px_20px_rgba(0,0,0,0.08)]
                dark:shadow-[0_4px_20px_rgba(0,0,0,0.4)]
                rounded-xl p-6 
                min-h-[300px]
              ">
                <h2 className="flex items-center gap-2 text-lg font-semibold">
                  <Info className="w-5 h-5 text-blue-600" />
                  Informações pessoais
                </h2>

                <div className="grid grid-cols-3 gap-4 mt-4">

                  {/* COLUNA 1 — IDADE + ID */}
                  <div>
                    <p className="text-gray-500 dark:text-gray-300 text-sm">Idade</p>
                    <p className="font-semibold">{student.idade} anos</p>

                    <p className="text-gray-500 dark:text-gray-300 text-sm mt-4">ID do aluno</p>
                    <p className="font-semibold">{student.id}</p>
                  </div>

                  {/* COLUNA 2 — TURMA + STATUS */}
                  <div>
                    <p className="text-gray-500 dark:text-gray-300 text-sm">Turma</p>
                    <p className="font-semibold">{student.turma}</p>

                    <p className="text-gray-500 dark:text-gray-300 text-sm mt-4">Status</p>
                    <span
                      className={`px-3 py-1 text-white rounded-full text-sm font-medium ${
                        student.statusMatricula === "matriculado"
                          ? "bg-green-600"
                          : "bg-red-600"
                      }`}
                    >
                      {student.statusMatricula === "matriculado"
                        ? "Matriculado"
                        : "Não matriculado"}
                    </span>
                  </div>

                  <div></div>
                </div>
              </div>

              {/* DISCIPLINAS */}
              <div className="
                bg-white dark:bg-[#161B22]
                shadow-[0_4px_20px_rgba(0,0,0,0.08)]
                dark:shadow-[0_4px_20px_rgba(0,0,0,0.4)]
                rounded-xl p-6 
                min-h-[300px]
              ">
                <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <User className="w-5 h-5 text-blue-600" />
                  Minhas disciplinas
                </h2>

                <div className="grid grid-cols-3 gap-3">
                  {student.disciplinas.map((disciplina, index) => (
                    <div
                      key={index}
                      className="px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 flex items-center gap-2 text-gray-700 dark:text-gray-200 text-sm"
                    >
                      <BookOpen className="w-4 h-4 text-blue-600" />
                      {disciplina}
                    </div>
                  ))}
                </div>
              </div>

              {/* HISTÓRICO DE COMPORTAMENTO */}
              <div className="
                bg-white dark:bg-[#161B22]
                shadow-[0_4px_20px_rgba(0,0,0,0.08)]
                dark:shadow-[0_4px_20px_rgba(0,0,0,0.4)]
                rounded-xl p-6 
                min-h-[300px]
              ">
                <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Info className="w-5 h-5 text-blue-600" />
                  Histórico de comportamento
                </h2>

                <div className="flex flex-col gap-4">
                  {student.comportamentoHistorico.map((item, index) => (
                    <div
                      key={index}
                      className="bg-gradient-to-r from-blue-100 to-green-100 
                                 dark:from-[#1f2937] dark:to-[#1e3a34] 
                                 rounded-lg p-4 flex items-center justify-between"
                    >
                      <div>
                        <p className="font-semibold">{item.bimestre}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-300">{item.meses}</p>
                      </div>

                      <span
                        className={`${comportamentoColor[item.status]} text-white px-4 py-1 rounded-full text-sm font-medium`}
                      >
                        {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
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
