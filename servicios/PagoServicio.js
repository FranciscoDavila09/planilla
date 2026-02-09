const {ejecutarConsulta} = require('../db.js');

class PagoServicio {

  constructor() { };
//Get para listar los pagos
  async listarPagos() {
    return await ejecutarConsulta("SELECT * FROM `dbplanilla`.`pagos`");
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
(IdPlanilla, IdEmpleado, MontoPagado, MetodoPago, ReferenciaPago, IdUsuarioProcesa, FechaPago, Estado, idFeriados, idDeduccion) VALUES 
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
