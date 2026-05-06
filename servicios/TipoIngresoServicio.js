const { supabase } = require("../supabase");

class TipoIngresoServicio {
  constructor() {}

  // Listar todos los tipos de ingreso
  async listarTipoIngreso() {
    const { data, error } = await supabase.from("tipoingresos").select("*");

    if (error) throw error;
    return data;
  }

  // Obtener tipo de ingreso por ID
  async obtenerPorId(id) {
    const { data, error } = await supabase
      .from("tipoingresos")
      .select("*")
      .eq("idTipoIngresos", id)
      .single();

    if (error) throw error;
    return data;
  }

  // Insertar tipo de ingreso
  async insertar(datos) {
    const { data, error } = await supabase
      .from("tipoingresos")
      .insert({
        Bonos: datos.Bonos,
        HorasExtra: datos.HorasExtra,
        HorasDobles: datos.HorasDobles,
        Comisiones: datos.Comisiones,
        Viaticos: datos.Viaticos,
        idEmpleados: datos.idEmpleados,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  // Actualizar tipo de ingreso
  async actualizar(datos) {
    const { data, error } = await supabase
      .from("tipoingresos")
      .update({
        Bonos: datos.Bonos,
        HorasExtra: datos.HorasExtra,
        HorasDobles: datos.HorasDobles,
        Comisiones: datos.Comisiones,
        Viaticos: datos.Viaticos,
        idEmpleados: datos.idEmpleados,
      })
      .eq("idTipoIngresos", datos.idTipoIngresos)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  // Eliminar tipo de ingreso
  async eliminar(id) {
    const { error } = await supabase
      .from("tipoingresos")
      .delete()
      .eq("idTipoIngresos", id);

    if (error) throw error;
    return { mensaje: "Tipo de ingreso eliminado correctamente" };
  }
}

module.exports = new TipoIngresoServicio();