import { Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';

// ── Interfaces (Ajustadas a PascalCase de tu API .NET) ──
interface Vacacion {
  IdVacacion: number;
  IdEmpleado: number;
  FechaInicio: string;
  FechaFin: string;
  DiasSolicitados: number;
  Estado: number; 
  UsuarioAprueba?: number | null;
}

interface Empleado {
  IdEmpleado: number; // Coincide con tu JSON de .NET
  Nombre: string;
  Apellidos: string;
}

interface Usuario {
  IdUsuario: number; // Coincide con tu JSON de .NET
  Nombre: string;
  Apellidos: string;
}

@Component({
  selector: 'app-vacaciones',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './vacaciones.html',
  styleUrl: './vacaciones.css',
})
export class Vacaciones implements OnInit {
  private readonly http = inject(HttpClient);

  // Ajusta estas URLs según tu entorno
  private readonly API_URL = 'http://localhost'; 
  private readonly VACACIONES_URL = `${this.API_URL}/VacacionesServicio/`;
  private readonly EMPLEADO_URL   = `${this.API_URL}/EmpleadoServicio/`;
  private readonly USUARIO_URL    = `${this.API_URL}/UsuarioServicio/`;

  // ── Signals ──
  protected readonly vacaciones = signal<Vacacion[]>([]);
  protected readonly empleados  = signal<Empleado[]>([]);
  protected readonly usuarios   = signal<Usuario[]>([]);

  readonly perPage = 8;
  showFormModal = false;
  showDeleteModal = false;

  searchQuery = '';
  estadoFiltro = '';
  currentPage = 1;

  editId: number | null = null;
  form: Partial<Vacacion> = {};
  deleteTargetId: number | null = null;

  ngOnInit() {
    this.getVacaciones();
    this.getEmpleados();
    this.getUsuarios();
  }

  // ───────────────────────────────
  // HTTP GET (Carga de datos)
  // ───────────────────────────────
  getVacaciones() {
    this.http.get<Vacacion[]>(`${this.VACACIONES_URL}listarVacaciones`).subscribe({
      next: (data) => this.vacaciones.set(data),
      error: (err) => console.error('Error al cargar vacaciones:', err)
    });
  }

  getEmpleados() {
    this.http.get<Empleado[]>(`${this.EMPLEADO_URL}listarEmpleados`).subscribe({
      next: (data) => this.empleados.set(data),
      error: (err) => console.error('Error al cargar empleados:', err)
    });
  }

  getUsuarios() {
    this.http.get<Usuario[]>(`${this.USUARIO_URL}listarUsuarios`).subscribe({
      next: (data) => this.usuarios.set(data),
      error: (err) => console.error('Error al cargar usuarios:', err)
    });
  }

  // ───────────────────────────────
  // CRUD ACTIONS
  // ───────────────────────────────
  saveVacacion() {
    if (!this.form.IdEmpleado || !this.form.FechaInicio || !this.form.FechaFin) {
      alert('Por favor rellena los campos obligatorios');
      return;
    }

    const body = {
      ...this.form,
      Estado: this.mapEstado(this.form.Estado),
      UsuarioAprueba: this.form.UsuarioAprueba || null
    };

    if (this.editId) {
      this.http.put(`${this.VACACIONES_URL}actualizar`, { ...body, IdVacacion: this.editId }).subscribe({
        next: () => { this.getVacaciones(); this.showFormModal = false; },
        error: (err) => console.error('Error al actualizar:', err)
      });
    } else {
      this.http.post(`${this.VACACIONES_URL}insertar`, body).subscribe({
        next: () => { this.getVacaciones(); this.showFormModal = false; },
        error: (err) => console.error('Error al insertar:', err)
      });
    }
  }

  confirmDelete() {
    if (this.deleteTargetId) {
      this.http.delete(`${this.VACACIONES_URL}eliminar`, { params: { id: this.deleteTargetId } }).subscribe({
        next: () => { this.getVacaciones(); this.showDeleteModal = false; },
        error: (err) => console.error('Error al eliminar:', err)
      });
    }
  }

  // ───────────────────────────────
  // HELPERS DE UI (Llamados desde el HTML)
  // ───────────────────────────────
  
  calcularDias() {
    if (this.form.FechaInicio && this.form.FechaFin) {
      const inicio = new Date(this.form.FechaInicio);
      const fin = new Date(this.form.FechaFin);
      const diff = fin.getTime() - inicio.getTime();
      if (diff >= 0) {
        this.form.DiasSolicitados = Math.ceil(diff / (1000 * 60 * 60 * 24)) + 1;
      } else {
        this.form.DiasSolicitados = 1;
      }
    }
  }

  inicialesNombre(nombreCompleto: string): string {
    if (!nombreCompleto || nombreCompleto === '—') return '??';
    return nombreCompleto.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  }

  colorFor(id: number): string {
    const colors = ['bg-blue', 'bg-purple', 'bg-amber', 'bg-green'];
    return colors[id % colors.length];
  }

  estadoClass(estado: number | string): string {
    const e = typeof estado === 'number' ? this.estadoLabel(estado) : estado;
    if (e === 'Aprobado') return 'status-aprobado';
    if (e === 'Rechazado') return 'status-rechazado';
    if (e === 'En curso') return 'status-curso';
    return 'status-pendiente';
  }

  // ───────────────────────────────
  // LOGICA EXISTENTE
  // ───────────────────────────────
  mapEstado(e: any): number {
    const m: any = { 'Pendiente': 1, 'Aprobado': 2, 'Rechazado': 3, 'En curso': 4 };
    return m[e] || (typeof e === 'number' ? e : 1);
  }

  estadoLabel(e: number): string {
    const labels: any = { 1: 'Pendiente', 2: 'Aprobado', 3: 'Rechazado', 4: 'En curso' };
    return labels[e] || 'Pendiente';
  }

  getNombreEmpleado(id: number) {
    const e = this.empleados().find(emp => emp.IdEmpleado == id);
    return e ? `${e.Nombre} ${e.Apellidos}` : '—';
  }

  getNombreUsuario(id: number) {
    const u = this.usuarios().find(user => user.IdUsuario == id);
    return u ? `${u.Nombre} ${u.Apellidos}` : '—';
  }

  // ── Filtros y Paginación ──
  get filteredVacaciones(): Vacacion[] {
    const q = this.searchQuery.toLowerCase();
    return this.vacaciones().filter(v =>
      (!q || this.getNombreEmpleado(v.IdEmpleado).toLowerCase().includes(q)) &&
      (!this.estadoFiltro || this.estadoLabel(v.Estado) === this.estadoFiltro)
    );
  }

  get pageSlice() {
    const start = (this.currentPage - 1) * this.perPage;
    return this.filteredVacaciones.slice(start, start + this.perPage);
  }

  get totalPages() {
    const count = Math.ceil(this.filteredVacaciones.length / this.perPage) || 1;
    return Array.from({ length: count }, (_, i) => i + 1);
  }

  openModal(mode: 'create' | 'edit', v?: Vacacion) {
    if (mode === 'create') {
      this.editId = null;
      this.form = { Estado: 1, DiasSolicitados: 1, UsuarioAprueba: null };
    } else if (v) {
      this.editId = v.IdVacacion;
      this.form = { ...v };
    }
    this.showFormModal = true;
  }

  // Otros métodos de UI
  changePage(d: number) { this.currentPage = Math.max(1, Math.min(this.totalPages.length, this.currentPage + d)); }
  goPage(n: number) { this.currentPage = n; }
  countByEstado(estado: string) { return this.vacaciones().filter(v => this.estadoLabel(v.Estado) === estado).length; }
  getTotalDias() { return this.vacaciones().reduce((sum, v) => sum + v.DiasSolicitados, 0); }
  fmtFecha(f: string) { if (!f) return ''; const [y, m, d] = f.split('-'); return `${d}/${m}/${y}`; }
  min(a: number, b: number) { return Math.min(a, b); }
  onOverlayClick(e: MouseEvent, m: string) { if (e.target === e.currentTarget) { this.showFormModal = false; this.showDeleteModal = false; } }
  askDelete(id: number) { this.deleteTargetId = id; this.showDeleteModal = true; }
}