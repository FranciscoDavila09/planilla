-- =====================================================
-- SCRIPT DE TRIGGERS PARA AUDITORÍA AUTOMÁTICA
-- Ejecutar este script en MySQL para habilitar auditoría
-- =====================================================

-- Verificar si la tabla auditoria existe
-- CREATE TABLE IF NOT EXISTS auditoria (
--     idAuditoria INT AUTO_INCREMENT PRIMARY KEY,
--     tabla_afectada VARCHAR(100) NOT NULL,
--     accion ENUM('INSERT','UPDATE','DELETE') NOT NULL,
--     usuario VARCHAR(100),
--     fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
--     registro_id VARCHAR(50),
--     datos_anteriores VARCHAR(500),
--     datos_nuevos VARCHAR(500)
-- );

-- =====================================================
-- TRIGGER PARA INSERT
-- =====================================================
DELIMITER //

CREATE TRIGGER trg_auditoria_insert
AFTER INSERT ON contrato
FOR EACH ROW
BEGIN
    INSERT INTO auditoria (tabla_afectada, accion, usuario, registro_id, datos_nuevos)
    VALUES ('contrato', 'INSERT', USER(), NEW.idContratos, 
            JSON_OBJECT('idContratos', NEW.idContratos, 'Nombre', NEW.Nombre));
END//

-- Trigger para empleados
CREATE TRIGGER trg_auditoria_insert_empleados
AFTER INSERT ON empleados
FOR EACH ROW
BEGIN
    INSERT INTO auditoria (tabla_afectada, accion, usuario, registro_id, datos_nuevos)
    VALUES ('empleados', 'INSERT', USER(), NEW.idEmpleados, 
            JSON_OBJECT('idEmpleados', NEW.idEmpleados, 'Nombre', NEW.Nombre));
END//

-- Trigger para puestos
CREATE TRIGGER trg_auditoria_insert_puestos
AFTER INSERT ON puestos
FOR EACH ROW
BEGIN
    INSERT INTO auditoria (tabla_afectada, accion, usuario, registro_id, datos_nuevos)
    VALUES ('puestos', 'INSERT', USER(), NEW.idPuestos, 
            JSON_OBJECT('idPuestos', NEW.idPuestos, 'Nombre', NEW.Nombre));
END//

-- Trigger para departamentos
CREATE TRIGGER trg_auditoria_insert_departamentos
AFTER INSERT ON departamentos
FOR EACH ROW
BEGIN
    INSERT INTO auditoria (tabla_afectada, accion, usuario, registro_id, datos_nuevos)
    VALUES ('departamentos', 'INSERT', USER(), NEW.idDepartamento, 
            JSON_OBJECT('idDepartamento', NEW.idDepartamento, 'Nombre', NEW.Nombre));
END//

-- Trigger para tipoingresos
CREATE TRIGGER trg_auditoria_insert_tipoingresos
AFTER INSERT ON tipoingresos
FOR EACH ROW
BEGIN
    INSERT INTO auditoria (tabla_afectada, accion, usuario, registro_id, datos_nuevos)
    VALUES ('tipoingresos', 'INSERT', USER(), NEW.idTipoIngresos, 
            JSON_OBJECT('idTipoIngresos', NEW.idTipoIngresos, 'idEmpleados', NEW.idEmpleados));
END//

-- Trigger para deducciones
CREATE TRIGGER trg_auditoria_insert_deducciones
AFTER INSERT ON deducciones
FOR EACH ROW
BEGIN
    INSERT INTO auditoria (tabla_afectada, accion, usuario, registro_id, datos_nuevos)
    VALUES ('deducciones', 'INSERT', USER(), NEW.idDeducciones, 
            JSON_OBJECT('idDeducciones', NEW.idDeducciones, 'idEmpleados', NEW.idEmpleados));
END//

-- Trigger para control_asistencia
CREATE TRIGGER trg_auditoria_insert_control_asistencia
AFTER INSERT ON control_asistencia
FOR EACH ROW
BEGIN
    INSERT INTO auditoria (tabla_afectada, accion, usuario, registro_id, datos_nuevos)
    VALUES ('control_asistencia', 'INSERT', USER(), NEW.idControlAsistencia, 
            JSON_OBJECT('idControlAsistencia', NEW.idControlAsistencia, 'idEmpleados', NEW.idEmpleados));
END//

-- Trigger para vacaciones
CREATE TRIGGER trg_auditoria_insert_vacaciones
AFTER INSERT ON vacaciones
FOR EACH ROW
BEGIN
    INSERT INTO auditoria (tabla_afectada, accion, usuario, registro_id, datos_nuevos)
    VALUES ('vacaciones', 'INSERT', USER(), NEW.idVacaciones, 
            JSON_OBJECT('idVacaciones', NEW.idVacaciones, 'idEmpleados', NEW.idEmpleados));
END//

-- Trigger para licencia
CREATE TRIGGER trg_auditoria_insert_licencia
AFTER INSERT ON licencia
FOR EACH ROW
BEGIN
    INSERT INTO auditoria (tabla_afectada, accion, usuario, registro_id, datos_nuevos)
    VALUES ('licencia', 'INSERT', USER(), NEW.idLicencia, 
            JSON_OBJECT('idLicencia', NEW.idLicencia, 'idEmpleados', NEW.idEmpleados));
