import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

interface PlanillaData {
  idPlanillas: number;
  EstadoPlanilla: string;
  idControlHorarios: number;
  FechaCreacion: string;
  idPeriodoPlanilla: number;
  descPeriodo: string;
  empleados: number;
  montoTotal: number;
}

// ── Tipos auxiliares para el detalle expandido ──
interface DetalleEmpleado {
  id: number;
  inicial: string;
  nombre: string;
  salario: number;
  ingresos: number;
  deducciones: number;
  neto: number;
}

interface IngresoExtra {
  tipo: string;
  monto: number;
  dotClass: string;
}

@Component({
  selector: 'app-planilla',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './planilla.html',
  styleUrl: './planilla.css',
})
export class Planilla {
  readonly perPage = 8;
  readonly COLORS  = ['av-red', 'av-green', 'av-blue', 'av-amber', 'av-violet', 'av-teal'];

  showFormModal   = false;
  showViewModal   = false;
  showDeleteModal = false;

  searchQuery  = '';
  statusFilter = '';
  yearFilter   = '';

  currentPage = 1;

  editId: number | null = null;
  form: Partial<PlanillaData> = {};

  viewedPlanilla!: PlanillaData;

  deleteTargetId: number | null = null;
  deleteDesc = '';

  planillas: PlanillaData[] = [
    { idPlanillas: 1,  EstadoPlanilla: 'Pagada',      idControlHorarios: 1001, FechaCreacion: '2025-01-16', idPeriodoPlanilla: 1,  descPeriodo: 'Quincena 1 — Enero 2025',    empleados: 24, montoTotal: 19250000 },
    { idPlanillas: 2,  EstadoPlanilla: 'Pagada',      idControlHorarios: 1002, FechaCreacion: '2025-02-01', idPeriodoPlanilla: 2,  descPeriodo: 'Quincena 2 — Enero 2025',    empleados: 24, montoTotal: 18980000 },
    { idPlanillas: 3,  EstadoPlanilla: 'Pagada',      idControlHorarios: 1003, FechaCreacion: '2025-02-16', idPeriodoPlanilla: 3,  descPeriodo: 'Quincena 1 — Febrero 2025',  empleados: 23, montoTotal: 18540000 },
    { idPlanillas: 4,  EstadoPlanilla: 'Pagada',      idControlHorarios: 1004, FechaCreacion: '2025-03-01', idPeriodoPlanilla: 4,  descPeriodo: 'Quincena 2 — Febrero 2025',  empleados: 23, montoTotal: 18660000 },
    { idPlanillas: 5,  EstadoPlanilla: 'Pagada',      idControlHorarios: 1005, FechaCreacion: '2025-03-16', idPeriodoPlanilla: 5,  descPeriodo: 'Quincena 1 — Marzo 2025',    empleados: 24, montoTotal: 19100000 },
    { idPlanillas: 6,  EstadoPlanilla: 'Pagada',      idControlHorarios: 1006, FechaCreacion: '2025-04-01', idPeriodoPlanilla: 6,  descPeriodo: 'Quincena 2 — Marzo 2025',    empleados: 24, montoTotal: 19250000 },
    { idPlanillas: 7,  EstadoPlanilla: 'Pagada',      idControlHorarios: 1007, FechaCreacion: '2025-04-16', idPeriodoPlanilla: 7,  descPeriodo: 'Quincena 1 — Abril 2025',    empleados: 25, montoTotal: 20010000 },
    { idPlanillas: 8,  EstadoPlanilla: 'Pagada',      idControlHorarios: 1008, FechaCreacion: '2025-05-01', idPeriodoPlanilla: 8,  descPeriodo: 'Quincena 2 — Abril 2025',    empleados: 25, montoTotal: 19870000 },
    { idPlanillas: 9,  EstadoPlanilla: 'Cerrada',     idControlHorarios: 1009, FechaCreacion: '2025-05-16', idPeriodoPlanilla: 9,  descPeriodo: 'Quincena 1 — Mayo 2025',     empleados: 25, montoTotal: 20150000 },
    { idPlanillas: 10, EstadoPlanilla: 'En revisión', idControlHorarios: 1010, FechaCreacion: '2025-06-01', idPeriodoPlanilla: 10, descPeriodo: 'Quincena 2 — Mayo 2025',     empleados: 25, montoTotal: 19980000 },
    { idPlanillas: 11, EstadoPlanilla: 'Abierta',     idControlHorarios: 1011, FechaCreacion: '2025-06-16', idPeriodoPlanilla: 11, descPeriodo: 'Quincena 1 — Junio 2025',    empleados: 25, montoTotal: 0        },
    { idPlanillas: 12, EstadoPlanilla: 'Anulada',     idControlHorarios: 999,  FechaCreacion: '2024-12-01', idPeriodoPlanilla: 0,  descPeriodo: 'Quincena 2 — Nov. 2024',     empleados: 22, montoTotal: 17200000 },
  ];

