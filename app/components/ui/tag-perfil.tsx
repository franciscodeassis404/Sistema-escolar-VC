import * as React from "react";
import { Users, Shield, GraduationCap } from "lucide-react";
import { authService } from "~/services/auth.service";

type TagPerfilProps = {
    tipo?: "aluno" | "professor" | "admin";
    nomeUsuario?: string;
    className?: string;
} & React.ComponentProps<"div">;

const TagPerfil = ({ tipo = "professor", nomeUsuario, className, ...props }: TagPerfilProps) => {
    // Obter usuário logado se não tiver nomeUsuario
    const usuarioLogado = React.useMemo(() => {
        if (nomeUsuario) return nomeUsuario;
        return authService.getUser()?.nome || "";
    }, [nomeUsuario]);

    const detectarGenero = (nome: string): "masculino" | "feminino" => {
        if (!nome) return "masculino";
        
        const ultimaPalavra = nome.trim().split(" ").pop()?.toLowerCase() || "";
        
        if (ultimaPalavra.endsWith("a")) {
            return "feminino";
        }
        
        return "masculino";
    };

    const formatarNome = (nome: string | undefined, tipoUsuario: string) => {
        if (!nome) {
            switch (tipoUsuario) {
                case "admin":
                    return "Admin";
                case "professor":
                    return "Professor";
                case "aluno":
                    return "Aluno";
                default:
                    return "Usuário";
            }
        }

        // Remove "Prof.", "Profa.", "Professor", "Professora" se já vier no nome
        const nomeLimpo = nome.replace(/^(Prof\.|Profa\.|Professor|Professora)\s*/i, "").trim();
        const primeiroNome = nomeLimpo.split(" ")[0];

        if (tipoUsuario === "professor") {
            const genero = detectarGenero(primeiroNome);
            const prefixo = genero === "feminino" ? "Profa." : "Prof.";
            return `${prefixo} ${primeiroNome}`;
        }

        if (tipoUsuario === "admin") {
            return `Admin - ${primeiroNome}`;
        }

        return primeiroNome;
    };

    const config = {
        aluno: {
            icon: Users,
            label: formatarNome(usuarioLogado, "aluno"),
        },
        professor: {
            icon: GraduationCap,
            label: formatarNome(usuarioLogado, "professor"),
        },
        admin: {
            icon: Shield,
            label: formatarNome(usuarioLogado, "admin"),
        },
    };

    const { icon: Icon, label } = config[tipo];

    return (
        <div
            className="flex items-center gap-2 text-secondary dark:text-gray-400 bg-tag-background dark:bg-gray-700 px-3 py-1 rounded-full text-sm font-medium"
            {...props}
        >
            <Icon className="w-4 h-4 text-primary dark:text-gray-300" />
            <span>{label}</span>
        </div>
    );
};
    
export default TagPerfil;