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


async ValidarToken(authorizationHeader) {
  let token;

  try {
    // authorizationHeader = "Bearer <token>"
    token = authorizationHeader.split(" ")[1];
    if (!token) return false;
  } catch (err) {
    return false;
  }

  let resultado;
  try {
    resultado = jwt.verify(token, this.PalabraSecreta);
  } catch (err) {
    return false;
  }

  // Buscar token guardado por el correo del JWT
  const filas = await ejecutarConsulta(
    "SELECT Token FROM dbplanilla.usuarios WHERE correo = ? LIMIT 1",
    [resultado.Correo]
  );

  if (!filas || filas.length === 0) return false;

  const tokenbase = filas[0].Token;

  //  Retornar SOLO true false 
  return tokenbase === token;
}






//  async ValidarToken(solicitud) {
//     let token;
//     try {
//       token = solicitud.headers.authorization.split(" ")[1];
//     } catch (err) {
//       return false;
//     }

//     let Resultado;
//     try {
//       Resultado = jwt.verify(token, this.PalabraSecreta);
//     } catch (err) {
//       return false;
//     }

//     // buscar usuario por correo que viene en el token
//     const filas = await ejecutarConsulta(
//       "SELECT Token FROM dbplanilla.usuarios WHERE correo = ? LIMIT 1",
//       [Resultado.Correo]
//     );

//     if (!filas || filas.length === 0) return false;

//     const Usuario = filas[0];

//     // validar que el token sea el mismo guardado en la base de datos
//     if (Usuario.Token === token) return Resultado;

//     return false;
//   }
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
  // 1. Borrar detalleplanilla de las planillas del usuario
  await ejecutarConsulta(
    `DELETE dp
     FROM dbplanilla.detalleplanilla dp
     INNER JOIN dbplanilla.planillas p
       ON dp.idPlanilla = p.idPlanillas
     WHERE p.IdUsuario = ?`,
    [id]
  );

  // 2. Borrar pagos asociados a las planillas del usuario
  await ejecutarConsulta(
    `DELETE pa
     FROM dbplanilla.pagos pa
     INNER JOIN dbplanilla.planillas p
       ON pa.IdPlanilla = p.idPlanillas
     WHERE p.IdUsuario = ?`,
    [id]
  );

  // 3. Borrar pagos que usen deducciones creadas por ese usuario
  await ejecutarConsulta(
    `DELETE pa
     FROM dbplanilla.pagos pa
     INNER JOIN dbplanilla.deducciones d
       ON pa.idDeduccion = d.idDeducciones
     WHERE d.usuariosId = ?`,
    [id]
  );

  // 4. Borrar pagos donde el usuario procesa el pago
  await ejecutarConsulta(
    "DELETE FROM dbplanilla.pagos WHERE IdUsuarioProcesa = ?",
    [id]
  );

  // 5. Borrar deducciones del usuario
  await ejecutarConsulta(
    "DELETE FROM dbplanilla.deducciones WHERE usuariosId = ?",
    [id]
  );

  // 6. Borrar aguinaldos del usuario
  await ejecutarConsulta(
    "DELETE FROM dbplanilla.aguinaldos WHERE idUsuario = ?",
    [id]
  );

  // 7. Borrar contratos del usuario
  await ejecutarConsulta(
    "DELETE FROM dbplanilla.contratos WHERE usuarioId = ?",
    [id]
  );

  // 8. Borrar control de asistencia del usuario
  await ejecutarConsulta(
    "DELETE FROM dbplanilla.controlasistencia WHERE idUsuarios = ?",
    [id]
  );

  // 9. Borrar control de horarios del usuario
  await ejecutarConsulta(
    "DELETE FROM dbplanilla.controlhorarios WHERE idUsuarios = ?",
    [id]
  );

  // 10. Borrar historial de salarios del usuario
  await ejecutarConsulta(
    "DELETE FROM dbplanilla.historialsalarios WHERE idUsuarios = ?",
    [id]
  );

  // 11. Borrar licencias del usuario
  await ejecutarConsulta(
    "DELETE FROM dbplanilla.licencias WHERE idUsuario = ?",
    [id]
  );

  // 12. Borrar puestos del usuario
  await ejecutarConsulta(
    "DELETE FROM dbplanilla.puestos WHERE idUsuario = ?",
    [id]
  );

  // 13. Borrar vacaciones aprobadas por el usuario
  await ejecutarConsulta(
    "DELETE FROM dbplanilla.vacaciones WHERE UsuarioAprueba = ?",
    [id]
  );

  // 14. Borrar planillas del usuario
  await ejecutarConsulta(
    "DELETE FROM dbplanilla.planillas WHERE IdUsuario = ?",
    [id]
  );

  // 15. Finalmente borrar el usuario
  return await ejecutarConsulta(
    "DELETE FROM dbplanilla.usuarios WHERE idUsuario = ?",
    [id]
  );
}

  
}

module.exports = new UsuarioServicio();
