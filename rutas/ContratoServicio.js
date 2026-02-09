const express = require('express');
const Router = express.Router();

const ContratoServicio = require('../servicios/ContratoServicio.js');

Router.get('/listarContratos', async (solicitud, respuesta, next) => {
  return respuesta.json(await ContratoServicio.listarContratos());
});

Router.get('/obtenerPorId', async (solicitud, respuesta, next) => {
return respuesta.json(await ContratoServicio.obtenerPorId(solicitud.query.id));
});

Router.post('/insertar', async (solicitud, respuesta, next) => {
return respuesta.json(await ContratoServicio.insertar(solicitud.body));
});

Router.put('/actualizar', async (solicitud, respuesta, next) => {
return respuesta.json(await ContratoServicio.actualizar(solicitud.body));
});

Router.delete('/eliminar', async (solicitud, respuesta, next) => {
return respuesta.json(await ContratoServicio.eliminar(solicitud.query.id));
});
module.exports = Router;