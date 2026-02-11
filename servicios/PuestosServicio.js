const { ejecutarConsulta } = require("../db.js");

class PuestosServicio {
  constructor() {}

  async listarPuestos() {
    return await ejecutarConsulta("SELECT * FROM `dbplanilla`.`puestos`");
  }

  async obtenerPorId(id) {
    return await ejecutarConsulta(
      "SELECT * FROM `dbplanilla`.`puestos` WHERE `IdPuestos` = ?",
      [id],
    );
  }

  async insertar(datos) {
    const sql = `
    INSERT INTO dbplanilla.puestos
(NombrePuesto, Descripcion, SalarioBase, Estado, idEmpleado, idUsuario) VALUES 
(?, ?, ?, ?, ?, ?)
    `;

    const parametros = [
      datos.NombrePuesto,
      datos.Descripcion,
      datos.SalarioBase,
      datos.Estado,
      datos.idEmpleado,
      datos.idUsuario,
    ];

    return await ejecutarConsulta(sql, parametros);
  }

  async actualizar(datos) {
    const sql = `
  UPDATE dbplanilla.puestos
      SET NombrePuesto = ?, Descripcion = ?, SalarioBase = ?, Estado = ?, idEmpleado = ?, idUsuario = ?
      WHERE IdPuestos = ?
`;

    const parametros = [
      datos.NombrePuesto,
      datos.Descripcion,
      datos.SalarioBase,
      datos.Estado,
      datos.idEmpleado,
      datos.idUsuario,
      datos.IdPuestos,
    ];

    return await ejecutarConsulta(sql, parametros);
  }

  async eliminar(id) {
    return await ejecutarConsulta(
      "DELETE FROM dbplanilla.puestos WHERE IdPuestos = ?",
      [id],
    );
  }
}

module.exports = new PuestosServicio();
