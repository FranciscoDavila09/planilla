const { supabase } = require("../supabase");

class RolesServicio {
  constructor() {}

  // Listar todos los roles
  async listarRoles() {
    const { data, error } = await supabase.from("roles").select("*");

    if (error) throw error;
    return data;
  }

  // Obtener rol por ID
  async obtenerPorId(id) {
    const { data, error } = await supabase
      .from("roles")
      .select("*")
      .eq("id_rol", id)
      .single();

    if (error) throw error;
    return data;
  }

  // Insertar un rol
  async insertar(datos) {
    const { data, error } = await supabase
      .from("roles")
      .insert({
        nombre: datos.Nombre,
        descripcion: datos.Descripcion,
        estado: datos.Estado,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  // Actualizar un rol
  async actualizar(datos) {
    const { data, error } = await supabase
      .from("roles")
      .update({
        nombre: datos.Nombre,
        descripcion: datos.Descripcion,
        estado: datos.Estado,
      })
      .eq("id_rol", datos.idRol)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  // Eliminar un rol
  async eliminar(id) {
    const { error } = await supabase
      .from("roles")
      .delete()
      .eq("id_rol", id);

    if (error) throw error;
    return { mensaje: "Rol eliminado correctamente" };
  }
}

module.exports = new RolesServicio();