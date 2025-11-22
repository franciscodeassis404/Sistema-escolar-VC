// components/LogoutModal.tsx
import React from "react";

type LogoutModalProps = {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
};

export default function LogoutModal({ open, onClose, onConfirm }: LogoutModalProps) {
  if (!open) return null;

  return (
    <div
      className="
        fixed inset-0 z-50
        flex items-center justify-center
        bg-black/20 backdrop-blur-sm
        animate-fadeIn
      "
    >
      <div
        className="
          w-full max-w-2xl
          bg-gray-100 dark:bg-gray-800
          rounded-xl shadow-xl
          border border-gray-300 dark:border-gray-700
          overflow-hidden
          animate-scaleIn
        "
      >
        {/* CABEÇALHO */}
        <div
          className="
            w-full bg-primary text-white
            px-6 py-4
            flex items-center justify-between
          "
        >
          <h2 className="text-lg font-semibold">Confirmar saída</h2>
          <button
            onClick={onClose}
            className="text-white hover:text-gray-200 text-xl font-bold"
          >
            ×
          </button>
        </div>

        {/* CORPO */}
        <div className="p-6">
          <h3 className="text-xl font-semibold mb-3 text-gray-800 dark:text-gray-100">
            Deseja realmente sair do sistema?
          </h3>

          <p className="text-gray-700 dark:text-gray-300 mb-6">
            Ao confirmar, sua sessão será encerrada e você será redirecionado para a página de login.
          </p>

          {/* BOTÕES */}
          <div className="flex justify-end gap-4 mt-4">
            <button
              onClick={onClose}
              className="
                px-6 py-2 rounded-lg
                bg-gray-300 dark:bg-gray-600
                text-gray-900 dark:text-gray-100
                hover:bg-gray-400 dark:hover:bg-gray-500
                transition
              "
            >
              Cancelar
            </button>

            <button
              onClick={onConfirm}
              className="
                px-6 py-2 rounded-lg
                bg-red-600 text-white
                hover:bg-red-700
                transition
              "
            >
              Sair
            </button>
          </div>
        </div>
      </div>

      {/* ANIMAÇÕES */}
      <style>
        {`
        @keyframes fadeIn {
          from { opacity: 0 }
          to { opacity: 1 }
        }
        .animate-fadeIn { animation: fadeIn .25s ease-out; }

        @keyframes scaleIn {
          from { opacity: 0; transform: scale(.92); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-scaleIn { animation: scaleIn .25s ease-out; }
      `}
      </style>
    </div>
  );
}