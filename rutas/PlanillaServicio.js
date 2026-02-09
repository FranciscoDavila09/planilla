const express = require('express');

const Router = express.Router();

const PlanillaServicio = require('../servicios/PlanillaServicio.js');


Router.get('/listarPlanillas', async (solicitud, respuesta, next) => {
  return respuesta.json(await PlanillaServicio.listarPlanillas());
});

Router.get('/obtenerPorId', async (solicitud, respuesta, next) => {
return respuesta.json(await PlanillaServicio.obtenerPorId(solicitud.query.id));
});


Router.post('/insertar', async (solicitud, respuesta, next) => {
return respuesta.json(await PlanillaServicio.insertar(solicitud.body));
});

Router.put('/actualizar', async (solicitud, respuesta, next) => {
return respuesta.json(await PlanillaServicio.actualizar(solicitud.body));
});

Router.delete('/eliminar', async (solicitud, respuesta, next) => {
return respuesta.json(await PlanillaServicio.eliminar(solicitud.query.id));
});
module.exports = Router;
