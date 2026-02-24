const { ejecutarConsulta } = require('../db.js');
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
class UsuarioServicio {
  constructor() {}
  PalabraSecreta = "MiPalabraSecreta";

  async Autenticacion(correo, ClaveSinEncriptar) {
    // Consultar en la base de datos si el usuario y la clave coninciden
    const filas = await ejecutarConsulta(
      "SELECT * FROM dbplanilla.usuarios  WHERE correo = ?",
      [correo],
    );

      if (!filas || filas.length === 0) return false;

    const Usuario = filas[0]; 

    
    let Resultado = false;



    try {
      Resultado = await bcrypt.compare(ClaveSinEncriptar, Usuario.Clave);

    } catch (err) {
      return false;
    }

    if (Resultado === true) {
  return await this.GenerarToken(Usuario.Nombre, Usuario.correo);
    } else {
      return false;
    }
  }


  async GenerarToken(Nombre, Correo) {
    let token = jwt.sign({ Nombre, Correo }, this.PalabraSecreta, {
      expiresIn: "10m",
    });
    // Almacenar en la base de datos para el usuario
     await ejecutarConsulta(
      "UPDATE dbplanilla.usuarios SET Token = ? WHERE correo = ?",
      [token, Correo]
    );
    return token;
  }


 async ValidarToken(solicitud) {
    let token;
    try {
      token = solicitud.headers.authorization.split(" ")[1];
    } catch (err) {
      return false;
    }

    let Resultado;
    try {
      Resultado = jwt.verify(token, this.PalabraSecreta);
    } catch (err) {
      return false;
    }

    // buscar usuario por correo que viene en el token
    const filas = await ejecutarConsulta(
      "SELECT Token FROM dbplanilla.usuarios WHERE correo = ? LIMIT 1",
      [Resultado.Correo]
    );

    if (!filas || filas.length === 0) return false;

    const Usuario = filas[0];

    // validar que el token sea el mismo guardado en la base de datos
    if (Usuario.Token === token) return Resultado;

    return false;
  }
async DesAutenticacion(CorreoElectronico) {
  await ejecutarConsulta(
    "UPDATE dbplanilla.usuarios SET Token = NULL WHERE correo = ?",
    [CorreoElectronico]
  );
  return true;
}




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
  const claveHash = await bcrypt.hash(datos.Clave, 10);

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
    claveHash,
    datos.telefono,
    datos.correo,
    datos.idRol,
    datos.idDepartamento,
  ];

  return await ejecutarConsulta(sql, parametros);
}




  // async insertar(datos) {
  //   const sql = `
  //   INSERT INTO dbplanilla.usuarios
  //   (Nombre, Apellidos, Estado, FechaCreacion, Clave, telefono,
  //    correo, IdRol, IdDepartamento) 
  //   VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  // `;

  //   const parametros = [
  //     datos.Nombre,
  //     datos.Apellidos,
  //     datos.Estado,
  //     datos.FechaCreacion,
  //     datos.Clave,
  //     datos.Telefono,
  //     datos.Correo,
  //     datos.idRol,
  //     datos.idDepartamento,
  //   ];

  //   return await ejecutarConsulta(sql, parametros);
  // }

  //Actualizar datos

async actualizar(datos) {
  const claveHash = await bcrypt.hash(datos.Clave, 10);

  const sql = `
    UPDATE dbplanilla.usuarios
    SET Nombre = ?, Apellidos = ?, Clave = ?, correo = ?, telefono = ?,
        FechaCreacion = ?, Estado = ?, idRol = ?, idDepartamento = ?
    WHERE idUsuario = ?
  `;

  const parametros = [
    datos.Nombre,
    datos.Apellidos,
    claveHash,
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




//   async actualizar(datos) {
//     const sql = `
//   UPDATE dbplanilla.usuarios
//       SET Nombre = ?, Apellidos = ?, Clave = ?, correo = ?, telefono = ?,
//           FechaCreacion = ?, Estado = ?, idRol = ?, idDepartamento = ?
//       WHERE idUsuario = ?

// `;

//     const parametros = [
//       datos.Nombre,
//       datos.Apellidos,
//       datos.Clave,
//       datos.correo,
//       datos.telefono,
//       datos.FechaCreacion,
//       datos.Estado,
//       datos.idRol,
//       datos.idDepartamento,
//       datos.idUsuario,
//     ];

//     return await ejecutarConsulta(sql, parametros);
//   }

  //eliminar datos por id

  async eliminar(id) {
    return await ejecutarConsulta(
      "DELETE FROM dbplanilla.usuarios WHERE idUsuario = ?",
      [id],
    );
  }


  
}

module.exports = new UsuarioServicio();
