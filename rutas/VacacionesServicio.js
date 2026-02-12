const express = require('express');
const Router = express.Router();

const VacacionesServicio = require('../servicios/VacacionesServicio.js');

Router.get('/listarVacaciones', async (solicitud, respuesta, next) => {
  return respuesta.json(await VacacionesServicio.listarVacaciones());
});

Router.get('/obtenerPorId', async (solicitud, respuesta, next) => {
return respuesta.json(await VacacionesServicio.obtenerPorId(solicitud.query.id));
});

Router.post('/insertar', async (solicitud, respuesta, next) => {
return respuesta.json(await VacacionesServicio.insertar(solicitud.body));
});

Router.put('/actualizar', async (solicitud, respuesta, next) => {
return respuesta.json(await VacacionesServicio.actualizar(solicitud.body));
});

Router.delete('/eliminar', async (solicitud, respuesta, next) => {
return respuesta.json(await VacacionesServicio.eliminar(solicitud.query.id));
});

module.exports = Router;