const { supabase } = require('../supabase');

class DetalleplanillaServicio {
    constructor() { }

    // Listar todos los detalles de planilla
    async listarDetalleplanilla() {
        const { data, error } = await supabase
            .from('detalleplanilla')
            .select('*');

        if (error) throw error;
        return data;
    }

    // Obtener detalle por ID
    async obtenerPorId(id) {
        const { data, error } = await supabase
            .from('detalleplanilla')
            .select('*')
            .eq('id_detalle_planilla', id)
            .single();

        if (error) throw error;
        return data;
    }

    // Insertar un detalle de planilla
    async insertar(datos) {
        const { data, error } = await supabase
            .from('detalleplanilla')
            .insert({
                salario_base:       datos.SalarioBase,
                total_deducciones:  datos.TotalDeducciones,
                salario_neto:       datos.SalarioNeto,
                salario_bruto:      datos.SalarioBruto,
                id_planilla:        datos.idPlanilla,
                id_deducciones:     datos.idDeducciones,
                id_tipo_ingreso:    datos.idTipoIngreso,
                id_empleado:        datos.idEmpleado,
            })
            .select()
            .single();

        if (error) throw error;
        return data;
    }

    // Actualizar un detalle de planilla
    async actualizar(datos) {
        const { data, error } = await supabase
            .from('detalleplanilla')
            .update({
                salario_base:       datos.SalarioBase,
                total_deducciones:  datos.TotalDeducciones,
                salario_neto:       datos.SalarioNeto,
                salario_bruto:      datos.SalarioBruto,
                id_planilla:        datos.idPlanilla,
                id_deducciones:     datos.idDeducciones,
                id_tipo_ingreso:    datos.idTipoIngreso,
                id_empleado:        datos.idEmpleado,
            })
            .eq('id_detalle_planilla', datos.idDetallePlanilla)
            .select()
            .single();

        if (error) throw error;
        return data;
    }

    // Eliminar un detalle de planilla
    async eliminar(id) {
        const { error } = await supabase
            .from('detalleplanilla')
            .delete()
            .eq('id_detalle_planilla', id);

        if (error) throw error;
        return { mensaje: 'Detalle de planilla eliminado correctamente' };
    }
}

module.exports = new DetalleplanillaServicio();