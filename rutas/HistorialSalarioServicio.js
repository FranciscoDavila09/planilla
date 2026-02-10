const express = require('express');

const Router = express.Router();

const HistorialSalarioServicio = require('../servicios/HistorialSalarioServicio.js');

Router.get('/listarHistorialSalario', async (solicitud, respuesta, next) => {
  return respuesta.json(await HistorialSalarioServicio.listarHistorialSalario());
});

Router.get('/obtenerPorId', async (solicitud, respuesta, next) => {
return respuesta.json(await HistorialSalarioServicio.obtenerPorId(solicitud.query.id));
}   );

Router.post('/insertar', async (solicitud, respuesta, next) => {
return respuesta.json(await HistorialSalarioServicio.insertar(solicitud.body));
});

Router.put('/actualizar', async (solicitud, respuesta, next) => {
return respuesta.json(await HistorialSalarioServicio.actualizar(solicitud.body));
}   
);

Router.delete('/eliminar', async (solicitud, respuesta, next) => {
return respuesta.json(await HistorialSalarioServicio.eliminar(solicitud.query.id));
});

module.exports = Router;