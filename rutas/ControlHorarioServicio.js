const express = require('express');
const Router = express.Router();

const ControlHorarioServicio = require('../servicios/ControlHorarioServicio.js');

Router.get('/listarControlHorario', async (solicitud, respuesta, next) => {
  return respuesta.json(await ControlHorarioServicio.listarControlHorario());
});
Router.get('/obtenerPorId', async (solicitud, respuesta, next) => {
return respuesta.json(await ControlHorarioServicio.obtenerPorId(solicitud.query.id));
});

Router.post('/insertar', async (solicitud, respuesta, next) => {
return respuesta.json(await ControlHorarioServicio.insertar(solicitud.body));
});

Router.put('/actualizar', async (solicitud, respuesta, next) => {
return respuesta.json(await ControlHorarioServicio.actualizar(solicitud.body));
});

Router.delete('/eliminar', async (solicitud, respuesta, next) => {
return respuesta.json(await ControlHorarioServicio.eliminar(solicitud.query.id));
});

module.exports = Router;