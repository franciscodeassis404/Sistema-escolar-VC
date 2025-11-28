import * as React from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router";
import { KeyRound, Loader2, ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";
import { BrowserRouter } from "react-router-dom";

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
// FAKE TOKEN (troque depois)
// ------------------------------------
const emailFromToken: string | null = null;
// coloque para testar ↓
// const emailFromToken = "usuarioteste@gmail.com";

// ------------------------------------
// VALIDAÇÃO
// ------------------------------------
const ResetSchema = z
  .object({
    email: z.string().email("Digite um e-mail válido"),
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
  const [loading, setLoading] = React.useState(false);

  const form = useForm<ResetValues>({
    resolver: zodResolver(ResetSchema),
    defaultValues: {
      email: emailFromToken ?? "",
      password: "",
      confirmPassword: "",
    },
  });

  async function onSubmit(values: ResetValues) {
    setLoading(true);

    // apenas visual
    setTimeout(() => {
      console.log("Enviado:", values);
      setSuccess(true);
      setLoading(false);

      setTimeout(() => navigate("/"), 2000);
    }, 1500);
  }

  // AUTOCOMPLETE DO EMAIL
  const emailDomains = ["gmail.com", "outlook.com", "hotmail.com", "yahoo.com"];

  const handleEmailSuggest = (value: string) => {
    if (!value.includes("@")) return value;

    const [user, domain] = value.split("@");

    const suggestion = emailDomains.find((d) => d.startsWith(domain));
    return user + "@" + (suggestion ?? domain);
  };

  return (
    <main className="min-h-screen w-full bg-linear-to-br from-[#C0D5F9] to-[#D0F9DF]">
      <div className="container mx-auto flex min-h-screen items-center justify-center px-4">

        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        >
          <Card className="w-[420px] max-w-full rounded-2xl shadow-lg bg-white">
            
            <CardHeader>
              <div className="flex items-center justify-between mb-4">
                <button
                  onClick={() => navigate("/")}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  title="Voltar para login"
                >
                  <ArrowLeft className="w-5 h-5 text-gray-600" />
                </button>
                <div className="flex-1" />
              </div>

              <motion.div
                initial={{ rotate: -10 }}
                animate={{ rotate: 0 }}
                transition={{ duration: 0.3 }}
                className="flex items-center justify-center"
              >
                <KeyRound className="size-16 bg-primary text-white rounded-full p-2 shadow-lg" />
              </motion.div>

              <CardTitle className="text-center font-bold text-2xl">
                Redefinir Senha
              </CardTitle>

              <CardDescription className="text-center">
                Digite seu e-mail e crie uma nova senha
              </CardDescription>
            </CardHeader>

            <CardContent>
              {success && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg"
                >
                  <p className="text-green-700 text-sm">
                    Senha redefinida com sucesso! Redirecionando...
                  </p>
                </motion.div>
              )}

              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-6"
                >

                  {/* EMAIL */}
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>E-mail</FormLabel>
                        <FormControl>
                          <input
                            type="email"
                            disabled={!!emailFromToken}
                            className="w-full rounded-md border px-3 py-2 disabled:bg-gray-100 disabled:text-gray-500"
                            placeholder="seuemail@email.com"
                            onChange={(e) => {
                              const value = handleEmailSuggest(e.target.value);
                              field.onChange(value);
                            }}
                            value={field.value}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* NOVA SENHA */}
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

                  {/* CONFIRMAR SENHA */}
                  <FormField
                    control={form.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Confirmar senha</FormLabel>
                        <FormControl>
                          <PasswordInput placeholder="••••••••" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-full flex items-center justify-center gap-2"
                  >
                    {loading && <Loader2 className="size-5 animate-spin" />}
                    {loading ? "Redefinindo..." : "Redefinir senha"}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </motion.div>

      </div>
    </main>
  );
}
