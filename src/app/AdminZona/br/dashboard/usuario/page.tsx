'use client'
import UsersComponentAdminZona from "@/components/adminzona/usuarios"
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";


export default function UsuarioAdmin(){
     const handleSubmit = async (e: any) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const nombre = formData.get("nombre");
    const email = formData.get("email");
    const sector = formData.get("sector");
    const password = formData.get("password");
    const telefono = formData.get("telefono");
    const confirm_password = formData.get("confirm_password");
  
    if (
      nombre === "" ||
      email === "" ||
      sector === "" ||
      password === "" ||
      confirm_password === ""
    ) {
      toast.error("Complete los campos requeridos");
      return;
    }

    if (password !== confirm_password) {
      toast.error("Contraseñas no coinciden");
      return;
    }

    const { data, error } = await supabase
      .from("users")
      .insert([
        {
          email: email,
          full_name: nombre,
          telefono: telefono,
          password: password,
          sector: sector,
          is_active: "TRUE",
         
        },
      ])
      .select();

    if (error) {
      console.error("Error inserting data:", error.message);
    } else {
      toast.success("Usuario Agregado Correctamente");
      e.target.reset();
      window.location.reload();
    }
  };

  const handleUpdateUser = async (form : any) => {
  const { id, Nombre, Email, Telefono, Sector, Password, Estado } = form;

  if(id === "" || Nombre === "" || Email === "" || Telefono === "" || Sector === "" || Password === "" || Estado === "") {
    toast.error("Complete todos los campos");
    return;
  }

  const { error } = await supabase
    .from("users")
    .update({
      full_name: Nombre,
      email: Email,
      telefono: Telefono,
      password: Password,
      sector: Sector,
      is_active: Estado === "TRUE",
    })
    .eq("id", id);

  if (error){
toast.error("Error al actualizar");
  } 
  else{
 toast.success("Usuario actualizado");
window.location.reload(); // recarga toda la página

  }
  };

   const handleDelete = async (from : any) => {
    const { id } = from;
    const { error } = await supabase.from("users").delete().eq("id", id);

    if (error) {
      console.error("Error deleting data:", error.message);
      toast.error("Error deleting data");
    } else {
      toast.success("Usuario Eliminado Correctamente");
      window.location.reload();
    }
  };
    return(
        <section>
            <UsersComponentAdminZona submit={handleSubmit} updateUser={handleUpdateUser} Delete={handleDelete}/>
        </section>
    )
}