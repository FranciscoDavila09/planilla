const { supabase } = require('../supabase');

class ContratoServicio {
    constructor() { }

    // Listar todos los contratos
    async listarContratos() {
        const { data, error } = await supabase
            .from('contratos')
            .select('*');

        if (error) throw error;
        return data;
    }

    // Obtener contrato por ID
    async obtenerPorId(id) {
        const { data, error } = await supabase
            .from('contratos')
            .select('*')
            .eq('id_contrato', id)
            .single();

        if (error) throw error;
        return data;
    }

    // Insertar un contrato
    async insertar(datos) {
        const { data, error } = await supabase
            .from('contratos')
            .insert({
                id_empleado:     datos.IdEmpleado,
                tipo_contrato:   datos.TipoContrato,
                fecha_inicio:    datos.FechaInicio,
                fecha_fin:       datos.FechaFin,
                salario_pactado: datos.SalarioPactado,
                estado:          datos.Estado,
                id_usuario:      datos.usuarioId,
            })
            .select()
            .single();

        if (error) throw error;
        return data;
    }

    // Actualizar un contrato
    async actualizar(datos) {
        const { data, error } = await supabase
            .from('contratos')
            .update({
                id_empleado:     datos.IdEmpleado,
                tipo_contrato:   datos.TipoContrato,
                fecha_inicio:    datos.FechaInicio,
                fecha_fin:       datos.FechaFin,
                salario_pactado: datos.SalarioPactado,
                estado:          datos.Estado,
                id_usuario:      datos.usuarioId,
            })
            .eq('id_contrato', datos.IdContrato)
            .select()
            .single();

        if (error) throw error;
        return data;
    }

    // Eliminar un contrato
    async eliminar(id) {
        const { error } = await supabase
            .from('contratos')
            .delete()
            .eq('id_contrato', id);

        if (error) throw error;
        return { mensaje: 'Contrato eliminado correctamente' };
    }
}

module.exports = new ContratoServicio();