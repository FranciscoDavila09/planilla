import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';

interface Aguinaldo {
  IdAguinaldo: number;
  IdEmpleado: number;
  Periodo: number;
  MontoCalculado: number;
  FechaPago: string | null;
  Estado: number;
  idUsuario: number;

  NombreEmpleado?: string;
  ApellidosEmpleado?: string;
  CodigoEmpleado?: string;

  NombreUsuario?: string;
  ApellidosUsuario?: string;
}

interface EmpleadoRef {
  idEmpleado: number;
  Nombre: string;
  Apellidos: string;
  Identificacion?: string;
  CodigoEmpleado?: string;
  Correo?: string;
  Telefono?: string;
  Salario?: number;
  idDepartamento?: number;
}

interface UsuarioRef {
  idUsuario: number;
  Nombre: string;
  Apellidos: string;
  idRol?: number;
  correo?: string;
}

interface PeriodoResumen {
  year: number;
  total: number;
  pagados: number;
  monto: number;
}

@Component({
  selector: 'app-aguinaldos',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './aguinaldos.html',
  styleUrl: './aguinaldos.css',
})
export class Aguinaldos implements OnInit {
  private readonly http = inject(HttpClient);

  private readonly BASE_URL = 'http://localhost';
  private readonly AGUINALDO_URL = `${this.BASE_URL}/AguinaldosServicio`;
  private readonly EMPLEADO_URL = `${this.BASE_URL}/EmpleadoServicio`;
  private readonly USUARIO_URL = `${this.BASE_URL}/UsuarioServicio`;

  readonly perPage = 8;
  readonly COLORS = ['av-red', 'av-green', 'av-blue', 'av-amber', 'av-violet', 'av-teal'];

