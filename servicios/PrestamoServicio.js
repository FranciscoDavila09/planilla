const { ejecutarConsulta } = require("../db.js");

class PrestamoServicio {
  constructor() {}

  async listarPrestamos() {
    return await ejecutarConsulta("SELECT * FROM `dbplanilla`.`prestamos`");
  }

  async obtenerPorId(id) {
    return await ejecutarConsulta(
      "SELECT * FROM `dbplanilla`.`prestamos` WHERE `IdPrestamo` = ?",
      [id],
    );
  }

  async insertar(datos) {
    const sql = `
    INSERT INTO dbplanilla.prestamos
(IdEmpleado, MontoTotal, Cuotas, MontoPorCuota, SaldoPendiente, FechaInicio, Estado, IdUsuario) VALUES 
(?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const parametros = [
      datos.IdEmpleado,
      datos.MontoTotal,
      datos.Cuotas,
      datos.MontoPorCuota,
      datos.SaldoPendiente,
      datos.FechaInicio,
      datos.Estado,
      datos.IdUsuario,
    ];

    return await ejecutarConsulta(sql, parametros);
  }

  async actualizar(datos) {
    const sql = `
  UPDATE dbplanilla.prestamos
      SET IdEmpleado = ?, MontoTotal = ?, Cuotas = ?, MontoPorCuota = ?, SaldoPendiente = ?, FechaInicio = ?, Estado = ?, IdUsuario = ?
      WHERE IdPrestamo = ?
`;

    const parametros = [
      datos.IdEmpleado,
      datos.MontoTotal,
      datos.Cuotas,
      datos.MontoPorCuota,
      datos.SaldoPendiente,
      datos.FechaInicio,
      datos.Estado,
      datos.IdUsuario,
      datos.IdPrestamo,
    ];

    return await ejecutarConsulta(sql, parametros);
  }

  async eliminar(id) {
    return await ejecutarConsulta(
      "DELETE FROM dbplanilla.prestamos WHERE IdPrestamo = ?",
      [id],
    );
  }
}

module.exports = new PrestamoServicio();
