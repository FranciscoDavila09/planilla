const { supabase } = require("../supabase");

class FeriadoServicio {
  constructor() {}

  // Listar todos los feriados
  async listarFeriados() {
    const { data, error } = await supabase.from("feriados").select("*");

    if (error) throw error;
    return data;
  }

  // Obtener feriado por ID
  async obtenerPorId(id) {
    const { data, error } = await supabase
      .from("feriados")
      .select("*")
      .eq("id_feriado", id)
      .single();

    if (error) throw error;
    return data;
  }

  // Insertar un feriado
  async insertar(datos) {
    const { data, error } = await supabase
      .from("feriados")
      .insert({
        fecha: datos.Fecha,
        nombre: datos.Nombre,
        es_obligatorio: datos.EsObligatorio,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  // Actualizar un feriado
  async actualizar(datos) {
    const { data, error } = await supabase
      .from("feriados")
      .update({
        fecha: datos.Fecha,
        nombre: datos.Nombre,
        es_obligatorio: datos.EsObligatorio,
      })
      .eq("id_feriado", datos.IdFeriado)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  // Eliminar un feriado
  async eliminar(id) {
    const { error } = await supabase
      .from("feriados")
      .delete()
      .eq("id_feriado", id);

    if (error) throw error;
    return { mensaje: "Feriado eliminado correctamente" };
  }
}

module.exports = new FeriadoServicio();
