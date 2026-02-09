const {ejecutarConsulta} = require('../db.js');

class ContratoServicio {
    constructor() { };

//Get para listar los contratos
async listarContratos() {
    return await ejecutarConsulta("SELECT * FROM `dbplanilla`.`contratos`");
}

//Get para obtener contratos por el id
async obtenerPorId(id) {
    return await ejecutarConsulta("SELECT * FROM `dbplanilla`.`contratos` WHERE `IdContrato` = ?",
         [id]);
    }

//Insertar datos
async insertar(datos) {
    const sql = `
    INSERT INTO dbplanilla.contratos
(IdEmpleado, TipoContrato, FechaInicio, FechaFin, SalarioPactado, Estado, usuarioId) VALUES 
(?, ?, ?, ?, ?, ?, ?)
    `;

const parametros = [
datos.IdEmpleado,
datos.TipoContrato,
datos.FechaInicio,
datos.FechaFin,
datos.SalarioPactado,
datos.Estado,
datos.usuarioId
];

return await ejecutarConsulta(sql, parametros);

}

//Actualizar datos
async actualizar(datos) {
    const sql = `
    UPDATE dbplanilla.contratos SET 
    IdEmpleado = ?, TipoContrato = ?, FechaInicio = ?, FechaFin = ?, SalarioPactado = ?, Estado = ?, usuarioId = ? WHERE IdContrato = ?
    `;
    const parametros = [
        datos.IdEmpleado,
        datos.TipoContrato,
        datos.FechaInicio,
        datos.FechaFin,
        datos.SalarioPactado,
        datos.Estado,
        datos.usuarioId,
        datos.IdContrato
    ];
    return await ejecutarConsulta(sql, parametros);
}

//Eliminar datos
async eliminar(id) {
    const sql = `
    DELETE FROM dbplanilla.contratos WHERE IdContrato = ?
    `;
    return await ejecutarConsulta(sql, [id]);
}

 
}

module.exports = new ContratoServicio();