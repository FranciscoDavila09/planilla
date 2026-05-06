const express = require("express");
const Router = express.Router();

const AguinaldosServicio = require("../servicios/AguinaldosServicio.js");
const UsuarioServicio = require("../servicios/UsuarioServicio.js");

Router.get("/listarAguinaldos", async (solicitud, respuesta, next) => {
  // return respuesta.json(await AguinaldosServicio.listarAguinaldos());
  if (await UsuarioServicio.ValidarToken(solicitud.headers.authorization)) {
    try {
      return respuesta.json(await AguinaldosServicio.listarAguinaldos());
    } catch (error) {
      console.error(error);
      return respuesta.status(500).json(error);
    }
  }
  return respuesta.status(401).json();
});

Router.get("/listarAguinaldosVista", async (solicitud, respuesta, next) => {
  // return respuesta.json(await AguinaldosServicio.listarAguinaldos());
  if (await UsuarioServicio.ValidarToken(solicitud.headers.authorization)) {
    try {
      return respuesta.json(await AguinaldosServicio.listarAguinaldosVista());
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
      return respuesta.json(
        await AguinaldosServicio.obtenerPorId(solicitud.query.id),
      );
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
      return respuesta.json(await AguinaldosServicio.insertar(solicitud.body));
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
      return respuesta.json(
        await AguinaldosServicio.actualizar(solicitud.body),
      );
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
      return respuesta.json(
        await AguinaldosServicio.eliminar(solicitud.query.id),
      );
    } catch (error) {
      console.error(error);
      return respuesta.status(500).json(error);
    }
  }
  return respuesta.status(401).json();
});
module.exports = Router;
