import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

interface Contrato {
  IdContrato: number;
  IdEmpleado: number;
  TipoContrato: string;
  FechaInicio: string;
  FechaFin: string;
  SalarioPactado: number;
  Estado: string;
  usuarioId?: number;
}

interface Empleado { id: number; nombre: string; }
interface Usuario  { id: number; nombre: string; }

@Component({
  selector: 'app-contratos',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './contratos.html',
  styleUrl: './contratos.css',
})
export class Contratos {
  readonly COLORS = ['av-red', 'av-green', 'av-blue', 'av-amber', 'av-violet', 'av-teal'];
  readonly perPage = 8;

  showFormModal   = false;
  showViewModal   = false;
  showDeleteModal = false;

  searchQuery  = '';
  tipoFiltro   = '';
  estadoFiltro = '';
  currentPage  = 1;

  editId: number | null = null;
  form: Partial<Contrato> = {};
  viewedContrato!: Contrato;
  deleteTargetId: number | null = null;

  empleados: Empleado[] = [
    { id: 1,  nombre: 'María Rodríguez López'    },
    { id: 2,  nombre: 'Carlos Mendoza Torres'    },
    { id: 3,  nombre: 'Sofía Vargas Chaves'      },
    { id: 4,  nombre: 'Andrés Jiménez Mora'      },
    { id: 5,  nombre: 'Lucía Pérez Solís'        },
    { id: 6,  nombre: 'Diego Castillo Brenes'    },
    { id: 7,  nombre: 'Valeria Núñez Ulate'      },
    { id: 8,  nombre: 'Felipe Aguilar Rojas'     },
    { id: 9,  nombre: 'Daniela Herrera Campos'   },
    { id: 10, nombre: 'Ricardo Soto Fallas'      },
    { id: 11, nombre: 'Camila Quesada León'      },
    { id: 12, nombre: 'Pablo Araya Badilla'      },
  ];

  usuarios: Usuario[] = [
    { id: 1, nombre: 'Admin RH'      },
    { id: 2, nombre: 'Supervisor TI' },
    { id: 3, nombre: 'Gerente RRHH'  },
  ];

  contratos: Contrato[] = [
    { IdContrato: 1,  IdEmpleado: 1,  TipoContrato: 'Indefinido', FechaInicio: '2021-03-15', FechaFin: '',           SalarioPactado: 950000,  Estado: 'Activo',    usuarioId: 1 },
    { IdContrato: 2,  IdEmpleado: 2,  TipoContrato: 'Indefinido', FechaInicio: '2019-07-01', FechaFin: '',           SalarioPactado: 820000,  Estado: 'Activo',    usuarioId: 1 },
    { IdContrato: 3,  IdEmpleado: 3,  TipoContrato: 'Temporal',   FechaInicio: '2026-01-10', FechaFin: '2026-06-10', SalarioPactado: 1100000, Estado: 'Activo',    usuarioId: 1 },
    { IdContrato: 4,  IdEmpleado: 4,  TipoContrato: 'Indefinido', FechaInicio: '2022-06-20', FechaFin: '',           SalarioPactado: 700000,  Estado: 'Activo',    usuarioId: 3 },
    { IdContrato: 5,  IdEmpleado: 5,  TipoContrato: 'Indefinido', FechaInicio: '2017-09-05', FechaFin: '',           SalarioPactado: 1050000, Estado: 'Activo',    usuarioId: 1 },
    { IdContrato: 6,  IdEmpleado: 6,  TipoContrato: 'Indefinido', FechaInicio: '2020-11-12', FechaFin: '',           SalarioPactado: 980000,  Estado: 'Activo',    usuarioId: 2 },
    { IdContrato: 7,  IdEmpleado: 7,  TipoContrato: 'Temporal',   FechaInicio: '2026-01-25', FechaFin: '2026-04-10', SalarioPactado: 860000,  Estado: 'Activo',    usuarioId: 1 },
    { IdContrato: 8,  IdEmpleado: 8,  TipoContrato: 'Prueba',     FechaInicio: '2026-02-01', FechaFin: '2026-04-30', SalarioPactado: 750000,  Estado: 'Activo',    usuarioId: 1 },
    { IdContrato: 9,  IdEmpleado: 9,  TipoContrato: 'Indefinido', FechaInicio: '2022-08-14', FechaFin: '',           SalarioPactado: 870000,  Estado: 'Activo',    usuarioId: 2 },
    { IdContrato: 10, IdEmpleado: 10, TipoContrato: 'Temporal',   FechaInicio: '2023-07-10', FechaFin: '2024-07-10', SalarioPactado: 620000,  Estado: 'Vencido',   usuarioId: 1 },
    { IdContrato: 11, IdEmpleado: 11, TipoContrato: 'Indefinido', FechaInicio: '2021-10-03', FechaFin: '',           SalarioPactado: 730000,  Estado: 'Activo',    usuarioId: 3 },
    { IdContrato: 12, IdEmpleado: 12, TipoContrato: 'Por obra',   FechaInicio: '2025-06-01', FechaFin: '2025-12-31', SalarioPactado: 680000,  Estado: 'Vencido',   usuarioId: 2 },
    { IdContrato: 13, IdEmpleado: 1,  TipoContrato: 'Indefinido', FechaInicio: '2018-01-01', FechaFin: '2021-03-14', SalarioPactado: 750000,  Estado: 'Cancelado', usuarioId: 1 },
  ];

