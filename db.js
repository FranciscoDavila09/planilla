// const mysql = require("mysql2/promise");

// async function crearObjetoConexion() {
//   return await mysql.createConnection({
//     host: process.env.DB_HOST || "127.0.0.1",
//     user: process.env.DB_USER || "root",
//     password: process.env.MYSQLPASS || "123456",
//     database: process.env.DB_NAME || "dbplanilla",
//     port: process.env.MYSQLPORT || 3306,
//     multipleStatements: true,
//     charset: "utf8mb4",
//   });
// }

// // Detectar acción y tabla
// function detectarOperacion(sql) {
//   const sqlNorm = sql.replace(/\s+/g, " ").trim();
//   const sqlUpper = sqlNorm.toUpperCase();

//   let accion = null;
//   let tabla = null;

//   if (sqlUpper.startsWith("INSERT")) {
//     accion = "INSERT";
//     const match = sqlNorm.match(/INSERT\s+INTO\s+`?(\w+)`?/i);
//     if (match) tabla = match[1];
//   }

//   if (sqlUpper.startsWith("UPDATE")) {
//     accion = "UPDATE";
//     const match = sqlNorm.match(/UPDATE\s+`?(\w+)`?/i);
//     if (match) tabla = match[1];
//   }

//   if (sqlUpper.startsWith("DELETE")) {
//     accion = "DELETE";
//     const match = sqlNorm.match(/DELETE\s+FROM\s+`?(\w+)`?/i);
//     if (match) tabla = match[1];
//   }

//   return { accion, tabla };
// }

// // Registrar auditoría
// async function registrarAuditoria(
//   conexion,
//   tabla,
//   accion,
//   registroId,
//   datosAnteriores,
//   datosNuevos,
// ) {
//   try {
//     if (!tabla || tabla === "auditoria") return;

//     const sqlAuditoria = `
//       INSERT INTO auditoria 
//       (tabla_afectada, accion, usuario, registro_id, datos_anteriores, datos_nuevos) 
//       VALUES (?, ?, ?, ?, ?, ?)
//     `;

//     await conexion.query(sqlAuditoria, [
//       tabla,
//       accion,
//       "sistema",
//       registroId,
//       datosAnteriores ? JSON.stringify(datosAnteriores) : null,
//       datosNuevos ? JSON.stringify(datosNuevos) : null,
//     ]);
//   } catch (error) {
//     console.error("Error auditoría:", error.message);
//   }
// }

// // Ejecutar consulta principal
// async function ejecutarConsulta(sql, parametros = []) {
//   const conexion = await crearObjetoConexion();

//   try {
//     const { accion, tabla } = detectarOperacion(sql);

//     let datosAnteriores = null;
//     let registroId = null;

//     // Para UPDATE
//     if (accion === "UPDATE" && parametros.length > 0) {
//       registroId = parametros[parametros.length - 1];

//       const [rows] = await conexion.query(
//         `SELECT * FROM ${tabla} WHERE id = ?`,
//         [registroId],
//       );

//       if (rows.length > 0) {
//         datosAnteriores = rows[0];
//       }
//     }

//     // Para DELETE
//     if (accion === "DELETE" && parametros.length > 0) {
//       registroId = parametros[0];

//       const [rows] = await conexion.query(
//         `SELECT * FROM ${tabla} WHERE id = ?`,
//         [registroId],
//       );

//       if (rows.length > 0) {
//         datosAnteriores = rows[0];
//       }
//     }

//     // Ejecutar consulta principal
//     const [result] = await conexion.query(sql, parametros);

//     // Para INSERT obtener ID
//     if (accion === "INSERT") {
//       registroId = result.insertId;
//     }

//     // Obtener datos nuevos para UPDATE
//     let datosNuevos = null;

//     if ((accion === "INSERT" || accion === "UPDATE") && registroId) {
//       const [rows] = await conexion.query(
//         `SELECT * FROM ${tabla} WHERE id = ?`,
//         [registroId],
//       );

//       if (rows.length > 0) {
//         datosNuevos = rows[0];
//       }
//     }

//     // Registrar auditoría
//     await registrarAuditoria(
//       conexion,
//       tabla,
//       accion,
//       registroId,
//       datosAnteriores,
//       datosNuevos,
//     );

//     return result;
//   } catch (error) {
//     console.error("Error consulta:", error.message);
//     throw error;
//   } finally {
//     await conexion.end();
//   }
// }

// module.exports = { ejecutarConsulta, crearObjetoConexion };



const mysql = require("mysql2/promise");

async function crearObjetoConexion() {
  return await mysql.createConnection({
    host: process.env.DB_HOST || "127.0.0.1",
    user: process.env.DB_USER || "root",
    password: process.env.MYSQLPASS || "123456",
    database: process.env.DB_NAME || "dbplanilla",
    port: process.env.MYSQLPORT || 3306,
    multipleStatements: true,
    charset: "utf8mb4",
  });
}

