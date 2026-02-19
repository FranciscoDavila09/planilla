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

// Función para registrar auditoría automáticamente en cada consulta
async function registrarAuditoria(sql, parametros, conexion) {
  try {
    // Normalizar: quitar saltos de línea extras y múltiples espacios
    const sqlNorm = sql.replace(/\s+/g, " ").trim();
    const sqlUpper = sqlNorm.toUpperCase();

    let accion = null;
    let tabla = null;
    let registroId = null;

    // Detectar tipo de operación y tabla
    if (sqlUpper.startsWith("INSERT")) {
      accion = "INSERT";
      // Busca: INSERT INTO [dbplanilla.]tabla
      const match = sqlUpper.match(/INSERT\s+INTO\s+[\w`\.]+\.`?(\w+)`?/i);
      if (match) tabla = match[1];

      // Si no encontró, intenta otro patrón
      if (!tabla) {
        const match2 = sqlUpper.match(/INSERT\s+INTO\s+(\w+)/i);
        if (match2) tabla = match2[1];
      }

      // Obtener el último ID insertado
      if (tabla) {
        const [result] = await conexion.query("SELECT LAST_INSERT_ID() as id");
        registroId = result[0]?.id?.toString() || null;
      }
    } else if (sqlUpper.startsWith("UPDATE")) {
      accion = "UPDATE";
      // Busca: UPDATE [dbplanilla.]tabla
      const match = sqlUpper.match(/UPDATE\s+[\w`\.]+\.`?(\w+)`?/i);
      if (match) tabla = match[1];

      if (!tabla) {
        const match2 = sqlUpper.match(/UPDATE\s+(\w+)/i);
        if (match2) tabla = match2[1];
      }

      // Extraer ID del WHERE (último parámetro)
      if (tabla && parametros && parametros.length > 0) {
        registroId = parametros[parametros.length - 1]?.toString();
      }
    } else if (sqlUpper.startsWith("DELETE")) {
      accion = "DELETE";
      // Busca: DELETE FROM [dbplanilla.]tabla
      const match = sqlUpper.match(/DELETE\s+FROM\s+[\w`\.]+\.`?(\w+)`?/i);
      if (match) tabla = match[1];

      if (!tabla) {
        const match2 = sqlUpper.match(/DELETE\s+FROM\s+(\w+)/i);
        if (match2) tabla = match2[1];
      }

      // Extraer ID del WHERE (primer parámetro)
      if (tabla && parametros && parametros.length > 0) {
        registroId = parametros[0]?.toString();
      }
    }

    // Ignorar si no es DML o si es la tabla de auditoría
    if (!accion || !tabla || tabla === "auditoria") return;

    // Insertar en auditoría (registro automático)
    const sqlAuditoria = `
      INSERT INTO dbplanilla.auditoria 
      (tabla_afectada, accion, usuario, registro_id, datos_nuevos) 
      VALUES (?, ?, ?, ?, ?)
    `;

    await conexion.query(sqlAuditoria, [
      tabla,
      accion,
      "sistema",
      registroId,
      parametros ? JSON.stringify(parametros) : null,
    ]);
  } catch (error) {
    console.error("Auditoría error:", error.message);
  }
}

async function ejecutarConsulta(consulta, parametrosDeLaConsulta) {
  const conexion = await crearObjetoConexion();
  let resultados = undefined;
  try {
    resultados = await conexion.query(consulta, parametrosDeLaConsulta);

    // Registrar automáticamente en auditoría (con await para evitar race conditions)
    await registrarAuditoria(consulta, parametrosDeLaConsulta, conexion);

    return resultados[0];
  } catch (error) {
    console.error(error.message);
  } finally {
    await conexion.end();
  }
}

module.exports = { ejecutarConsulta, crearObjetoConexion };
