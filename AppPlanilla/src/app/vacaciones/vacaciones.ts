import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

interface Vacacion {
  IdVacacion: number;
  IdEmpleado: number;
  FechaInicio: string;
  FechaFin: string;
  DiasSolicitados: number;
  Estado: string;
  UsuarioAprueba?: number;
}

interface Empleado { id: number; nombre: string; }
interface Usuario  { id: number; nombre: string; }

@Component({
  selector: 'app-vacaciones',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './vacaciones.html',
  styleUrl: './vacaciones.css',
})
export class Vacaciones {
  readonly COLORS = ['av-red', 'av-green', 'av-blue', 'av-amber', 'av-violet', 'av-teal'];
  readonly perPage = 8;

  showFormModal   = false;
  showDeleteModal = false;

  searchQuery  = '';
  estadoFiltro = '';
  currentPage  = 1;

  editId: number | null = null;
  form: Partial<Vacacion> = {};
  deleteTargetId: number | null = null;

  empleados: Empleado[] = [
    { id: 1,  nombre: 'María Rodríguez López'   },
    { id: 2,  nombre: 'Carlos Mendoza Torres'   },
    { id: 3,  nombre: 'Sofía Vargas Chaves'     },
    { id: 4,  nombre: 'Andrés Jiménez Mora'     },
    { id: 5,  nombre: 'Lucía Pérez Solís'       },
    { id: 6,  nombre: 'Diego Castillo Brenes'   },
    { id: 7,  nombre: 'Valeria Núñez Ulate'     },
    { id: 8,  nombre: 'Felipe Aguilar Rojas'    },
    { id: 9,  nombre: 'Daniela Herrera Campos'  },
    { id: 10, nombre: 'Ricardo Soto Fallas'     },
    { id: 11, nombre: 'Camila Quesada León'     },
    { id: 12, nombre: 'Pablo Araya Badilla'     },
  ];

  usuarios: Usuario[] = [
    { id: 1, nombre: 'Admin RH'      },
    { id: 2, nombre: 'Supervisor TI' },
    { id: 3, nombre: 'Gerente RRHH'  },
  ];

  vacaciones: Vacacion[] = [
    { IdVacacion: 1,  IdEmpleado: 1,  FechaInicio: '2026-04-07', FechaFin: '2026-04-18', DiasSolicitados: 10, Estado: 'Aprobado',  UsuarioAprueba: 1 },
    { IdVacacion: 2,  IdEmpleado: 2,  FechaInicio: '2026-05-04', FechaFin: '2026-05-08', DiasSolicitados: 5,  Estado: 'Pendiente', UsuarioAprueba: undefined },
    { IdVacacion: 3,  IdEmpleado: 3,  FechaInicio: '2026-03-16', FechaFin: '2026-03-28', DiasSolicitados: 10, Estado: 'En curso',  UsuarioAprueba: 3 },
    { IdVacacion: 4,  IdEmpleado: 4,  FechaInicio: '2026-06-01', FechaFin: '2026-06-12', DiasSolicitados: 10, Estado: 'Pendiente', UsuarioAprueba: undefined },
    { IdVacacion: 5,  IdEmpleado: 5,  FechaInicio: '2026-07-13', FechaFin: '2026-07-24', DiasSolicitados: 10, Estado: 'Aprobado',  UsuarioAprueba: 1 },
    { IdVacacion: 6,  IdEmpleado: 6,  FechaInicio: '2025-12-22', FechaFin: '2026-01-02', DiasSolicitados: 10, Estado: 'Aprobado',  UsuarioAprueba: 2 },
    { IdVacacion: 7,  IdEmpleado: 7,  FechaInicio: '2026-03-09', FechaFin: '2026-03-20', DiasSolicitados: 10, Estado: 'En curso',  UsuarioAprueba: 1 },
    { IdVacacion: 8,  IdEmpleado: 8,  FechaInicio: '2026-08-03', FechaFin: '2026-08-07', DiasSolicitados: 5,  Estado: 'Pendiente', UsuarioAprueba: undefined },
    { IdVacacion: 9,  IdEmpleado: 9,  FechaInicio: '2026-04-20', FechaFin: '2026-05-01', DiasSolicitados: 10, Estado: 'Aprobado',  UsuarioAprueba: 2 },
    { IdVacacion: 10, IdEmpleado: 10, FechaInicio: '2026-02-16', FechaFin: '2026-02-20', DiasSolicitados: 5,  Estado: 'Rechazado', UsuarioAprueba: 1 },
    { IdVacacion: 11, IdEmpleado: 11, FechaInicio: '2026-09-07', FechaFin: '2026-09-18', DiasSolicitados: 10, Estado: 'Pendiente', UsuarioAprueba: undefined },
    { IdVacacion: 12, IdEmpleado: 12, FechaInicio: '2025-11-03', FechaFin: '2025-11-14', DiasSolicitados: 10, Estado: 'Aprobado',  UsuarioAprueba: 3 },
  ];

