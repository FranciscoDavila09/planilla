const { ejecutarConsulta } = require("../db.js");

class VacacionesServicio {
  constructor() {}

    async listarVacaciones() {
    return await ejecutarConsulta("SELECT * FROM `dbplanilla`.`vacaciones`");
  }

    async obtenerPorId(id) {
    return await ejecutarConsulta("SELECT * FROM `dbplanilla`.`vacaciones` WHERE `IdVacacion` = ?",
      [id]);
  }

    async insertar(datos) {
    const sql = `
    INSERT INTO dbplanilla.vacaciones
(IdEmpleado, FechaInicio, FechaFin, DiasSolicitados, Estado, UsuarioAprueba) VALUES
(?, ?, ?, ?, ?, ?)
    `;

    const parametros = [
        datos.IdEmpleado,
        datos.FechaInicio,
        datos.FechaFin,
        datos.DiasSolicitados,
        datos.Estado,
        datos.UsuarioAprueba
    ];
    return await ejecutarConsulta(sql, parametros);
    }

    async actualizar(datos) {
    const sql = `
    UPDATE dbplanilla.vacaciones SET 
    IdEmpleado = ?, FechaInicio = ?, FechaFin = ?, DiasSolicitados = ?, Estado = ?, UsuarioAprueba = ? WHERE IdVacacion = ?
    `;
    const parametros = [
        datos.IdEmpleado,
        datos.FechaInicio,
        datos.FechaFin,
        datos.DiasSolicitados,
        datos.Estado,
        datos.UsuarioAprueba,
        datos.IdVacacion
    ];
    return await ejecutarConsulta(sql, parametros);
    }

async eliminar(id) {
    return await ejecutarConsulta("DELETE FROM dbplanilla.vacaciones WHERE IdVacacion = ?",
         [id]);
    }

}

module.exports =  new VacacionesServicio();