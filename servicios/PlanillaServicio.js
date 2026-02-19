const { ejecutarConsulta } = require("../db.js");

class PlanillaServicio {
  constructor() {}
  //Get para listar las planillas
  async listarPlanillas() {
    return await ejecutarConsulta("SELECT * FROM `dbplanilla`.`planillas`");
  }

  //Get para obtener planillas por el id

  async obtenerPorId(id) {
    return await ejecutarConsulta(
      "SELECT * FROM `dbplanilla`.`planillas` WHERE `idPlanilla` = ?",
      [id],
    );
  }

  //Insertar datos

async insertar(datos) {
  const sql = `
    INSERT INTO dbplanilla.planillas
    (EstadoPlanilla, IdUsuario, FechaCreacion, idControlHorarios, idPeriodoPlanilla)
    VALUES (?, ?, ?, ?, ?)
  `;

  const parametros = [
    datos.EstadoPlanilla,
    datos.IdUsuario,
    datos.FechaCreacion,
    datos.idControlHorarios,
    datos.idPeriodoPlanilla
  ];

  return await ejecutarConsulta(sql, parametros);
}
  //Actualizar datos

 async actualizar(datos) {
  const sql = `
    UPDATE dbplanilla.planillas
    SET EstadoPlanilla = ?, IdUsuario = ?, FechaCreacion = ?, idControlHorarios = ?, idPeriodoPlanilla = ?
    WHERE idPlanillas = ?
  `;

  const parametros = [
    datos.EstadoPlanilla,
    datos.IdUsuario,
    datos.FechaCreacion,
    datos.idControlHorarios,
    datos.idPeriodoPlanilla,
    datos.idPlanillas
  ];

  return await ejecutarConsulta(sql, parametros);
}

  //eliminar datos por id

  async eliminar(id) {
    return await ejecutarConsulta(
      "DELETE FROM dbplanilla.planillas WHERE idPlanillas = ?",
      [id],
    );
  }
}

module.exports = new PlanillaServicio();
