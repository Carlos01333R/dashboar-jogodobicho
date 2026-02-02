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
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function DialogDemo() {
  return (
    <Dialog >
      <form>
        <DialogTrigger asChild>
          <Button variant="outline">Open Dialog</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px] p-4 text-muted-foreground">
         <section className="w-full flex justify-center items-center  text-muted-foreground">
           Database Functions Edge
         </section>

         <section className=" text-muted-foreground">
           <p className="text-muted-foreground">NAME: <span className="font-semibold">verificar_duplicados</span> </p> 
         </section>
        </DialogContent>
      </form>
    </Dialog>
  )
}
