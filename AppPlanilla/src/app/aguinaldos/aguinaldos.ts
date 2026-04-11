import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

interface Aguinaldo {
  IdAguinaldo: number;
  IdEmpleado: number;
  Periodo: number;
  MontoCalculado: number;
  FechaPago: string;
  Estado: number;
  idUsuario: number;
}

interface PeriodoResumen {
  year: number;
  total: number;
  pagados: number;
  monto: number;
}

interface EmpRef { nombre: string; }

@Component({
  selector: 'app-aguinaldos',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './aguinaldos.html',
  styleUrl: './aguinaldos.css',
})
export class Aguinaldos {
  readonly perPage = 8;
  readonly COLORS  = ['av-red', 'av-green', 'av-blue', 'av-amber', 'av-violet', 'av-teal'];

  // ── Mapas de referencia (reemplazar con servicios reales en producción) ──

  readonly empMap: Record<number, EmpRef> = {
    1:  { nombre: 'María Rodríguez'   },
    2:  { nombre: 'Carlos Mendoza'    },
    3:  { nombre: 'Sofía Vargas'      },
    4:  { nombre: 'Andrés Jiménez'    },
    5:  { nombre: 'Lucía Pérez'       },
    6:  { nombre: 'Diego Castillo'    },
    7:  { nombre: 'Valeria Núñez'     },
    8:  { nombre: 'Felipe Aguilar'    },
    9:  { nombre: 'Daniela Herrera'   },
    10: { nombre: 'Ricardo Soto'      },
    11: { nombre: 'Camila Quesada'    },
    12: { nombre: 'Pablo Araya'       },
    13: { nombre: 'Natalia Mora'      },
    14: { nombre: 'Sebastián Ugalde'  },
    15: { nombre: 'Adriana Blanco'    },
  };

  // Detalle extendido del empleado para el bloque hijo
  readonly empDetalleMap: Record<number, { puesto: string; departamento: string; cedula: string }> = {
    1:  { puesto: 'Desarrolladora Senior',    departamento: 'TI',          cedula: '1-0234-5678' },
    2:  { puesto: 'Analista Financiero',      departamento: 'Finanzas',    cedula: '2-0987-6543' },
    3:  { puesto: 'Gerente de Ventas',        departamento: 'Ventas',      cedula: '3-1234-7890' },
    4:  { puesto: 'Reclutador',               departamento: 'RRHH',        cedula: '1-0543-2109' },
    5:  { puesto: 'Jefa de Operaciones',      departamento: 'Operaciones', cedula: '4-0321-8765' },
    6:  { puesto: 'DevOps Engineer',          departamento: 'TI',          cedula: '2-1098-3456' },
    7:  { puesto: 'Contadora',                departamento: 'Finanzas',    cedula: '5-0765-4321' },
    8:  { puesto: 'Asesor Comercial',         departamento: 'Ventas',      cedula: '3-0432-9876' },
    9:  { puesto: 'Diseñadora UX',            departamento: 'TI',          cedula: '1-0876-5432' },
    10: { puesto: 'Auxiliar Contable',        departamento: 'Finanzas',    cedula: '2-0543-1098' },
    11: { puesto: 'Analista de RRHH',         departamento: 'RRHH',        cedula: '4-0987-6543' },
    12: { puesto: 'Técnico de Soporte',       departamento: 'TI',          cedula: '3-0654-3219' },
    13: { puesto: 'Supervisora',              departamento: 'Operaciones', cedula: '5-0321-7654' },
    14: { puesto: 'Programador Jr.',          departamento: 'TI',          cedula: '1-0789-4567' },
    15: { puesto: 'Vendedora',                departamento: 'Ventas',      cedula: '2-0234-8901' },
  };

  readonly usuarioMap: Record<number, { nombre: string; rol: string }> = {
    1: { nombre: 'María Rodríguez', rol: 'Administrador' },
    2: { nombre: 'Carlos Mendoza',  rol: 'RRHH'          },
  };

  showFormModal   = false;
  showViewModal   = false;
  showDeleteModal = false;

  searchQuery   = '';
  estadoFilter  = '';
  periodoFilter = '';
  periodoActivo = 2025;

  currentPage = 1;

  editId: number | null = null;
  form: Partial<Aguinaldo> = {};

  viewedAguinaldo!: Aguinaldo;

  deleteTargetId: number | null = null;
  deleteDesc = '';

