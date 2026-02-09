//Asignacion de rutas a express
const rutasDelServicio1 = require("./Servicio1.js");

//Para las rutas del Empleado
const rutasDelEmpleado = require("./EmpleadoServicio.js");
//Para asignar las rutas de usuario
const rutasDelUsuario = require("./UsuarioServicio.js");
//Para asignar las rutas de departamento
const rutasDelDepartamento = require("./DepartamentoServicio.js");
//Para asignar las rutas de planilla
const rutasDelPlanilla = require("./PlanillaServicio.js");
//Para asignar las rutas de pago
const rutasDelPago = require("./PagoServicio.js");
//Para asignar las rutas de feriado
const rutasDelFeriado = require("./FeriadoServicio.js");
function asignarRutasAExpress(app) {
  app.use("/Servicio1", rutasDelServicio1);
  app.use("/EmpleadoServicio", rutasDelEmpleado);
  app.use("/UsuarioServicio", rutasDelUsuario);
  app.use("/DepartamentoServicio", rutasDelDepartamento);
  app.use("/PlanillaServicio", rutasDelPlanilla);
  app.use("/PagoServicio", rutasDelPago);
  app.use("/FeriadoServicio", rutasDelFeriado);
}

module.exports = asignarRutasAExpress;
