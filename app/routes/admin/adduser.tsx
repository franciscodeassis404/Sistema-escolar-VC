import { ArrowLeft, Eye, EyeOff, Upload, X } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { Navbar } from "~/components/ui/navbar";
import { adminService, type NovoUsuario } from "~/services/admin.service";

export default function AddUser() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState(false);

  // Estados do formulário
  const [formData, setFormData] = useState({
    tipo: "",
    nomeCompleto: "",
    email: "",
    senha: "",
    confirmarSenha: "",
    turma: "",
    dataNascimento: "",
    matricula: "",
    especialidade: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removePhoto = () => {
    setPhotoPreview(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);

    try {
      // Validações
      if (!formData.tipo || !formData.nomeCompleto || !formData.email || !formData.senha) {
        throw new Error("Preencha todos os campos obrigatórios");
      }

      if (formData.senha !== formData.confirmarSenha) {
        throw new Error("As senhas não coincidem");
      }

      if (formData.senha.length < 6) {
        throw new Error("A senha deve ter no mínimo 6 caracteres");
      }

      // Preparar dados conforme o tipo de usuário
      let dadosUsuario: NovoUsuario;

      if (formData.tipo === "ALUNO") {
        if (!formData.turma || !formData.dataNascimento) {
          throw new Error("Preencha turma e data de nascimento para alunos");
        }
        dadosUsuario = {
          tipo: "ALUNO",
          nomeCompleto: formData.nomeCompleto,
          email: formData.email,
          senha: formData.senha,
          confirmarSenha: formData.confirmarSenha,
          dataNascimento: formData.dataNascimento,
          idTurma: parseInt(formData.turma),
        };
      } else if (formData.tipo === "PROFESSOR") {
        if (!formData.matricula || !formData.especialidade) {
          throw new Error("Preencha matrícula e especialidade para professores");
        }
        dadosUsuario = {
          tipo: "PROFESSOR",
          nomeCompleto: formData.nomeCompleto,
          email: formData.email,
          senha: formData.senha,
          confirmarSenha: formData.confirmarSenha,
          matricula: formData.matricula,
          especialidade: formData.especialidade,
        };
      } else {
        dadosUsuario = {
          tipo: "ADMIN",
          nomeCompleto: formData.nomeCompleto,
          email: formData.email,
          senha: formData.senha,
          confirmarSenha: formData.confirmarSenha,
        };
      }

      // Enviar para o backend
      await adminService.createUsuario(dadosUsuario);

      setSuccess(true);
      
      // Redirecionar após 2 segundos
      setTimeout(() => {
        navigate("/admin");
      }, 2000);

    } catch (err) {
      console.error("Erro no cadastro:", err);
      
      let errorMessage = "Erro ao cadastrar usuário";
      
      if (err instanceof TypeError && err.message.includes('fetch')) {
        errorMessage = "Não foi possível conectar ao servidor. Verifique se o backend está rodando em http://localhost:8080";
      } else if (err instanceof Error) {
        errorMessage = err.message;
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar tipoPerfil="admin" />
      <section className="flex min-h-screen flex-col bg-background dark:bg-gray-900">
        <div className="max-w-3xl mx-auto px-6 py-8 w-full">
          {/* VOLTAR */}
          <Link to="/admin" className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 transition-colors">
            <ArrowLeft size={18} />
            <span>Voltar ao Dashboard</span>
          </Link>

        {/* FORM CARD */}
        <div className="bg-card dark:bg-gray-800 border border-border rounded-xl p-10 shadow-sm">
          <h2 className="text-2xl font-semibold mb-1 text-foreground">Adicionar novo usuário</h2>
          <p className="text-muted-foreground mb-8">
            Preencha os dados para cadastrar um novo aluno, professor ou administrador
          </p>

          {/* Mensagens de feedback */}
          {error && (
            <div className="mb-6 p-4 bg-destructive/10 border border-destructive rounded-lg">
              <p className="text-destructive text-sm">{error}</p>
            </div>
          )}

          {success && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg dark:bg-green-950 dark:border-green-800">
              <p className="text-green-700 dark:text-green-400 text-sm">
                ✓ Usuário cadastrado com sucesso! Redirecionando...
              </p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">

            {/* Foto do usuário */}
            <div>
              <label className="font-medium text-foreground block mb-2">Foto do usuário</label>
              <div className="flex items-center gap-4">
                {photoPreview ? (
                  <div className="relative">
                    <img 
                      src={photoPreview} 
                      alt="Preview" 
                      className="w-24 h-24 rounded-full object-cover border-2 border-border"
                    />
                    <button
                      type="button"
                      onClick={removePhoto}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ) : (
                  <div className="w-24 h-24 rounded-full bg-muted border-2 border-dashed border-border flex items-center justify-center">
                    <Upload className="w-8 h-8 text-muted-foreground" />
                  </div>
                )}
                <div className="flex-1">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoChange}
                    className="hidden"
                    id="photo-upload"
                  />
                  <label
                    htmlFor="photo-upload"
                    className="inline-block px-4 py-2 bg-primary text-primary-foreground rounded-md cursor-pointer hover:bg-primary/90 transition-colors"
                  >
                    Escolher foto
                  </label>
                  <p className="text-sm text-muted-foreground mt-2">
                    Formatos aceitos: JPG, PNG, GIF (máx. 5MB)
                  </p>
                </div>
              </div>
            </div>

            {/* Tipo de usuário */}
            <div>
              <label className="font-medium text-foreground">Tipo de usuário*</label>
              <select
                name="tipo"
                value={formData.tipo}
                onChange={handleChange}
                className="mt-1 w-full p-3 bg-background border border-border rounded-md outline-none focus:ring-2 focus:ring-primary text-foreground"
                required
                disabled={loading}
              >
                <option value="">Selecione...</option>
                <option value="ALUNO">Aluno</option>
                <option value="PROFESSOR">Professor</option>
                <option value="ADMIN">Administrador</option>
              </select>
            </div>

            {/* Nome */}
            <div>
              <label className="font-medium text-foreground">Nome Completo*</label>
              <input
                type="text"
                name="nomeCompleto"
                value={formData.nomeCompleto}
                onChange={handleChange}
                className="mt-1 w-full p-3 bg-background border border-border rounded-md outline-none focus:ring-2 focus:ring-primary text-foreground"
                required
                disabled={loading}
              />
            </div>

            {/* Email */}
            <div>
              <label className="font-medium text-foreground">Email*</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="mt-1 w-full p-3 bg-background border border-border rounded-md outline-none focus:ring-2 focus:ring-primary text-foreground"
                required
                disabled={loading}
              />
            </div>

            {/* Campos condicionais para ALUNO */}
            {formData.tipo === "ALUNO" && (
              <>
                <div>
                  <label className="font-medium text-foreground">Data de Nascimento*</label>
                  <input
                    type="date"
                    name="dataNascimento"
                    value={formData.dataNascimento}
                    onChange={handleChange}
                    className="mt-1 w-full p-3 bg-background border border-border rounded-md outline-none focus:ring-2 focus:ring-primary text-foreground"
                    required
                    disabled={loading}
                  />
                </div>

                <div>
                  <label className="font-medium text-foreground">Turma*</label>
                  <select
                    name="turma"
                    value={formData.turma}
                    onChange={handleChange}
                    className="mt-1 w-full p-3 bg-background border border-border rounded-md outline-none focus:ring-2 focus:ring-primary text-foreground"
                    required
                    disabled={loading}
                  >
                    <option value="">Selecione a turma...</option>
                    <option value="1">7º A</option>
                    <option value="2">7º B</option>
                    <option value="3">7º C</option>
                    <option value="4">8º A</option>
                    <option value="5">8º B</option>
                    <option value="6">8º C</option>
                    <option value="7">9º A</option>
                    <option value="8">9º B</option>
                    <option value="9">9º C</option>
                    <option value="10">1º A</option>
                    <option value="11">1º B</option>
                    <option value="12">1º C</option>
                    <option value="13">2º A</option>
                    <option value="14">2º B</option>
                    <option value="15">2º C</option>
                    <option value="16">3º A</option>
                    <option value="17">3º B</option>
                    <option value="18">3º C</option>
                  </select>
                </div>
              </>
            )}

            {/* Campos condicionais para PROFESSOR */}
            {formData.tipo === "PROFESSOR" && (
              <>
                <div>
                  <label className="font-medium text-foreground">Matrícula*</label>
                  <input
                    type="text"
                    name="matricula"
                    value={formData.matricula}
                    onChange={handleChange}
                    className="mt-1 w-full p-3 bg-background border border-border rounded-md outline-none focus:ring-2 focus:ring-primary text-foreground"
                    placeholder="Ex: PROF001"
                    required
                    disabled={loading}
                  />
                </div>

                <div>
                  <label className="font-medium text-foreground">Especialidade*</label>
                  <input
                    type="text"
                    name="especialidade"
                    value={formData.especialidade}
                    onChange={handleChange}
                    className="mt-1 w-full p-3 bg-background border border-border rounded-md outline-none focus:ring-2 focus:ring-primary text-foreground"
                    placeholder="Ex: Matemática"
                    required
                    disabled={loading}
                  />
                </div>
              </>
            )}

            {/* Senha */}
            <div className="relative">
              <label className="font-medium text-foreground">Senha*</label>
              <input
                type={showPassword ? "text" : "password"}
                name="senha"
                value={formData.senha}
                onChange={handleChange}
                className="mt-1 w-full p-3 bg-background border border-border rounded-md outline-none focus:ring-2 focus:ring-primary text-foreground"
                placeholder="Mínimo 6 caracteres"
                required
                disabled={loading}
                minLength={6}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 bottom-3 text-muted-foreground hover:text-foreground"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            {/* Confirmar senha */}
            <div className="relative">
              <label className="font-medium text-foreground">Confirmar senha*</label>
              <input
                type={showConfirm ? "text" : "password"}
                name="confirmarSenha"
                value={formData.confirmarSenha}
                onChange={handleChange}
                className="mt-1 w-full p-3 bg-background border border-border rounded-md outline-none focus:ring-2 focus:ring-primary text-foreground"
                required
                disabled={loading}
              />
              <button
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                className="absolute right-3 bottom-3 text-muted-foreground hover:text-foreground"
              >
                {showConfirm ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            {/* BOTÕES */}
            <div className="flex items-center justify-between pt-4 gap-4">

              {/* Cancelar */}
              <Link
                to="/admin"
                className="w-[48%] py-3 border border-border rounded-md text-center font-medium bg-background hover:bg-accent transition-colors text-foreground"
              >
                Cancelar
              </Link>

              {/* Adicionar */}
              <button
                type="submit"
                disabled={loading}
                className="w-[48%] py-3 rounded-md text-center font-medium text-primary-foreground bg-primary hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Cadastrando..." : "Adicionar"}
              </button>

            </div>

          </form>
        </div>
        </div>
      </section>
    </>
  );
}
