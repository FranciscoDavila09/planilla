const { ejecutarConsulta } = require('../db.js');
class LicenciaServicio {

  constructor() { }

  async listarLicencia() {
    return await ejecutarConsulta("SELECT * FROM `dbplanilla`.`licencias`");
  }

    async obtenerPorId(id) {    
    return await ejecutarConsulta("SELECT * FROM `dbplanilla`.`licencias` WHERE `IdLicencia` = ?", 
        [id]);
    }

    async insertar(datos) {
    const sql = `
    INSERT INTO dbplanilla.licencias
(IdEmpleado, Tipo, FechaInicio, FechaFin, DocumentoSoporte, Estado, idUsuario) VALUES 
(?, ?, ?, ?, ?, ?, ?)
    `;

    const parametros = [
    datos.IdEmpleado,
    datos.Tipo,
    datos.FechaInicio,
    datos.FechaFin,
    datos.DocumentoSoporte,
    datos.Estado,
    datos.idUsuario
    ];
    return await ejecutarConsulta(sql, parametros);
}

async actualizar(datos) {
    const sql = `
    UPDATE dbplanilla.licencias SET 
    IdEmpleado = ?, Tipo = ?, FechaInicio = ?, FechaFin = ?, DocumentoSoporte = ?, Estado = ?, idUsuario = ? WHERE IdLicencia = ?   
    `;

    const parametros = [
    datos.IdEmpleado,
    datos.Tipo,
    datos.FechaInicio,
    datos.FechaFin,
    datos.DocumentoSoporte,
    datos.Estado,
    datos.idUsuario,
    datos.IdLicencia
    ];
    return await ejecutarConsulta(sql, parametros);
}

async eliminar(id) {
    return await ejecutarConsulta("DELETE FROM dbplanilla.licencias WHERE IdLicencia = ?",
         [id]);
    }
}

module.exports =  new LicenciaServicio();