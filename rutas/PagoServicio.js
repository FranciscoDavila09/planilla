const express = require('express');

const Router = express.Router();

const PagoServicio = require('../servicios/PagoServicio.js');


Router.get('/listarPagos', async (solicitud, respuesta, next) => {
  return respuesta.json(await PagoServicio.listarPagos());
});

Router.get('/obtenerPorId', async (solicitud, respuesta, next) => {
return respuesta.json(await PagoServicio.obtenerPorId(solicitud.query.id));
});


Router.post('/insertar', async (solicitud, respuesta, next) => {
return respuesta.json(await PagoServicio.insertar(solicitud.body));
});

Router.put('/actualizar', async (solicitud, respuesta, next) => {
return respuesta.json(await PagoServicio.actualizar(solicitud.body));
});

Router.delete('/eliminar', async (solicitud, respuesta, next) => {
return respuesta.json(await PagoServicio.eliminar(solicitud.query.id));
});
module.exports = Router;
