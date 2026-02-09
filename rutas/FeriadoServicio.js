const express = require('express');

const Router = express.Router();

const FeriadoServicio = require('../servicios/FeriadoServicio.js');


Router.get('/listarFeriados', async (solicitud, respuesta, next) => {
  return respuesta.json(await FeriadoServicio.listarFeriados());
});

Router.get('/obtenerPorId', async (solicitud, respuesta, next) => {
return respuesta.json(await FeriadoServicio.obtenerPorId(solicitud.query.id));
});


Router.post('/insertar', async (solicitud, respuesta, next) => {
return respuesta.json(await FeriadoServicio.insertar(solicitud.body));
});

Router.put('/actualizar', async (solicitud, respuesta, next) => {
return respuesta.json(await FeriadoServicio.actualizar(solicitud.body));
});

Router.delete('/eliminar', async (solicitud, respuesta, next) => {
return respuesta.json(await FeriadoServicio.eliminar(solicitud.query.id));
});
module.exports = Router;
