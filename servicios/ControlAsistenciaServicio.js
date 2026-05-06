const { supabase } = require('../supabase');

class ControlAsistenciaServicio {
    constructor() { }

    // Listar todos los registros de asistencia
    async listarControlAsistencia() {
        const { data, error } = await supabase
            .from('controlasistencia')
            .select('*')
            .order('id_control_asistencia', { ascending: false });

        if (error) throw error;
        return data;
    }

    // Obtener registro por ID
    async obtenerPorId(id) {
        const { data, error } = await supabase
            .from('controlasistencia')
            .select('*')
            .eq('id_control_asistencia', id)
            .single();

        if (error) throw error;
        return data;
    }

    // Insertar registro de asistencia
    async insertar(datos) {
        console.log("PARAMETROS INSERT:", datos);

        const { data, error } = await supabase
            .from('controlasistencia')
            .insert({
                hora_entrada: datos.HoraEntrada,
                hora_salida:  datos.HoraSalida,
                id_empleados: datos.idEmpleados,
                id_usuarios:  datos.idUsuarios,
                fecha:        datos.Fecha,
            })
            .select()
            .single();

        if (error) throw error;
        return data;
    }

    // Actualizar registro de asistencia
    async actualizar(datos) {
        const { data, error } = await supabase
            .from('controlasistencia')
            .update({
                hora_entrada: datos.HoraEntrada,
                hora_salida:  datos.HoraSalida,
                id_empleados: datos.idEmpleados,
                id_usuarios:  datos.idUsuarios,
                fecha:        datos.Fecha,
            })
            .eq('id_control_asistencia', datos.idControlAsistencia)
            .select()
            .single();

        if (error) throw error;
        return data;
    }

    // Eliminar registro de asistencia
    async eliminar(id) {
        const { error } = await supabase
            .from('controlasistencia')
            .delete()
            .eq('id_control_asistencia', id);

        if (error) throw error;
        return { mensaje: 'Registro de asistencia eliminado correctamente' };
    }
}

module.exports = new ControlAsistenciaServicio();