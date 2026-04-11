const express = require("express");
const Router = express.Router();

const AuditoriaServicio = require("../servicios/AuditoriaServicio.js");

//Listar todos los registros de auditoría
Router.get("/listarAuditoria", async (solicitud, respuesta, next) => {
  return respuesta.json(await AuditoriaServicio.listarAuditoria());
});

//Obtener auditoría por ID
Router.get("/obtenerAuditoriaPorId", async (solicitud, respuesta, next) => {
  return respuesta.json(
    await AuditoriaServicio.obtenerPorId(solicitud.query.id),
  );
});

//Obtener auditoría por tabla
Router.get("/obtenerAuditoriaPorTabla", async (solicitud, respuesta, next) => {
  return respuesta.json(
    await AuditoriaServicio.obtenerPorTabla(solicitud.query.tabla),
  );
});

//Obtener auditoría por tipo de acción
Router.get("/obtenerAuditoriaPorAccion", async (solicitud, respuesta, next) => {
  return respuesta.json(
    await AuditoriaServicio.obtenerPorAccion(solicitud.query.accion),
  );
});

//Obtener auditoría por usuario
Router.get(
  "/obtenerAuditoriaPorUsuario",
  async (solicitud, respuesta, next) => {
    return respuesta.json(
      await AuditoriaServicio.obtenerPorUsuario(solicitud.query.usuario),
    );
  },
);

//Obtener auditoría por rango de fechas
Router.get("/obtenerAuditoriaPorFechas", async (solicitud, respuesta, next) => {
  return respuesta.json(
    await AuditoriaServicio.obtenerPorFechas(
      solicitud.query.fechaInicio,
      solicitud.query.fechaFin,
    ),
  );
});

module.exports = Router;
