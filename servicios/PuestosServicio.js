const { supabase } = require("../supabase");

class PuestosServicio {
  constructor() {}

  // Listar todos los puestos
  async listarPuestos() {
    const { data, error } = await supabase.from("puestos").select("*");

    if (error) throw error;
    return data;
  }

  // Obtener puesto por ID
  async obtenerPorId(id) {
    const { data, error } = await supabase
      .from("puestos")
      .select("*")
      .eq("id_puesto", id)
      .single();

    if (error) throw error;
    return data;
  }

  // Insertar un puesto
  async insertar(datos) {
    const { data, error } = await supabase
      .from("puestos")
      .insert({
        nombre_puesto: datos.NombrePuesto,
        descripcion: datos.Descripcion,
        salario_base: datos.SalarioBase,
        estado: datos.Estado,
        id_empleado: datos.idEmpleado,
        id_usuario: datos.idUsuario,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  // Actualizar un puesto
  async actualizar(datos) {
    const { data, error } = await supabase
      .from("puestos")
      .update({
        nombre_puesto: datos.NombrePuesto,
        descripcion: datos.Descripcion,
        salario_base: datos.SalarioBase,
        estado: datos.Estado,
        id_empleado: datos.idEmpleado,
        id_usuario: datos.idUsuario,
      })
      .eq("id_puesto", datos.idPuestos)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  // Eliminar un puesto
  async eliminar(id) {
    const { error } = await supabase
      .from("puestos")
      .delete()
      .eq("id_puesto", id);

    if (error) throw error;
    return { mensaje: "Puesto eliminado correctamente" };
  }
}

module.exports = new PuestosServicio();
