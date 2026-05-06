const { supabase } = require('../supabase');

class ControlHorarioServicio {
    constructor() { }

    // Listar todos los registros de control horario
    async listarControlHorario() {
        const { data, error } = await supabase
            .from('controlhorarios')
            .select('*');

        if (error) throw error;
        return data;
    }

    // Obtener registro por ID
    async obtenerPorId(id) {
        const { data, error } = await supabase
            .from('controlhorarios')
            .select('*')
            .eq('id_control', id)
            .single();

        if (error) throw error;
        return data;
    }

    // Insertar registro de control horario
    async insertar(datos) {
        const { data, error } = await supabase
            .from('controlhorarios')
            .insert({
                id_empleado:    datos.IdEmpleado,
                fecha:          datos.Fecha,
                hora_entrada:   datos.HoraEntrada,
                hora_salida:    datos.HoraSalida,
                horas_normales: datos.HorasNormales,
                horas_extra:    datos.HorasExtra,
                estado:         datos.Estado,
                id_usuarios:    datos.idUsuarios,
            })
            .select()
            .single();

        if (error) throw error;
        return data;
    }

    // Actualizar registro de control horario
    async actualizar(datos) {
        const { data, error } = await supabase
            .from('controlhorarios')
            .update({
                id_empleado:    datos.IdEmpleado,
                fecha:          datos.Fecha,
                hora_entrada:   datos.HoraEntrada,
                hora_salida:    datos.HoraSalida,
                horas_normales: datos.HorasNormales,
                horas_extra:    datos.HorasExtra,
                estado:         datos.Estado,
                id_usuarios:    datos.idUsuarios,
            })
            .eq('id_control', datos.IdControl)
            .select()
            .single();

        if (error) throw error;
        return data;
    }

    // Eliminar registro de control horario
    async eliminar(id) {
        const { error } = await supabase
            .from('controlhorarios')
            .delete()
            .eq('id_control', id);

        if (error) throw error;
        return { mensaje: 'Registro de horario eliminado correctamente' };
    }
}

module.exports = new ControlHorarioServicio();