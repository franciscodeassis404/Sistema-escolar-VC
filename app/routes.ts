import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
	index("routes/login/login.tsx"),
	route("login", "routes/login/login.tsx"),
	route("aluno", "routes/aluno/aluno.tsx"),
	route("admin", "routes/admin/admin.tsx"),
	route("adduser", "routes/admin/adduser.tsx"),
	route("professor", "routes/professor/professor.tsx"),
	route("perfilAluno", "routes/perfis/perfilAluno.tsx"),
	route("perfilProfessor", "routes/perfis/perfilprofessor.tsx"),
	
	// API Routes (Backend For Frontend)
	route("api/auth", "routes/api/auth.ts"),
	route("api/usuarios", "routes/api/usuarios.ts"),
] satisfies RouteConfig;