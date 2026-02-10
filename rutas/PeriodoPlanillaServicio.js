const express = require('express');

const Router = express.Router();

const PeriodoPlanillaServicio = require('../servicios/PeriodoPlanillaServicio.js');

Router.get('/listarPeriodoPlanilla', async (solicitud, respuesta, next) => {
  return respuesta.json(await PeriodoPlanillaServicio.listarPeriodoPlanilla());
});

Router.get('/obtenerPorId', async (solicitud, respuesta, next) => {
return respuesta.json(await PeriodoPlanillaServicio.obtenerPorId(solicitud.query.id));
}   );

Router.post('/insertar', async (solicitud, respuesta, next) => {
return respuesta.json(await PeriodoPlanillaServicio.insertar(solicitud.body));
});

Router.put('/actualizar', async (solicitud, respuesta, next) => {
return respuesta.json(await PeriodoPlanillaServicio.actualizar(solicitud.body));
}   );

Router.delete('/eliminar', async (solicitud, respuesta, next) => {
return respuesta.json(await PeriodoPlanillaServicio.eliminar(solicitud.query.id));
});

module.exports = Router;