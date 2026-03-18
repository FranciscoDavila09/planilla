import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('AppPlanilla');
  protected menuAbierto = signal(false);
  protected seccionActiva = signal('dashboard');

  protected readonly menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: 'bi-house' },
    { id: 'empleados', label: 'Empleados', icon: 'bi-people' },
    { id: 'departamentos', label: 'Departamentos', icon: 'bi-building' },
    { id: 'puestos', label: 'Puestos', icon: 'bi-briefcase' },
    { id: 'asistencia', label: 'Asistencia', icon: 'bi-clock' },
    { id: 'horarios', label: 'Horarios', icon: 'bi-calendar' },
    { id: 'vacaciones', label: 'Vacaciones', icon: 'bi-sun' },
    { id: 'licencias', label: 'Licencias', icon: 'bi-file-medical' },
    { id: 'planilla', label: 'Planilla', icon: 'bi-currency-dollar' },
    { id: 'aguinaldos', label: 'Aguinaldos', icon: 'bi-gift' },
    { id: 'prestamos', label: 'Préstamos', icon: 'bi-cash' },
    { id: 'usuarios', label: 'Usuarios', icon: 'bi-person-badge' },
    { id: 'auditoria', label: 'Auditoría', icon: 'bi-journal-text' }
  ];

  toggleMenu(): void {
    this.menuAbierto.update(v => !v);
  }

  seleccionarSeccion(id: string): void {
    this.seccionActiva.set(id);
    // En móvil, cerrar el menú al seleccionar
    if (window.innerWidth < 768) {
      this.menuAbierto.set(false);
    }
  }

  getNombreSeccion(): string {
    const item = this.menuItems.find(m => m.id === this.seccionActiva());
    return item?.label || 'Dashboard';
  }
}
