import * as React from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router";
import { KeyRound } from "lucide-react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { PasswordInput } from "~/components/ui/password-input";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "~/components/ui/form";

// ------------------------------------
// VALIDAÇÃO
// ------------------------------------
const ResetSchema = z
  .object({
    password: z.string().min(6, "A senha deve ter no mínimo 6 caracteres"),
    confirmPassword: z.string().min(6, "Confirme a senha"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "As senhas não coincidem",
    path: ["confirmPassword"],
  });

type ResetValues = z.infer<typeof ResetSchema>;

// ------------------------------------
// COMPONENTE PRINCIPAL
// ------------------------------------
export default function ResetPassword() {
  const navigate = useNavigate();
  const [success, setSuccess] = React.useState(false);

  const form = useForm<ResetValues>({
    resolver: zodResolver(ResetSchema),
    defaultValues: { password: "", confirmPassword: "" },
  });

  async function onSubmit(values: ResetValues) {
    console.log("Dados enviados (front-only):", values);

    // Apenas visual — sem backend
    setSuccess(true);

    // Após 2s, volta para o login
    setTimeout(() => navigate("/"), 1800);
  }

  return (
    <main className="min-h-screen w-full bg-linear-to-br from-[#C0D5F9] to-[#D0F9DF]">
      <div className="container mx-auto flex min-h-screen items-center justify-center px-4">
        
        <Card className="w-full max-w-md border-primary">
          <CardHeader>
            <div className="flex items-center justify-center">
              <KeyRound className="size-16 bg-primary text-white rounded-full p-2" />
            </div>

            <CardTitle className="text-center font-bold text-2xl">
              Redefinir Senha
            </CardTitle>

            <CardDescription className="text-center">
              Crie uma nova senha para acessar o portal
            </CardDescription>
          </CardHeader>

          <CardContent>
            {success && (
              <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-green-700 text-sm">
                  Senha redefinida com sucesso! Redirecionando...
                </p>
              </div>
            )}

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nova senha</FormLabel>
                      <FormControl>
                        <PasswordInput placeholder="••••••••" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirmar nova senha</FormLabel>
                      <FormControl>
                        <PasswordInput placeholder="••••••••" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit" className="w-full">
                  Redefinir senha
                </Button>

              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}