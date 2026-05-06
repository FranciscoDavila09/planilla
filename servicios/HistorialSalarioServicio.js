const { supabase } = require("../supabase");

class HistorialSalarioServicio {
  constructor() {}

  // Listar todo el historial de salarios
  async listarHistorialSalario() {
    const { data, error } = await supabase
      .from("historialsalarios")
      .select("*");

    if (error) throw error;
    return data;
  }

  // Obtener historial por ID
  async obtenerPorId(id) {
    const { data, error } = await supabase
      .from("historialsalarios")
      .select("*")
      .eq("id_historial_salarios", id)
      .single();

    if (error) throw error;
    return data;
  }

  // Insertar un registro de historial
  async insertar(datos) {
    const { data, error } = await supabase
      .from("historialsalarios")
      .insert({
        monto_salario: datos.MontoSalario,
        fecha_inicio: datos.FechaInicio,
        fecha_fin: datos.FechaFin,
        motivo_cambio: datos.MotivoCambio,
        id_usuarios: datos.idUsuarios,
        id_empleados: datos.idEmpleados,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  // Actualizar un registro de historial
  async actualizar(datos) {
    const { data, error } = await supabase
      .from("historialsalarios")
      .update({
        monto_salario: datos.MontoSalario,
        fecha_inicio: datos.FechaInicio,
        fecha_fin: datos.FechaFin,
        motivo_cambio: datos.MotivoCambio,
        id_usuarios: datos.idUsuarios,
        id_empleados: datos.idEmpleados,
      })
      .eq("id_historial_salarios", datos.idHistorialSalarios)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  // Eliminar un registro de historial
  async eliminar(id) {
    const { error } = await supabase
      .from("historialsalarios")
      .delete()
      .eq("id_historial_salarios", id);

    if (error) throw error;
    return { mensaje: "Historial de salario eliminado correctamente" };
  }
}

module.exports = new HistorialSalarioServicio();