END//

-- Trigger para planilla
CREATE TRIGGER trg_auditoria_insert_planilla
AFTER INSERT ON planilla
FOR EACH ROW
BEGIN
    INSERT INTO auditoria (tabla_afectada, accion, usuario, registro_id, datos_nuevos)
    VALUES ('planilla', 'INSERT', USER(), NEW.idPlanilla, 
            JSON_OBJECT('idPlanilla', NEW.idPlanilla, 'idPeriodoPlanilla', NEW.idPeriodoPlanilla));
END//

-- =====================================================
-- TRIGGER PARA UPDATE
-- =====================================================
DELIMITER //

CREATE TRIGGER trg_auditoria_update_contrato
AFTER UPDATE ON contrato
FOR EACH ROW
BEGIN
    INSERT INTO auditoria (tabla_afectada, accion, usuario, registro_id, datos_anteriores, datos_nuevos)
    VALUES ('contrato', 'UPDATE', USER(), OLD.idContratos, 
            JSON_OBJECT('idContratos', OLD.idContratos, 'Nombre', OLD.Nombre),
            JSON_OBJECT('idContratos', NEW.idContratos, 'Nombre', NEW.Nombre));
END//

CREATE TRIGGER trg_auditoria_update_empleados
AFTER UPDATE ON empleados
FOR EACH ROW
BEGIN
    INSERT INTO auditoria (tabla_afectada, accion, usuario, registro_id, datos_anteriores, datos_nuevos)
    VALUES ('empleados', 'UPDATE', USER(), OLD.idEmpleados, 
            JSON_OBJECT('idEmpleados', OLD.idEmpleados, 'Nombre', OLD.Nombre),
            JSON_OBJECT('idEmpleados', NEW.idEmpleados, 'Nombre', NEW.Nombre));
END//

CREATE TRIGGER trg_auditoria_update_puestos
AFTER UPDATE ON puestos
FOR EACH ROW
BEGIN
    INSERT INTO auditoria (tabla_afectada, accion, usuario, registro_id, datos_anteriores, datos_nuevos)
    VALUES ('puestos', 'UPDATE', USER(), OLD.idPuestos, 
            JSON_OBJECT('idPuestos', OLD.idPuestos, 'Nombre', OLD.Nombre),
            JSON_OBJECT('idPuestos', NEW.idPuestos, 'Nombre', NEW.Nombre));
END//

CREATE TRIGGER trg_auditoria_update_departamentos
AFTER UPDATE ON departamentos
FOR EACH ROW
BEGIN
    INSERT INTO auditoria (tabla_afectada, accion, usuario, registro_id, datos_anteriores, datos_nuevos)
    VALUES ('departamentos', 'UPDATE', USER(), OLD.idDepartamento, 
            JSON_OBJECT('idDepartamento', OLD.idDepartamento, 'Nombre', OLD.Nombre),
            JSON_OBJECT('idDepartamento', NEW.idDepartamento, 'Nombre', NEW.Nombre));
END//

-- =====================================================
-- TRIGGER PARA DELETE
-- =====================================================
DELIMITER //

CREATE TRIGGER trg_auditoria_delete_contrato
AFTER DELETE ON contrato
FOR EACH ROW
BEGIN
    INSERT INTO auditoria (tabla_afectada, accion, usuario, registro_id, datos_anteriores)
    VALUES ('contrato', 'DELETE', USER(), OLD.idContratos, 
            JSON_OBJECT('idContratos', OLD.idContratos, 'Nombre', OLD.Nombre));
END//

CREATE TRIGGER trg_auditoria_delete_empleados
AFTER DELETE ON empleados
FOR EACH ROW
BEGIN
    INSERT INTO auditoria (tabla_afectada, accion, usuario, registro_id, datos_anteriores)
    VALUES ('empleados', 'DELETE', USER(), OLD.idEmpleados, 
            JSON_OBJECT('idEmpleados', OLD.idEmpleados, 'Nombre', OLD.Nombre));
END//

CREATE TRIGGER trg_auditoria_delete_puestos
AFTER DELETE ON puestos
FOR EACH ROW
BEGIN
    INSERT INTO auditoria (tabla_afectada, accion, usuario, registro_id, datos_anteriores)
    VALUES ('puestos', 'DELETE', USER(), OLD.idPuestos, 
            JSON_OBJECT('idPuestos', OLD.idPuestos, 'Nombre', OLD.Nombre));
END//

CREATE TRIGGER trg_auditoria_delete_departamentos
AFTER DELETE ON departamentos
FOR EACH ROW
BEGIN
    INSERT INTO auditoria (tabla_afectada, accion, usuario, registro_id, datos_anteriores)
    VALUES ('departamentos', 'DELETE', USER(), OLD.idDepartamento, 
            JSON_OBJECT('idDepartamento', OLD.idDepartamento, 'Nombre', OLD.Nombre));
END//

DELIMITER ;
