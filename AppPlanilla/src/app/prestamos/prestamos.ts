import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

interface Prestamo {
  IdPrestamo: number;
  IdEmpleado: number;
  MontoTotal: number;
  Cuotas: number;
  MontoPorCuota: number;
  SaldoPendiente: number;
  FechaInicio: string;
  Estado: number;     // tinyint(1): 0 = En curso, 1 = Cancelado
  idUsuario: number;
}

interface EmpRef { nombre: string; }

@Component({
  selector: 'app-prestamos',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './prestamos.html',
  styleUrl: './prestamos.css',
})
export class Prestamos {
  readonly perPage = 8;
  readonly COLORS  = ['av-red', 'av-green', 'av-blue', 'av-amber', 'av-violet', 'av-teal'];

  // Mapa de empleados — reemplazar con datos reales del servicio
  readonly empMap: Record<number, EmpRef> = {
    1:  { nombre: 'María Rodríguez' },
    2:  { nombre: 'Carlos Mendoza' },
    3:  { nombre: 'Sofía Vargas' },
    4:  { nombre: 'Andrés Jiménez' },
    5:  { nombre: 'Lucía Pérez' },
    6:  { nombre: 'Diego Castillo' },
    7:  { nombre: 'Valeria Núñez' },
    8:  { nombre: 'Felipe Aguilar' },
    9:  { nombre: 'Daniela Herrera' },
    10: { nombre: 'Ricardo Soto' },
    11: { nombre: 'Camila Quesada' },
    12: { nombre: 'Pablo Araya' },
  };

  showFormModal   = false;
  showViewModal   = false;
  showDeleteModal = false;

  searchQuery  = '';
  estadoFilter = '';
  yearFilter   = '';

  currentPage = 1;

  editId: number | null = null;
  form: Partial<Prestamo> = {};

  viewedPrestamo!: Prestamo;

  deleteTargetId: number | null = null;
  deleteDesc = '';

  prestamos: Prestamo[] = [
    { IdPrestamo: 1,  IdEmpleado: 4,  MontoTotal: 600000,  Cuotas: 12, MontoPorCuota: 50000,  SaldoPendiente: 350000,  FechaInicio: '2024-07-01', Estado: 0, idUsuario: 1 },
    { IdPrestamo: 2,  IdEmpleado: 8,  MontoTotal: 400000,  Cuotas: 8,  MontoPorCuota: 50000,  SaldoPendiente: 100000,  FechaInicio: '2024-10-01', Estado: 0, idUsuario: 1 },
    { IdPrestamo: 3,  IdEmpleado: 12, MontoTotal: 1000000, Cuotas: 24, MontoPorCuota: 41667,  SaldoPendiente: 708334,  FechaInicio: '2024-03-15', Estado: 0, idUsuario: 2 },
    { IdPrestamo: 4,  IdEmpleado: 2,  MontoTotal: 300000,  Cuotas: 6,  MontoPorCuota: 50000,  SaldoPendiente: 0,       FechaInicio: '2024-01-01', Estado: 1, idUsuario: 1 },
    { IdPrestamo: 5,  IdEmpleado: 7,  MontoTotal: 750000,  Cuotas: 15, MontoPorCuota: 50000,  SaldoPendiente: 500000,  FechaInicio: '2024-08-01', Estado: 0, idUsuario: 2 },
    { IdPrestamo: 6,  IdEmpleado: 1,  MontoTotal: 500000,  Cuotas: 10, MontoPorCuota: 50000,  SaldoPendiente: 0,       FechaInicio: '2023-11-01', Estado: 1, idUsuario: 1 },
    { IdPrestamo: 7,  IdEmpleado: 9,  MontoTotal: 850000,  Cuotas: 17, MontoPorCuota: 50000,  SaldoPendiente: 600000,  FechaInicio: '2024-06-01', Estado: 0, idUsuario: 1 },
    { IdPrestamo: 8,  IdEmpleado: 5,  MontoTotal: 1200000, Cuotas: 24, MontoPorCuota: 50000,  SaldoPendiente: 900000,  FechaInicio: '2024-09-01', Estado: 0, idUsuario: 2 },
    { IdPrestamo: 9,  IdEmpleado: 11, MontoTotal: 200000,  Cuotas: 4,  MontoPorCuota: 50000,  SaldoPendiente: 0,       FechaInicio: '2024-02-01', Estado: 1, idUsuario: 1 },
    { IdPrestamo: 10, IdEmpleado: 3,  MontoTotal: 950000,  Cuotas: 19, MontoPorCuota: 50000,  SaldoPendiente: 650000,  FechaInicio: '2024-11-01', Estado: 0, idUsuario: 1 },
    { IdPrestamo: 11, IdEmpleado: 6,  MontoTotal: 480000,  Cuotas: 12, MontoPorCuota: 40000,  SaldoPendiente: 240000,  FechaInicio: '2025-01-01', Estado: 0, idUsuario: 2 },
    { IdPrestamo: 12, IdEmpleado: 10, MontoTotal: 660000,  Cuotas: 12, MontoPorCuota: 55000,  SaldoPendiente: 330000,  FechaInicio: '2025-02-01', Estado: 0, idUsuario: 1 },
  ];

  // ── Computed ──
  get filteredPrestamos(): Prestamo[] {
    const q = this.searchQuery.toLowerCase();
    return this.prestamos.filter(p => {
      const txt = `${p.IdPrestamo} ${this.empName(p.IdEmpleado)}`.toLowerCase();
      const estadoOk = this.estadoFilter === '' || p.Estado === +this.estadoFilter;
      const yearOk   = !this.yearFilter   || p.FechaInicio.startsWith(this.yearFilter);
      return (!q || txt.includes(q)) && estadoOk && yearOk;
    });
  }

