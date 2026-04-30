const { ejecutarConsulta } = require("../db.js");

class ControlAsistenciaServicio {
  constructor() {}

async listarControlAsistencia() {
  return await ejecutarConsulta(`
    SELECT *
    FROM dbplanilla.controlasistencia
    ORDER BY idControlAsistencia DESC
  `);
}

  async obtenerPorId(id) {
    return await ejecutarConsulta(
      "SELECT * FROM `dbplanilla`.`controlasistencia` WHERE `idControlAsistencia` = ?",
      [id],
    );
  }

async insertar(datos) {
  const sql = `
    INSERT INTO dbplanilla.controlasistencia
    (\`HoraEntrada\`, \`HoraSalida\`, \`idEmpleados\`, \`idUsuarios\`, \`Fecha\`)
    VALUES (?, ?, ?, ?, ?)
  `;

  const parametros = [
    datos.HoraEntrada,
    datos.HoraSalida,
    datos.idEmpleados,
    datos.idUsuarios,
    datos.Fecha,
  ];

  console.log("PARAMETROS INSERT:", parametros);

  return await ejecutarConsulta(sql, parametros);
}

  async actualizar(datos) {
    const sql = `
  UPDATE dbplanilla.controlasistencia
      SET HoraEntrada = ?, HoraSalida = ?, idEmpleados = ?, idUsuarios = ?,Fecha=?
      WHERE idControlAsistencia = ?
`;
    const parametros = [
      datos.HoraEntrada,
      datos.HoraSalida,
      datos.idEmpleados,
      datos.idUsuarios,
      datos.Fecha, // ✅ ahora sí en su lugar
      datos.idControlAsistencia, // ✅ para el WHERE
    ];
    return await ejecutarConsulta(sql, parametros);
  }

  async eliminar(id) {
    return await ejecutarConsulta(
      "DELETE FROM dbplanilla.controlasistencia WHERE idControlAsistencia = ?",
      [id],
    );
  }
}

module.exports = new ControlAsistenciaServicio();
