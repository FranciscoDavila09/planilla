const {ejecutarConsulta} = require('../db.js');

class EmpleadoServicio {

  constructor() { };
//Get para listar los empleados
  async listarEmpleados() {
    return await ejecutarConsulta("SELECT * FROM `dbplanilla`.`empleados`");
  }


  //Get para obtener empleados por el id 

    async obtenerPorId(id) {
        return await ejecutarConsulta("SELECT * FROM `dbplanilla`.`empleados` WHERE `idEmpleado` = ?",
             [id]);

    }

    //Insertar datos 

async insertar(datos) {
    const sql = `
    INSERT INTO dbplanilla.empleados
(CodigoEmpleado, Nombre, Apellidos, Identificacion, Correo, Telefono, FechaIngreso, Estado,
HoraEntrada, CuentaBancaria, Salario, idDepartamento, HoraSalida ) VALUES 
(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

const parametros = [
datos.CodigoEmpleado,
datos.Nombre,
datos.Apellidos,
datos.Identificacion,
datos.Correo,
datos.Telefono,
datos.FechaIngreso,
datos.Estado,
datos.HoraEntrada,
datos.CuentaBancaria,
datos.Salario,
datos.idDepartamento,
datos.HoraSalida
];

return await ejecutarConsulta(sql, parametros);

}


//Actualizar datos

async actualizar(datos) {

const sql = `
  UPDATE dbplanilla.empleados
      SET CodigoEmpleado = ?, Nombre = ?, Apellidos = ?, Identificacion = ?, Correo = ?, Telefono = ?,
          FechaIngreso = ?, Estado = ?, HoraEntrada = ?, CuentaBancaria = ?, Salario = ?, idDepartamento = ?, HoraSalida = ?
      WHERE IdEmpleado = ?

`;

const parametros = [

datos.CodigoEmpleado,
datos.Nombre,
datos.Apellidos,
datos.Identificacion,
datos.Correo,
datos.Telefono,
datos.FechaIngreso,
datos.Estado,
datos.HoraEntrada,
datos.CuentaBancaria,
datos.Salario,
datos.idDepartamento,
datos.HoraSalida,
datos.IdEmpleado
];

return await ejecutarConsulta(sql, parametros);

}


//eliminar datos por id

async eliminar(id) {

return await ejecutarConsulta("DELETE FROM dbplanilla.empleados WHERE idEmpleado = ?", [id]);


}




}

module.exports = new EmpleadoServicio();