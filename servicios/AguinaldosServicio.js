const { supabase } = require("../supabase");

class AguinaldosServicio {
  constructor() {}

  // Listar todos los aguinaldos
  async listarAguinaldos() {
    const { data, error } = await supabase.from("aguinaldos").select("*");

    if (error) throw error;
    return data;
  }

  // Listar aguinaldos con datos de empleado y usuario
  async listarAguinaldosVista() {
    const { data, error } = await supabase
      .from("aguinaldos")
      .select(
        `
                id_aguinaldo,
                id_empleado,
                periodo,
                monto_calculado,
                fecha_pago,
                estado,
                id_usuario,
                empleados (
                    nombre,
                    apellidos,
                    codigo_empleado
                ),
                usuarios (
                    nombre,
                    apellidos
                )
            `,
      )
      .order("id_aguinaldo", { ascending: false });

    if (error) throw error;

    // Aplanar la respuesta para mantener el mismo formato que antes
    return data.map((a) => ({
      id_aguinaldo: a.id_aguinaldo,
      id_empleado: a.id_empleado,
      periodo: a.periodo,
      monto_calculado: a.monto_calculado,
      fecha_pago: a.fecha_pago,
      estado: a.estado,
      id_usuario: a.id_usuario,
      nombre_empleado: a.empleados?.nombre,
      apellidos_empleado: a.empleados?.apellidos,
      codigo_empleado: a.empleados?.codigo_empleado,
      nombre_usuario: a.usuarios?.nombre,
      apellidos_usuario: a.usuarios?.apellidos,
    }));
  }

  // Obtener un aguinaldo por ID
  async obtenerPorId(id) {
    const { data, error } = await supabase
      .from("aguinaldos")
      .select("*")
      .eq("id_aguinaldo", id)
      .single();

    if (error) throw error;
    return data;
  }

  // Insertar un aguinaldo
  async insertar(datos) {
    const { data, error } = await supabase
      .from("aguinaldos")
      .insert({
        id_empleado: datos.IdEmpleado,
        periodo: datos.Periodo,
        monto_calculado: datos.MontoCalculado,
        fecha_pago: datos.FechaPago,
        estado: datos.Estado,
        id_usuario: datos.idUsuario,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  // Actualizar un aguinaldo
  async actualizar(datos) {
    const { data, error } = await supabase
      .from("aguinaldos")
      .update({
        id_empleado: datos.IdEmpleado,
        periodo: datos.Periodo,
        monto_calculado: datos.MontoCalculado,
        fecha_pago: datos.FechaPago,
        estado: datos.Estado,
        id_usuario: datos.idUsuario,
      })
      .eq("id_aguinaldo", datos.IdAguinaldo)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  // Eliminar un aguinaldo
  async eliminar(id) {
    const { error } = await supabase
      .from("aguinaldos")
      .delete()
      .eq("id_aguinaldo", id);

    if (error) throw error;
    return { mensaje: "Aguinaldo eliminado correctamente" };
  }
}

module.exports = new AguinaldosServicio();
