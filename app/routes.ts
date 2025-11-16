import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
	index("routes/login/login.tsx"),
	route("aluno", "routes/aluno/aluno.tsx"),
	route("admin", "routes/admin/admin.tsx"),
] satisfies RouteConfig;