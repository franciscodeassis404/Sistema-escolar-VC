import * as React from "react";

import logo from "./../../../public/logo.svg";
import TagPerfil from "./tag-perfil";
import { Button } from "./button";

import {LogOut} from "lucide-react";



const Navbar = ({ className, ...props }: React.ComponentProps<"nav">) => {
    return (
    <header className="w-full border-b bg-white dark:bg-[#161B22] dark:border-gray-700 h-20 flex items-center justify-between px-10 shadow-sm">
      <div className="flex items-center gap-3">
        <img
          src={logo}
          className="w-10 h-10 rounded-full border border-gray-300 dark:border-gray-600"
        />
        <div>
          <p className="text-sm text-secondary font-bold dark:text-gray-400">Portal Viriato Corrêia</p>
          <p className="font-medium text-sm">Gestão de Alunos</p>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <TagPerfil />
        <Button variant="outline" size="sm" className="flex items-center gap-2 hover:bg-red-50 hover:text-red-600 hover:border-red-300 dark:hover:bg-red-950 dark:hover:text-red-400 dark:hover:border-red-700">
          <LogOut className="w-4 h-4" />
          Sair
        </Button>
      </div>
    </header>
    );
}

export { Navbar };

