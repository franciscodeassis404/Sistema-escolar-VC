// app/routes/admin/adduser.tsx
import { ArrowLeft, Eye, EyeOff, Upload, X } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { Navbar } from "~/components/ui/navbar";
import { adminService, type NovoUsuario } from "~/services/admin.service";
import { uploadService } from "~/services/uploadService"; // 👈 NOVO

// Lista de turmas disponíveis
const TURMAS = [
  { id: 1, nome: "7º A" },
  { id: 2, nome: "7º B" },
  { id: 3, nome: "7º C" },
  { id: 4, nome: "8º A" },
  { id: 5, nome: "8º B" },
  { id: 6, nome: "8º C" },
  { id: 7, nome: "9º A" },
  { id: 8, nome: "9º B" },
  { id: 9, nome: "9º C" },
  { id: 10, nome: "1º A" },
  { id: 11, nome: "1º B" },
  { id: 12, nome: "1º C" },
  { id: 13, nome: "2º A" },
  { id: 14, nome: "2º B" },
  { id: 15, nome: "2º C" },
  { id: 16, nome: "3º A" },
  { id: 17, nome: "3º B" },
  { id: 18, nome: "3º C" },
];

export default function AddUser() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [photoFile, setPhotoFile] = useState<File | null>(null); // 👈 NOVO
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    tipo: "ALUNO",
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
      // Salvar o arquivo para upload posterior
      setPhotoFile(file);

      // Mostrar preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removePhoto = () => {
    setPhotoPreview(null);
    setPhotoFile(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);

    try {
      // Validações básicas
      if (!formData.tipo) {
        throw new Error("Selecione o tipo de usuário");
      }

      if (!formData.nomeCompleto || !formData.email || !formData.senha) {
        throw new Error("Preencha todos os campos obrigatórios");
      }

      if (formData.senha !== formData.confirmarSenha) {
        throw new Error("As senhas não coincidem");
      }

      if (formData.senha.length < 6) {
        throw new Error("A senha deve ter no mínimo 6 caracteres");
      }

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

      console.log('📤 Criando usuário:', dadosUsuario);

      // 1️⃣ PRIMEIRO: Criar o usuário
      const usuarioCriado = await adminService.createUsuario(dadosUsuario);
      console.log('✅ Usuário criado:', usuarioCriado);

      // 2️⃣ DEPOIS: Se tem foto E é aluno, fazer upload
      if (photoFile && usuarioCriado.id && formData.tipo === "ALUNO") {
        console.log('📸 Fazendo upload da foto...');
        try {
          await uploadService.uploadFotoAluno(usuarioCriado.id, photoFile);
          console.log('✅ Foto enviada com sucesso!');
        } catch (uploadError) {
          console.error('⚠️ Erro ao enviar foto:', uploadError);
          // Não falha a criação do usuário, apenas avisa
          setError('Usuário criado, mas houve erro ao enviar a foto. Você pode adicionar depois.');
        }
      }

      setSuccess(true);

      // Redirecionar após 2 segundos
      setTimeout(() => {
        navigate("/admin");
      }, 2000);

    } catch (err) {
      console.error("Erro no cadastro:", err);

      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Erro ao cadastrar usuário");
      }
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
                autoComplete="off"
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
                    {TURMAS.map((turma) => (
                      <option key={turma.id} value={turma.id}>
                        {turma.nome}
                      </option>
                    ))}
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
                autoComplete="new-password"
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
                autoComplete="new-password"
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
              <Link
                to="/admin"
                className="w-[48%] py-3 border border-border rounded-md text-center font-medium bg-background hover:bg-accent transition-colors text-foreground"
              >
                Cancelar
              </Link>

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