  // ── Computed originales ──
  get filteredPlanillas(): PlanillaData[] {
    const q = this.searchQuery.toLowerCase();
    return this.planillas.filter(p => {
      const txt = `${p.descPeriodo} ${p.idPlanillas} ${p.idControlHorarios}`.toLowerCase();
      return (
        (!q || txt.includes(q)) &&
        (!this.statusFilter || p.EstadoPlanilla === this.statusFilter) &&
        (!this.yearFilter   || p.FechaCreacion.startsWith(this.yearFilter))
      );
    });
  }

  get pageSlice(): PlanillaData[] {
    const start = (this.currentPage - 1) * this.perPage;
    return this.filteredPlanillas.slice(start, start + this.perPage);
  }

  get totalPages(): number[] {
    const count = Math.ceil(this.filteredPlanillas.length / this.perPage) || 1;
    return Array.from({ length: count }, (_, i) => i + 1);
  }

  // ── Helpers originales ──
  min(a: number, b: number) { return Math.min(a, b); }

  fmtDate(d: string) {
    if (!d) return '—';
    const [y, m, day] = d.split('-');
    return `${day}/${m}/${y}`;
  }

  fmtNum(n: number) {
    return Number(n).toLocaleString('es-CR');
  }

  statusClass(s: string) {
    if (s === 'Abierta')     return 'status-abierta';
    if (s === 'En revisión') return 'status-revision';
    if (s === 'Cerrada')     return 'status-cerrada';
    if (s === 'Pagada')      return 'status-pagada';
    if (s === 'Anulada')     return 'status-anulada';
    return '';
  }

  countByStatus(s: string) {
    return this.planillas.filter(p => p.EstadoPlanilla === s).length;
  }

  colorFor(id: number) {
    return this.COLORS[(id - 1) % this.COLORS.length];
  }

  // ── Filtro / paginación originales ──
  filterTable()   { this.currentPage = 1; }
  changePage(d: number) {
    const max = this.totalPages.length;
    this.currentPage = Math.max(1, Math.min(max, this.currentPage + d));
  }
  goPage(n: number) { this.currentPage = n; }

  // ── CRUD original ──
  openModal(mode: 'create' | 'edit', id?: number) {
    if (mode === 'create') {
      this.editId = null;
      this.form = {
        EstadoPlanilla: 'Abierta',
        FechaCreacion: new Date().toISOString().slice(0, 10),
      };
    } else {
      const p = this.planillas.find(x => x.idPlanillas === id)!;
      this.editId = p.idPlanillas;
      this.form = { ...p };
    }
    this.showFormModal = true;
  }

  savePlanilla() {
    if (!this.form.descPeriodo?.trim()) {
      alert('Por favor ingresa la descripción del período.');
      return;
    }
    if (this.editId) {
      const idx = this.planillas.findIndex(x => x.idPlanillas === this.editId);
      this.planillas[idx] = { ...this.planillas[idx], ...this.form } as PlanillaData;
    } else {
      const newId = Math.max(0, ...this.planillas.map(x => x.idPlanillas)) + 1;
      this.planillas = [...this.planillas, { idPlanillas: newId, ...this.form } as PlanillaData];
    }
    this.showFormModal = false;
  }

  viewPlanilla(id: number) {
    this.viewedPlanilla = this.planillas.find(x => x.idPlanillas === id)!;
    this.showViewModal = true;
  }

  askDelete(id: number) {
    const p = this.planillas.find(x => x.idPlanillas === id)!;
    this.deleteTargetId = id;
    this.deleteDesc = `Estás a punto de eliminar la Planilla #${p.idPlanillas} (${p.descPeriodo}). Esta acción no se puede deshacer.`;
    this.showDeleteModal = true;
  }

