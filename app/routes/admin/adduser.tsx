import { ArrowLeft, Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

export default function AddUser() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-neutral-900 text-gray-800 dark:text-gray-100">
      {/* HEADER */}
      <header className="w-full bg-white dark:bg-neutral-800 border-b border-gray-200 dark:border-neutral-700">
        <div className="max-w-6xl mx-auto flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <img src="/logo.png" alt="Logo" className="w-10 h-10" />
            <div>
              <h1 className="font-semibold text-lg">Portal Viriato Corrêia</h1>
              <p className="text-sm text-gray-500 dark:text-gray-300 -mt-1">
                Gestão de alunos
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Theme toggle */}
            <button
              onClick={() => {
                document.documentElement.classList.toggle("dark");
              }}
              className="w-12 h-6 bg-gray-300 dark:bg-neutral-700 rounded-full flex items-center transition-all px-1"
            >
              <div className="w-5 h-5 bg-white dark:bg-neutral-900 rounded-full shadow flex items-center justify-center text-gray-800 dark:text-gray-100 text-xs transition-all">
                🌙
              </div>
            </button>

            <div className="px-4 py-1 rounded-md bg-gray-100 dark:bg-neutral-700 flex items-center gap-2">
              <span className="text-sm font-medium">Admin</span>
            </div>
          </div>
        </div>
      </header>

      {/* BODY */}
      <div className="max-w-3xl mx-auto px-6 py-14">
        {/* VOLTAR */}
        <Link to="/dashboard" className="flex items-center gap-2 text-gray-600 dark:text-gray-300 mb-6">
          <ArrowLeft size={18} />
          <span>Voltar ao Dashboard</span>
        </Link>

        {/* FORM CARD */}
        <div className="bg-white dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 rounded-xl p-10 shadow-sm">
          <h2 className="text-2xl font-semibold mb-1">Adicionar novo usuário</h2>
          <p className="text-gray-500 dark:text-gray-300 mb-8">
            Preencha os dados para cadastrar um novo aluno, professor ou administrador
          </p>

          <form className="space-y-5">

            {/* Tipo de usuário */}
            <div>
              <label className="font-medium">Tipo de usuário*</label>
              <select
                className="mt-1 w-full p-3 bg-gray-100 dark:bg-neutral-700 rounded-md outline-none focus:ring-2 focus:ring-blue-400"
              >
                <option>Selecione...</option>
                <option>Aluno</option>
                <option>Professor</option>
                <option>Administrador</option>
              </select>
            </div>

            {/* Nome */}
            <div>
              <label className="font-medium">Nome Completo*</label>
              <input
                type="text"
                className="mt-1 w-full p-3 bg-gray-100 dark:bg-neutral-700 rounded-md outline-none"
              />
            </div>

            {/* Email */}
            <div>
              <label className="font-medium">Email*</label>
              <input
                type="email"
                className="mt-1 w-full p-3 bg-gray-100 dark:bg-neutral-700 rounded-md outline-none"
              />
            </div>

            {/* Senha */}
            <div className="relative">
              <label className="font-medium">Senha*</label>
              <input
                type={showPassword ? "text" : "password"}
                className="mt-1 w-full p-3 bg-gray-100 dark:bg-neutral-700 rounded-md outline-none"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 bottom-3 text-gray-500 dark:text-gray-300"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            {/* Confirmar senha */}
            <div className="relative">
              <label className="font-medium">Confirmar senha*</label>
              <input
                type={showConfirm ? "text" : "password"}
                className="mt-1 w-full p-3 bg-gray-100 dark:bg-neutral-700 rounded-md outline-none"
              />
              <button
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                className="absolute right-3 bottom-3 text-gray-500 dark:text-gray-300"
              >
                {showConfirm ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            {/* BOTÕES */}
            <div className="flex items-center justify-between pt-4">

              {/* Cancelar */}
              <Link
                to="/dashboard"
                className="w-[48%] py-3 border border-gray-300 dark:border-neutral-600 rounded-md text-center font-medium bg-white dark:bg-neutral-700"
              >
                Cancelar
              </Link>

              {/* Adicionar */}
              <button
                type="submit"
                className="w-[48%] py-3 rounded-md text-center font-medium text-white 
                bg-gradient-to-r from-blue-500 to-blue-600 hover:opacity-90"
              >
                Adicionar
              </button>

            </div>

          </form>
        </div>
      </div>
    </div>
  );
}
