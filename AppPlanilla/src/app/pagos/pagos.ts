import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

interface Pago {
  IdPago: number;
  IdPlanilla: number;
  IdEmpleado: number;
  MontoPagado: number;
  MetodoPago: string;
  ReferenciaPago: string;
  IdUsuarioProcesa: number;
  FechaPago: string;
  Estado: number;           // tinyint(1): 1 = Completado, 0 = Pendiente
  IdFeriados: number;
  idDeduccion: number;
}

// Mapa ligero de empleados para mostrar nombre en tabla
// En un proyecto real esto vendría del servicio de empleados
interface EmpRef { nombre: string; color: string; inicial: string; }

@Component({
  selector: 'app-pagos',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './pagos.html',
  styleUrl: './pagos.css',
})
export class Pagos {
  readonly perPage = 8;
  readonly COLORS  = ['av-red', 'av-green', 'av-blue', 'av-amber', 'av-violet', 'av-teal'];

  // Referencia rápida de empleados (reemplazar con datos reales del servicio)
  readonly empMap: Record<number, EmpRef> = {
    1:  { nombre: 'María Rodríguez',   color: 'av-red',    inicial: 'MR' },
    2:  { nombre: 'Carlos Mendoza',    color: 'av-green',  inicial: 'CM' },
    3:  { nombre: 'Sofía Vargas',      color: 'av-blue',   inicial: 'SV' },
    4:  { nombre: 'Andrés Jiménez',    color: 'av-amber',  inicial: 'AJ' },
    5:  { nombre: 'Lucía Pérez',       color: 'av-violet', inicial: 'LP' },
    6:  { nombre: 'Diego Castillo',    color: 'av-teal',   inicial: 'DC' },
    7:  { nombre: 'Valeria Núñez',     color: 'av-red',    inicial: 'VN' },
    8:  { nombre: 'Felipe Aguilar',    color: 'av-green',  inicial: 'FA' },
    9:  { nombre: 'Daniela Herrera',   color: 'av-blue',   inicial: 'DH' },
    10: { nombre: 'Ricardo Soto',      color: 'av-amber',  inicial: 'RS' },
    11: { nombre: 'Camila Quesada',    color: 'av-violet', inicial: 'CQ' },
    12: { nombre: 'Pablo Araya',       color: 'av-teal',   inicial: 'PA' },
  };

  showFormModal   = false;
  showViewModal   = false;
  showDeleteModal = false;

  searchQuery  = '';
  estadoFilter = '';
  metodoFilter = '';

  currentPage = 1;

  editId: number | null = null;
  form: Partial<Pago> = {};

  viewedPago!: Pago;

  deleteTargetId: number | null = null;
  deleteDesc = '';

