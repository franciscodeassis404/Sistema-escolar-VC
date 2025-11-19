import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
	index("routes/login/login.tsx"),
	route("aluno", "routes/aluno/aluno.tsx"),
	route("admin", "routes/admin/admin.tsx"),
	route("adduser", "routes/admin/adduser.tsx"),
	route("professor", "routes/professor/professor.tsx"),
	route("perfilprofessor", "routes/professor/perfilprofessor.tsx"),
] satisfies RouteConfig;