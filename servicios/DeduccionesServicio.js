const {ejecutarConsulta} = require('../db.js');

class DeduccionesServicio {

  constructor() { };

    async listarDeducciones() {
    return await ejecutarConsulta("SELECT * FROM `dbplanilla`.`deducciones`");
  }

  // get para traer todos los datos de las otras tablas 
  async listarDeduccionesVista() {
  const sql = `
    SELECT
      d.idDeducciones,
      d.Nombre,
      d.Monto,
      d.Impuestos,
      d.Estado,
      d.idEmpleado,
      d.usuariosId,
      d.idPrestamo,

      e.Nombre AS NombreEmpleado,
      e.Apellidos AS ApellidosEmpleado,
      e.CodigoEmpleado,

      u.Nombre AS NombreUsuario,
      u.Apellidos AS ApellidosUsuario,

      p.MontoTotal AS PrestamoMontoTotal,
      p.Cuotas AS PrestamoCuotas,
      p.MontoPorCuota AS PrestamoMontoPorCuota,
      p.SaldoPendiente AS PrestamoSaldoPendiente,
      p.FechaInicio AS PrestamoFechaInicio,
      p.Estado AS PrestamoEstado

    FROM dbplanilla.deducciones d
    LEFT JOIN dbplanilla.empleados e
      ON d.idEmpleado = e.idEmpleado
    LEFT JOIN dbplanilla.usuarios u
      ON d.usuariosId = u.idUsuario
    LEFT JOIN dbplanilla.prestamos p
      ON d.idPrestamo = p.IdPrestamo
    ORDER BY d.idDeducciones DESC
  `;

  return await ejecutarConsulta(sql);
}

    async obtenerPorId(id) {
    return await ejecutarConsulta("SELECT * FROM `dbplanilla`.`deducciones` WHERE `idDeducciones` = ?",
      [id]);
  }

    async insertar(datos) {
    const sql = `
    INSERT INTO dbplanilla.deducciones
(Nombre, Monto, Impuestos, Estado, idEmpleado, usuariosId, idPrestamo) VALUES 
(?, ?, ?, ?, ?, ?, ?)
    `;
const parametros = [
datos.Nombre,
datos.Monto,
datos.Impuestos,
datos.Estado,
datos.idEmpleado,
datos.usuariosId,
datos.idPrestamo
];
return await ejecutarConsulta(sql, parametros);
    }

    async actualizar(datos) {
    const sql = `
  UPDATE dbplanilla.deducciones
      SET Nombre = ?, Monto = ?, Impuestos = ?, Estado = ?, idEmpleado = ?, usuariosId = ?, idPrestamo = ?
      WHERE idDeducciones = ?
`;
const parametros = [
  datos.Nombre,
  datos.Monto,
  datos.Impuestos,
  datos.Estado,
  datos.idEmpleado,
  datos.usuariosId,
  datos.idPrestamo,
  datos.idDeducciones
];
return await ejecutarConsulta(sql, parametros);
}

async eliminar(id) {
    return await ejecutarConsulta("DELETE FROM dbplanilla.deducciones WHERE idDeducciones = ?",
         [id]);
}
    }

    module.exports =  new DeduccionesServicio();