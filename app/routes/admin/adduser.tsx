import { ArrowLeft, Eye, EyeOff, Upload, X } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router";
import { Navbar } from "~/components/ui/navbar";

export default function AddUser() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);

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

          <form className="space-y-5">

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
                className="mt-1 w-full p-3 bg-background border border-border rounded-md outline-none focus:ring-2 focus:ring-primary text-foreground"
              >
                <option>Selecione...</option>
                <option>Aluno</option>
                <option>Professor</option>
                <option>Administrador</option>
              </select>
            </div>

            {/* Nome */}
            <div>
              <label className="font-medium text-foreground">Nome Completo*</label>
              <input
                type="text"
                className="mt-1 w-full p-3 bg-background border border-border rounded-md outline-none focus:ring-2 focus:ring-primary text-foreground"
              />
            </div>

            {/* Email */}
            <div>
              <label className="font-medium text-foreground">Email*</label>
              <input
                type="email"
                className="mt-1 w-full p-3 bg-background border border-border rounded-md outline-none focus:ring-2 focus:ring-primary text-foreground"
              />
            </div>

            {/* Turma */}
            <div>
              <label className="font-medium text-foreground">Turma*</label>
              <select
                className="mt-1 w-full p-3 bg-background border border-border rounded-md outline-none focus:ring-2 focus:ring-primary text-foreground"
              >
                <option>Selecione a turma...</option>
                <option>7º A</option>
                <option>7º B</option>
                <option>7º C</option>
                <option>8º A</option>
                <option>8º B</option>
                <option>8º C</option>
                <option>9º A</option>
                <option>9º B</option>
                <option>9º C</option>
                <option>1º A</option>
                <option>1º B</option>
                <option>1º C</option>
                <option>2º A</option>
                <option>2º B</option>
                <option>2º C</option>
                <option>3º A</option>
                <option>3º B</option>
                <option>3º C</option>
              </select>
            </div>

            {/* Senha */}
            <div className="relative">
              <label className="font-medium text-foreground">Senha*</label>
              <input
                type={showPassword ? "text" : "password"}
                className="mt-1 w-full p-3 bg-background border border-border rounded-md outline-none focus:ring-2 focus:ring-primary text-foreground"
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
                className="mt-1 w-full p-3 bg-background border border-border rounded-md outline-none focus:ring-2 focus:ring-primary text-foreground"
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
                className="w-[48%] py-3 rounded-md text-center font-medium text-primary-foreground bg-primary hover:bg-primary/90 transition-colors"
              >
                Adicionar
              </button>

            </div>

          </form>
        </div>
        </div>
      </section>
    </>
  );
}
