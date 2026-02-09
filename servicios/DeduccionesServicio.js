const {ejecutarConsulta} = require('../db.js');

class DeduccionesServicio {

  constructor() { };

    async listarDeducciones() {
    return await ejecutarConsulta("SELECT * FROM `dbplanilla`.`deducciones`");
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