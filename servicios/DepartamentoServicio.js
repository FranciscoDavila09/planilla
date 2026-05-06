const { supabase } = require('../supabase');

class DepartamentoServicio {
    constructor() { }

    // Listar todos los departamentos
    async listarDepartamentos() {
        const { data, error } = await supabase
            .from('departamentos')
            .select('*');

        if (error) throw error;
        return data;
    }

    // Obtener departamento por ID
    async obtenerPorId(id) {
        const { data, error } = await supabase
            .from('departamentos')
            .select('*')
            .eq('id_departamento', id)
            .single();

        if (error) throw error;
        return data;
    }

    // Insertar un departamento
    async insertar(datos) {
        const { data, error } = await supabase
            .from('departamentos')
            .insert({
                nombre:      datos.Nombre,
                descripcion: datos.Descripcion,
                estado:      datos.Estado,
            })
            .select()
            .single();

        if (error) throw error;
        return data;
    }

    // Actualizar un departamento
    async actualizar(datos) {
        const { data, error } = await supabase
            .from('departamentos')
            .update({
                nombre:      datos.Nombre,
                descripcion: datos.Descripcion,
                estado:      datos.Estado,
            })
            .eq('id_departamento', datos.IdDepartamento)
            .select()
            .single();

        if (error) throw error;
        return data;
    }

    // Eliminar un departamento
    async eliminar(id) {
        const { error } = await supabase
            .from('departamentos')
            .delete()
            .eq('id_departamento', id);

        if (error) throw error;
        return { mensaje: 'Departamento eliminado correctamente' };
    }
}

module.exports = new DepartamentoServicio();