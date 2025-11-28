import * as React from "react";

import {Users, Shield, GraduationCap} from "lucide-react";

type TagPerfilProps = {
    tipo?: "aluno" | "professor" | "admin";
    nomeUsuario?: string;
    className?: string;
} & React.ComponentProps<"div">;

const TagPerfil = ({ tipo = "professor", nomeUsuario, className, ...props }: TagPerfilProps) => {
    
    const formatarNome = (nome: string | undefined, tipo: string) => {
        if (!nome) {
            return tipo === "admin" ? "Admin" : tipo === "professor" ? "Professor" : "Aluno";
        }
        
        if (tipo === "admin") {
            return "Admin";
        }
        
        // Remove "Prof.", "Profa.", "Professor", "Professora" se já vier no nome
        const nomeLimpo = nome.replace(/^(Prof\.|Profa\.|Professor|Professora)\s*/i, '').trim();
        const primeiroNome = nomeLimpo.split(" ")[0];
        
        if (tipo === "professor") {
            return `Prof. ${primeiroNome}`;
        }
        
        return primeiroNome;
    };

    const config = {
        aluno: {
            icon: Users,
            label: formatarNome(nomeUsuario, "aluno")
        },
        professor: {
            icon: GraduationCap,
            label: formatarNome(nomeUsuario, "professor")
        },
        admin: {
            icon: Shield,
            label: "Admin"
        }
    };

    const { icon: Icon, label } = config[tipo];

    return (
    <div className="flex items-center gap-2 text-secondary dark:text-gray-400 bg-tag-background dark:bg-gray-700 px-3 py-1 rounded-full text-sm font-medium">
        <Icon className="w-4 h-4 text-primary dark:text-gray-300" />
        <span>{label}</span>
    </div>  
    );
}
    
export default TagPerfil;