import * as React from "react";
import { Users, Shield, GraduationCap } from "lucide-react";
import { authService } from "~/services/auth.service";

type TagPerfilProps = {
    tipo?: "aluno" | "professor" | "admin";
    className?: string;
} & React.ComponentProps<"div">;

const TagPerfil = ({ tipo = "professor", className, ...props }: TagPerfilProps) => {
    // Obter usuário logado
    const usuario = React.useMemo(() => {
        return authService.getUser();
    }, []);

    const obterLabel = () => {
        if (!usuario?.nome) {
            return tipo === "admin" ? "Admin" : "Usuário";
        }

        const primeiroNome = usuario.nome.split(" ")[0];

        // Admin: apenas "Admin"
        if (tipo === "admin") {
            return "Admin";
        }

        // Aluno e Professor: apenas o primeiro nome da pessoa logada
        return primeiroNome;
    };

    const config = {
        aluno: {
            icon: Users,
        },
        professor: {
            icon: GraduationCap,
        },
        admin: {
            icon: Shield,
        },
    };

    const { icon: Icon } = config[tipo];
    const label = obterLabel();

    return (
        <div
            className="flex items-center gap-1 sm:gap-2 text-secondary dark:text-gray-400 bg-tag-background dark:bg-gray-700 px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium whitespace-nowrap"
            {...props}
        >
            <Icon className="w-3 h-3 sm:w-4 sm:h-4 text-primary dark:text-gray-300 shrink-0" />
            <span className="hidden sm:inline">{label}</span>
        </div>
    );
};
    
export default TagPerfil;