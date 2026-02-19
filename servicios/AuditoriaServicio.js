const { ejecutarConsulta } = require("../db.js");

class AuditoriaServicio {
  constructor() {}

  //Listar todos los registros de auditoría (solo lectura)
  async listarAuditoria() {
    return await ejecutarConsulta(
      "SELECT * FROM `dbplanilla`.`auditoria` ORDER BY fecha DESC",
    );
  }

  //Obtener auditoría por ID (solo lectura)
  async obtenerPorId(id) {
    return await ejecutarConsulta(
      "SELECT * FROM `dbplanilla`.`auditoria` WHERE `idAuditoria` = ?",
      [id],
    );
  }

  //Obtener auditoría por tabla (solo lectura)
  async obtenerPorTabla(tabla) {
    return await ejecutarConsulta(
      "SELECT * FROM `dbplanilla`.`auditoria` WHERE `tabla_afectada` = ? ORDER BY fecha DESC",
      [tabla],
    );
  }

  //Obtener auditoría por tipo de acción (solo lectura)
  async obtenerPorAccion(accion) {
    return await ejecutarConsulta(
      "SELECT * FROM `dbplanilla`.`auditoria` WHERE `accion` = ? ORDER BY fecha DESC",
      [accion],
    );
  }

  //Obtener auditoría por usuario (solo lectura)
  async obtenerPorUsuario(usuario) {
    return await ejecutarConsulta(
      "SELECT * FROM `dbplanilla`.`auditoria` WHERE `usuario` = ? ORDER BY fecha DESC",
      [usuario],
    );
  }

  //Obtener auditoría por rango de fechas (solo lectura)
  async obtenerPorFechas(fechaInicio, fechaFin) {
    return await ejecutarConsulta(
      "SELECT * FROM `dbplanilla`.`auditoria` WHERE `fecha` BETWEEN ? AND ? ORDER BY fecha DESC",
      [fechaInicio, fechaFin],
    );
  }
}

module.exports = new AuditoriaServicio();
