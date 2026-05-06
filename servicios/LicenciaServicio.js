const { supabase } = require('../supabase');

class LicenciaServicio {
    constructor() { }

    // Listar todas las licencias
    async listarLicencia() {
        const { data, error } = await supabase
            .from('licencias')
            .select('*');

        if (error) throw error;
        return data;
    }

    // Obtener licencia por ID
    async obtenerPorId(id) {
        const { data, error } = await supabase
            .from('licencias')
            .select('*')
            .eq('id_licencia', id)
            .single();

        if (error) throw error;
        return data;
    }

    // Insertar una licencia
    async insertar(datos) {
        const { data, error } = await supabase
            .from('licencias')
            .insert({
                id_empleado:        datos.IdEmpleado,
                tipo:               datos.Tipo,
                fecha_inicio:       datos.FechaInicio,
                fecha_fin:          datos.FechaFin,
                documento_soporte:  datos.DocumentoSoporte,
                estado:             datos.Estado,
                id_usuario:         datos.idUsuario,
            })
            .select()
            .single();

        if (error) throw error;
        return data;
    }

    // Actualizar una licencia
    async actualizar(datos) {
        const { data, error } = await supabase
            .from('licencias')
            .update({
                id_empleado:        datos.IdEmpleado,
                tipo:               datos.Tipo,
                fecha_inicio:       datos.FechaInicio,
                fecha_fin:          datos.FechaFin,
                documento_soporte:  datos.DocumentoSoporte,
                estado:             datos.Estado,
                id_usuario:         datos.idUsuario,
            })
            .eq('id_licencia', datos.IdLicencia)
            .select()
            .single();

        if (error) throw error;
        return data;
    }

    // Eliminar una licencia
    async eliminar(id) {
        const { error } = await supabase
            .from('licencias')
            .delete()
            .eq('id_licencia', id);

        if (error) throw error;
        return { mensaje: 'Licencia eliminada correctamente' };
    }
}

module.exports = new LicenciaServicio();