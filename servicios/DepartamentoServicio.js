const {ejecutarConsulta} = require('../db.js');

class DepartamentoServicio {

  constructor() { };
//Get para listar los departamentos
  async listarDepartamentos() {
    return await ejecutarConsulta("SELECT * FROM `dbplanilla`.`departamentos`");
  }


  //Get para obtener departamentos por el id 

    async obtenerPorId(id) {
        return await ejecutarConsulta("SELECT * FROM `dbplanilla`.`departamentos` WHERE `idDepartamento` = ?",
             [id]);

    }

    //Insertar datos 

async insertar(datos) {
    const sql = `
    INSERT INTO dbplanilla.departamentos
(Nombre, Descripcion, Estado) VALUES 
(?, ?, ?)
    `;

const parametros = [
datos.Nombre,
datos.Descripcion,
datos.Estado
];

return await ejecutarConsulta(sql, parametros);

}


//Actualizar datos

async actualizar(datos) {

const sql = `
  UPDATE dbplanilla.departamentos
      SET Nombre = ?, Descripcion = ?, Estado = ?
      WHERE idDepartamento = ?

`;

const parametros = [

datos.Nombre,
datos.Descripcion,
datos.Estado,
datos.idDepartamento
];

return await ejecutarConsulta(sql, parametros);

}


//eliminar datos por id

async eliminar(id) {

return await ejecutarConsulta("DELETE FROM dbplanilla.departamentos WHERE idDepartamento = ?", [id]);


}




}

module.exports = new DepartamentoServicio();
