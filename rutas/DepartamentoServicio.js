const express = require('express');

const Router = express.Router();

const DepartamentoServicio = require('../servicios/DepartamentoServicio.js');


Router.get('/listarDepartamentos', async (solicitud, respuesta, next) => {
  return respuesta.json(await DepartamentoServicio.listarDepartamentos());
});

Router.get('/obtenerPorId', async (solicitud, respuesta, next) => {
return respuesta.json(await DepartamentoServicio.obtenerPorId(solicitud.query.id));
});


Router.post('/insertar', async (solicitud, respuesta, next) => {
return respuesta.json(await DepartamentoServicio.insertar(solicitud.body));
});

Router.put('/actualizar', async (solicitud, respuesta, next) => {
return respuesta.json(await DepartamentoServicio.actualizar(solicitud.body));
});

Router.delete('/eliminar', async (solicitud, respuesta, next) => {
return respuesta.json(await DepartamentoServicio.eliminar(solicitud.query.id));
});
module.exports = Router;
