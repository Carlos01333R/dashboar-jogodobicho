import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Trash2} from "lucide-react";

interface Props {
  name: string;
  id: string;
  title: string;
  onsubmit: (form:{
    id : string;
  }) => void | Promise<void>;
}

export function ModalDelete({name, id, onsubmit, title} : Props) {

  const handleDelete = async (e:any) => {
     e.preventDefault();
    await onsubmit({id});
  };
  return (
    <Dialog >
    
        <DialogTrigger asChild>
          <button className="bg-red-50 hover:bg-red-100 text-red-700 py-2 px-3 rounded-lg text-sm font-medium transition-colors cursor-pointer">
         <Trash2 className="w-4 h-4" />
        </button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px] ">
          <DialogHeader>
            <DialogTitle className="flex-1 text-center">Eliminar {title}</DialogTitle>
            <DialogDescription className="flex-1 text-center">
              <span >ID : {id}</span>
            </DialogDescription>
          </DialogHeader>
           <section>
            <h2 className="font-raleway-black 2xl text-center ">
                  ¿Estás seguro de que quieres eliminar a <span className="font-bold text-red-600">{name}</span>?
                </h2>
           </section>
            <DialogFooter>
            <section className="w-full  flex items-center justify-center gap-x-2">
            <DialogClose asChild>
              <button className="py-1.5 px-3 bg-red-500 text-white rounded-lg cursor-pointer">Cancelar</button>
            </DialogClose>
            <Button className="cursor-pointer" onClick={handleDelete}>Aceptar</Button>
            </section>
          </DialogFooter>
        </DialogContent>
          

    </Dialog>
  )
}
