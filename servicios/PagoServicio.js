const {ejecutarConsulta} = require('../db.js');

class PagoServicio {

  constructor() { };
//Get para listar los pagos
  async listarPagos() {
    return await ejecutarConsulta("SELECT * FROM `dbplanilla`.`pagos`");
  }

  //get para obtner los pagos con nombre del empleado y planilla y demas 

  async listarPagosVista() {
  const sql = `
    SELECT 
      p.IdPago,
      p.IdPlanilla,
      p.IdEmpleado,
      p.MontoPagado,
      p.MetodoPago,
      p.ReferenciaPago,
      p.IdUsuarioProcesa,
      p.FechaPago,
      p.Estado,
      p.idFeriados,
      p.idDeduccion,

      e.Nombre AS NombreEmpleado,
      e.Apellidos AS ApellidosEmpleado,
      e.CodigoEmpleado,

      pl.EstadoPlanilla,

      u.Nombre AS NombreUsuarioProcesa,
      u.Apellidos AS ApellidosUsuarioProcesa,

      f.Nombre AS NombreFeriado,

      d.Nombre AS NombreDeduccion
    FROM dbplanilla.pagos p
    LEFT JOIN dbplanilla.empleados e
      ON p.IdEmpleado = e.idEmpleado
    LEFT JOIN dbplanilla.planillas pl
      ON p.IdPlanilla = pl.idPlanillas
    LEFT JOIN dbplanilla.usuarios u
      ON p.IdUsuarioProcesa = u.idUsuario
    LEFT JOIN dbplanilla.feriados f
      ON p.idFeriados = f.IdFeriado
    LEFT JOIN dbplanilla.deducciones d
      ON p.idDeduccion = d.idDeducciones
    ORDER BY p.IdPago DESC
  `;

  return await ejecutarConsulta(sql);
}


  //Get para obtener pagos por el id 

    async obtenerPorId(id) {
        return await ejecutarConsulta("SELECT * FROM `dbplanilla`.`pagos` WHERE `IdPago` = ?",
             [id]);

    }

    //Insertar datos 

async insertar(datos) {
    const sql = `
    INSERT INTO dbplanilla.pagos
(IdPlanilla, IdEmpleado, MontoPagado, MetodoPago, ReferenciaPago, IdUsuarioProcesa,
 FechaPago, Estado, idFeriados, idDeduccion) VALUES 
(?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

const parametros = [
datos.IdPlanilla,
datos.IdEmpleado,
datos.MontoPagado,
datos.MetodoPago,
datos.ReferenciaPago,
datos.IdUsuarioProcesa,
datos.FechaPago,
datos.Estado,
datos.idFeriados,
datos.idDeduccion
];

return await ejecutarConsulta(sql, parametros);

}


//Actualizar datos

async actualizar(datos) {

const sql = `
  UPDATE dbplanilla.pagos
      SET IdPlanilla = ?, IdEmpleado = ?, MontoPagado = ?, MetodoPago = ?, ReferenciaPago = ?, IdUsuarioProcesa = ?, FechaPago = ?, Estado = ?, idFeriados = ?, idDeduccion = ?
      WHERE IdPago = ?

`;

const parametros = [

datos.IdPlanilla,
datos.IdEmpleado,
datos.MontoPagado,
datos.MetodoPago,
datos.ReferenciaPago,
datos.IdUsuarioProcesa,
datos.FechaPago,
datos.Estado,
datos.idFeriados,
datos.idDeduccion,
datos.IdPago
];

return await ejecutarConsulta(sql, parametros);

}


//eliminar datos por id

async eliminar(id) {

return await ejecutarConsulta("DELETE FROM dbplanilla.pagos WHERE IdPago = ?", [id]);


}




}

module.exports = new PagoServicio();
