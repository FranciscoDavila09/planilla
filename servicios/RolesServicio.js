const { ejecutarConsulta } = require("../db.js");

class RolesServicio {
  constructor() {}

    async listarRoles() {
        const consulta = "SELECT * FROM roles";
        return await ejecutarConsulta(consulta);
    }

    async obtenerPorId(id) {
        const consulta = "SELECT * FROM roles WHERE IdRol = ?";
        return await ejecutarConsulta(consulta, [id]);
    }

    async insertar(datos) {
        const consulta = "INSERT INTO roles (Nombre, Descripcion, Estado) VALUES (?, ?, ?)";
        const parametros = 
        [datos.Nombre, 
        datos.Descripcion, 
        datos.Estado];
        return await ejecutarConsulta(consulta, parametros);
    }

    async actualizar(datos) {
        const consulta = "UPDATE roles SET Nombre = ?, Descripcion = ?, Estado = ? WHERE IdRol = ?";
        const parametros = 
        [datos.Nombre, 
        datos.Descripcion, 
        datos.Estado,
        datos.IdRol];
        return await ejecutarConsulta(consulta, parametros);
    }

    async eliminar(id) {
        const consulta = "DELETE FROM roles WHERE IdRol = ?";
        return await ejecutarConsulta(consulta, [id]);
    }
}

module.exports = new RolesServicio();