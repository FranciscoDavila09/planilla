const express = require("express");

const Router = express.Router();

const RolesServicio = require("../servicios/RolesServicio.js");

Router.get("/listarRoles", async (solicitud, respuesta, next) => {
  return respuesta.json(await RolesServicio.listarRoles());
});

Router.get("/obtenerPorId", async (solicitud, respuesta, next) => {
  return respuesta.json(await RolesServicio.obtenerPorId(solicitud.query.id));
});

Router.post("/insertar", async (solicitud, respuesta, next) => {
  return respuesta.json(await RolesServicio.insertar(solicitud.body));
});

Router.put("/actualizar", async (solicitud, respuesta, next) => {
  return respuesta.json(await RolesServicio.actualizar(solicitud.body));
});

Router.delete("/eliminar", async (solicitud, respuesta, next) => {
  return respuesta.json(await RolesServicio.eliminar(solicitud.query.id));
});

module.exports = Router;