const {ejecutarConsulta} = require('../db.js');
class ControlHorarioServicio {

  constructor() { };

    async listarControlHorario() {
    return await ejecutarConsulta("SELECT * FROM `dbplanilla`.`controlhorarios`");
  }

    async obtenerPorId(id) {
    return await ejecutarConsulta("SELECT * FROM `dbplanilla`.`controlhorarios` WHERE `IdControl` = ?",
      [id]);
  }

  async insertar(datos) {
  const sql = `
    INSERT INTO dbplanilla.controlhorarios
    (IdEmpleado, Fecha, HoraEntrada, HoraSalida, HorasNormales, HorasExtra, Estado, idUsuarios)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `;

  const parametros = [
    datos.IdEmpleado,
    datos.Fecha,
    datos.HoraEntrada,
    datos.HoraSalida,
    datos.HorasNormales,
    datos.HorasExtra,
    datos.Estado,
    datos.idUsuarios
  ];

  return await ejecutarConsulta(sql, parametros);
}

async actualizar(datos) {
  const sql = `
    UPDATE dbplanilla.controlhorarios
    SET IdEmpleado = ?, Fecha = ?, HoraEntrada = ?, HoraSalida = ?, HorasNormales = ?, HorasExtra = ?, Estado = ?, idUsuarios = ?
    WHERE IdControl = ?
  `;

  const parametros = [
    datos.IdEmpleado,
    datos.Fecha,
    datos.HoraEntrada,
    datos.HoraSalida,
    datos.HorasNormales,
    datos.HorasExtra,
    datos.Estado,
    datos.idUsuarios,
    datos.IdControl
  ];

  return await ejecutarConsulta(sql, parametros);
}


async eliminar(id) {
    return await ejecutarConsulta("DELETE FROM dbplanilla.controlhorarios WHERE IdControl = ?",
         [id]);
}
  }

    module.exports =  new ControlHorarioServicio();