const { supabase } = require("../supabase");

class AuditoriaServicio {
  constructor() {}

  // Listar todos los registros de auditoría
  async listarAuditoria() {
    const { data, error } = await supabase
      .from("auditoria")
      .select("*")
      .order("fecha", { ascending: false });

    if (error) throw error;
    return data;
  }

  // Obtener auditoría por ID
  async obtenerPorId(id) {
    const { data, error } = await supabase
      .from("auditoria")
      .select("*")
      .eq("id_auditoria", id)
      .single();

    if (error) throw error;
    return data;
  }

  // Obtener auditoría por tabla afectada
  async obtenerPorTabla(tabla) {
    const { data, error } = await supabase
      .from("auditoria")
      .select("*")
      .eq("tabla_afectada", tabla)
      .order("fecha", { ascending: false });

    if (error) throw error;
    return data;
  }

  // Obtener auditoría por tipo de acción (INSERT, UPDATE, DELETE)
  async obtenerPorAccion(accion) {
    const { data, error } = await supabase
      .from("auditoria")
      .select("*")
      .eq("accion", accion)
      .order("fecha", { ascending: false });

    if (error) throw error;
    return data;
  }

  // Obtener auditoría por usuario
  async obtenerPorUsuario(usuario) {
    const { data, error } = await supabase
      .from("auditoria")
      .select("*")
      .eq("usuario", usuario)
      .order("fecha", { ascending: false });

    if (error) throw error;
    return data;
  }

  // Obtener auditoría por rango de fechas
  async obtenerPorFechas(fechaInicio, fechaFin) {
    const { data, error } = await supabase
      .from("auditoria")
      .select("*")
      .gte("fecha", fechaInicio)
      .lte("fecha", fechaFin)
      .order("fecha", { ascending: false });

    if (error) throw error;
    return data;
  }
}

module.exports = new AuditoriaServicio();
