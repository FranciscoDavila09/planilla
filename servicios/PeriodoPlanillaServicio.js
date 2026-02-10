const {ejecutarConsulta} = require('../db.js');
class PeriodoPlanillaServicio {

  constructor() { }

    async listarPeriodoPlanilla() {
    return await ejecutarConsulta("SELECT * FROM `dbplanilla`.`periodoplanilla`");
  }

    async obtenerPorId(id) {
    return await ejecutarConsulta("SELECT * FROM `dbplanilla`.`periodoplanilla` WHERE `idPeriodoPlanilla` = ?",
      [id]);
    }
    async insertar(datos) {
    const sql = `
    INSERT INTO dbplanilla.periodoplanilla
(NombrePeriodo, FechaInicio, FechaFin) VALUES 
(?, ?, ?)
    `;
    const parametros = [
      datos.NombrePeriodo,
      datos.FechaInicio,
      datos.FechaFin
    ];
    return await ejecutarConsulta(sql, parametros);
}

async actualizar(datos) {
    const sql = `
  UPDATE dbplanilla.periodoplanilla
        SET NombrePeriodo = ?, FechaInicio = ?, FechaFin = ?
        WHERE idPeriodoPlanilla = ?
`;
const parametros = [    
        datos.NombrePeriodo,
        datos.FechaInicio,
        datos.FechaFin,
        datos.idPeriodoPlanilla
    ];
    return await ejecutarConsulta(sql, parametros);
}

async eliminar(id) {
    return await ejecutarConsulta("DELETE FROM dbplanilla.periodoplanilla WHERE idPeriodoPlanilla = ?",
         [id]);
}

  }

  module.exports =  new PeriodoPlanillaServicio();
