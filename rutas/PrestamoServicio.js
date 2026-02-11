const express = require('express');

const Router = express.Router();

const PrestamoServicio = require('../servicios/PrestamoServicio.js');
const { route } = require('./Servicio1.js');


Router.get('/listarPrestamos', async (solicitud, respuesta, next) => {
  return respuesta.json(await PrestamoServicio.listarPrestamos());
});

Router.get('/obtenerPorId', async (solicitud, respuesta, next) => {
return respuesta.json(await PrestamoServicio.obtenerPorId(solicitud.query.id));
});


Router.post('/insertar', async (solicitud, respuesta, next) => {
return respuesta.json(await PrestamoServicio.insertar(solicitud.body));
});

Router.put('/actualizar', async (solicitud, respuesta, next) => {
return respuesta.json(await PrestamoServicio.actualizar(solicitud.body));
});

Router.delete('/eliminar', async (solicitud, respuesta, next) => {
return respuesta.json(await PrestamoServicio.eliminar(solicitud.query.id));
});

module.exports = Router;
