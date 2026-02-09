const express = require('express');
const Router = express.Router();

const AguinaldosServicio = require('../servicios/AguinaldosServicio.js');

Router.get('/listarAguinaldos', async (solicitud, respuesta, next) => {
  return respuesta.json(await AguinaldosServicio.listarAguinaldos());
});

Router.get('/obtenerPorId', async (solicitud, respuesta, next) => {
return respuesta.json(await AguinaldosServicio.obtenerPorId(solicitud.query.id));
});


Router.post('/insertar', async (solicitud, respuesta, next) => {
return respuesta.json(await AguinaldosServicio.insertar(solicitud.body));
});

Router.put('/actualizar', async (solicitud, respuesta, next) => {
return respuesta.json(await AguinaldosServicio.actualizar(solicitud.body));
});

Router.delete('/eliminar', async (solicitud, respuesta, next) => {
return respuesta.json(await AguinaldosServicio.eliminar(solicitud.query.id));
});
module.exports = Router;