  aguinaldos: Aguinaldo[] = [
    // ── 2025 ──
    { IdAguinaldo: 1,  IdEmpleado: 1,  Periodo: 2025, MontoCalculado: 950000,  FechaPago: '2025-12-15', Estado: 0, idUsuario: 1 },
    { IdAguinaldo: 2,  IdEmpleado: 2,  Periodo: 2025, MontoCalculado: 820000,  FechaPago: '2025-12-15', Estado: 0, idUsuario: 1 },
    { IdAguinaldo: 3,  IdEmpleado: 3,  Periodo: 2025, MontoCalculado: 1100000, FechaPago: '2025-12-15', Estado: 0, idUsuario: 1 },
    { IdAguinaldo: 4,  IdEmpleado: 4,  Periodo: 2025, MontoCalculado: 700000,  FechaPago: '2025-12-15', Estado: 0, idUsuario: 1 },
    { IdAguinaldo: 5,  IdEmpleado: 5,  Periodo: 2025, MontoCalculado: 1050000, FechaPago: '2025-12-15', Estado: 0, idUsuario: 1 },
    { IdAguinaldo: 6,  IdEmpleado: 6,  Periodo: 2025, MontoCalculado: 980000,  FechaPago: '2025-12-15', Estado: 0, idUsuario: 1 },
    { IdAguinaldo: 7,  IdEmpleado: 7,  Periodo: 2025, MontoCalculado: 860000,  FechaPago: '2025-12-15', Estado: 0, idUsuario: 1 },
    { IdAguinaldo: 8,  IdEmpleado: 8,  Periodo: 2025, MontoCalculado: 750000,  FechaPago: '2025-12-15', Estado: 0, idUsuario: 1 },
    // ── 2024 ──
    { IdAguinaldo: 9,  IdEmpleado: 1,  Periodo: 2024, MontoCalculado: 912500,  FechaPago: '2024-12-14', Estado: 1, idUsuario: 1 },
    { IdAguinaldo: 10, IdEmpleado: 2,  Periodo: 2024, MontoCalculado: 795000,  FechaPago: '2024-12-14', Estado: 1, idUsuario: 1 },
    { IdAguinaldo: 11, IdEmpleado: 3,  Periodo: 2024, MontoCalculado: 1058333, FechaPago: '2024-12-14', Estado: 1, idUsuario: 2 },
    { IdAguinaldo: 12, IdEmpleado: 4,  Periodo: 2024, MontoCalculado: 672917,  FechaPago: '2024-12-14', Estado: 1, idUsuario: 2 },
    { IdAguinaldo: 13, IdEmpleado: 5,  Periodo: 2024, MontoCalculado: 1012500, FechaPago: '2024-12-14', Estado: 1, idUsuario: 1 },
    { IdAguinaldo: 14, IdEmpleado: 6,  Periodo: 2024, MontoCalculado: 943750,  FechaPago: '2024-12-14', Estado: 1, idUsuario: 1 },
    { IdAguinaldo: 15, IdEmpleado: 9,  Periodo: 2024, MontoCalculado: 837500,  FechaPago: '2024-12-14', Estado: 1, idUsuario: 1 },
    { IdAguinaldo: 16, IdEmpleado: 10, Periodo: 2024, MontoCalculado: 598750,  FechaPago: '2024-12-14', Estado: 1, idUsuario: 2 },
    // ── 2023 ──
    { IdAguinaldo: 17, IdEmpleado: 1,  Periodo: 2023, MontoCalculado: 875000,  FechaPago: '2023-12-12', Estado: 1, idUsuario: 1 },
    { IdAguinaldo: 18, IdEmpleado: 2,  Periodo: 2023, MontoCalculado: 762500,  FechaPago: '2023-12-12', Estado: 1, idUsuario: 1 },
    { IdAguinaldo: 19, IdEmpleado: 3,  Periodo: 2023, MontoCalculado: 1020833, FechaPago: '2023-12-12', Estado: 1, idUsuario: 1 },
    { IdAguinaldo: 20, IdEmpleado: 5,  Periodo: 2023, MontoCalculado: 975000,  FechaPago: '2023-12-12', Estado: 1, idUsuario: 1 },
  ];

  // ── Computed ──
  get filteredAguinaldos(): Aguinaldo[] {
    const q = this.searchQuery.toLowerCase();
    return this.aguinaldos.filter(a => {
      const txt = `${a.IdAguinaldo} ${this.empName(a.IdEmpleado)} ${a.Periodo}`.toLowerCase();
      const estadoOk  = this.estadoFilter  === '' || a.Estado === +this.estadoFilter;
      const periodoOk = !this.periodoFilter || a.Periodo === +this.periodoFilter;
      return (!q || txt.includes(q)) && estadoOk && periodoOk;
    });
  }

