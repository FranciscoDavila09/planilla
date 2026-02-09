const express = require('express');

const Router = express.Router();

const DetalleplanillaServicio = require('../servicios/DetalleplanillaServicio.js');
const { route } = require('./Servicio1.js');


Router.get('/listarDetalleplanilla', async (solicitud, respuesta, next) => {
  return respuesta.json(await DetalleplanillaServicio.listarDetalleplanilla());
});

Router.get('/obtenerPorId', async (solicitud, respuesta, next) => {
return respuesta.json(await DetalleplanillaServicio.obtenerPorId(solicitud.query.id));
});


Router.post('/insertar', async (solicitud, respuesta, next) => {
return respuesta.json(await DetalleplanillaServicio.insertar(solicitud.body));
});

Router.put('/actualizar', async (solicitud, respuesta, next) => {
return respuesta.json(await DetalleplanillaServicio.actualizar(solicitud.body));
});

Router.delete('/eliminar', async (solicitud, respuesta, next) => {
return respuesta.json(await DetalleplanillaServicio.eliminar(solicitud.query.id));
});

module.exports = Router;
