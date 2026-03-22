import { Routes } from '@angular/router';
import { Empleados } from './empleados/empleados';
import { Panel } from './panel/panel';
import { Puestos } from './puestos/puestos';

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
    
];
