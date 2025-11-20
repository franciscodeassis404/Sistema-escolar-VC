import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
	index("routes/login/login.tsx"),
	route("aluno", "routes/aluno/aluno.tsx"),
	route("admin", "routes/admin/admin.tsx"),
	route("adduser", "routes/admin/adduser.tsx"),
	route("professor", "routes/professor/professor.tsx"),
	route("perfilAluno", "routes/professor/perfilAluno.tsx"),
	route("perfilProfessor", "routes/professor/perfilProfessor.tsx"),
] satisfies RouteConfig;