  // ── Computed ──
  get filteredVacaciones(): Vacacion[] {
    const q = this.searchQuery.toLowerCase();
    return this.vacaciones.filter(v =>
      (!q || this.getNombreEmpleado(v.IdEmpleado).toLowerCase().includes(q)) &&
      (!this.estadoFiltro || v.Estado === this.estadoFiltro)
    );
  }

  get pageSlice(): Vacacion[] {
    const start = (this.currentPage - 1) * this.perPage;
    return this.filteredVacaciones.slice(start, start + this.perPage);
  }

  get totalPages(): number[] {
    const count = Math.ceil(this.filteredVacaciones.length / this.perPage) || 1;
    return Array.from({ length: count }, (_, i) => i + 1);
  }

  // ── Helpers ──
  min(a: number, b: number) { return Math.min(a, b); }

  colorFor(id: number) { return this.COLORS[(id - 1) % this.COLORS.length]; }

  getNombreEmpleado(id: number) {
    return this.empleados.find(e => e.id === id)?.nombre ?? `Empleado ${id}`;
  }

  getNombreUsuario(id: number) {
    return this.usuarios.find(u => u.id === id)?.nombre ?? '—';
  }

  inicialesNombre(nombre: string) {
    const p = nombre.split(' ');
    return (p[0][0] + (p[1]?.[0] ?? '')).toUpperCase();
  }

  fmtFecha(f: string) {
    if (!f) return '—';
    const [y, m, d] = f.split('-');
    return `${d}/${m}/${y}`;
  }

  estadoClass(s: string) {
    if (s === 'Aprobado')  return 'status-active';
    if (s === 'Pendiente') return 'status-tardanza';
    if (s === 'En curso')  return 'status-vacation';
    return 'status-inactive';
  }

  countByEstado(e: string) { return this.vacaciones.filter(v => v.Estado === e).length; }

  getTotalDias() { return this.vacaciones.reduce((s, v) => s + v.DiasSolicitados, 0); }

  // ── Cálculo automático de días ──
  calcularDias() {
    if (!this.form.FechaInicio || !this.form.FechaFin) return;
    const d1 = new Date(this.form.FechaInicio);
    const d2 = new Date(this.form.FechaFin);
    const diff = Math.ceil((d2.getTime() - d1.getTime()) / (1000 * 60 * 60 * 24)) + 1;
    this.form.DiasSolicitados = diff > 0 ? diff : 1;
  }

  // ── Filtro / paginación ──
  filterTable()   { this.currentPage = 1; }
  changePage(d: number) {
    const max = this.totalPages.length;
    this.currentPage = Math.max(1, Math.min(max, this.currentPage + d));
  }
  goPage(n: number) { this.currentPage = n; }

  // ── CRUD ──
  openModal(mode: 'create' | 'edit', id?: number) {
    if (mode === 'create') {
      this.editId = null;
      this.form = { Estado: 'Pendiente', DiasSolicitados: 1 };
    } else {
      const v = this.vacaciones.find(x => x.IdVacacion === id)!;
      this.editId = v.IdVacacion;
      this.form = { ...v };
    }
    this.showFormModal = true;
  }

  saveVacacion() {
    if (!this.form.IdEmpleado || !this.form.FechaInicio || !this.form.FechaFin) {
      alert('Por favor completa los campos obligatorios.');
      return;
    }
    if (this.editId) {
      const idx = this.vacaciones.findIndex(v => v.IdVacacion === this.editId);
      this.vacaciones[idx] = { ...this.vacaciones[idx], ...this.form } as Vacacion;
    } else {
      const newId = Math.max(0, ...this.vacaciones.map(v => v.IdVacacion)) + 1;
      this.vacaciones = [...this.vacaciones, { IdVacacion: newId, ...this.form } as Vacacion];
    }
    this.showFormModal = false;
  }

  aprobar(id: number) {
    const idx = this.vacaciones.findIndex(v => v.IdVacacion === id);
    this.vacaciones[idx] = { ...this.vacaciones[idx], Estado: 'Aprobado', UsuarioAprueba: 1 };
    this.vacaciones = [...this.vacaciones];
  }

  rechazar(id: number) {
    const idx = this.vacaciones.findIndex(v => v.IdVacacion === id);
    this.vacaciones[idx] = { ...this.vacaciones[idx], Estado: 'Rechazado', UsuarioAprueba: 1 };
    this.vacaciones = [...this.vacaciones];
  }

  askDelete(id: number) {
    this.deleteTargetId = id;
    this.showDeleteModal = true;
  }

  confirmDelete() {
    this.vacaciones = this.vacaciones.filter(v => v.IdVacacion !== this.deleteTargetId);
    this.deleteTargetId = null;
    this.showDeleteModal = false;
  }

  onOverlayClick(event: MouseEvent, modal: 'form' | 'delete') {
    if (event.target === event.currentTarget) {
      if (modal === 'form')   this.showFormModal   = false;
      if (modal === 'delete') this.showDeleteModal = false;
    }
  }
}