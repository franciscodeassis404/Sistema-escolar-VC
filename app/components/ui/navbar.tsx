import * as React from "react";
import { useNavigate } from "react-router-dom";

import logo from "./../../../public/logo.svg";
import TagPerfil from "./tag-perfil";
import { Button } from "./button";
import ThemeToggle from "./theme";

import { LogOut } from "lucide-react";
import LogoutModal from "../ui/LogoutModal";

type NavbarProps = {
  tipoPerfil?: "aluno" | "professor" | "admin";
  className?: string;
} & React.ComponentProps<"nav">;

const Navbar = ({ tipoPerfil = "professor", className, ...props }: NavbarProps) => {
  const navigate = useNavigate();

  // estado do modal
  const [showLogout, setShowLogout] = React.useState(false);

  // ação de confirmação
  function handleConfirmLogout() {
    setShowLogout(false);
    navigate("/");
  }

  return (
    <>
      <header className="w-full border-b bg-white dark:bg-[#161B22] dark:border-gray-700 h-20 flex items-center justify-between px-10 shadow-sm">
        <div className="flex items-center gap-3">
          <img
            src={logo}
            className="w-10 h-10 rounded-full border border-gray-300 dark:border-gray-600"
          />
          <div>
            <p className="text-sm text-secondary font-bold dark:text-gray-400">
              Portal Viriato Corrêia
            </p>
            <p className="font-medium text-sm">Gestão de Alunos</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <ThemeToggle />
          <TagPerfil tipo={tipoPerfil} />

          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowLogout(true)}   
            className="flex items-center gap-2 hover:bg-red-50 hover:text-red-600 hover:border-red-300 dark:hover:bg-red-950 dark:hover:text-red-400 dark:hover:border-red-700"
          >
            <LogOut className="w-4 h-4" />
            Sair
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