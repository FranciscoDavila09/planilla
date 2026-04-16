import { Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

interface Deduccion {
  idDeducciones: number;
  Nombre: string;
  Monto: number;
  Impuestos: number;
  Estado: number;
  idEmpleado: number;
  usuariosId: number;
  idPrestamo: number | null;

  NombreEmpleado?: string;
  ApellidosEmpleado?: string;
  CodigoEmpleado?: string;

  NombreUsuario?: string;
  ApellidosUsuario?: string;

  PrestamoMontoTotal?: number;
  PrestamoCuotas?: number;
  PrestamoMontoPorCuota?: number;
  PrestamoSaldoPendiente?: number;
  PrestamoFechaInicio?: string;
  PrestamoEstado?: number;
}

@Component({
  selector: 'app-deducciones',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './deducciones.html',
  styleUrl: './deducciones.css',
})
export class Deducciones implements OnInit {
  private readonly http = inject(HttpClient);

  private readonly BASE_URL = 'http://localhost';
  private readonly DEDUCCIONES_URL = `${this.BASE_URL}/DeduccionesServicio`;

  readonly perPage = 8;
  readonly COLORS = ['av-red', 'av-green', 'av-blue', 'av-amber', 'av-violet', 'av-teal'];

  protected readonly deducciones = signal<Deduccion[]>([]);

  showFormModal = false;
  showViewModal = false;
  showDeleteModal = false;

  searchQuery = '';
  estadoFilter = '';
  tipoFilter = '';

  currentPage = 1;

  editId: number | null = null;
  form: Partial<Deduccion> = {};

  viewedDeduccion!: Deduccion;

  deleteTargetId: number | null = null;
  deleteDesc = '';

  readonly TIPO_KEYWORDS: { key: string; label: string; color: string }[] = [
    { key: 'ccss', label: 'CCSS', color: 'dot-red' },
    { key: 'renta', label: 'Renta', color: 'dot-amber' },
    { key: 'prést', label: 'Préstamo', color: 'dot-blue' },
    { key: 'prestamo', label: 'Préstamo', color: 'dot-blue' },
    { key: 'embargo', label: 'Embargo', color: 'dot-violet' },
    { key: 'ins', label: 'Otro', color: 'dot-green' },
    { key: 'asociac', label: 'Otro', color: 'dot-green' },
  ];

  ngOnInit(): void {
    this.getDeducciones();
  }

  getDeducciones(): void {
    this.http.get<Deduccion[]>(`${this.DEDUCCIONES_URL}/listarDeduccionesVista`).subscribe({
      next: (data) => {
        this.deducciones.set(data || []);
      },
      error: (err) => {
        console.error('Error al obtener deducciones:', err);
        this.deducciones.set([]);
      },
    });
  }

  get filteredDeducciones(): Deduccion[] {
    const q = this.searchQuery.toLowerCase().trim();

    return this.deducciones().filter((d) => {
      const texto = `
        ${d.idDeducciones}
        ${d.Nombre}
        ${this.empName(d)}
        ${d.idPrestamo ?? ''}
        ${this.usuarioNombre(d)}
      `.toLowerCase();

      const estadoOk = this.estadoFilter === '' || d.Estado === Number(this.estadoFilter);
      const tipoOk =
        !this.tipoFilter ||
        this.tipoLabel(d.Nombre).toLowerCase() === this.tipoFilter.toLowerCase() ||
        d.Nombre.toLowerCase().includes(this.tipoFilter.toLowerCase());

      return (!q || texto.includes(q)) && estadoOk && tipoOk;
    });
  }

  get pageSlice(): Deduccion[] {
    const start = (this.currentPage - 1) * this.perPage;
    return this.filteredDeducciones.slice(start, start + this.perPage);
  }

  get totalPages(): number[] {
    const total = Math.ceil(this.filteredDeducciones.length / this.perPage) || 1;
    const pages: number[] = [];

    let start = Math.max(1, this.currentPage - 2);
    let end = Math.min(total, start + 4);

    if (end - start < 4) {
      start = Math.max(1, end - 4);
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    return pages;
  }

  min(a: number, b: number): number {
    return Math.min(a, b);
  }

  fmtNum(n: number | null | undefined): string {
    return Number(n || 0).toLocaleString('es-CR');
  }

  fmtShort(n: number | null | undefined): string {
    const value = Number(n || 0);
    if (value >= 1_000_000) return (value / 1_000_000).toFixed(1) + 'M';
    if (value >= 1_000) return (value / 1_000).toFixed(0) + 'K';
    return String(value);
  }

  colorFor(id: number | null | undefined): string {
    const safeId = Number(id || 1);
    return this.COLORS[(safeId - 1) % this.COLORS.length];
  }

  empName(d: Deduccion): string {
    const nombre = `${d.NombreEmpleado ?? ''} ${d.ApellidosEmpleado ?? ''}`.trim();
    return nombre || `Empleado #${d.idEmpleado}`;
  }

  empInitial(id: number | null | undefined): string {
    const ded = this.deducciones().find((x) => Number(x.idEmpleado) === Number(id));
    if (ded) {
      const n = ded.NombreEmpleado?.[0] ?? 'E';
      const a = ded.ApellidosEmpleado?.[0] ?? '';
      return (n + a).toUpperCase();
    }
    return `E${id ?? ''}`;
  }

  usuarioNombre(d: Deduccion): string {
    const nombre = `${d.NombreUsuario ?? ''} ${d.ApellidosUsuario ?? ''}`.trim();
    return nombre || `Usuario #${d.usuariosId}`;
  }

  usuarioInitial(id: number | null | undefined): string {
    const ded = this.deducciones().find((x) => Number(x.usuariosId) === Number(id));
    if (ded) {
      const n = ded.NombreUsuario?.[0] ?? 'U';
      const a = ded.ApellidosUsuario?.[0] ?? '';
      return (n + a).toUpperCase();
    }
    return `U${id ?? ''}`;
  }

  usuarioRol(_id: number | null | undefined): string {
    return 'Usuario del sistema';
  }

  tipoColor(nombre: string): string {
    const n = (nombre || '').toLowerCase();
    return this.TIPO_KEYWORDS.find((t) => n.includes(t.key))?.color ?? 'dot-muted';
  }

  tipoLabel(nombre: string): string {
    const n = (nombre || '').toLowerCase();
    return this.TIPO_KEYWORDS.find((t) => n.includes(t.key))?.label ?? 'Otro';
  }

  estadoClass(e: number): string {
    return e === 1 ? 'status-activa' : 'status-inactiva';
  }

  countByEstado(e: number): number {
    return this.deducciones().filter((d) => d.Estado === e).length;
  }

  totalMontos(): number {
    return this.deducciones()
      .filter((d) => d.Estado === 1)
      .reduce((acc, d) => acc + Number(d.Monto || 0) + Number(d.Impuestos || 0), 0);
  }

  filterTable(): void {
    this.currentPage = 1;
  }

  changePage(d: number): void {
    const max = Math.ceil(this.filteredDeducciones.length / this.perPage) || 1;
    this.currentPage = Math.max(1, Math.min(max, this.currentPage + d));
  }

  goPage(n: number): void {
    this.currentPage = n;
  }

  openModal(mode: 'create' | 'edit', id?: number): void {
    if (mode === 'create') {
      this.editId = null;
      this.form = {
        Nombre: '',
        Monto: undefined,
        Impuestos: 0,
        Estado: 1,
        idEmpleado: undefined,
        usuariosId: undefined,
        idPrestamo: null,
      };
    } else {
      const d = this.deducciones().find((x) => x.idDeducciones === id);
      if (!d) return;

      this.editId = d.idDeducciones;
      this.form = {
        idDeducciones: d.idDeducciones,
        Nombre: d.Nombre,
        Monto: d.Monto,
        Impuestos: d.Impuestos,
        Estado: d.Estado,
        idEmpleado: d.idEmpleado,
        usuariosId: d.usuariosId,
        idPrestamo: d.idPrestamo,
      };
    }

    this.showFormModal = true;
  }

  saveDeduccion(): void {
    if (!this.form.Nombre?.trim()) {
      alert('El nombre es requerido.');
      return;
    }

    if (!this.form.idEmpleado || Number(this.form.idEmpleado) <= 0) {
      alert('Debes ingresar un ID de empleado válido.');
      return;
    }

    if (!this.form.usuariosId || Number(this.form.usuariosId) <= 0) {
      alert('Debes ingresar un ID de usuario válido.');
      return;
    }

    if (this.form.Monto == null || Number(this.form.Monto) <= 0) {
      alert('Debes ingresar un monto válido.');
      return;
    }

    const payload = {
      idDeducciones: this.editId ?? undefined,
      Nombre: this.form.Nombre,
      Monto: Number(this.form.Monto),
      Impuestos: Number(this.form.Impuestos || 0),
      Estado: Number(this.form.Estado ?? 1),
      idEmpleado: Number(this.form.idEmpleado),
      usuariosId: Number(this.form.usuariosId),
   idPrestamo:
  this.form.idPrestamo === null ||
  this.form.idPrestamo === undefined ||
  Number(this.form.idPrestamo) === 0
    ? null
    : Number(this.form.idPrestamo),
    };

    if (this.editId) {
      this.http.put(`${this.DEDUCCIONES_URL}/actualizar`, payload).subscribe({
        next: () => {
          this.getDeducciones();
          this.showFormModal = false;
        },
        error: (err) => {
          console.error('Error al editar deducción:', err);
        },
      });
    } else {
      this.http.post(`${this.DEDUCCIONES_URL}/insertar`, payload).subscribe({
        next: () => {
          this.getDeducciones();
          this.showFormModal = false;
        },
        error: (err) => {
          console.error('Error al crear deducción:', err);
        },
      });
    }
  }

  viewDeduccion(id: number): void {
    const d = this.deducciones().find((x) => x.idDeducciones === id);
    if (!d) return;

    this.viewedDeduccion = d;
    this.showViewModal = true;
  }

  askDelete(id: number): void {
    const d = this.deducciones().find((x) => x.idDeducciones === id);
    if (!d) return;

    this.deleteTargetId = id;
    this.deleteDesc = `Estás a punto de eliminar la deducción "${d.Nombre}" de ${this.empName(d)} (₡${this.fmtNum(d.Monto)}). Esta acción no se puede deshacer.`;
    this.showDeleteModal = true;
  }

  confirmDelete(): void {
    if (!this.deleteTargetId) return;

    this.http.delete(`${this.DEDUCCIONES_URL}/eliminar?id=${this.deleteTargetId}`).subscribe({
      next: () => {
        this.getDeducciones();
        this.deleteTargetId = null;
        this.showDeleteModal = false;
      },
      error: (err) => {
        console.error('Error al eliminar deducción:', err);
      },
    });
  }

  onOverlayClick(event: MouseEvent, modal: 'form' | 'view' | 'delete'): void {
    if (event.target === event.currentTarget) {
      if (modal === 'form') this.showFormModal = false;
      if (modal === 'view') this.showViewModal = false;
      if (modal === 'delete') this.showDeleteModal = false;
    }
  }

  empDetalle(id: number): { puesto: string; departamento: string; cedula: string } {
    const d = this.deducciones().find((x) => Number(x.idEmpleado) === Number(id));

    return {
      puesto: d?.CodigoEmpleado ? `Código ${d.CodigoEmpleado}` : 'Empleado registrado',
      departamento: 'Departamento no disponible',
      cedula: 'No disponible',
    };
  }

  prestamoDetalle(id: number | null): {
    desc: string;
    montoTotal: number;
    saldo: number;
    cuota: number;
    pct: number;
  } {
    if (!id) {
      return { desc: '—', montoTotal: 0, saldo: 0, cuota: 0, pct: 0 };
    }

    const d = this.deducciones().find((x) => Number(x.idPrestamo) === Number(id));

    if (!d) {
      return { desc: 'Préstamo relacionado', montoTotal: 0, saldo: 0, cuota: 0, pct: 0 };
    }

    const montoTotal = Number(d.PrestamoMontoTotal || 0);
    const saldo = Number(d.PrestamoSaldoPendiente || 0);
    const cuota = Number(d.PrestamoMontoPorCuota || 0);
    const pagado = montoTotal - saldo;
    const pct = montoTotal > 0 ? Math.min(100, Math.round((pagado / montoTotal) * 100)) : 0;

    return {
      desc: d.PrestamoFechaInicio ? `Desde ${d.PrestamoFechaInicio}` : 'Préstamo relacionado',
      montoTotal,
      saldo,
      cuota,
      pct,
    };
  }
}