const express = require('express');
const Router = express.Router();

const TipoIngresoServicio = require('../servicios/TipoIngresoServicio.js');

Router.get('/listarTipoIngreso', async (solicitud, respuesta, next) => {
  return respuesta.json(await TipoIngresoServicio.listarTipoIngreso());
});

Router.get('/obtenerPorId', async (solicitud, respuesta, next) => {
return respuesta.json(await TipoIngresoServicio.obtenerPorId(solicitud.query.id));
});

Router.post('/insertar', async (solicitud, respuesta, next) => {
return respuesta.json(await TipoIngresoServicio.insertar(solicitud.body));
});

Router.put('/actualizar', async (solicitud, respuesta, next) => {
return respuesta.json(await TipoIngresoServicio.actualizar(solicitud.body));
});

Router.delete('/eliminar', async (solicitud, respuesta, next) => {
return respuesta.json(await TipoIngresoServicio.eliminar(solicitud.query.id));
});

module.exports = Router;