  confirmDelete() {
    this.planillas = this.planillas.filter(x => x.idPlanillas !== this.deleteTargetId);
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

  // ════════════════════════════════════════════════
  // NUEVOS MÉTODOS — MODAL DETALLE EXPANDIDO
  // ════════════════════════════════════════════════

  /**
   * Bloque 3 — Período de planilla.
   * Deduce inicio, fin, días y fecha de pago a partir de la descripción.
   * En producción esto vendría de la tabla periodoPlanilla de la BD.
   */
  periodoDetalle(p: PlanillaData): { inicio: string; fin: string; dias: number; fechaPago: string } {
    const [y, m] = p.FechaCreacion.split('-').map(Number);
    const esQ1   = p.descPeriodo.toLowerCase().includes('quincena 1');
    const inicio = esQ1
      ? `01/${String(m).padStart(2,'0')}/${y}`
      : `16/${String(m).padStart(2,'0')}/${y}`;
    const fin = esQ1
      ? `15/${String(m).padStart(2,'0')}/${y}`
      : `${new Date(y, m, 0).getDate()}/${String(m).padStart(2,'0')}/${y}`;
    const fechaPago = esQ1
      ? `18/${String(m).padStart(2,'0')}/${y}`
      : `03/${String(m < 12 ? m + 1 : 1).padStart(2,'0')}/${m < 12 ? y : y + 1}`;
    return { inicio, fin, dias: esQ1 ? 11 : 10, fechaPago };
  }

  /**
   * Bloque 4 — Detalle por empleado.
   * Genera filas representativas a partir del monto total de la planilla.
   * En producción esto vendría de la tabla detallePlanilla de la BD.
   */
  detalleEmpleados(p: PlanillaData): DetalleEmpleado[] {
    if (!p.empleados || !p.montoTotal) return [];

    // Datos de muestra derivados del monto total
    const mockEmpleados = [
      { id: 1,  nombre: 'María Rodríguez',  salario: 950000  },
      { id: 2,  nombre: 'Carlos Mendoza',   salario: 820000  },
      { id: 3,  nombre: 'Sofía Vargas',     salario: 1100000 },
      { id: 4,  nombre: 'Andrés Jiménez',   salario: 700000  },
      { id: 5,  nombre: 'Lucía Pérez',      salario: 1050000 },
      { id: 6,  nombre: 'Diego Castillo',   salario: 980000  },
    ];

    // Muestra hasta 6 filas o el total de empleados de la planilla
    const cantidad = Math.min(p.empleados, mockEmpleados.length);
    return mockEmpleados.slice(0, cantidad).map(e => {
      const ingresos   = Math.round(e.salario * 0.04);  // ~4% extras
      const deducciones = Math.round(e.salario * 0.095); // ~9.5% CCSS + renta
      return {
        id: e.id,
        inicial: (e.nombre.split(' ')[0][0] + e.nombre.split(' ')[1][0]).toUpperCase(),
        nombre: e.nombre,
        salario: e.salario,
        ingresos,
        deducciones,
        neto: e.salario + ingresos - deducciones,
      };
    });
  }

  /**
   * Totales de la tabla detalle por empleado.
   */
  totalesDetalle(p: PlanillaData): { salarios: number; ingresos: number; deducciones: number; neto: number } {
    const rows = this.detalleEmpleados(p);
    return rows.reduce(
      (acc, e) => ({
        salarios:    acc.salarios    + e.salario,
        ingresos:    acc.ingresos    + e.ingresos,
        deducciones: acc.deducciones + e.deducciones,
        neto:        acc.neto        + e.neto,
      }),
      { salarios: 0, ingresos: 0, deducciones: 0, neto: 0 }
    );
  }

  /**
   * Bloque 5 — Ingresos extra.
   * En producción esto vendría de la tabla tipoIngresos / ingresosPlanilla de la BD.
   */
  ingresosExtra(p: PlanillaData): IngresoExtra[] {
    if (!p.montoTotal) return [];
    const base = p.montoTotal;
    return [
      { tipo: 'Bonos',        monto: Math.round(base * 0.006), dotClass: 'dot-red'    },
      { tipo: 'Horas extra',  monto: Math.round(base * 0.004), dotClass: 'dot-amber'  },
      { tipo: 'Horas dobles', monto: Math.round(base * 0.002), dotClass: 'dot-blue'   },
      { tipo: 'Comisiones',   monto: Math.round(base * 0.003), dotClass: 'dot-green'  },
      { tipo: 'Viáticos',     monto: Math.round(base * 0.001), dotClass: 'dot-violet' },
    ].filter(i => i.monto > 0);
  }

  /**
   * Suma total de los ingresos extra.
   */
  totalIngresosExtra(p: PlanillaData): number {
    return this.ingresosExtra(p).reduce((acc, i) => acc + i.monto, 0);
  }
}