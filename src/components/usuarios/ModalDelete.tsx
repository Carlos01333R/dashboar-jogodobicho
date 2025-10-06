// ModalDelete.tsx
import { useEffect } from "react";
import { Button } from "../ui/button";
import { usePathname } from "next/navigation";

interface Props {
  name: string;
  id: string;
  title: string;
  isOpen: boolean;
  onClose: () => void;
  onsubmit: (form: { id: string }) => void | Promise<void>;
}

export default function ModalDelete({ name, id, title, isOpen, onClose, onsubmit }: Props) {
  const pathname = usePathname();



  const handleDelete = async (e: any) => {
    e.preventDefault();
    await onsubmit({ id });
    onClose();
  };

  if (!isOpen) return null; // 👈 No se muestra hasta que lo actives desde fuera

  return (
    <div className="fixed z-40 inset-0 flex justify-center items-center backdrop-blur-sm ">
      <div
        className="bg-white rounded-2xl shadow-xl p-6 relative sm:max-w-[725px] max-h-[90vh] flex-col overflow-y-scroll"
        onClick={(e) => e.stopPropagation()}
      >
        <section className="w-full flex flex-col items-center justify-center gap-y-2">
          <p>Eliminar {title}</p>
          <small>ID: {id}</small>
          <h2 className="font-raleway-black 2xl text-center py-4">
            ¿Estás seguro de que quieres eliminar a{" "}
            <span className="font-bold text-red-600">{name}</span>?
          </h2>
        </section>

        <section className="w-full flex items-center justify-center gap-x-2">
          <button onClick={onClose} className="py-1.5 px-3 bg-red-500 text-white rounded-lg">
            Cancelar
          </button>
          <Button onClick={handleDelete}>Aceptar</Button>
        </section>
      </div>
    </div>
  );
}
