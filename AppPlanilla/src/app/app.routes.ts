import { Routes } from '@angular/router';
import { Empleados } from './empleados/empleados';
import { Panel } from './panel/panel';
import { Puestos } from './puestos/puestos';
import { Asistencia } from './asistencia/asistencia';
import { Horarios } from './horarios/horarios';
import { Planilla } from './planilla/planilla';
import { Pagos } from './pagos/pagos';
import { Prestamos } from './prestamos/prestamos';
import { Deducciones } from './deducciones/deducciones';
import { Contratos } from './contratos/contratos';
import { Vacaciones } from './vacaciones/vacaciones';
export const routes: Routes = [
    {
        path: 'empleados',component:Empleados,
        
    },
    {
        path: 'panel',component:Panel,
    },
    {

        path: 'puestos',component:Puestos,
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
        path: 'contratos', component:Contratos,
    },
     {
        path: 'vacaciones', component:Vacaciones,
    }
];
