const {ejecutarConsulta} = require('../db.js');

class AguinaldosServicio {
    constructor() { };


//Get para listar los aguinaldos
async listarAguinaldos() {
    return await ejecutarConsulta("SELECT * FROM `dbplanilla`.`aguinaldos`");

}


//Get para obtener aguinaldos por el id
async obtenerPorId(id) {
    return await ejecutarConsulta("SELECT * FROM `dbplanilla`.`aguinaldos` WHERE `IdAguinaldo` = ?",
         [id]);
    }

//Insertar datos
async insertar(datos) {
    const sql = `
    INSERT INTO dbplanilla.aguinaldos
(IdEmpleado, Periodo, MontoCalculado, FechaPago, Estado, idUsuario) VALUES 
(?, ?, ?, ?, ?, ?)
    `;

const parametros = [
datos.IdEmpleado,
datos.Periodo,
datos.MontoCalculado,
datos.FechaPago,
datos.Estado,
datos.idUsuario
];


return await ejecutarConsulta(sql, parametros);
}


//Actualizar datos
async actualizar(datos) {

const sql = `
  UPDATE dbplanilla.aguinaldos
      SET IdEmpleado = ?, Periodo = ?, MontoCalculado = ?, FechaPago = ?, Estado = ?, idUsuario = ?
      WHERE IdAguinaldo = ?
`;

const parametros = [
datos.IdEmpleado,
datos.Periodo,
datos.MontoCalculado,
datos.FechaPago,
datos.Estado,
datos.idUsuario,
datos.IdAguinaldo
];

  return await ejecutarConsulta(sql, parametros);
}


//Eliminar datos
async eliminar(id) {
    return await ejecutarConsulta("DELETE FROM `dbplanilla`.`aguinaldos` WHERE `IdAguinaldo` = ?",
         [id]);
    }

}
module.exports = new AguinaldosServicio();