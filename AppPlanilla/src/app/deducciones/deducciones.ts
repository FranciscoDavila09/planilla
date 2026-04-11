import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

interface Deduccion {
  idDeducciones: number;
  Nombre: string;
  Monto: number;
  Impuestos: number;
  Estado: number;
  idEmpleado: number;
  usuariosId: number;
  idPrestamo: number | null;
}

interface EmpRef { nombre: string; }

@Component({
  selector: 'app-deducciones',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './deducciones.html',
  styleUrl: './deducciones.css',
})
export class Deducciones {
  readonly perPage = 8;
  readonly COLORS  = ['av-red', 'av-green', 'av-blue', 'av-amber', 'av-violet', 'av-teal'];

  // ── Mapas de referencia (reemplazar con servicios reales en producción) ──

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

  // Detalle extendido del empleado para el bloque hijo
  readonly empDetalleMap: Record<number, { puesto: string; departamento: string; cedula: string }> = {
    1:  { puesto: 'Desarrolladora Senior',  departamento: 'TI',          cedula: '1-0234-5678' },
    2:  { puesto: 'Analista Financiero',    departamento: 'Finanzas',    cedula: '2-0987-6543' },
    3:  { puesto: 'Gerente de Ventas',      departamento: 'Ventas',      cedula: '3-1234-7890' },
    4:  { puesto: 'Reclutador',             departamento: 'RRHH',        cedula: '1-0543-2109' },
    5:  { puesto: 'Jefa de Operaciones',    departamento: 'Operaciones', cedula: '4-0321-8765' },
    6:  { puesto: 'DevOps Engineer',        departamento: 'TI',          cedula: '2-1098-3456' },
    7:  { puesto: 'Contadora',              departamento: 'Finanzas',    cedula: '5-0765-4321' },
    8:  { puesto: 'Asesor Comercial',       departamento: 'Ventas',      cedula: '3-0432-9876' },
    9:  { puesto: 'Diseñadora UX',          departamento: 'TI',          cedula: '1-0876-5432' },
    10: { puesto: 'Auxiliar Contable',      departamento: 'Finanzas',    cedula: '2-0543-1098' },
    11: { puesto: 'Analista de RRHH',       departamento: 'RRHH',        cedula: '4-0987-6543' },
    12: { puesto: 'Técnico de Soporte',     departamento: 'TI',          cedula: '3-0654-3219' },
  };

  // Mapa de préstamos relacionados — reemplazar con servicio real
  readonly prestamoMap: Record<number, {
    desc: string; montoTotal: number; saldo: number; cuota: number;
  }> = {
    7:  { desc: 'Préstamo personal',  montoTotal: 600000,  saldo: 350000, cuota: 50000 },
    12: { desc: 'Préstamo vehículo',  montoTotal: 1000000, saldo: 708334, cuota: 41667 },
    15: { desc: 'Préstamo personal',  montoTotal: 300000,  saldo: 100000, cuota: 50000 },
  };

  readonly usuarioMap: Record<number, { nombre: string; rol: string }> = {
    1: { nombre: 'María Rodríguez', rol: 'Administrador' },
    2: { nombre: 'Carlos Mendoza',  rol: 'RRHH'          },
  };

  private readonly TIPO_KEYWORDS: { key: string; label: string; color: string }[] = [
    { key: 'ccss',     label: 'Seguro Social',     color: 'dot-red'    },
    { key: 'renta',    label: 'Impuesto de renta', color: 'dot-amber'  },
    { key: 'prést',    label: 'Préstamo',          color: 'dot-blue'   },
    { key: 'prestamo', label: 'Préstamo',          color: 'dot-blue'   },
    { key: 'embargo',  label: 'Embargo',           color: 'dot-violet' },
    { key: 'ins',      label: 'INS / Seguro',      color: 'dot-green'  },
    { key: 'sinpe',    label: 'SINPE',             color: 'dot-green'  },
    { key: 'asociac',  label: 'Asociación',        color: 'dot-green'  },
  ];

  showFormModal   = false;
  showViewModal   = false;
  showDeleteModal = false;

  searchQuery  = '';
  estadoFilter = '';
  tipoFilter   = '';

  currentPage = 1;

  editId: number | null = null;
  form: Partial<Deduccion> = {};

  viewedDeduccion!: Deduccion;

  deleteTargetId: number | null = null;
  deleteDesc = '';

