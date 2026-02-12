const { ejecutarConsulta } = require('../db.js');
class TipoIngresoServicio {

  constructor() { }

    async listarTipoIngreso() {
    return await ejecutarConsulta("SELECT * FROM `dbplanilla`.`tipoingresos`");
  }

    async obtenerPorId(id) {
    return await ejecutarConsulta("SELECT * FROM `dbplanilla`.`tipoingresos` WHERE `idTipoIngresos` = ?",
      [id]);
    }

    async insertar(datos) {
    const sql = `
    INSERT INTO dbplanilla.tipoingresos
(Bonos, HorasExtra, HorasDobles, Comisiones, Viaticos, idEmpleados) VALUES 
(?, ?, ?, ?, ?, ?)
    `;
    const parametros = [
      datos.Bonos,
      datos.HorasExtra,
      datos.HorasDobles,
      datos.Comisiones,
      datos.Viaticos,
      datos.idEmpleados
    ];
    return await ejecutarConsulta(sql, parametros);
    }

    async actualizar(datos) {
    const sql = `
  UPDATE dbplanilla.tipoingresos
      SET Bonos = ?, HorasExtra = ?, HorasDobles = ?, Comisiones = ?, Viaticos = ?, idEmpleados = ?
      WHERE idTipoIngresos = ?
`;
    const parametros = [
      datos.Bonos,
      datos.HorasExtra,
      datos.HorasDobles,
      datos.Comisiones,
      datos.Viaticos,
      datos.idEmpleados,
      datos.idTipoIngresos
    ];
    return await ejecutarConsulta(sql, parametros);
}

async eliminar(id) {
    return await ejecutarConsulta("DELETE FROM dbplanilla.tipoingresos WHERE idTipoIngresos = ?",
         [id]);
    }

  }

    module.exports =  new TipoIngresoServicio();