const express = require("express");

const Router = express.Router();

const PuestosServicio = require("../servicios/PuestosServicio.js");
const { route } = require("./Servicio1.js");

Router.get("/listarPuestos", async (solicitud, respuesta, next) => {
  return respuesta.json(await PuestosServicio.listarPuestos());
});

Router.get("/obtenerPorId", async (solicitud, respuesta, next) => {
  return respuesta.json(await PuestosServicio.obtenerPorId(solicitud.query.id));
});

Router.post("/insertar", async (solicitud, respuesta, next) => {
  return respuesta.json(await PuestosServicio.insertar(solicitud.body));
});

Router.put("/actualizar", async (solicitud, respuesta, next) => {
  return respuesta.json(await PuestosServicio.actualizar(solicitud.body));
});

Router.delete("/eliminar", async (solicitud, respuesta, next) => {
  return respuesta.json(await PuestosServicio.eliminar(solicitud.query.id));
});

module.exports = Router;
