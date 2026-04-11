import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'panel',
    loadComponent: () => import('./panel/panel').then(m => m.Panel)
  },
  {
    path: 'empleados',
    loadComponent: () => import('./empleados/empleados').then(m => m.Empleados)
  },
  {
    path: 'puestos',
    loadComponent: () => import('./puestos/puestos').then(m => m.Puestos)
  },
  {
    path: 'asistencia',
    loadComponent: () => import('./asistencia/asistencia').then(m => m.Asistencia)
  },
  {
    path: 'horarios',
    loadComponent: () => import('./horarios/horarios').then(m => m.Horarios)
  },
  {
    path: 'contratos',
    loadComponent: () => import('./contratos/contratos').then(m => m.Contratos)
  },
  {
    path: 'vacaciones',
    loadComponent: () => import('./vacaciones/vacaciones').then(m => m.Vacaciones)
  },
  {
    path: 'planilla',
    loadComponent: () => import('./planilla/planilla').then(m => m.Planilla)
  },
  {
    path: 'pagos',
    loadComponent: () => import('./pagos/pagos').then(m => m.Pagos)
  },
  {
    path: 'prestamos',
    loadComponent: () => import('./prestamos/prestamos').then(m => m.Prestamos)
  },
  {
    path: 'deducciones',
    loadComponent: () => import('./deducciones/deducciones').then(m => m.Deducciones)
  },
  {
    path: 'aguinaldos',
    loadComponent: () => import('./aguinaldos/aguinaldos').then(m => m.Aguinaldos)
  },
  {
    path: 'usuarios',
    loadComponent: () => import('./usuarios/usuarios').then(m => m.Usuarios)
  },
  {
    path: 'roles',
    loadComponent: () => import('./roles/roles').then(m => m.Roles)
  },
  { path: '', redirectTo: 'panel', pathMatch: 'full' },
  { path: '**', redirectTo: 'panel' }
];