  deducciones: Deduccion[] = [
    { idDeducciones: 1,  Nombre: 'CCSS Obrero',            Monto: 95000,  Impuestos: 0,     Estado: 1, idEmpleado: 1,  usuariosId: 1, idPrestamo: null },
    { idDeducciones: 2,  Nombre: 'CCSS Obrero',            Monto: 82000,  Impuestos: 0,     Estado: 1, idEmpleado: 2,  usuariosId: 1, idPrestamo: null },
    { idDeducciones: 3,  Nombre: 'Renta mensual',          Monto: 154000, Impuestos: 28000, Estado: 1, idEmpleado: 3,  usuariosId: 1, idPrestamo: null },
    { idDeducciones: 4,  Nombre: 'Préstamo personal',      Monto: 70000,  Impuestos: 0,     Estado: 1, idEmpleado: 4,  usuariosId: 2, idPrestamo: 7   },
    { idDeducciones: 5,  Nombre: 'Renta mensual',          Monto: 210000, Impuestos: 48500, Estado: 1, idEmpleado: 5,  usuariosId: 1, idPrestamo: null },
    { idDeducciones: 6,  Nombre: 'CCSS Obrero',            Monto: 98000,  Impuestos: 0,     Estado: 1, idEmpleado: 6,  usuariosId: 1, idPrestamo: null },
    { idDeducciones: 7,  Nombre: 'Embargo judicial',       Monto: 120000, Impuestos: 0,     Estado: 1, idEmpleado: 7,  usuariosId: 2, idPrestamo: null },
    { idDeducciones: 8,  Nombre: 'Préstamo vehículo',      Monto: 95000,  Impuestos: 0,     Estado: 1, idEmpleado: 8,  usuariosId: 2, idPrestamo: 12  },
    { idDeducciones: 9,  Nombre: 'CCSS Obrero',            Monto: 87000,  Impuestos: 0,     Estado: 1, idEmpleado: 9,  usuariosId: 1, idPrestamo: null },
    { idDeducciones: 10, Nombre: 'Renta mensual',          Monto: 62000,  Impuestos: 9500,  Estado: 0, idEmpleado: 10, usuariosId: 1, idPrestamo: null },
    { idDeducciones: 11, Nombre: 'Asociación solidarista', Monto: 36500,  Impuestos: 0,     Estado: 1, idEmpleado: 11, usuariosId: 1, idPrestamo: null },
    { idDeducciones: 12, Nombre: 'CCSS Obrero',            Monto: 68000,  Impuestos: 0,     Estado: 1, idEmpleado: 12, usuariosId: 1, idPrestamo: null },
    { idDeducciones: 13, Nombre: 'Préstamo personal',      Monto: 50000,  Impuestos: 0,     Estado: 0, idEmpleado: 2,  usuariosId: 2, idPrestamo: 15  },
    { idDeducciones: 14, Nombre: 'Renta mensual',          Monto: 190000, Impuestos: 41000, Estado: 1, idEmpleado: 1,  usuariosId: 1, idPrestamo: null },
    { idDeducciones: 15, Nombre: 'INS accidente laboral',  Monto: 12000,  Impuestos: 0,     Estado: 1, idEmpleado: 5,  usuariosId: 1, idPrestamo: null },
    { idDeducciones: 16, Nombre: 'Embargo judicial',       Monto: 85000,  Impuestos: 0,     Estado: 0, idEmpleado: 6,  usuariosId: 2, idPrestamo: null },
  ];

  // ── Computed ──
  get filteredDeducciones(): Deduccion[] {
    const q = this.searchQuery.toLowerCase();
    return this.deducciones.filter(d => {
      const txt = `${d.Nombre} ${d.idDeducciones} ${this.empName(d.idEmpleado)} ${d.idPrestamo ?? ''}`.toLowerCase();
      const estadoOk = this.estadoFilter === '' || d.Estado === +this.estadoFilter;
      const tipoOk   = !this.tipoFilter || this.tipoLabel(d.Nombre).toLowerCase().includes(this.tipoFilter.toLowerCase())
                                        || d.Nombre.toLowerCase().includes(this.tipoFilter.toLowerCase());
      return (!q || txt.includes(q)) && estadoOk && tipoOk;
    });
  }

  get pageSlice(): Deduccion[] {
    const start = (this.currentPage - 1) * this.perPage;
    return this.filteredDeducciones.slice(start, start + this.perPage);
  }

