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

//Para asignar las rutas de aguinaldos
const rutasDelAguinaldos = require("./AguinaldosServicio.js");
//para asignar las rutas de contrato
const rutasDelContrato = require("./ContratoServicio.js");
//Para asignar las rutas de detalleplanilla
const rutasDelDetalleplanilla = require("./DetalleplanillaServicio.js");

//para asignar las rutas de controlAsistencia

const rutasDelControlAsistencia = require("./ControlAsistenciaServicio.js");

//para asignar las rutas de control horarios

const rutasDelControlHorarios = require("./ControlHorarioServicio.js");

// para asignar las rutas de deducciones

const rutasDelDeducciones = require("./DeduccionesServicio.js");

//para asignar las rutas de historial salarios

const rutasDelHistorialSalarios = require("./HistorialSalarioServicio.js");

//para asignar las rutas de licencias

const rutasDelLicencias = require("./LicenciaServicio.js");

//para asignar las rutas de periodo planilla

const rutasDelPeriodoPlanilla = require("./PeriodoPlanillaServicio.js");

//para asignar las rutas de prestamo

const rutasDelPrestamo = require("./PrestamoServicio.js");

//para asignar las rutas de puestos

const rutasDelPuestos = require("./PuestosServicio.js");

// para asignar las rutas de roles
const rutasDelRoles = require("./RolesServicio.js");

//para asignar las rutas de tipo ingresos

const rutasDelTipoIngresos = require("./TipoIngresoServicio.js");

// para asignar las rutas de vacaciones
const rutasDelVacaciones = require("./VacacionesServicio.js");

//para asignar las rutas de auditoria
const rutasDelAuditoria = require("./AuditoriaServicio.js");

function asignarRutasAExpress(app) {
  app.use("/Servicio1", rutasDelServicio1);
  app.use("/EmpleadoServicio", rutasDelEmpleado);
  app.use("/UsuarioServicio", rutasDelUsuario);
  app.use("/DepartamentoServicio", rutasDelDepartamento);
  app.use("/PlanillaServicio", rutasDelPlanilla);
  app.use("/PagoServicio", rutasDelPago);
  app.use("/FeriadoServicio", rutasDelFeriado);
  app.use("/AguinaldosServicio", rutasDelAguinaldos);
  app.use("/ContratoServicio", rutasDelContrato);
  app.use("/DetalleplanillaServicio", rutasDelDetalleplanilla);
  app.use("/ControlAsistenciaServicio", rutasDelControlAsistencia);
  app.use("/ControlHorarioServicio", rutasDelControlHorarios);
  app.use("/DeduccionesServicio", rutasDelDeducciones);
  app.use("/HistorialSalarioServicio", rutasDelHistorialSalarios);
  app.use("/LicenciaServicio", rutasDelLicencias);
  app.use("/PeriodoPlanillaServicio", rutasDelPeriodoPlanilla);
  app.use("/PrestamoServicio", rutasDelPrestamo);
  app.use("/PuestosServicio", rutasDelPuestos);
  app.use("/RolesServicio", rutasDelRoles);
  app.use("/TipoIngresoServicio", rutasDelTipoIngresos);
  app.use("/VacacionesServicio", rutasDelVacaciones);
  app.use("/AuditoriaServicio", rutasDelAuditoria);
}

module.exports = asignarRutasAExpress;
