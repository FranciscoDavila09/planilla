const express = require('express');
const Router = express.Router();

const DeduccionesServicio = require('../servicios/DeduccionesServicio.js');

Router.get('/listarDeducciones', async (solicitud, respuesta, next) => {
  return respuesta.json(await DeduccionesServicio.listarDeducciones());
});

Router.get('/obtenerPorId', async (solicitud, respuesta, next) => {
return respuesta.json(await DeduccionesServicio.obtenerPorId(solicitud.query.id));
});

Router.post('/insertar', async (solicitud, respuesta, next) => {
return respuesta.json(await DeduccionesServicio.insertar(solicitud.body));
});

Router.put('/actualizar', async (solicitud, respuesta, next) => {       
return respuesta.json(await DeduccionesServicio.actualizar(solicitud.body));
});

Router.delete('/eliminar', async (solicitud, respuesta, next) => {
return respuesta.json(await DeduccionesServicio.eliminar(solicitud.query.id));
});

module.exports = Router;