  private get headers(): HttpHeaders {
    const token = localStorage.getItem('token') ?? '';
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    });
  }

  protected readonly aguinaldos = signal<Aguinaldo[]>([]);
  protected readonly empleados = signal<EmpleadoRef[]>([]);
  protected readonly usuarios = signal<UsuarioRef[]>([]);

  showFormModal = false;
  showViewModal = false;
  showDeleteModal = false;

  searchQuery = '';
  estadoFilter = '';
  periodoFilter = '';
  periodoActivo = new Date().getFullYear();

  currentPage = 1;

  editId: number | null = null;
  form: Partial<Aguinaldo> = {};

  viewedAguinaldo!: Aguinaldo;

  deleteTargetId: number | null = null;
  deleteDesc = '';

  ngOnInit(): void {
    this.cargarTodo();
  }

  cargarTodo(): void {
    this.getEmpleados();
    this.getUsuarios();
    this.getAguinaldos();
  }

  getAguinaldos(): void {
    this.http
      .get<Aguinaldo[]>(`${this.AGUINALDO_URL}/listarAguinaldosVista`, { headers: this.headers })
      .subscribe({
        next: (data) => {
          const lista = (data || []).map((a) => ({
            ...a,
            IdAguinaldo: Number(a.IdAguinaldo),
            IdEmpleado: Number(a.IdEmpleado),
            Periodo: Number(a.Periodo),
            MontoCalculado: Number(a.MontoCalculado ?? 0),
            Estado: Number(a.Estado ?? 0),
            idUsuario: Number(a.idUsuario),
            FechaPago: a.FechaPago ?? '',
          }));
          this.aguinaldos.set(lista);
        },
        error: (err) => console.error('Error al obtener aguinaldos:', err),
      });
  }

  getEmpleados(): void {
    this.http
      .get<EmpleadoRef[]>(`${this.EMPLEADO_URL}/listarEmpleados`, { headers: this.headers })
      .subscribe({
        next: (data) => {
          const lista = (data || []).map((e: any) => ({
            ...e,
            idEmpleado: Number(e.idEmpleado ?? e.IdEmpleado),
          }));
          this.empleados.set(lista);
        },
        error: (err) => {
          console.error('Error al obtener empleados:', err);
          this.empleados.set([]);
        },
      });
  }

  getUsuarios(): void {
    this.http
      .get<UsuarioRef[]>(`${this.USUARIO_URL}/listarUsuarios`, { headers: this.headers })
      .subscribe({
        next: (data) => {
          const lista = (data || []).map((u: any) => ({
            ...u,
            idUsuario: Number(u.idUsuario ?? u.IdUsuario),
          }));
          this.usuarios.set(lista);
        },
        error: (err) => {
          console.error('Error al obtener usuarios:', err);
          this.usuarios.set([]);
        },
      });
  }

  readonly filteredAguinaldos = computed(() => {
    const q = this.searchQuery.toLowerCase().trim();

    return this.aguinaldos().filter((a) => {
      const texto = `${a.IdAguinaldo} ${this.empName(a.IdEmpleado)} ${a.Periodo} ${this.usuarioNombre(a.idUsuario)}`.toLowerCase();

      const estadoOk = this.estadoFilter === '' || Number(a.Estado) === Number(this.estadoFilter);
      const periodoOk = this.periodoFilter === '' || Number(a.Periodo) === Number(this.periodoFilter);

      return (!q || texto.includes(q)) && estadoOk && periodoOk;
    });
  });

  readonly pageSlice = computed(() => {
    const start = (this.currentPage - 1) * this.perPage;
    return this.filteredAguinaldos().slice(start, start + this.perPage);
  });

  readonly totalPages = computed(() => {
    const count = Math.ceil(this.filteredAguinaldos().length / this.perPage) || 1;
    return Array.from({ length: count }, (_, i) => i + 1);
  });

  periodos(): PeriodoResumen[] {
    const map = new Map<number, PeriodoResumen>();

    for (const a of this.aguinaldos()) {
      if (!map.has(a.Periodo)) {
        map.set(a.Periodo, {
          year: a.Periodo,
          total: 0,
          pagados: 0,
          monto: 0,
        });
      }

      const item = map.get(a.Periodo)!;
      item.total += 1;
      item.monto += Number(a.MontoCalculado ?? 0);

      if (Number(a.Estado) === 1) {
        item.pagados += 1;
      }
    }

    return Array.from(map.values()).sort((a, b) => b.year - a.year);
  }

  min(a: number, b: number): number {
    return Math.min(a, b);
  }

  fmtNum(n: number): string {
    return Number(n ?? 0).toLocaleString('es-CR');
  }

  fmtShort(n: number): string {
    const val = Number(n ?? 0);
    if (val >= 1_000_000) return (val / 1_000_000).toFixed(1) + 'M';
    if (val >= 1_000) return (val / 1_000).toFixed(0) + 'K';
    return String(val);
  }

  fmtDate(d: string | null): string {
    if (!d) return '—';
    const soloFecha = d.includes('T') ? d.split('T')[0] : d;
    const [y, m, day] = soloFecha.split('-');
    if (!y || !m || !day) return soloFecha;
    const meses = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];
    return `${Number(day)} ${meses[Number(m) - 1]} ${y}`;
  }

  colorFor(id: number): string {
    const safeId = Number(id || 1);
    return this.COLORS[(safeId - 1) % this.COLORS.length];
  }

  empName(id: number): string {
    const aguinaldo = this.aguinaldos().find((a) => Number(a.IdEmpleado) === Number(id) && a.NombreEmpleado);
    if (aguinaldo?.NombreEmpleado) {
      return `${aguinaldo.NombreEmpleado}${aguinaldo.ApellidosEmpleado ? ' ' + aguinaldo.ApellidosEmpleado : ''}`;
    }

    const emp = this.empleados().find((e) => Number(e.idEmpleado) === Number(id));
    if (emp) {
      return `${emp.Nombre}${emp.Apellidos ? ' ' + emp.Apellidos : ''}`;
    }

    return `Empleado #${id}`;
  }

  empInitial(id: number): string {
    const nombre = this.empName(id);
    const partes = nombre.split(' ');
    return (partes[0]?.[0] ?? 'E') + (partes[1]?.[0] ?? '');
  }

  empDetalle(id: number): { puesto: string; departamento: string; cedula: string } {
    const emp = this.empleados().find((e) => Number(e.idEmpleado) === Number(id));
    return {
      puesto: emp?.CodigoEmpleado ? `Código ${emp.CodigoEmpleado}` : 'Sin puesto',
      departamento: emp?.idDepartamento ? `Departamento #${emp.idDepartamento}` : 'Sin departamento',
      cedula: emp?.Identificacion ?? '—',
    };
  }

  usuarioNombre(id: number): string {
    const aguinaldo = this.aguinaldos().find((a) => Number(a.idUsuario) === Number(id) && a.NombreUsuario);
    if (aguinaldo?.NombreUsuario) {
      return `${aguinaldo.NombreUsuario}${aguinaldo.ApellidosUsuario ? ' ' + aguinaldo.ApellidosUsuario : ''}`;
    }

    const usuario = this.usuarios().find((u) => Number(u.idUsuario) === Number(id));
    if (usuario) {
      return `${usuario.Nombre}${usuario.Apellidos ? ' ' + usuario.Apellidos : ''}`;
    }

    return `Usuario #${id}`;
  }

  usuarioRol(id: number): string {
    const usuario = this.usuarios().find((u) => Number(u.idUsuario) === Number(id));
    if (!usuario?.idRol) return 'Usuario del sistema';

    if (Number(usuario.idRol) === 1) return 'Administrador';
    if (Number(usuario.idRol) === 2) return 'RRHH';
    if (Number(usuario.idRol) === 3) return 'Supervisor';

    return `Rol #${usuario.idRol}`;
  }

  usuarioInitial(id: number): string {
    const nombre = this.usuarioNombre(id);
    const partes = nombre.split(' ');
    return (partes[0]?.[0] ?? 'U') + (partes[1]?.[0] ?? '');
  }

  estadoClass(e: number): string {
    return Number(e) === 1 ? 'status-pagado' : 'status-pendiente';
  }

  countByEstado(e: number): number {
    return this.aguinaldos().filter((a) => Number(a.Estado) === Number(e)).length;
  }

  totalMontoPagado(): number {
    return this.aguinaldos()
      .filter((a) => Number(a.Estado) === 1)
      .reduce((acc, a) => acc + Number(a.MontoCalculado ?? 0), 0);
  }

  setPeriodo(year: number): void {
    this.periodoActivo = year;
    this.periodoFilter = String(year);
    this.filterTable();
  }

  filterTable(): void {
    this.currentPage = 1;
  }

  changePage(d: number): void {
    const max = this.totalPages().length;
    this.currentPage = Math.max(1, Math.min(max, this.currentPage + d));
  }

  goPage(n: number): void {
    this.currentPage = n;
  }

  openModal(mode: 'create' | 'edit', id?: number): void {
    if (mode === 'create') {
      this.editId = null;
      this.form = {
        Estado: 0,
        Periodo: new Date().getFullYear(),
        FechaPago: '',
        idUsuario: 1,
      };
    } else {
      const a = this.aguinaldos().find((x) => Number(x.IdAguinaldo) === Number(id));
      if (!a) return;

      this.editId = a.IdAguinaldo;
      this.form = {
        IdAguinaldo: a.IdAguinaldo,
        IdEmpleado: a.IdEmpleado,
        Periodo: a.Periodo,
        MontoCalculado: a.MontoCalculado,
        FechaPago: a.FechaPago ? (a.FechaPago.includes('T') ? a.FechaPago.split('T')[0] : a.FechaPago) : '',
        Estado: a.Estado,
        idUsuario: a.idUsuario,
      };
    }

    this.showFormModal = true;
  }

  saveAguinaldo(): void {
    if (!this.form.IdEmpleado || Number(this.form.IdEmpleado) <= 0) {
      alert('Debes ingresar un ID de empleado válido.');
      return;
    }

    if (!this.form.Periodo || Number(this.form.Periodo) <= 0) {
      alert('Debes ingresar un período válido.');
      return;
    }

    if (!this.form.MontoCalculado || Number(this.form.MontoCalculado) <= 0) {
      alert('Debes ingresar un monto válido.');
      return;
    }

    if (!this.form.idUsuario || Number(this.form.idUsuario) <= 0) {
      alert('Debes ingresar un ID de usuario válido.');
      return;
    }

    const payload = {
      IdAguinaldo: this.editId ?? undefined,
      IdEmpleado: Number(this.form.IdEmpleado),
      Periodo: Number(this.form.Periodo),
      MontoCalculado: Number(this.form.MontoCalculado),
      FechaPago: this.form.FechaPago || null,
      Estado: Number(this.form.Estado ?? 0),
      idUsuario: Number(this.form.idUsuario),
    };

    if (this.editId) {
      this.http
        .put(`${this.AGUINALDO_URL}/actualizar`, payload, { headers: this.headers })
        .subscribe({
          next: () => {
            this.getAguinaldos();
            this.showFormModal = false;
          },
          error: (err) => console.error('Error al editar aguinaldo:', err),
        });
    } else {
      this.http
        .post(`${this.AGUINALDO_URL}/insertar`, payload, { headers: this.headers })
        .subscribe({
          next: () => {
            this.getAguinaldos();
            this.showFormModal = false;
          },
          error: (err) => console.error('Error al crear aguinaldo:', err),
        });
    }
  }

  viewAguinaldo(id: number): void {
    const a = this.aguinaldos().find((x) => Number(x.IdAguinaldo) === Number(id));
    if (!a) return;

    this.viewedAguinaldo = a;
    this.showViewModal = true;
  }

  askDelete(id: number): void {
    const a = this.aguinaldos().find((x) => Number(x.IdAguinaldo) === Number(id));
    if (!a) return;

    this.deleteTargetId = id;
    this.deleteDesc = `Estás a punto de eliminar el aguinaldo de ${this.empName(a.IdEmpleado)} del período ${a.Periodo} por ₡${this.fmtNum(a.MontoCalculado)}. Esta acción no se puede deshacer.`;
    this.showDeleteModal = true;
  }

  confirmDelete(): void {
    if (!this.deleteTargetId) return;

    this.http
      .delete(`${this.AGUINALDO_URL}/eliminar?id=${this.deleteTargetId}`, { headers: this.headers })
      .subscribe({
        next: () => {
          this.getAguinaldos();
          this.deleteTargetId = null;
          this.showDeleteModal = false;
        },
        error: (err) => console.error('Error al eliminar aguinaldo:', err),
      });
  }

  onOverlayClick(event: MouseEvent, modal: 'form' | 'view' | 'delete'): void {
    if (event.target === event.currentTarget) {
      if (modal === 'form') this.showFormModal = false;
      if (modal === 'view') this.showViewModal = false;
      if (modal === 'delete') this.showDeleteModal = false;
    }
  }
}