  pagos: Pago[] = [
    { IdPago: 1,  IdPlanilla: 1,  IdEmpleado: 1,  MontoPagado: 950000,  MetodoPago: 'Transferencia', ReferenciaPago: 'TRF-20250116-00101', IdUsuarioProcesa: 1, FechaPago: '2025-01-16T09:00:00', Estado: 1, IdFeriados: 0, idDeduccion: 2 },
    { IdPago: 2,  IdPlanilla: 1,  IdEmpleado: 2,  MontoPagado: 820000,  MetodoPago: 'Transferencia', ReferenciaPago: 'TRF-20250116-00102', IdUsuarioProcesa: 1, FechaPago: '2025-01-16T09:05:00', Estado: 1, IdFeriados: 0, idDeduccion: 0 },
    { IdPago: 3,  IdPlanilla: 1,  IdEmpleado: 3,  MontoPagado: 1100000, MetodoPago: 'SINPE',         ReferenciaPago: 'SNP-20250116-00103', IdUsuarioProcesa: 1, FechaPago: '2025-01-16T09:10:00', Estado: 1, IdFeriados: 1, idDeduccion: 1 },
    { IdPago: 4,  IdPlanilla: 2,  IdEmpleado: 4,  MontoPagado: 700000,  MetodoPago: 'Transferencia', ReferenciaPago: 'TRF-20250201-00104', IdUsuarioProcesa: 1, FechaPago: '2025-02-01T10:00:00', Estado: 1, IdFeriados: 0, idDeduccion: 0 },
    { IdPago: 5,  IdPlanilla: 2,  IdEmpleado: 5,  MontoPagado: 1050000, MetodoPago: 'Cheque',        ReferenciaPago: 'CHQ-00512',         IdUsuarioProcesa: 2, FechaPago: '2025-02-01T10:15:00', Estado: 1, IdFeriados: 0, idDeduccion: 3 },
    { IdPago: 6,  IdPlanilla: 3,  IdEmpleado: 6,  MontoPagado: 980000,  MetodoPago: 'SINPE',         ReferenciaPago: 'SNP-20250216-00106', IdUsuarioProcesa: 1, FechaPago: '2025-02-16T08:45:00', Estado: 1, IdFeriados: 0, idDeduccion: 0 },
    { IdPago: 7,  IdPlanilla: 3,  IdEmpleado: 7,  MontoPagado: 860000,  MetodoPago: 'Transferencia', ReferenciaPago: 'TRF-20250216-00107', IdUsuarioProcesa: 1, FechaPago: '2025-02-16T08:50:00', Estado: 1, IdFeriados: 0, idDeduccion: 1 },
    { IdPago: 8,  IdPlanilla: 4,  IdEmpleado: 8,  MontoPagado: 750000,  MetodoPago: 'Efectivo',      ReferenciaPago: '',                  IdUsuarioProcesa: 2, FechaPago: '2025-03-01T11:00:00', Estado: 1, IdFeriados: 0, idDeduccion: 0 },
    { IdPago: 9,  IdPlanilla: 4,  IdEmpleado: 9,  MontoPagado: 870000,  MetodoPago: 'Transferencia', ReferenciaPago: 'TRF-20250301-00109', IdUsuarioProcesa: 1, FechaPago: '2025-03-01T11:10:00', Estado: 1, IdFeriados: 0, idDeduccion: 2 },
    { IdPago: 10, IdPlanilla: 5,  IdEmpleado: 10, MontoPagado: 620000,  MetodoPago: 'SINPE',         ReferenciaPago: 'SNP-20250316-00110', IdUsuarioProcesa: 1, FechaPago: '2025-03-16T09:00:00', Estado: 1, IdFeriados: 0, idDeduccion: 0 },
    { IdPago: 11, IdPlanilla: 9,  IdEmpleado: 11, MontoPagado: 730000,  MetodoPago: 'Transferencia', ReferenciaPago: 'TRF-20250516-00111', IdUsuarioProcesa: 1, FechaPago: '2025-05-16T09:30:00', Estado: 1, IdFeriados: 1, idDeduccion: 1 },
    { IdPago: 12, IdPlanilla: 10, IdEmpleado: 12, MontoPagado: 680000,  MetodoPago: 'Cheque',        ReferenciaPago: 'CHQ-00598',         IdUsuarioProcesa: 2, FechaPago: '2025-06-01T10:00:00', Estado: 0, IdFeriados: 0, idDeduccion: 0 },
    { IdPago: 13, IdPlanilla: 10, IdEmpleado: 1,  MontoPagado: 950000,  MetodoPago: 'Transferencia', ReferenciaPago: '',                  IdUsuarioProcesa: 1, FechaPago: '2025-06-01T10:05:00', Estado: 0, IdFeriados: 0, idDeduccion: 2 },
    { IdPago: 14, IdPlanilla: 10, IdEmpleado: 3,  MontoPagado: 1100000, MetodoPago: 'SINPE',         ReferenciaPago: '',                  IdUsuarioProcesa: 1, FechaPago: '2025-06-01T10:10:00', Estado: 0, IdFeriados: 0, idDeduccion: 1 },
  ];

