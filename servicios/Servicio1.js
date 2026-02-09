const { ejecutarConsulta } = require('../db.js');

class Servicio1 {

  constructor() { };


  async listar(Datos) {
    return await ejecutarConsulta("SELECT * FROM `mysql`.`user` WHERE `User` = ?"
      , [Datos.Usuario]);
  }


async listar2() {
  return await ejecutarConsulta("SELECT * FROM `dbplanilla`.`empleados`");
}


}

module.exports = new Servicio1();