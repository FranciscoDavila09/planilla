const express = require("express");

const Router = express.Router();
//Para asignar las rutas de usuario
const UsuarioServicio = require("../servicios/UsuarioServicio.js");

Router.get("/listarUsuarios", async (solicitud, respuesta, next) => {
  return respuesta.json(await UsuarioServicio.listarUsuarios());
});

Router.get("/obtenerPorId", async (solicitud, respuesta, next) => {
  return respuesta.json(await UsuarioServicio.obtenerPorId(solicitud.query.id));
});

Router.post("/insertar", async (solicitud, respuesta, next) => {
  return respuesta.json(await UsuarioServicio.insertar(solicitud.body));
});

Router.put("/actualizar", async (solicitud, respuesta, next) => {
  return respuesta.json(await UsuarioServicio.actualizar(solicitud.body));
});

Router.delete("/eliminar", async (solicitud, respuesta, next) => {
  return respuesta.json(await UsuarioServicio.eliminar(solicitud.query.id));
});

/// para ka parte del token y autenticacion
Router.post("/autenticar", async (solicitud, respuesta) => {
  respuesta.json(await UsuarioServicio.Autenticacion(solicitud.body.CorreoElectronico, solicitud.body.Clave));
});

Router.post("/validarToken", async (solicitud, respuesta) => {
  respuesta.json(await UsuarioServicio.ValidarToken(solicitud));
});

Router.post("/desautenticar", async (solicitud, respuesta) => {
  respuesta.json(await UsuarioServicio.DesAutenticacion(solicitud.body.CorreoElectronico));
});




module.exports = Router;
