const { supabase } = require("../supabase");

class PeriodoPlanillaServicio {
  constructor() {}

  // Listar todos los periodos de planilla
  async listarPeriodoPlanilla() {
    const { data, error } = await supabase.from("periodoplanilla").select("*");

    if (error) throw error;
    return data;
  }

  // Obtener periodo por ID
  async obtenerPorId(id) {
    const { data, error } = await supabase
      .from("periodoplanilla")
      .select("*")
      .eq("id_periodo_planilla", id)
      .single();

    if (error) throw error;
    return data;
  }

  // Insertar un periodo de planilla
  async insertar(datos) {
    const { data, error } = await supabase
      .from("periodoplanilla")
      .insert({
        nombre_periodo: datos.NombrePeriodo,
        fecha_inicio: datos.FechaInicio,
        fecha_fin: datos.FechaFin,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  // Actualizar un periodo de planilla
  async actualizar(datos) {
    const { data, error } = await supabase
      .from("periodoplanilla")
      .update({
        nombre_periodo: datos.NombrePeriodo,
        fecha_inicio: datos.FechaInicio,
        fecha_fin: datos.FechaFin,
      })
      .eq("id_periodo_planilla", datos.idPeriodoPlanilla)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  // Eliminar un periodo de planilla
  async eliminar(id) {
    const { error } = await supabase
      .from("periodoplanilla")
      .delete()
      .eq("id_periodo_planilla", id);

    if (error) throw error;
    return { mensaje: "Periodo de planilla eliminado correctamente" };
  }
}

module.exports = new PeriodoPlanillaServicio();