  // ── Computed ──
  get filteredContratos(): Contrato[] {
    const q = this.searchQuery.toLowerCase();
    return this.contratos.filter(c => {
      const nombre = this.getNombreEmpleado(c.IdEmpleado).toLowerCase();
      return (
        (!q || nombre.includes(q) || c.TipoContrato.toLowerCase().includes(q)) &&
        (!this.tipoFiltro   || c.TipoContrato === this.tipoFiltro) &&
        (!this.estadoFiltro || c.Estado === this.estadoFiltro)
      );
    });
  }

  get pageSlice(): Contrato[] {
    const start = (this.currentPage - 1) * this.perPage;
    return this.filteredContratos.slice(start, start + this.perPage);
  }

  get totalPages(): number[] {
    const count = Math.ceil(this.filteredContratos.length / this.perPage) || 1;
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

  fmtSalary(n: number) {
    return '₡' + Number(n).toLocaleString('es-CR');
  }

  getDuracion(inicio: string, fin: string): string {
    if (!inicio) return '—';
    const d1 = new Date(inicio);
    const d2 = fin ? new Date(fin) : new Date();
    const meses = (d2.getFullYear() - d1.getFullYear()) * 12 + (d2.getMonth() - d1.getMonth());
    if (meses < 1)  return 'Menos de 1 mes';
    if (meses < 12) return `${meses} mes${meses > 1 ? 'es' : ''}`;
    const años = Math.floor(meses / 12);
    const resto = meses % 12;
    return resto > 0 ? `${años} año${años > 1 ? 's' : ''} y ${resto} mes${resto > 1 ? 'es' : ''}` : `${años} año${años > 1 ? 's' : ''}`;
  }

  estadoClass(s: string) {
    if (s === 'Activo')    return 'status-active';
    if (s === 'Vencido')   return 'status-tardanza';
    return 'status-inactive';
  }

  tipoClass(t: string) {
    if (t === 'Indefinido') return 'indefinido';
    if (t === 'Temporal')   return 'temporal';
    if (t === 'Por obra')   return 'obra';
    return 'prueba';
  }

  fechaFinClass(fecha: string): string {
    const hoy = new Date();
    const fin = new Date(fecha);
    const diff = (fin.getTime() - hoy.getTime()) / (1000 * 60 * 60 * 24);
    if (diff < 0)  return 'fecha-vencida';
    if (diff < 30) return 'fecha-pronto';
    return 'fecha-normal';
  }

  countByEstado(e: string) { return this.contratos.filter(c => c.Estado === e).length; }

  getProximosVencer(): number {
    const hoy = new Date();
    return this.contratos.filter(c => {
      if (!c.FechaFin || c.Estado !== 'Activo') return false;
      const fin = new Date(c.FechaFin);
      const diff = (fin.getTime() - hoy.getTime()) / (1000 * 60 * 60 * 24);
      return diff >= 0 && diff <= 30;
    }).length;
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
      const hoy = new Date().toISOString().split('T')[0];
      this.form = { FechaInicio: hoy, Estado: 'Activo', TipoContrato: 'Indefinido' };
    } else {
      const c = this.contratos.find(x => x.IdContrato === id)!;
      this.editId = c.IdContrato;
      this.form = { ...c };
    }
    this.showViewModal  = false;
    this.showFormModal  = true;
  }

  saveContrato() {
    if (!this.form.IdEmpleado || !this.form.TipoContrato || !this.form.FechaInicio) {
      alert('Por favor completa los campos obligatorios.');
      return;
    }
    if (this.editId) {
      const idx = this.contratos.findIndex(c => c.IdContrato === this.editId);
      this.contratos[idx] = { ...this.contratos[idx], ...this.form } as Contrato;
    } else {
      const newId = Math.max(0, ...this.contratos.map(c => c.IdContrato)) + 1;
      this.contratos = [...this.contratos, { IdContrato: newId, ...this.form } as Contrato];
    }
    this.showFormModal = false;
  }

  viewContrato(id: number) {
    this.viewedContrato = this.contratos.find(c => c.IdContrato === id)!;
    this.showViewModal  = true;
  }

  editFromView() {
    this.showViewModal = false;
    this.openModal('edit', this.viewedContrato.IdContrato);
  }

  askDelete(id: number) {
    this.deleteTargetId = id;
    this.showDeleteModal = true;
  }

  confirmDelete() {
    this.contratos = this.contratos.filter(c => c.IdContrato !== this.deleteTargetId);
    this.deleteTargetId = null;
    this.showDeleteModal = false;
  }

  onOverlayClick(event: MouseEvent, modal: 'form' | 'view' | 'delete') {
    if (event.target === event.currentTarget) {
      if (modal === 'form')   this.showFormModal   = false;
      if (modal === 'view')   this.showViewModal   = false;
      if (modal === 'delete') this.showDeleteModal = false;
    }
  }
}