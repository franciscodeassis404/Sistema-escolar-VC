import * as React from "react";
import {
  BookOpen,
  Info,
  User,
  ChevronRight,
  Moon,
  Sun,
} from "lucide-react";
import {Navbar} from "./../../components/ui/navbar";

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
      <main
        className={`min-h-screen w-full ${
          darkMode ? "dark" : ""
        } transition-colors duration-500`}
      >
        <div className="min-h-screen w-full bg-[#F4F7FA] dark:bg-[#0D1117] dark:text-white transition-colors duration-500">

          {/* NAVBAR AQUI */}
          <Navbar />

          {/* CONTEÚDO */}
          <div className="px-10 py-10 animate-fadeIn">

            <h1 className="text-3xl font-bold animate-fadeIn">
              Bem-vindo, {student.nome.split(" ")[0]}!
            </h1>

            <p className="text-gray-600 dark:text-gray-300 mt-1 animate-fadeIn">
              Aqui você pode visualizar suas informações e notas de comportamento
            </p>

            {/* GRID */}
            <div className="grid grid-cols-4 gap-10 mt-10 items-start">

              {/* COLUNA ESQUERDA */}
              <div className="col-span-1 animate-fadeIn">
                <div
                  className="
                    bg-white dark:bg-[#161B22]
                    shadow-[0_4px_20px_rgba(0,0,0,0.08)]
                    dark:shadow-[0_4px_20px_rgba(0,0,0,0.4)]
                    rounded-xl p-6 text-center
                    h-full w-full min-h-[980px]
                    flex flex-col items-center justify-start
                    pop card-anim glow tilt
                  "
                >
                  <img
                    src={student.foto}
                    className="w-28 h-28 rounded-full mx-auto border-4 border-blue-400 shadow-lg animate-fadeIn"
                  />

                  <h2 className="text-xl font-semibold mt-4 animate-fadeIn">
                    {student.nome}
                  </h2>

                  <p className="text-sm text-gray-500 dark:text-gray-300 animate-fadeIn">
                    {student.turma}
                  </p>

                  <div
                    className={`
                      mt-3 text-white rounded-full px-4 py-1 text-sm font-medium pulse animate-fadeIn
                      ${comportamentoColor[student.statusComportamento]}
                    `}
                  >
                    {student.statusComportamento.charAt(0).toUpperCase() +
                      student.statusComportamento.slice(1)}
                  </div>

                  <div className="flex items-center justify-center gap-2 mt-4 text-sm text-gray-600 dark:text-gray-300 animate-fadeIn">
                    <BookOpen className="w-4 h-4" />
                    {student.disciplinas.length} disciplinas
                  </div>
                </div>
              </div>

              {/* COLUNA DIREITA */}
              <div className="col-span-3 flex flex-col gap-10 animate-fadeIn">

                {/* INFORMAÇÕES PESSOAIS */}
                <div
                  className="
                    bg-white dark:bg-[#161B22]
                    shadow-[0_4px_20px_rgba(0,0,0,0.08)]
                    dark:shadow-[0_4px_20px_rgba(0,0,0,0.4)]
                    rounded-xl p-6 min-h-[300px]
                    pop glow tilt card-anim
                  "
                >
                  <h2 className="flex items-center gap-2 text-lg font-semibold animate-fadeIn">
                    <Info className="w-5 h-5 text-blue-600" />
                    Informações pessoais
                  </h2>

                  <div className="grid grid-cols-3 gap-4 mt-4 animate-fadeIn">

                    <div>
                      <p className="text-gray-500 dark:text-gray-300 text-sm">Idade</p>
                      <p className="font-semibold">{student.idade} anos</p>

                      <p className="text-gray-500 dark:text-gray-300 text-sm mt-4">
                        ID do aluno
                      </p>
                      <p className="font-semibold">{student.id}</p>
                    </div>

                    <div>
                      <p className="text-gray-500 dark:text-gray-300 text-sm">Turma</p>
                      <p className="font-semibold">{student.turma}</p>

                      <p className="text-gray-500 dark:text-gray-300 text-sm mt-4">Status</p>

                      <span
                        className={`
                          px-3 py-1 text-white rounded-full text-sm font-medium
                          ${
                            student.statusMatricula === "matriculado"
                              ? "bg-green-600"
                              : "bg-red-600"
                          }
                        `}
                      >
                        {student.statusMatricula === "matriculado"
                          ? "Matriculado"
                          : "Não matriculado"}
                      </span>
                    </div>

                  </div>
                </div>

                {/* DISCIPLINAS */}
                <div
                  className="
                    bg-white dark:bg-[#161B22]
                    shadow-[0_4px_20px_rgba(0,0,0,0.08)]
                    dark:shadow-[0_4px_20px_rgba(0,0,0,0.4)]
                    rounded-xl p-6 min-h-[300px]
                    pop glow tilt card-anim
                  "
                >
                  <h2 className="text-lg font-semibold mb-4 flex items-center gap-2 animate-fadeIn">
                    <User className="w-5 h-5 text-blue-600" />
                    Minhas disciplinas
                  </h2>

                  <div className="grid grid-cols-3 gap-3 animate-fadeIn">
                    {student.disciplinas.map((disciplina, index) => (
                      <div
                        key={index}
                        className="
                          px-4 py-2 rounded-lg
                          bg-gray-100 dark:bg-gray-700
                          flex items-center gap-2
                          text-gray-700 dark:text-gray-200 text-sm
                          pop glow transition
                        "
                      >
                        <BookOpen className="w-4 h-4 text-blue-600" />
                        {disciplina}
                      </div>
                    ))}
                  </div>
                </div>

                {/* HISTÓRICO DE COMPORTAMENTO */}
                <div
                  className="
                    bg-white dark:bg-[#161B22]
                    shadow-[0_4px_20px_rgba(0,0,0,0.08)]
                    dark:shadow-[0_4px_20px_rgba(0,0,0,0.4)]
                    rounded-xl p-6 min-h-[300px]
                    pop glow tilt card-anim
                  "
                >
                  <h2 className="text-lg font-semibold mb-4 flex items-center gap-2 animate-fadeIn">
                    <Info className="w-5 h-5 text-blue-600" />
                    Histórico de comportamento
                  </h2>

                  <div className="flex flex-col gap-4 animate-fadeIn">
                    {student.comportamentoHistorico.map((item, index) => (
                      <div
                        key={index}
                        className="
                          flex items-center justify-between
                          px-4 py-3 rounded-lg
                          bg-gray-100 dark:bg-gray-700
                          pop glow transition
                        "
                      >
                        <div>
                          <p className="font-semibold">{item.bimestre}</p>
                          <p className="text-sm text-gray-500 dark:text-gray-300">
                            {item.meses}
                          </p>
                        </div>

                        <span
                          className={`
                            px-3 py-1 text-white rounded-full text-sm font-medium
                            ${comportamentoColor[item.status]}
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
