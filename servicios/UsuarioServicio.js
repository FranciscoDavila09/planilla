const { ejecutarConsulta } = require("../db.js");

class UsuarioServicio {
  constructor() {}
  //Get para listar los usuarios
  async listarUsuarios() {
    return await ejecutarConsulta("SELECT * FROM `dbplanilla`.`usuarios`");
  }

  //Get para obtener empleados por el id

  async obtenerPorId(id) {
    return await ejecutarConsulta(
      "SELECT * FROM `dbplanilla`.`usuarios` WHERE `idUsuario` = ?",
      [id],
    );
  }

  //Insertar datos
  async insertar(datos) {
    const sql = `
    INSERT INTO dbplanilla.usuarios
    (Nombre, Apellidos, Estado, FechaCreacion, Clave, telefono,
     correo, IdRol, IdDepartamento) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

    const parametros = [
      datos.Nombre,
      datos.Apellidos,
      datos.Estado,
      datos.FechaCreacion,
      datos.Clave,
      datos.Telefono,
      datos.Correo,
      datos.idRol,
      datos.idDepartamento,
    ];

    return await ejecutarConsulta(sql, parametros);
  }

  //Actualizar datos

  async actualizar(datos) {
    const sql = `
  UPDATE dbplanilla.usuarios
      SET Nombre = ?, Apellidos = ?, Clave = ?, correo = ?, telefono = ?,
          FechaCreacion = ?, Estado = ?, idRol = ?, idDepartamento = ?
      WHERE idUsuario = ?

`;

    const parametros = [
      datos.Nombre,
      datos.Apellidos,
      datos.Clave,
      datos.correo,
      datos.telefono,
      datos.FechaCreacion,
      datos.Estado,
      datos.idRol,
      datos.idDepartamento,
      datos.idUsuario,
    ];

    return await ejecutarConsulta(sql, parametros);
  }

  //eliminar datos por id

  async eliminar(id) {
    return await ejecutarConsulta(
      "DELETE FROM dbplanilla.usuarios WHERE idUsuario = ?",
      [id],
    );
  }
}

module.exports = new UsuarioServicio();
