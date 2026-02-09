const express = require('express');
const Router = express.Router();

const ControlAsistenciaServicio = require('../servicios/ControlAsistenciaServicio.js');

Router.get('/listarControlAsistencia', async (solicitud, respuesta, next) => {
  return respuesta.json(await ControlAsistenciaServicio.listarControlAsistencia());
});
Router.get('/obtenerPorId', async (solicitud, respuesta, next) => {
return respuesta.json(await ControlAsistenciaServicio.obtenerPorId(solicitud.query.id));
});

Router.post('/insertar', async (solicitud, respuesta, next) => {
return respuesta.json(await ControlAsistenciaServicio.insertar(solicitud.body));
});

Router.put('/actualizar', async (solicitud, respuesta, next) => {
return respuesta.json(await ControlAsistenciaServicio.actualizar(solicitud.body));
});

Router.delete('/eliminar', async (solicitud, respuesta, next) => {
return respuesta.json(await ControlAsistenciaServicio.eliminar(solicitud.query.id));
});

module.exports = Router;