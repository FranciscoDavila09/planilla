const { supabase } = require("../supabase");

class PagoServicio {
  constructor() {}

  // Listar todos los pagos
  async listarPagos() {
    const { data, error } = await supabase.from("pagos").select("*");

    if (error) throw error;
    return data;
  }

  // Listar pagos con datos de empleado, planilla, usuario, feriado y deducción
  async listarPagosVista() {
    const { data, error } = await supabase
      .from("pagos")
      .select(
        `
                id_pago,
                id_planilla,
                id_empleado,
                monto_pagado,
                metodo_pago,
                referencia_pago,
                id_usuario_procesa,
                fecha_pago,
                estado,
                id_feriados,
                id_deduccion,
                empleados (
                    nombre,
                    apellidos,
                    codigo_empleado
                ),
                planillas (
                    estado_planilla
                ),
                usuarios (
                    nombre,
                    apellidos
                ),
                feriados (
                    nombre
                ),
                deducciones (
                    nombre
                )
            `,
      )
      .order("id_pago", { ascending: false });

    if (error) throw error;

    // Aplanar la respuesta para mantener el mismo formato que antes
    return data.map((p) => ({
      id_pago: p.id_pago,
      id_planilla: p.id_planilla,
      id_empleado: p.id_empleado,
      monto_pagado: p.monto_pagado,
      metodo_pago: p.metodo_pago,
      referencia_pago: p.referencia_pago,
      id_usuario_procesa: p.id_usuario_procesa,
      fecha_pago: p.fecha_pago,
      estado: p.estado,
      id_feriados: p.id_feriados,
      id_deduccion: p.id_deduccion,
      nombre_empleado: p.empleados?.nombre,
      apellidos_empleado: p.empleados?.apellidos,
      codigo_empleado: p.empleados?.codigo_empleado,
      estado_planilla: p.planillas?.estado_planilla,
      nombre_usuario_procesa: p.usuarios?.nombre,
      apellidos_usuario_procesa: p.usuarios?.apellidos,
      nombre_feriado: p.feriados?.nombre,
      nombre_deduccion: p.deducciones?.nombre,
    }));
  }

  // Obtener pago por ID
  async obtenerPorId(id) {
    const { data, error } = await supabase
      .from("pagos")
      .select("*")
      .eq("id_pago", id)
      .single();

    if (error) throw error;
    return data;
  }

  // Insertar un pago
  async insertar(datos) {
    const { data, error } = await supabase
      .from("pagos")
      .insert({
        id_planilla: datos.IdPlanilla,
        id_empleado: datos.IdEmpleado,
        monto_pagado: datos.MontoPagado,
        metodo_pago: datos.MetodoPago,
        referencia_pago: datos.ReferenciaPago,
        id_usuario_procesa: datos.IdUsuarioProcesa,
        fecha_pago: datos.FechaPago,
        estado: datos.Estado,
        id_feriados: datos.idFeriados,
        id_deduccion: datos.idDeduccion,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  // Actualizar un pago
  async actualizar(datos) {
    const { data, error } = await supabase
      .from("pagos")
      .update({
        id_planilla: datos.IdPlanilla,
        id_empleado: datos.IdEmpleado,
        monto_pagado: datos.MontoPagado,
        metodo_pago: datos.MetodoPago,
        referencia_pago: datos.ReferenciaPago,
        id_usuario_procesa: datos.IdUsuarioProcesa,
        fecha_pago: datos.FechaPago,
        estado: datos.Estado,
        id_feriados: datos.idFeriados,
        id_deduccion: datos.idDeduccion,
      })
      .eq("id_pago", datos.IdPago)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  // Eliminar un pago
  async eliminar(id) {
    const { error } = await supabase.from("pagos").delete().eq("id_pago", id);

    if (error) throw error;
    return { mensaje: "Pago eliminado correctamente" };
  }
}

module.exports = new PagoServicio();
