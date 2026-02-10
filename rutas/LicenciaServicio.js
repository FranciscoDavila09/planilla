const express = require('express');

const Router = express.Router();

const LicenciaServicio = require('../servicios/LicenciaServicio.js');

Router.get('/listarLicencia', async (solicitud, respuesta, next) => {
  return respuesta.json(await LicenciaServicio.listarLicencia());
});

Router.get('/obtenerPorId', async (solicitud, respuesta, next) => {
return respuesta.json(await LicenciaServicio.obtenerPorId(solicitud.query.id));
});

Router.post('/insertar', async (solicitud, respuesta, next) => {
return respuesta.json(await LicenciaServicio.insertar(solicitud.body));
});

Router.put('/actualizar', async (solicitud, respuesta, next) => {
return respuesta.json(await LicenciaServicio.actualizar(solicitud.body));
});

Router.delete('/eliminar', async (solicitud, respuesta, next) => {
return respuesta.json(await LicenciaServicio.eliminar(solicitud.query.id));
});

module.exports = Router;