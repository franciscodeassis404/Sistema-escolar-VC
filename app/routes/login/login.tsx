import * as React from "react";
import { useForm, type UseFormReturn } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
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
    <section className="flex flex-col items-center justify-center gap-4 sm:gap-6">
      <div className="flex flex-col items-center px-4 sm:px-0">
        <h1 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold leading-tight text-center">
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
        className="h-auto w-48 sm:w-56 md:w-64 lg:w-80"
      />
    </section>
  );
}

function LoginForm({
  form,
  onSubmit,
  isDisabled,
  error,
  onForgotPassword,
}: {
  form: UseFormReturn<LoginValues>;
  onSubmit: (values: LoginValues) => Promise<void>;
  isDisabled: boolean;
  error?: string;
  onForgotPassword: () => void;
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
      className={`group flex-1 sm:flex-none sm:w-40 h-14 sm:h-16 flex flex-col items-center justify-center gap-1 sm:gap-2 border-primary border-2 transition-all duration-300 text-xs sm:text-sm ${
        isActive
          ? "bg-primary text-white hover:bg-primary hover:text-white"
          : "bg-white text-primary hover:bg-primary/10"
      }`}
      onClick={() => onChange(profile.value)}
    >
      {React.cloneElement(profile.icon, {
        className: `size-5 sm:size-6 ${isActive ? "text-white" : "text-primary"}`,
      })}
      {profile.label}
    </Button>
  );

  return (
    <section className="flex w-full items-center justify-center px-4 sm:px-0">
      <Card className="w-full max-w-xl border-primary">
        <CardHeader>
          <div className="flex items-center justify-center">
            <GraduationCap className="size-12 sm:size-16 bg-primary text-white rounded-full p-2" />
          </div>
          <CardTitle className="text-center font-bold text-xl sm:text-2xl">
            Área de login
          </CardTitle>
          <CardDescription className="text-center text-sm sm:text-base">
            Faça login para acessar o sistema
          </CardDescription>
        </CardHeader>

        <CardContent>
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg dark:bg-red-950 dark:border-red-800 text-xs sm:text-sm">
              <p className="text-red-700 dark:text-red-400">{error}</p>
            </div>
          )}

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 sm:space-y-6">
              <FormField
                control={form.control}
                name="profile"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm sm:text-base">Entrar como:</FormLabel>
                    <FormControl>
                      <div className="flex flex-wrap sm:flex-nowrap items-center justify-center sm:justify-between w-full gap-2 sm:gap-0">
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
                    <FormLabel className="text-sm sm:text-base">Email</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="seu@email.com" 
                        type="email" 
                        autoComplete="off"
                        {...field} 
                      />
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
                    <FormLabel className="text-sm sm:text-base">Senha</FormLabel>
                    <FormControl>
                      <PasswordInput 
                        placeholder="••••••••" 
                        autoComplete="new-password"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full text-sm sm:text-base" disabled={isDisabled}>
                Entrar
              </Button>

                <div className="flex items-center justify-center">
                  <button
                    type="button"
                    onClick={onForgotPassword}
                    className="text-xs sm:text-sm text-muted-foreground underline-offset-4 hover:underline"
                  >
                    Esqueci a senha
                  </button>
                </div>

            </form>
          </Form>
        </CardContent>
      </Card>
    </section>
  );
}

export function meta() {
  return [
    { title: "Login" },
    { name: "description", content: "Realize seu login" },
  ];
}

export default function Login() {
  const navigate = useNavigate();
  const [error, setError] = React.useState("");
  
  function goToReset() {
    navigate("/reset-password");
  }

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
      <div className="container mx-auto grid min-h-screen w-full grid-cols-1 items-center gap-6 sm:gap-8 px-4 sm:px-6 py-6 sm:py-10 sm:grid-cols-2">
        <Welcome />

        <LoginForm
          form={form}
          onSubmit={onSubmit}
          isDisabled={isDisabled}
          error={error}
          onForgotPassword={goToReset}
        />
      </div>
    </main>
  );
}
