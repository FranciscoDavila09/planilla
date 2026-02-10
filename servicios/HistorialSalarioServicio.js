const { ejecutarConsulta } = require('../db.js');

class HistorialSalarioServicio {
  constructor() {}

  async listarHistorialSalario() {
    return await ejecutarConsulta("SELECT * FROM `dbplanilla`.`historialsalarios`");
  }

  async obtenerPorId(id) {
    return await ejecutarConsulta(
      "SELECT * FROM `dbplanilla`.`historialsalarios` WHERE `idHistorialSalarios` = ?",
      [id]
    );
  }

  async insertar(datos) {
    const sql = `
      INSERT INTO \`dbplanilla\`.\`historialsalarios\`
      (MontoSalario, FechaInicio, FechaFin, MotivoCambio, idUsuarios, idEmpleados)
      VALUES (?, ?, ?, ?, ?, ?)
    `;

    const parametros = [
      datos.MontoSalario,
      datos.FechaInicio,
      datos.FechaFin,
      datos.MotivoCambio,
      datos.idUsuarios,
      datos.idEmpleados
    ];

    return await ejecutarConsulta(sql, parametros);
  }

  async actualizar(datos) {
    const sql = `
      UPDATE \`dbplanilla\`.\`historialsalarios\`
      SET MontoSalario = ?, FechaInicio = ?, FechaFin = ?, MotivoCambio = ?, idUsuarios = ?, idEmpleados = ?
      WHERE idHistorialSalarios = ?
    `;

    const parametros = [
      datos.MontoSalario,
      datos.FechaInicio,
      datos.FechaFin,
      datos.MotivoCambio,
      datos.idUsuarios,
      datos.idEmpleados,
      datos.idHistorialSalarios
    ];

    return await ejecutarConsulta(sql, parametros);
  }

  async eliminar(id) {
    return await ejecutarConsulta(
      "DELETE FROM `dbplanilla`.`historialsalarios` WHERE idHistorialSalarios = ?",
      [id]
    );
  }
}

module.exports = new HistorialSalarioServicio();