  get totalPages(): number[] {
    const count = Math.ceil(this.filteredDeducciones.length / this.perPage) || 1;
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

  fmtNum(n: number)   { return Number(n).toLocaleString('es-CR'); }
  fmtShort(n: number) {
    if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + 'M';
    if (n >= 1_000)     return (n / 1_000).toFixed(0) + 'K';
    return String(n);
  }

  tipoColor(nombre: string): string {
    const n = nombre.toLowerCase();
    return this.TIPO_KEYWORDS.find(t => n.includes(t.key))?.color ?? 'dot-muted';
  }

  tipoLabel(nombre: string): string {
    const n = nombre.toLowerCase();
    return this.TIPO_KEYWORDS.find(t => n.includes(t.key))?.label ?? 'Otra deducción';
  }

  estadoClass(e: number) { return e === 1 ? 'status-activa' : 'status-inactiva'; }

  countByEstado(e: number) { return this.deducciones.filter(d => d.Estado === e).length; }

  totalMontos() {
    return this.deducciones.filter(d => d.Estado === 1).reduce((acc, d) => acc + d.Monto + d.Impuestos, 0);
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
      this.form = { Estado: 1, Monto: undefined, Impuestos: 0, idPrestamo: null, usuariosId: 1 };
    } else {
      const d = this.deducciones.find(x => x.idDeducciones === id)!;
      this.editId = d.idDeducciones;
      this.form = { ...d };
    }
    this.showFormModal = true;
  }

  saveDeduccion() {
    if (!this.form.Nombre?.trim()) { alert('El nombre es requerido.'); return; }
    if (!this.form.idEmpleado || !this.form.Monto) { alert('Completa empleado y monto.'); return; }
    if (this.editId) {
      const idx = this.deducciones.findIndex(x => x.idDeducciones === this.editId);
      this.deducciones[idx] = { ...this.deducciones[idx], ...this.form } as Deduccion;
    } else {
      const newId = Math.max(0, ...this.deducciones.map(x => x.idDeducciones)) + 1;
      this.deducciones = [...this.deducciones, { idDeducciones: newId, Impuestos: 0, idPrestamo: null, ...this.form } as Deduccion];
    }
    this.showFormModal = false;
  }

  viewDeduccion(id: number) {
    this.viewedDeduccion = this.deducciones.find(x => x.idDeducciones === id)!;
    this.showViewModal = true;
  }

  askDelete(id: number) {
    const d = this.deducciones.find(x => x.idDeducciones === id)!;
    this.deleteTargetId = id;
    this.deleteDesc = `Estás a punto de eliminar la deducción "${d.Nombre}" de ${this.empName(d.idEmpleado)} (₡${this.fmtNum(d.Monto)}). Esta acción no se puede deshacer.`;
    this.showDeleteModal = true;
  }

  confirmDelete() {
    this.deducciones = this.deducciones.filter(x => x.idDeducciones !== this.deleteTargetId);
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

  /** Bloque 2 — Empleado relacionado */
  empDetalle(id: number): { puesto: string; departamento: string; cedula: string } {
    return this.empDetalleMap[id] ?? { puesto: '—', departamento: '—', cedula: '—' };
  }

  /**
   * Bloque 3 — Préstamo relacionado.
   * Incluye el porcentaje pagado para la barra de progreso.
   */
  prestamoDetalle(id: number): {
    desc: string; montoTotal: number; saldo: number; cuota: number; pct: number;
  } {
    const p = this.prestamoMap[id];
    if (!p) return { desc: '—', montoTotal: 0, saldo: 0, cuota: 0, pct: 0 };
    const pagado = p.montoTotal - p.saldo;
    const pct = Math.min(100, Math.round((pagado / p.montoTotal) * 100));
    return { ...p, pct };
  }

  /** Bloque 4 — Usuario responsable */
  usuarioNombre(id: number): string { return this.usuarioMap[id]?.nombre ?? `Usuario #${id}`; }
  usuarioRol(id: number):    string { return this.usuarioMap[id]?.rol    ?? '—'; }
  usuarioInitial(id: number): string {
    const n = this.usuarioMap[id]?.nombre;
    if (!n) return `U${id}`;
    const p = n.split(' ');
    return (p[0][0] + (p[1]?.[0] ?? '')).toUpperCase();
  }
}