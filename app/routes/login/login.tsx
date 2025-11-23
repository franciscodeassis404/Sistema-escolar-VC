import type { Route } from "./+types/login";
import * as React from "react";
import { useForm, type UseFormReturn } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router";
import { authService } from "~/services/auth.service";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { PasswordInput } from "~/components/ui/password-input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import {
  GraduationCap,
  CircleUserRound,
  Users,
} from "lucide-react";

const LoginSchema = z.object({
  email: z.string().min(1, "Informe o email").email("Email inválido"),
  password: z.string().min(1, "Informe a senha"),
  profile: z.enum(["professor", "aluno", "admin"]),
});

type LoginValues = z.infer<typeof LoginSchema>;

function Welcome() {
  return (
    <section className="flex flex-col items-center justify-center gap-6">
      <div className="flex flex-col items-center">
        <h1 className="font-display text-3xl font-bold leading-tight md:text-4xl text-center">
          <span className="bg-linear-to-r from-foreground to-primary bg-clip-text text-transparent">
            Seja Bem-vindo ao Portal
            <br />
            Viriato Correia
          </span>
        </h1>
      </div>

      <img
        src="/viriato_correa.svg"
        alt="Viriato Correia"
        className="h-auto w-64 md:w-80"
      />
    </section>
  );
}

function LoginForm({
  form,
  onSubmit,
  isDisabled,
  error,
}: {
  form: UseFormReturn<LoginValues>;
  onSubmit: (values: LoginValues) => Promise<void>;
  isDisabled: boolean;
  error?: string;
}) {
  const profiles = [
    { label: "Professor", value: "professor", icon: <GraduationCap /> },
    { label: "Aluno", value: "aluno", icon: <Users /> },
    { label: "Admin", value: "admin", icon: <CircleUserRound /> },
  ];

  const ProfileSelect = ({
    profile,
    onChange,
    isActive,
  }: {
    profile: (typeof profiles)[number];
    onChange: (value: (typeof profiles)[number]["value"]) => void;
    isActive: boolean;
  }) => (
    <Button
      type="button"
      variant="outline"
      className={`group w-40 h-16 flex flex-col items-center justify-center gap-2 border-primary border-2 transition-all duration-300 ${
        isActive
          ? "bg-primary text-white hover:bg-primary hover:text-white"
          : "bg-white text-primary hover:bg-primary/10"
      }`}
      onClick={() => onChange(profile.value)}
    >
      {React.cloneElement(profile.icon, {
        className: `size-6 ${isActive ? "text-white" : "text-primary"}`,
      })}
      {profile.label}
    </Button>
  );

  return (
    <section className="flex w-full items-center justify-center">
      <Card className="w-full max-w-xl border-primary">
        <CardHeader>
          <div className="flex items-center justify-center">
            <GraduationCap className="size-16 bg-primary text-white rounded-full p-2" />
          </div>
          <CardTitle className="text-center font-bold text-2xl">
            Área de login
          </CardTitle>
          <CardDescription className="text-center">
            Faça login para acessar o sistema
          </CardDescription>
        </CardHeader>

        <CardContent>
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg dark:bg-red-950 dark:border-red-800">
              <p className="text-red-700 dark:text-red-400 text-sm">{error}</p>
            </div>
          )}

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="profile"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Entrar como:</FormLabel>
                    <FormControl>
                      <div className="flex items-center justify-between w-full">
                        {profiles.map((profile) => (
                          <ProfileSelect
                            key={profile.value}
                            profile={profile}
                            isActive={field.value === profile.value}
                            onChange={field.onChange}
                          />
                        ))}
                      </div>
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="seu@email.com" type="email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Senha</FormLabel>
                    <FormControl>
                      <PasswordInput placeholder="••••••••" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full" disabled={isDisabled}>
                Entrar
              </Button>

              <div className="flex items-center justify-center">
                <a className="text-sm text-muted-foreground underline-offset-4 hover:underline">
                  Esqueci a senha
                </a>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </section>
  );
}

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Login" },
    { name: "description", content: "Realize seu login" },
  ];
}

export default function Login() {
  const navigate = useNavigate();
  const [error, setError] = React.useState("");

  const form = useForm<LoginValues>({
    resolver: zodResolver(LoginSchema),
    defaultValues: { email: "", password: "", profile: "professor" },
    mode: "onChange",
  });

  const isDisabled =
    !form.watch("email") ||
    !form.watch("password") ||
    form.formState.isSubmitting;

  // Aqui está seu onSubmit exatamente como você enviou
  async function onSubmit(values: LoginValues) {
    setError("");

    try {
      const response = await authService.login({
        email: values.email,
        senha: values.password, // authService trata internamente
      });

      switch (response.perfil) {
        case "ALUNO":
          navigate("/aluno");
          break;
        case "PROFESSOR":
          navigate("/professor");
          break;
        case "ADMIN":
          navigate("/admin");
          break;
        default:
          navigate("/");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao fazer login");
    }
  }

  return (
    <main className="min-h-screen w-full bg-linear-to-br from-[#C0D5F9] to-[#D0F9DF]">
      <div className="container mx-auto grid min-h-screen w-full grid-cols-1 items-center gap-8 px-4 py-10 md:grid-cols-2">
        <Welcome />

        <LoginForm
          form={form}
          onSubmit={onSubmit}
          isDisabled={isDisabled}
          error={error}
        />
      </div>
    </main>
  );
}
