const { supabase } = require("../supabase");

class VacacionesServicio {
  constructor() {}

  // Listar todas las vacaciones
  async listarVacaciones() {
    const { data, error } = await supabase.from("vacaciones").select("*");

    if (error) throw error;
    return data;
  }

  // Obtener vacación por ID
  async obtenerPorId(id) {
    const { data, error } = await supabase
      .from("vacaciones")
      .select("*")
      .eq("IdVacacion", id)
      .single();

    if (error) throw error;
    return data;
  }

  // Insertar vacación
  async insertar(datos) {
    const { data, error } = await supabase
      .from("vacaciones")
      .insert({
        IdEmpleado: datos.IdEmpleado,
        FechaInicio: datos.FechaInicio,
        FechaFin: datos.FechaFin,
        DiasSolicitados: datos.DiasSolicitados,
        Estado: datos.Estado,
        UsuarioAprueba: datos.UsuarioAprueba,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  // Actualizar vacación
  async actualizar(datos) {
    const { data, error } = await supabase
      .from("vacaciones")
      .update({
        IdEmpleado: datos.IdEmpleado,
        FechaInicio: datos.FechaInicio,
        FechaFin: datos.FechaFin,
        DiasSolicitados: datos.DiasSolicitados,
        Estado: datos.Estado,
        UsuarioAprueba: datos.UsuarioAprueba,
      })
      .eq("IdVacacion", datos.IdVacacion)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  // Eliminar vacación
  async eliminar(id) {
    const { error } = await supabase
      .from("vacaciones")
      .delete()
      .eq("IdVacacion", id);

    if (error) throw error;
    return { mensaje: "Vacación eliminada correctamente" };
  }
}

module.exports = new VacacionesServicio();