  get pageSlice(): Aguinaldo[] {
    const start = (this.currentPage - 1) * this.perPage;
    return this.filteredAguinaldos.slice(start, start + this.perPage);
  }

  get totalPages(): number[] {
    const count = Math.ceil(this.filteredAguinaldos.length / this.perPage) || 1;
    return Array.from({ length: count }, (_, i) => i + 1);
  }

  // ── Helpers originales ──
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

  fmtDate(d: string) {
    if (!d) return '—';
    const [y, m, day] = d.split('-');
    const meses = ['ene','feb','mar','abr','may','jun','jul','ago','sep','oct','nov','dic'];
    return `${+day} ${meses[+m - 1]} ${y}`;
  }

  estadoClass(e: number) { return e === 1 ? 'status-pagado' : 'status-pendiente'; }

  countByEstado(e: number) { return this.aguinaldos.filter(a => a.Estado === e).length; }

  totalMontoPagado() {
    return this.aguinaldos.filter(a => a.Estado === 1).reduce((acc, a) => acc + a.MontoCalculado, 0);
  }

  periodos(): PeriodoResumen[] {
    const map = new Map<number, PeriodoResumen>();
    for (const a of this.aguinaldos) {
      if (!map.has(a.Periodo)) map.set(a.Periodo, { year: a.Periodo, total: 0, pagados: 0, monto: 0 });
      const r = map.get(a.Periodo)!;
      r.total++;
      r.monto += a.MontoCalculado;
      if (a.Estado === 1) r.pagados++;
    }
    return Array.from(map.values()).sort((a, b) => b.year - a.year);
  }

  setPeriodo(year: number) {
    this.periodoActivo = year;
    this.periodoFilter = String(year);
    this.filterTable();
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
      this.form = { Estado: 0, Periodo: new Date().getFullYear(), FechaPago: '', idUsuario: 1 };
    } else {
      const a = this.aguinaldos.find(x => x.IdAguinaldo === id)!;
      this.editId = a.IdAguinaldo;
      this.form = { ...a };
    }
    this.showFormModal = true;
  }

  saveAguinaldo() {
    if (!this.form.IdEmpleado || !this.form.MontoCalculado || !this.form.Periodo) {
      alert('Por favor completa empleado, período y monto.');
      return;
    }
    if (this.editId) {
      const idx = this.aguinaldos.findIndex(x => x.IdAguinaldo === this.editId);
      this.aguinaldos[idx] = { ...this.aguinaldos[idx], ...this.form } as Aguinaldo;
    } else {
      const newId = Math.max(0, ...this.aguinaldos.map(x => x.IdAguinaldo)) + 1;
      this.aguinaldos = [...this.aguinaldos, { IdAguinaldo: newId, ...this.form } as Aguinaldo];
    }
    this.showFormModal = false;
  }

  viewAguinaldo(id: number) {
    this.viewedAguinaldo = this.aguinaldos.find(x => x.IdAguinaldo === id)!;
    this.showViewModal = true;
  }

  askDelete(id: number) {
    const a = this.aguinaldos.find(x => x.IdAguinaldo === id)!;
    this.deleteTargetId = id;
    this.deleteDesc = `Estás a punto de eliminar el aguinaldo de ${this.empName(a.IdEmpleado)} del período ${a.Periodo} por ₡${this.fmtNum(a.MontoCalculado)}. Esta acción no se puede deshacer.`;
    this.showDeleteModal = true;
  }

  confirmDelete() {
    this.aguinaldos = this.aguinaldos.filter(x => x.IdAguinaldo !== this.deleteTargetId);
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
  // NUEVOS MÉTODOS — BLOQUES HIJO DEL DETALLE
  // ════════════════════════════════════════════════

  /**
   * Bloque 2 — Empleado relacionado.
   * Devuelve puesto, departamento y cédula para la tarjeta hijo.
   * En producción esto viene del servicio de empleados.
   */
  empDetalle(id: number): { puesto: string; departamento: string; cedula: string } {
    return this.empDetalleMap[id] ?? { puesto: '—', departamento: '—', cedula: '—' };
  }

  /**
   * Bloque 3 — Usuario responsable.
   * Nombre, rol e inicial para el avatar.
   */
  usuarioNombre(id: number): string { return this.usuarioMap[id]?.nombre ?? `Usuario #${id}`; }
  usuarioRol(id: number):    string { return this.usuarioMap[id]?.rol    ?? '—'; }
  usuarioInitial(id: number): string {
    const n = this.usuarioMap[id]?.nombre;
    if (!n) return `U${id}`;
    const p = n.split(' ');
    return (p[0][0] + (p[1]?.[0] ?? '')).toUpperCase();
  }
}