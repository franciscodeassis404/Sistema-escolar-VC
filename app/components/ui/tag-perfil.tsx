import * as React from "react";

import {Users, Shield, GraduationCap} from "lucide-react";

type TagPerfilProps = {
    tipo?: "aluno" | "professor" | "admin";
    className?: string;
} & React.ComponentProps<"div">;

const TagPerfil = ({ tipo = "professor", className, ...props }: TagPerfilProps) => {
    const config = {
        aluno: {
            icon: Users,
            label: "Aluno"
        },
        professor: {
            icon: GraduationCap,
            label: "Prof. Leonardo"
        },
        admin: {
            icon: Shield,
            label: "Admin"
        }
    };

    const { icon: Icon, label } = config[tipo];

    return (
    <div className="flex items-center gap-2 text-secondary bg-tag-background dark:bg-gray-700 px-3 py-1 rounded-full text-sm font-medium">
        <Icon className="w-4 h-4 text-primary dark:text-gray-300" />
        <span>{label}</span>
    </div>  
    );
}
    
export default TagPerfil;