const { supabase } = require('../supabase');

class DeduccionesServicio {
    constructor() { }

    // Listar todas las deducciones
    async listarDeducciones() {
        const { data, error } = await supabase
            .from('deducciones')
            .select('*');

        if (error) throw error;
        return data;
    }

    // Listar deducciones con datos de empleado, usuario y préstamo
    async listarDeduccionesVista() {
        const { data, error } = await supabase
            .from('deducciones')
            .select(`
                id_deducciones,
                nombre,
                monto,
                impuestos,
                estado,
                id_empleado,
                id_usuario,
                id_prestamo,
                empleados (
                    nombre,
                    apellidos,
                    codigo_empleado
                ),
                usuarios (
                    nombre,
                    apellidos
                ),
                prestamos (
                    monto_total,
                    cuotas,
                    monto_por_cuota,
                    saldo_pendiente,
                    fecha_inicio,
                    estado
                )
            `)
            .order('id_deducciones', { ascending: false });

        if (error) throw error;

        // Aplanar la respuesta para mantener el mismo formato que antes
        return data.map(d => ({
            id_deducciones:           d.id_deducciones,
            nombre:                   d.nombre,
            monto:                    d.monto,
            impuestos:                d.impuestos,
            estado:                   d.estado,
            id_empleado:              d.id_empleado,
            id_usuario:               d.id_usuario,
            id_prestamo:              d.id_prestamo,
            nombre_empleado:          d.empleados?.nombre,
            apellidos_empleado:       d.empleados?.apellidos,
            codigo_empleado:          d.empleados?.codigo_empleado,
            nombre_usuario:           d.usuarios?.nombre,
            apellidos_usuario:        d.usuarios?.apellidos,
            prestamo_monto_total:     d.prestamos?.monto_total,
            prestamo_cuotas:          d.prestamos?.cuotas,
            prestamo_monto_por_cuota: d.prestamos?.monto_por_cuota,
            prestamo_saldo_pendiente: d.prestamos?.saldo_pendiente,
            prestamo_fecha_inicio:    d.prestamos?.fecha_inicio,
            prestamo_estado:          d.prestamos?.estado,
        }));
    }

    // Obtener deducción por ID
    async obtenerPorId(id) {
        const { data, error } = await supabase
            .from('deducciones')
            .select('*')
            .eq('id_deducciones', id)
            .single();

        if (error) throw error;
        return data;
    }

    // Insertar una deducción
    async insertar(datos) {
        const { data, error } = await supabase
            .from('deducciones')
            .insert({
                nombre:      datos.Nombre,
                monto:       datos.Monto,
                impuestos:   datos.Impuestos,
                estado:      datos.Estado,
                id_empleado: datos.idEmpleado,
                id_usuario:  datos.usuariosId,
                id_prestamo: datos.idPrestamo,
            })
            .select()
            .single();

        if (error) throw error;
        return data;
    }

    // Actualizar una deducción
    async actualizar(datos) {
        const { data, error } = await supabase
            .from('deducciones')
            .update({
                nombre:      datos.Nombre,
                monto:       datos.Monto,
                impuestos:   datos.Impuestos,
                estado:      datos.Estado,
                id_empleado: datos.idEmpleado,
                id_usuario:  datos.usuariosId,
                id_prestamo: datos.idPrestamo,
            })
            .eq('id_deducciones', datos.idDeducciones)
            .select()
            .single();

        if (error) throw error;
        return data;
    }

    // Eliminar una deducción
    async eliminar(id) {
        const { error } = await supabase
            .from('deducciones')
            .delete()
            .eq('id_deducciones', id);

        if (error) throw error;
        return { mensaje: 'Deducción eliminada correctamente' };
    }
}

module.exports = new DeduccionesServicio();