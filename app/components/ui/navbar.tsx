import * as React from "react";
import { useNavigate } from "react-router-dom";

import logo from "./../../../public/logo.svg";
import TagPerfil from "./tag-perfil";
import { Button } from "./button";
import ThemeToggle from "./theme";

import { LogOut } from "lucide-react";
import LogoutModal from "../ui/LogoutModal";
import { authService } from "~/services/auth.service";

type NavbarProps = {
  tipoPerfil?: "aluno" | "professor" | "admin";
  className?: string;
} & React.ComponentProps<"nav">;

const Navbar = ({ tipoPerfil = "professor", className, ...props }: NavbarProps) => {
  const navigate = useNavigate();

  // estado do modal
  const [showLogout, setShowLogout] = React.useState(false);
  
  // Pega os dados do usuário logado
  const user = authService.getUser();

  // ação de confirmação
  function handleConfirmLogout() {
    setShowLogout(false);
    navigate("/");
  }

  return (
    <>
      <header className="w-full border-b bg-white dark:bg-[#161B22] dark:border-gray-700 h-16 sm:h-20 flex items-center justify-between px-3 sm:px-6 md:px-10 shadow-sm">
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          <img
            src={logo}
            className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border border-gray-300 dark:border-gray-600 shrink-0"
          />
          <div className="min-w-0">
            <p className="text-xs sm:text-sm text-secondary font-bold dark:text-gray-400 truncate">
              Portal Viriato Corrêia
            </p>
            <p className="font-medium text-xs sm:text-sm truncate">Gestão de Alunos</p>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3 md:gap-4 shrink-0">
          <ThemeToggle />
          <TagPerfil tipo={tipoPerfil} />

          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowLogout(true)}   
            className="flex items-center gap-1 sm:gap-2 hover:bg-red-50 hover:text-red-600 hover:border-red-300 dark:hover:bg-red-950 dark:hover:text-red-400 dark:hover:border-red-700 text-xs sm:text-sm px-2 sm:px-3"
          >
            <LogOut className="w-3 h-3 sm:w-4 sm:h-4" />
            <span className="hidden sm:inline">Sair</span>
            <span className="sm:hidden">Sair</span>
          </Button>
        </div>
      </header>

      {/* MODAL DE LOGOUT */}
      <LogoutModal
        open={showLogout}
        onClose={() => setShowLogout(false)}
        onConfirm={handleConfirmLogout}
      />
    </>
  );
};

export { Navbar };