  get pageSlice(): Prestamo[] {
    const start = (this.currentPage - 1) * this.perPage;
    return this.filteredPrestamos.slice(start, start + this.perPage);
  }

  get totalPages(): number[] {
    const count = Math.ceil(this.filteredPrestamos.length / this.perPage) || 1;
    return Array.from({ length: count }, (_, i) => i + 1);
  }

  // ── Helpers ──
  min(a: number, b: number) { return Math.min(a, b); }

  empName(id: number) { return this.empMap[id]?.nombre ?? `Empleado #${id}`; }

  empInitial(id: number) {
    const n = this.empMap[id]?.nombre;
    if (!n) return `E${id}`;
    const p = n.split(' ');
    return (p[0][0] + (p[1]?.[0] ?? '')).toUpperCase();
  }

  colorFor(id: number) { return this.COLORS[(id - 1) % this.COLORS.length]; }

  fmtNum(n: number) { return Number(n).toLocaleString('es-CR'); }

  fmtShort(n: number) {
    if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + 'M';
    if (n >= 1_000)     return (n / 1_000).toFixed(0) + 'K';
    return String(n);
  }

  fmtDateShort(d: string) {
    if (!d) return '—';
    const [y, m, day] = d.split('-');
    const meses = ['ene','feb','mar','abr','may','jun','jul','ago','sep','oct','nov','dic'];
    return `${+day} ${meses[+m - 1]} ${y}`;
  }

  estadoClass(e: number) { return e === 0 ? 'status-encurso' : 'status-cancelado'; }

  countByEstado(e: number) { return this.prestamos.filter(p => p.Estado === e).length; }

  totalSaldoPendiente() {
    return this.prestamos
      .filter(p => p.Estado === 0)
      .reduce((acc, p) => acc + p.SaldoPendiente, 0);
  }

  /** Porcentaje del monto total ya pagado (0–100) */
  porcentajePagado(p: Prestamo): number {
    if (!p.MontoTotal) return 0;
    const pagado = p.MontoTotal - p.SaldoPendiente;
    return Math.min(100, Math.round((pagado / p.MontoTotal) * 100));
  }

  /** Cuotas ya abonadas inferidas del saldo */
  cuotasPagadas(p: Prestamo): number {
    if (!p.MontoPorCuota) return 0;
    const pagado = p.MontoTotal - p.SaldoPendiente;
    return Math.round(pagado / p.MontoPorCuota);
  }

  /** Array para renderizar la cuadrícula de cuotas en el modal de detalle */
  cuotasArray(p: Prestamo): { num: number; pagada: boolean }[] {
    const pagadas = this.cuotasPagadas(p);
    return Array.from({ length: p.Cuotas }, (_, i) => ({
      num: i + 1,
      pagada: i < pagadas,
    }));
  }

  /** Top 3 préstamos activos para las progress cards */
  topPrestamos(): Prestamo[] {
    return this.prestamos
      .filter(p => p.Estado === 0)
      .sort((a, b) => b.SaldoPendiente - a.SaldoPendiente)
      .slice(0, 3);
  }

  /** Calcula la cuota estimada para preview en el formulario */
  calcMontoCuota(): number {
    if (!this.form.MontoTotal || !this.form.Cuotas || this.form.Cuotas <= 0) return 0;
    return Math.round(this.form.MontoTotal / this.form.Cuotas);
  }

  /** Autocompleta la cuota al escribir en el form */
  calcularCuota() {
    const cuota = this.calcMontoCuota();
    if (cuota > 0) {
      this.form.MontoPorCuota = cuota;
      this.form.SaldoPendiente = this.form.MontoTotal;
    }
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
        FechaInicio: new Date().toISOString().slice(0, 10),
        idUsuario: 1,
        Cuotas: undefined,
        MontoTotal: undefined,
        MontoPorCuota: undefined,
        SaldoPendiente: undefined,
      };
    } else {
      const p = this.prestamos.find(x => x.IdPrestamo === id)!;
      this.editId = p.IdPrestamo;
      this.form = { ...p };
    }
    this.showFormModal = true;
  }

  savePrestamo() {
    if (!this.form.IdEmpleado || !this.form.MontoTotal || !this.form.Cuotas) {
      alert('Por favor completa empleado, monto y número de cuotas.');
      return;
    }
    if (!this.form.MontoPorCuota) this.form.MontoPorCuota = this.calcMontoCuota();
    if (!this.form.SaldoPendiente && this.form.SaldoPendiente !== 0) {
      this.form.SaldoPendiente = this.form.MontoTotal;
    }
    if (this.editId) {
      const idx = this.prestamos.findIndex(x => x.IdPrestamo === this.editId);
      this.prestamos[idx] = { ...this.prestamos[idx], ...this.form } as Prestamo;
    } else {
      const newId = Math.max(0, ...this.prestamos.map(x => x.IdPrestamo)) + 1;
      this.prestamos = [...this.prestamos, { IdPrestamo: newId, ...this.form } as Prestamo];
    }
    this.showFormModal = false;
  }

  viewPrestamo(id: number) {
    this.viewedPrestamo = this.prestamos.find(x => x.IdPrestamo === id)!;
    this.showViewModal = true;
  }

  askDelete(id: number) {
    const p = this.prestamos.find(x => x.IdPrestamo === id)!;
    this.deleteTargetId = id;
    this.deleteDesc = `Estás a punto de eliminar el Préstamo #${p.IdPrestamo} de ${this.empName(p.IdEmpleado)} por ₡${this.fmtNum(p.MontoTotal)}. Esta acción no se puede deshacer.`;
    this.showDeleteModal = true;
  }

  confirmDelete() {
    this.prestamos = this.prestamos.filter(x => x.IdPrestamo !== this.deleteTargetId);
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