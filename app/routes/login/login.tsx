import type { Route } from "./+types/home";
import { Welcome } from "../welcome/welcome";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Login" },
    { name: "description", content: "Realize seu login" },
  ];
}

export default function Login() {
  return (<div>
     login
  </div>
  );
}
