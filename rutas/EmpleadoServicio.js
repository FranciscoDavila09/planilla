const express = require('express');

const Router = express.Router();

const EmpleadoServicio = require('../servicios/EmpleadoServicio.js');
const { route } = require('./Servicio1.js');


Router.get('/listarEmpleados', async (solicitud, respuesta, next) => {
  return respuesta.json(await EmpleadoServicio.listarEmpleados());
});

Router.get('/obtenerPorId', async (solicitud, respuesta, next) => {
return respuesta.json(await EmpleadoServicio.obtenerPorId(solicitud.query.id));
});


Router.post('/insertar', async (solicitud, respuesta, next) => {
return respuesta.json(await EmpleadoServicio.insertar(solicitud.body));
});

Router.put('/actualizar', async (solicitud, respuesta, next) => {
return respuesta.json(await EmpleadoServicio.actualizar(solicitud.body));
});

Router.delete('/eliminar', async (solicitud, respuesta, next) => {
return respuesta.json(await EmpleadoServicio.eliminar(solicitud.query.id));
});
module.exports = Router;