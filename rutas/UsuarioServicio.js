const express = require("express");

const Router = express.Router();
//Para asignar las rutas de usuario
const UsuarioServicio = require("../servicios/UsuarioServicio.js");

Router.get("/listarUsuarios", async (solicitud, respuesta, next) => {
  // return respuesta.json(await UsuarioServicio.listarUsuarios());
  if (await UsuarioServicio.ValidarToken(solicitud.headers.authorization)) {
    try {   
     return respuesta.json(await UsuarioServicio.listarUsuarios());
    } catch (error) {
      console.error(error);
      return respuesta.status(500).json(error);
    }
  }
  return respuesta.status(401).json();

});

Router.get("/obtenerPorId", async (solicitud, respuesta, next) => {
  // return respuesta.json(await UsuarioServicio.obtenerPorId(solicitud.query.id));
    if (await UsuarioServicio.ValidarToken(solicitud.headers.authorization)) {
    try {   
    return respuesta.json(await UsuarioServicio.obtenerPorId(solicitud.query.id));
    } catch (error) {
      console.error(error);
      return respuesta.status(500).json(error);
    }
  }
  return respuesta.status(401).json();
});
    
Router.post("/insertar", async (solicitud, respuesta, next) => {
    // return respuesta.json(await UsuarioServicio.insertar(solicitud.body));
    
    if (await UsuarioServicio.ValidarToken(solicitud.headers.authorization)) {
    try {   
   return respuesta.json(await UsuarioServicio.insertar(solicitud.body));
    } catch (error) {
      console.error(error);
      return respuesta.status(500).json(error);
    }
  }
  return respuesta.status(401).json();
});

Router.put("/actualizar", async (solicitud, respuesta, next) => {
  if (await UsuarioServicio.ValidarToken(solicitud.headers.authorization)) {
    try {
      return respuesta.json(await UsuarioServicio.actualizar(solicitud.body));
    } catch (error) {
      console.error(error);
      return respuesta.status(500).json(error);
    }
  }
  return respuesta.status(401).json();
});

Router.delete("/eliminar", async (solicitud, respuesta, next) => {
  if (await UsuarioServicio.ValidarToken(solicitud.headers.authorization)) {
    try {
      return respuesta.json(await UsuarioServicio.eliminar(solicitud.query.id));
    } catch (error) {
      console.error(error);
      return respuesta.status(500).json(error);
    }
  }
  return respuesta.status(401).json();
});

/// para ka parte del token y autenticacion
Router.post("/autenticar", async (solicitud, respuesta) => {
  respuesta.json(await UsuarioServicio.Autenticacion(solicitud.body.CorreoElectronico, solicitud.body.Clave));
});

Router.post("/validarToken", async (solicitud, respuesta) => {
  respuesta.json(await UsuarioServicio.ValidarToken(solicitud.headers.authorization));
});

Router.post("/desautenticar", async (solicitud, respuesta) => {
  respuesta.json(await UsuarioServicio.DesAutenticacion(solicitud.body.CorreoElectronico));
});




module.exports = Router;
