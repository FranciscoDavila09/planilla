import { Routes } from '@angular/router';
import { Empleados } from './empleados/empleados';
import { Panel } from './panel/panel';
import { Asistencia } from './asistencia/asistencia';
import { Horarios } from './horarios/horarios';
import { Planilla } from './planilla/planilla';
import { Pagos } from './pagos/pagos';
import { Prestamos } from './prestamos/prestamos';
import { Deducciones } from './deducciones/deducciones';
import { Aguinaldos } from './aguinaldos/aguinaldos';
import { Usuarios } from './usuarios/usuarios';
import { Roles } from './roles/roles';

export const routes: Routes = [
    {
        path: 'empleados',component:Empleados,
        
    },
    {
        path: 'panel',component:Panel,
    },
    {
        path: 'asistencia', component: Asistencia,
    },
    {
        path: 'horarios', component: Horarios,
    },
    {
        path: 'planilla', component: Planilla,
    },
    {
        path: 'pagos', component: Pagos,
    },
    {
        path: 'prestamos', component: Prestamos,
    },
    {
        path: 'deducciones', component: Deducciones,
    },
    {
        path: 'aguinaldos', component: Aguinaldos,
    },
    {
        path: 'usuarios', component: Usuarios,
    },
    {
        path: 'roles', component: Roles,
    }
];
