const { ejecutarConsulta } = require("../db.js");

class PrestamoServicio {
  constructor() {}

  async listarPrestamos() {
    return await ejecutarConsulta("SELECT * FROM `dbplanilla`.`prestamos`");
  }

  //get para listar el prestami con el nombre del empleado y el usuario que lo proceso

  async listarPrestamosVista() {
  const sql = `
    SELECT
      p.IdPrestamo,
      p.IdEmpleado,
      p.MontoTotal,
      p.Cuotas,
      p.MontoPorCuota,
      p.SaldoPendiente,
      p.FechaInicio,
      p.Estado,
      p.idUsuario,

      e.Nombre AS NombreEmpleado,
      e.Apellidos AS ApellidosEmpleado,
      e.CodigoEmpleado,

      u.Nombre AS NombreUsuario,
      u.Apellidos AS ApellidosUsuario

    FROM dbplanilla.prestamos p
    LEFT JOIN dbplanilla.empleados e
      ON p.IdEmpleado = e.idEmpleado
    LEFT JOIN dbplanilla.usuarios u
      ON p.idUsuario = u.idUsuario
    ORDER BY p.IdPrestamo DESC
  `;

  return await ejecutarConsulta(sql);
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
