const { supabase } = require('../supabase');

class PlanillaServicio {
    constructor() { }

    // Listar todas las planillas con nombre de usuario
    async listarPlanillas() {
        const { data, error } = await supabase
            .from('planillas')
            .select(`
                id_planillas,
                estado_planilla,
                id_usuario,
                fecha_creacion,
                id_control_horarios,
                id_periodo_planilla,
                usuarios (
                    nombre,
                    apellidos
                )
            `);

        if (error) throw error;

        return data.map(p => ({
            id_planillas:         p.id_planillas,
            estado_planilla:      p.estado_planilla,
            id_usuario:           p.id_usuario,
            nombre_usuario:       `${p.usuarios?.nombre ?? ''} ${p.usuarios?.apellidos ?? ''}`.trim(),
            fecha_creacion:       p.fecha_creacion,
            id_control_horarios:  p.id_control_horarios,
            id_periodo_planilla:  p.id_periodo_planilla,
        }));
    }

    // Obtener planilla por ID con nombre de usuario
    async obtenerPorId(id) {
        const { data, error } = await supabase
            .from('planillas')
            .select(`
                id_planillas,
                estado_planilla,
                id_usuario,
                fecha_creacion,
                id_control_horarios,
                id_periodo_planilla,
                usuarios (
                    nombre,
                    apellidos
                )
            `)
            .eq('id_planillas', id)
            .single();

        if (error) throw error;

        return {
            id_planillas:         data.id_planillas,
            estado_planilla:      data.estado_planilla,
            id_usuario:           data.id_usuario,
            nombre_usuario:       `${data.usuarios?.nombre ?? ''} ${data.usuarios?.apellidos ?? ''}`.trim(),
            fecha_creacion:       data.fecha_creacion,
            id_control_horarios:  data.id_control_horarios,
            id_periodo_planilla:  data.id_periodo_planilla,
        };
    }

    // Insertar una planilla
    async insertar(datos) {
        const { data, error } = await supabase
            .from('planillas')
            .insert({
                estado_planilla:     datos.EstadoPlanilla,
                id_usuario:          datos.IdUsuario,
                fecha_creacion:      datos.FechaCreacion,
                id_control_horarios: datos.idControlHorarios,
                id_periodo_planilla: datos.idPeriodoPlanilla,
            })
            .select()
            .single();

        if (error) throw error;
        return data;
    }

    // Actualizar una planilla
    async actualizar(datos) {
        const { data, error } = await supabase
            .from('planillas')
            .update({
                estado_planilla:     datos.EstadoPlanilla,
                id_usuario:          datos.IdUsuario,
                fecha_creacion:      datos.FechaCreacion,
                id_control_horarios: datos.idControlHorarios,
                id_periodo_planilla: datos.idPeriodoPlanilla,
            })
            .eq('id_planillas', datos.idPlanillas)
            .select()
            .single();

        if (error) throw error;
        return data;
    }

    // Eliminar una planilla
    async eliminar(id) {
        const { error } = await supabase
            .from('planillas')
            .delete()
            .eq('id_planillas', id);

        if (error) throw error;
        return { mensaje: 'Planilla eliminada correctamente' };
    }
}

module.exports = new PlanillaServicio();