// Detectar acción y tabla
function detectarOperacion(sql) {
  const sqlNorm = sql.replace(/\s+/g, " ").trim();
  const sqlUpper = sqlNorm.toUpperCase();

  let accion = null;
  let tabla = null;

  if (sqlUpper.startsWith("INSERT")) {
    accion = "INSERT";
    const match = sqlNorm.match(/INSERT\s+INTO\s+(?:`?\w+`?\.)?`?(\w+)`?/i);
    if (match) tabla = match[1];
  }

  if (sqlUpper.startsWith("UPDATE")) {
    accion = "UPDATE";
    const match = sqlNorm.match(/UPDATE\s+(?:`?\w+`?\.)?`?(\w+)`?/i);
    if (match) tabla = match[1];
  }

  if (sqlUpper.startsWith("DELETE")) {
    accion = "DELETE";
    const match = sqlNorm.match(/DELETE\s+FROM\s+(?:`?\w+`?\.)?`?(\w+)`?/i);
    if (match) tabla = match[1];
  }

  return { accion, tabla };
}

// Obtener automáticamente la llave primaria de la tabla
async function obtenerLlavePrimaria(conexion, tabla) {
  try {
    const sql = `
      SELECT COLUMN_NAME
      FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE
      WHERE TABLE_SCHEMA = DATABASE()
        AND TABLE_NAME = ?
        AND CONSTRAINT_NAME = 'PRIMARY'
      LIMIT 1
    `;

    const [rows] = await conexion.query(sql, [tabla]);

    if (rows.length > 0) {
      return rows[0].COLUMN_NAME;
    }

    return null;
  } catch (error) {
    console.error("Error obteniendo llave primaria:", error.message);
    return null;
  }
}

// Registrar auditoría
async function registrarAuditoria(
  conexion,
  tabla,
  accion,
  registroId,
  datosAnteriores,
  datosNuevos,
) {
  try {
    if (!tabla || tabla === "auditoria") return;

    const sqlAuditoria = `
      INSERT INTO auditoria 
      (tabla_afectada, accion, usuario, registro_id, datos_anteriores, datos_nuevos) 
      VALUES (?, ?, ?, ?, ?, ?)
    `;

    await conexion.query(sqlAuditoria, [
      tabla,
      accion,
      "sistema",
      registroId,
      datosAnteriores ? JSON.stringify(datosAnteriores) : null,
      datosNuevos ? JSON.stringify(datosNuevos) : null,
    ]);
  } catch (error) {
    console.error("Error auditoría:", error.message);
  }
}

// Ejecutar consulta principal
async function ejecutarConsulta(sql, parametros = []) {
  const conexion = await crearObjetoConexion();

  try {
    const { accion, tabla } = detectarOperacion(sql);

    let datosAnteriores = null;
    let registroId = null;
    let datosNuevos = null;

    const llavePrimaria = tabla
      ? await obtenerLlavePrimaria(conexion, tabla)
      : null;

    // Para UPDATE
    if (accion === "UPDATE" && parametros.length > 0 && tabla && llavePrimaria) {
      registroId = parametros[parametros.length - 1];

      const [rows] = await conexion.query(
        `SELECT * FROM \`${tabla}\` WHERE \`${llavePrimaria}\` = ?`,
        [registroId],
      );

      if (rows.length > 0) {
        datosAnteriores = rows[0];
      }
    }

    // Para DELETE
    if (accion === "DELETE" && parametros.length > 0 && tabla && llavePrimaria) {
      registroId = parametros[0];

      const [rows] = await conexion.query(
        `SELECT * FROM \`${tabla}\` WHERE \`${llavePrimaria}\` = ?`,
        [registroId],
      );

      if (rows.length > 0) {
        datosAnteriores = rows[0];
      }
    }

    // Ejecutar consulta principal
    const [result] = await conexion.query(sql, parametros);

    // Para INSERT obtener ID
    if (accion === "INSERT") {
      registroId = result.insertId;
    }

    // Obtener datos nuevos para INSERT y UPDATE
    if ((accion === "INSERT" || accion === "UPDATE") && registroId && tabla && llavePrimaria) {
      const [rows] = await conexion.query(
        `SELECT * FROM \`${tabla}\` WHERE \`${llavePrimaria}\` = ?`,
        [registroId],
      );

      if (rows.length > 0) {
        datosNuevos = rows[0];
      }
    }

    // Registrar auditoría
    await registrarAuditoria(
      conexion,
      tabla,
      accion,
      registroId,
      datosAnteriores,
      datosNuevos,
    );

    return result;
  } catch (error) {
    console.error("Error consulta:", error.message);
    throw error;
  } finally {
    await conexion.end();
  }
}

module.exports = { ejecutarConsulta, crearObjetoConexion };