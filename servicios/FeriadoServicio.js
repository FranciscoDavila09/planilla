const { ejecutarConsulta } = require("../db.js");

class FeriadoServicio {
  constructor() {}
  //Get para listar los feriados
  async listarFeriados() {
    return await ejecutarConsulta("SELECT * FROM `dbplanilla`.`feriados`");
  }

  //Get para obtener feriados por el id

  async obtenerPorId(id) {
    return await ejecutarConsulta(
      "SELECT * FROM `dbplanilla`.`feriados` WHERE `IdFeriado` = ?",
      [id],
    );
  }

  //Insertar datos

  async insertar(datos) {
    const sql = `
    INSERT INTO dbplanilla.feriados
(Fecha, Nombre, EsObligatorio) VALUES 
(?, ?, ?)
    `;

    const parametros = [datos.Fecha, datos.Nombre, datos.EsObligatorio];

    return await ejecutarConsulta(sql, parametros);
  }

  //Actualizar datos

  async actualizar(datos) {
    const sql = `
  UPDATE dbplanilla.feriados
      SET Fecha = ?, Nombre = ?, EsObligatorio = ?
      WHERE IdFeriado = ?

`;

    const parametros = [
      datos.Fecha,
      datos.Nombre,
      datos.EsObligatorio,
      datos.IdFeriado,
    ];

    return await ejecutarConsulta(sql, parametros);
  }

  //eliminar datos por id

  async eliminar(id) {
    return await ejecutarConsulta(
      "DELETE FROM dbplanilla.feriados WHERE IdFeriado = ?",
      [id],
    );
  }
}

module.exports = new FeriadoServicio();
