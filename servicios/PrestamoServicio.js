const { supabase } = require("../supabase");

class PrestamoServicio {
  constructor() {}

  // Listar todos los préstamos
  async listarPrestamos() {
    const { data, error } = await supabase.from("prestamos").select("*");

    if (error) throw error;
    return data;
  }

  // Listar préstamos con datos de empleado y usuario
  async listarPrestamosVista() {
    const { data, error } = await supabase
      .from("prestamos")
      .select(
        `
                id_prestamo,
                id_empleado,
                monto_total,
                cuotas,
                monto_por_cuota,
                saldo_pendiente,
                fecha_inicio,
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
      .order("id_prestamo", { ascending: false });

    if (error) throw error;

    return data.map((p) => ({
      id_prestamo: p.id_prestamo,
      id_empleado: p.id_empleado,
      monto_total: p.monto_total,
      cuotas: p.cuotas,
      monto_por_cuota: p.monto_por_cuota,
      saldo_pendiente: p.saldo_pendiente,
      fecha_inicio: p.fecha_inicio,
      estado: p.estado,
      id_usuario: p.id_usuario,
      nombre_empleado: p.empleados?.nombre,
      apellidos_empleado: p.empleados?.apellidos,
      codigo_empleado: p.empleados?.codigo_empleado,
      nombre_usuario: p.usuarios?.nombre,
      apellidos_usuario: p.usuarios?.apellidos,
    }));
  }

  // Obtener préstamo por ID
  async obtenerPorId(id) {
    const { data, error } = await supabase
      .from("prestamos")
      .select("*")
      .eq("id_prestamo", id)
      .single();

    if (error) throw error;
    return data;
  }

  // Insertar un préstamo
  async insertar(datos) {
    const { data, error } = await supabase
      .from("prestamos")
      .insert({
        id_empleado: datos.IdEmpleado,
        monto_total: datos.MontoTotal,
        cuotas: datos.Cuotas,
        monto_por_cuota: datos.MontoPorCuota,
        saldo_pendiente: datos.SaldoPendiente,
        fecha_inicio: datos.FechaInicio,
        estado: datos.Estado,
        id_usuario: datos.IdUsuario,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  // Actualizar un préstamo
  async actualizar(datos) {
    const { data, error } = await supabase
      .from("prestamos")
      .update({
        id_empleado: datos.IdEmpleado,
        monto_total: datos.MontoTotal,
        cuotas: datos.Cuotas,
        monto_por_cuota: datos.MontoPorCuota,
        saldo_pendiente: datos.SaldoPendiente,
        fecha_inicio: datos.FechaInicio,
        estado: datos.Estado,
        id_usuario: datos.IdUsuario,
      })
      .eq("id_prestamo", datos.IdPrestamo)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  // Eliminar un préstamo
  async eliminar(id) {
    const { error } = await supabase
      .from("prestamos")
      .delete()
      .eq("id_prestamo", id);

    if (error) throw error;
    return { mensaje: "Préstamo eliminado correctamente" };
  }
}

module.exports = new PrestamoServicio();