  // ── Computed ──
  get filteredPagos(): Pago[] {
    const q = this.searchQuery.toLowerCase();
    return this.pagos.filter(p => {
      const txt = `${p.IdPago} ${p.IdEmpleado} ${p.ReferenciaPago} ${this.empName(p.IdEmpleado)}`.toLowerCase();
      const estadoMatch = this.estadoFilter === '' || p.Estado === +this.estadoFilter;
      const metodoMatch = !this.metodoFilter || p.MetodoPago === this.metodoFilter;
      return (!q || txt.includes(q)) && estadoMatch && metodoMatch;
    });
  }

  get pageSlice(): Pago[] {
    const start = (this.currentPage - 1) * this.perPage;
    return this.filteredPagos.slice(start, start + this.perPage);
  }

  get totalPages(): number[] {
    const count = Math.ceil(this.filteredPagos.length / this.perPage) || 1;
    return Array.from({ length: count }, (_, i) => i + 1);
  }

  // ── Helpers ──
  min(a: number, b: number) { return Math.min(a, b); }

  empName(id: number) {
    return this.empMap[id]?.nombre ?? `Empleado #${id}`;
  }

  empInitial(id: number) {
    return this.empMap[id]?.inicial ?? `E${id}`;
  }

  colorFor(id: number) {
    return this.COLORS[(id - 1) % this.COLORS.length];
  }

  fmtNum(n: number) {
    return Number(n).toLocaleString('es-CR');
  }

  fmtNumShort(n: number) {
    if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + 'M';
    if (n >= 1_000)     return (n / 1_000).toFixed(0) + 'K';
    return String(n);
  }

  fmtDate(d: string) {
    if (!d) return '—';
    const dt = new Date(d);
    return dt.toLocaleDateString('es-CR', { day: '2-digit', month: '2-digit', year: 'numeric' })
      + ' ' + dt.toLocaleTimeString('es-CR', { hour: '2-digit', minute: '2-digit' });
  }

  estadoClass(e: number) {
    return e === 1 ? 'status-completado' : 'status-pendiente';
  }

  metodoClass(m: string) {
    const map: Record<string, string> = {
      'Transferencia': 'metodo-transferencia',
      'SINPE':         'metodo-sinpe',
      'Cheque':        'metodo-cheque',
      'Efectivo':      'metodo-efectivo',
    };
    return map[m] ?? '';
  }

  countByEstado(e: number) {
    return this.pagos.filter(p => p.Estado === e).length;
  }

  totalMonto() {
    return this.pagos
      .filter(p => p.Estado === 1)
      .reduce((acc, p) => acc + p.MontoPagado, 0);
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
      this.form = {
        Estado: 0,
        FechaPago: new Date().toISOString().slice(0, 16),
        IdFeriados: 0,
        idDeduccion: 0,
        IdUsuarioProcesa: 1,
      };
    } else {
      const p = this.pagos.find(x => x.IdPago === id)!;
      this.editId = p.IdPago;
      this.form = { ...p, FechaPago: p.FechaPago.slice(0, 16) };
    }
    this.showFormModal = true;
  }

  savePago() {
    if (!this.form.IdEmpleado || !this.form.MontoPagado) {
      alert('Por favor completa el empleado y el monto.');
      return;
    }
    if (this.editId) {
      const idx = this.pagos.findIndex(x => x.IdPago === this.editId);
      this.pagos[idx] = { ...this.pagos[idx], ...this.form } as Pago;
    } else {
      const newId = Math.max(0, ...this.pagos.map(x => x.IdPago)) + 1;
      this.pagos = [...this.pagos, { IdPago: newId, ...this.form } as Pago];
    }
    this.showFormModal = false;
  }

  viewPago(id: number) {
    this.viewedPago = this.pagos.find(x => x.IdPago === id)!;
    this.showViewModal = true;
  }

  askDelete(id: number) {
    const p = this.pagos.find(x => x.IdPago === id)!;
    this.deleteTargetId = id;
    this.deleteDesc = `Estás a punto de eliminar el Pago #${p.IdPago} de ${this.empName(p.IdEmpleado)} por ₡${this.fmtNum(p.MontoPagado)}. Esta acción no se puede deshacer.`;
    this.showDeleteModal = true;
  }

  confirmDelete() {
    this.pagos = this.pagos.filter(x => x.IdPago !== this.deleteTargetId);
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