const express = require('express');
const Router = express.Router();

const TipoIngresoServicio = require('../servicios/TipoIngresoServicio.js');
const UsuarioServicio = require("../servicios/UsuarioServicio.js");

Router.get('/listarTipoIngreso', async (solicitud, respuesta, next) => {
  // return respuesta.json(await TipoIngresoServicio.listarTipoIngreso());
      if (await UsuarioServicio.ValidarToken(solicitud.headers.authorization)) {
      try {   
    return respuesta.json(await TipoIngresoServicio.listarTipoIngreso());
      } catch (error) {
        console.error(error);
        return respuesta.status(500).json(error);
      }
    }
    return respuesta.status(401).json();
});

Router.get('/obtenerPorId', async (solicitud, respuesta, next) => {
// return respuesta.json(await TipoIngresoServicio.obtenerPorId(solicitud.query.id));
  if (await UsuarioServicio.ValidarToken(solicitud.headers.authorization)) {
      try {   
   return respuesta.json(await TipoIngresoServicio.obtenerPorId(solicitud.query.id));
      } catch (error) {
        console.error(error);
        return respuesta.status(500).json(error);
      }
    }
    return respuesta.status(401).json();
});

Router.post('/insertar', async (solicitud, respuesta, next) => {
  if (await UsuarioServicio.ValidarToken(solicitud.headers.authorization)) {
    try {
      return respuesta.json(await TipoIngresoServicio.insertar(solicitud.body));
    } catch (error) {
      console.error(error);
      return respuesta.status(500).json(error);
    }
  }
  return respuesta.status(401).json();
});

Router.put('/actualizar', async (solicitud, respuesta, next) => {
  if (await UsuarioServicio.ValidarToken(solicitud.headers.authorization)) {
    try {
      return respuesta.json(await TipoIngresoServicio.actualizar(solicitud.body));
    } catch (error) {
      console.error(error);
      return respuesta.status(500).json(error);
    }
  }
  return respuesta.status(401).json();
});

Router.delete('/eliminar', async (solicitud, respuesta, next) => {
  if (await UsuarioServicio.ValidarToken(solicitud.headers.authorization)) {
    try {
      return respuesta.json(await TipoIngresoServicio.eliminar(solicitud.query.id));
    } catch (error) {
      console.error(error);
      return respuesta.status(500).json(error);
    }
  }
  return respuesta.status(401).json();
});

module.exports = Router;