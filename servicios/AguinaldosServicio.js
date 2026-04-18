const {ejecutarConsulta} = require('../db.js');

class AguinaldosServicio {
    constructor() { };


//Get para listar los aguinaldos
async listarAguinaldos() {
    return await ejecutarConsulta("SELECT * FROM `dbplanilla`.`aguinaldos`");

}

// para listar los aguinaldos con propiedades de otras tablas hijas 

async listarAguinaldosVista() {
  const sql = `
    SELECT
      a.IdAguinaldo,
      a.IdEmpleado,
      a.Periodo,
      a.MontoCalculado,
      a.FechaPago,
      a.Estado,
      a.idUsuario,

      e.Nombre AS NombreEmpleado,
      e.Apellidos AS ApellidosEmpleado,
      e.CodigoEmpleado,

      u.Nombre AS NombreUsuario,
      u.Apellidos AS ApellidosUsuario

    FROM dbplanilla.aguinaldos a
    LEFT JOIN dbplanilla.empleados e
      ON a.IdEmpleado = e.idEmpleado
    LEFT JOIN dbplanilla.usuarios u
      ON a.idUsuario = u.idUsuario
    ORDER BY a.IdAguinaldo DESC
  `;

  return await ejecutarConsulta(sql);
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