import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import Sidebar from "./sidebar";
import {Menu} from "lucide-react"

interface SidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
  MenuArry: any;
}

export function SheetMovil({activeSection, onSectionChange,
  MenuArry,}: SidebarProps) {
  return (
    <Sheet >
      <SheetTrigger asChild>
      <Menu className="w-6 h-6 text-[#101828] hover:text-gray-600 transition-colors" />
      </SheetTrigger>
      <SheetContent side="left" className="bg-gray-900 border-none rounded-r-lg">
         <section>
         <Sidebar
          activeSection={activeSection}
          onSectionChange={onSectionChange}
          Menu={MenuArry}
        />
         </section>
       
      </SheetContent>
    </Sheet>
  )
}
