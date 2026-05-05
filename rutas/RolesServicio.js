const express = require("express");

const Router = express.Router();

const RolesServicio = require("../servicios/RolesServicio.js");
const UsuarioServicio = require("../servicios/UsuarioServicio.js");

Router.get("/listarRoles", async (solicitud, respuesta, next) => {
  if (await UsuarioServicio.ValidarToken(solicitud.headers.authorization)) {
    try {
      return respuesta.json(await RolesServicio.listarRoles());
    } catch (error) {
      console.error(error);
      return respuesta.status(500).json(error);
    }
  }
  return respuesta.status(401).json();
});

Router.get("/obtenerPorId", async (solicitud, respuesta, next) => {
  if (await UsuarioServicio.ValidarToken(solicitud.headers.authorization)) {
    try {
      return respuesta.json(await RolesServicio.obtenerPorId(solicitud.query.id));
    } catch (error) {
      console.error(error);
      return respuesta.status(500).json(error);
    }
  }
  return respuesta.status(401).json();
});

Router.post("/insertar", async (solicitud, respuesta, next) => {
  if (await UsuarioServicio.ValidarToken(solicitud.headers.authorization)) {
    try {
      return respuesta.json(await RolesServicio.insertar(solicitud.body));
    } catch (error) {
      console.error(error);
      return respuesta.status(500).json(error);
    }
  }
  return respuesta.status(401).json();
});

Router.put("/actualizar", async (solicitud, respuesta, next) => {
  if (await UsuarioServicio.ValidarToken(solicitud.headers.authorization)) {
    try {
      return respuesta.json(await RolesServicio.actualizar(solicitud.body));
    } catch (error) {
      console.error(error);
      return respuesta.status(500).json(error);
    }
  }
  return respuesta.status(401).json();
});

Router.delete("/eliminar", async (solicitud, respuesta, next) => {
  if (await UsuarioServicio.ValidarToken(solicitud.headers.authorization)) {
    try {
      return respuesta.json(await RolesServicio.eliminar(solicitud.query.id));
    } catch (error) {
      console.error(error);
      return respuesta.status(500).json(error);
    }
  }
  return respuesta.status(401).json();
});

module.exports = Router;