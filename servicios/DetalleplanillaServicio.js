const {ejecutarConsulta} = require('../db.js');

class DetalleplanillaServicio {

  constructor() { };

  async listarDetalleplanilla() {
    return await ejecutarConsulta("SELECT * FROM `dbplanilla`.`detalleplanilla`");
  }

  async obtenerPorId(id) {
    return await ejecutarConsulta("SELECT * FROM `dbplanilla`.`detalleplanilla` WHERE `idDetallePlanilla` = ?",
      [id]);
  }

  async insertar(datos) {
    const sql = `
    INSERT INTO dbplanilla.detalleplanilla
(SalarioBase, TotalDeducciones, SalarioNeto,, SalarioBruto, idPlanilla, idDeducciones, idTipoIngreso) VALUES 
(?, ?, ?, ?, ?, ?, ?)
    `;

    const parametros = [
      datos.SalarioBase,
      datos.TotalDeducciones,
      datos.SalarioNeto,
      datos.SalarioBruto,
      datos.idPlanilla,
      datos.idDeducciones,
      datos.idTipoIngreso
    ];

    return await ejecutarConsulta(sql, parametros);
  }

  async actualizar(datos) {
    const sql = `
  UPDATE dbplanilla.detalleplanilla
      SET SalarioBase = ?, TotalDeducciones = ?, SalarioNeto = ?, SalarioBruto = ?, idPlanilla = ?, idDeducciones = ?, idTipoIngreso = ?
      WHERE idDetallePlanilla = ?
`;

    const parametros = [
      datos.SalarioBase,
      datos.TotalDeducciones,
      datos.SalarioNeto,
      datos.SalarioBruto,
      datos.idPlanilla,
      datos.idDeducciones,
      datos.idTipoIngreso,
      datos.idDetallePlanilla
    ];

    return await ejecutarConsulta(sql, parametros);
  }

  async eliminar(id) {
    return await ejecutarConsulta("DELETE FROM dbplanilla.detalleplanilla WHERE idDetallePlanilla = ?", [id]);
  }

}

module.exports = new DetalleplanillaServicio();
