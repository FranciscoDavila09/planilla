import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

interface ControlHorario {
  IdControl: number;
  IdEmpleado: number;
  Fecha: string;
  HoraEntrada: string;
  HoraSalida: string;
  HorasNormales: number;
  HorasExtra: number;
  Estado: string;
  idUsuarios?: number;
}

interface Empleado { id: number; nombre: string; }
interface Usuario  { id: number; nombre: string; }

@Component({
  selector: 'app-horarios',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './horarios.html',
  styleUrl: './horarios.css',
})
export class Horarios {
  readonly COLORS = ['av-red', 'av-green', 'av-blue', 'av-amber', 'av-violet', 'av-teal'];
  readonly perPage = 8;

  showFormModal   = false;
  showDeleteModal = false;

  searchQuery  = '';
  fechaFiltro  = '';
  estadoFiltro = '';
  currentPage  = 1;

  editId: number | null = null;
  form: Partial<ControlHorario> = {};
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
  ];

  usuarios: Usuario[] = [
    { id: 1, nombre: 'Admin RH'      },
    { id: 2, nombre: 'Supervisor TI' },
    { id: 3, nombre: 'Gerente RRHH'  },
  ];

  horarios: ControlHorario[] = [
    { IdControl: 1,  IdEmpleado: 1,  Fecha: '2026-03-21', HoraEntrada: '07:58', HoraSalida: '17:02', HorasNormales: 8, HorasExtra: 0, Estado: 'Aprobado',  idUsuarios: 1 },
    { IdControl: 2,  IdEmpleado: 2,  Fecha: '2026-03-21', HoraEntrada: '08:15', HoraSalida: '18:00', HorasNormales: 8, HorasExtra: 1, Estado: 'Aprobado',  idUsuarios: 1 },
    { IdControl: 3,  IdEmpleado: 3,  Fecha: '2026-03-21', HoraEntrada: '08:00', HoraSalida: '17:00', HorasNormales: 8, HorasExtra: 0, Estado: 'Pendiente', idUsuarios: 1 },
    { IdControl: 4,  IdEmpleado: 4,  Fecha: '2026-03-21', HoraEntrada: '07:55', HoraSalida: '19:00', HorasNormales: 8, HorasExtra: 3, Estado: 'Pendiente', idUsuarios: 1 },
    { IdControl: 5,  IdEmpleado: 5,  Fecha: '2026-03-21', HoraEntrada: '08:00', HoraSalida: '17:05', HorasNormales: 8, HorasExtra: 0, Estado: 'Aprobado',  idUsuarios: 1 },
    { IdControl: 6,  IdEmpleado: 6,  Fecha: '2026-03-21', HoraEntrada: '08:30', HoraSalida: '18:30', HorasNormales: 8, HorasExtra: 2, Estado: 'Aprobado',  idUsuarios: 2 },
    { IdControl: 7,  IdEmpleado: 7,  Fecha: '2026-03-21', HoraEntrada: '08:00', HoraSalida: '17:00', HorasNormales: 8, HorasExtra: 0, Estado: 'Pendiente', idUsuarios: 1 },
    { IdControl: 8,  IdEmpleado: 8,  Fecha: '2026-03-21', HoraEntrada: '07:50', HoraSalida: '17:10', HorasNormales: 8, HorasExtra: 0, Estado: 'Aprobado',  idUsuarios: 1 },
    { IdControl: 9,  IdEmpleado: 9,  Fecha: '2026-03-20', HoraEntrada: '08:00', HoraSalida: '20:00', HorasNormales: 8, HorasExtra: 4, Estado: 'Aprobado',  idUsuarios: 2 },
    { IdControl: 10, IdEmpleado: 10, Fecha: '2026-03-20', HoraEntrada: '08:00', HoraSalida: '17:00', HorasNormales: 8, HorasExtra: 0, Estado: 'Rechazado', idUsuarios: 1 },
    { IdControl: 11, IdEmpleado: 1,  Fecha: '2026-03-20', HoraEntrada: '07:59', HoraSalida: '18:59', HorasNormales: 8, HorasExtra: 3, Estado: 'Aprobado',  idUsuarios: 1 },
    { IdControl: 12, IdEmpleado: 2,  Fecha: '2026-03-20', HoraEntrada: '08:00', HoraSalida: '17:00', HorasNormales: 8, HorasExtra: 0, Estado: 'Aprobado',  idUsuarios: 1 },
    { IdControl: 13, IdEmpleado: 3,  Fecha: '2026-03-19', HoraEntrada: '08:05', HoraSalida: '17:05', HorasNormales: 8, HorasExtra: 0, Estado: 'Aprobado',  idUsuarios: 1 },
    { IdControl: 14, IdEmpleado: 4,  Fecha: '2026-03-19', HoraEntrada: '08:45', HoraSalida: '19:45', HorasNormales: 8, HorasExtra: 3, Estado: 'Pendiente', idUsuarios: 1 },
    { IdControl: 15, IdEmpleado: 5,  Fecha: '2026-03-19', HoraEntrada: '07:55', HoraSalida: '17:55', HorasNormales: 8, HorasExtra: 2, Estado: 'Aprobado',  idUsuarios: 1 },
    { IdControl: 16, IdEmpleado: 6,  Fecha: '2026-03-19', HoraEntrada: '08:00', HoraSalida: '17:00', HorasNormales: 8, HorasExtra: 0, Estado: 'Aprobado',  idUsuarios: 2 },
  ];

  // ── Computed ──
  get filteredHorarios(): ControlHorario[] {
    const q = this.searchQuery.toLowerCase();
    return this.horarios.filter(h => {
      const nombre = this.getNombreEmpleado(h.IdEmpleado).toLowerCase();
      return (
        (!q || nombre.includes(q)) &&
        (!this.fechaFiltro || h.Fecha === this.fechaFiltro) &&
        (!this.estadoFiltro || h.Estado === this.estadoFiltro)
      );
    });
  }

  get pageSlice(): ControlHorario[] {
    const start = (this.currentPage - 1) * this.perPage;
    return this.filteredHorarios.slice(start, start + this.perPage);
  }

  get totalPages(): number[] {
    const count = Math.ceil(this.filteredHorarios.length / this.perPage) || 1;
    return Array.from({ length: count }, (_, i) => i + 1);
  }

  // ── Helpers ──
  min(a: number, b: number) { return Math.min(a, b); }

  colorFor(id: number)      { return this.COLORS[(id - 1) % this.COLORS.length]; }

  getNombreEmpleado(id: number) {
    return this.empleados.find(e => e.id === id)?.nombre ?? `Empleado ${id}`;
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
    return 'status-inactive';
  }

  getTotalRegistros()    { return this.horarios.length; }
  getTotalHorasNormales(){ return this.horarios.reduce((s, h) => s + h.HorasNormales, 0); }
  getTotalHorasExtra()   { return this.horarios.reduce((s, h) => s + h.HorasExtra, 0); }
  countByEstado(e: string){ return this.horarios.filter(h => h.Estado === e).length; }

  // ── Filtro / paginación ──
  filterTable()   { this.currentPage = 1; }
  changePage(d: number) {
    const max = this.totalPages.length;
    this.currentPage = Math.max(1, Math.min(max, this.currentPage + d));
  }
  goPage(n: number) { this.currentPage = n; }

  // ── Cálculo automático ──
  calcularHoras() {
    const e = this.form.HoraEntrada;
    const s = this.form.HoraSalida;
    if (!e || !s) return;
    const [eh, em] = e.split(':').map(Number);
    const [sh, sm] = s.split(':').map(Number);
    const total = (sh * 60 + sm) - (eh * 60 + em);
    if (total <= 0) return;
    const totalH = total / 60;
    this.form.HorasNormales = Math.min(8, Math.floor(totalH));
    this.form.HorasExtra    = Math.max(0, Math.floor(totalH) - 8);
  }

  // ── CRUD ──
  openModal(mode: 'create' | 'edit', id?: number) {
    if (mode === 'create') {
      this.editId = null;
      const hoy = new Date().toISOString().split('T')[0];
      this.form = { Fecha: hoy, Estado: 'Pendiente', HorasNormales: 8, HorasExtra: 0 };
    } else {
      const h = this.horarios.find(x => x.IdControl === id)!;
      this.editId = h.IdControl;
      this.form = { ...h };
    }
    this.showFormModal = true;
  }

  saveHorario() {
    if (!this.form.IdEmpleado || !this.form.Fecha) {
      alert('Por favor selecciona un empleado y una fecha.');
      return;
    }
    if (this.editId) {
      const idx = this.horarios.findIndex(h => h.IdControl === this.editId);
      this.horarios[idx] = { ...this.horarios[idx], ...this.form } as ControlHorario;
    } else {
      const newId = Math.max(0, ...this.horarios.map(h => h.IdControl)) + 1;
      this.horarios = [...this.horarios, { IdControl: newId, ...this.form } as ControlHorario];
    }
    this.showFormModal = false;
  }

  aprobar(id: number) {
    const idx = this.horarios.findIndex(h => h.IdControl === id);
    if (this.horarios[idx].Estado !== 'Aprobado') {
      this.horarios[idx] = { ...this.horarios[idx], Estado: 'Aprobado' };
      this.horarios = [...this.horarios];
    }
  }

  askDelete(id: number) {
    this.deleteTargetId = id;
    this.showDeleteModal = true;
  }

  confirmDelete() {
    this.horarios = this.horarios.filter(h => h.IdControl !== this.deleteTargetId);
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