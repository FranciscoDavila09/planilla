import { Component, inject, signal, OnInit } from '@angular/core';



import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

interface Empleado {
  idEmpleado?: number;
  CodigoEmpleado: string;
  Nombre: string;
  Apellidos: string;
  Identificacion: string;
  Correo: string;
  Telefono: string;
  FechaIngreso: string;
  Estado: number;
  HoraEntrada: string;
  CuentaBancaria: number;
  Salario: number;
  idDepartamento: number;
  HoraSalida: string;
}

@Component({
  selector: 'app-empleados',
  standalone: true,
  imports: [FormsModule],   
  templateUrl: './empleados.html',
  styleUrl: './empleados.css',
})
export class Empleados implements OnInit {
  private readonly http = inject(HttpClient);
  private readonly API_URL = 'http://localhost/EmpleadoServicio/';

  protected readonly Empleados = signal<Empleado[]>([]);

  readonly COLORS = ['av-red', 'av-green', 'av-blue', 'av-amber', 'av-violet', 'av-teal'];
  readonly perPage = 8;

  showFormModal   = false;
  showViewModal   = false;
  showDeleteModal = false;

  searchQuery  = '';
  statusFilter = '';
  deptFilter   = '';

  currentPage = 1;

  editId: number | null = null;
  form: Partial<Empleado> = {};

  viewedEmployee!: Empleado;

  deleteTargetId: number | null = null;
  deleteDesc = '';

  // ── Lifecycle ──
  ngOnInit(): void {
    this.getEmpleados();
  }

  // ── HTTP ──
  getEmpleados(): void {
    this.http.get<Empleado[]>(`${this.API_URL}listarEmpleados`).subscribe({
      next: (data) => this.Empleados.set(data),
      error: (err) => console.error('Error al obtener empleados:', err)
    });
  }

  // ── Computed ──
  get filteredEmployees(): Empleado[] {
    const q = this.searchQuery.toLowerCase();
    return this.Empleados().filter(e => {
      const full = `${e.Nombre} ${e.Apellidos} ${e.Identificacion} ${e.CodigoEmpleado}`.toLowerCase();
      return (
        (!q || full.includes(q)) &&
        (!this.statusFilter || e.Estado === Number(this.statusFilter)) &&
        (!this.deptFilter   || e.idDepartamento === Number(this.deptFilter))
      );
    });
  }

  get pageSlice(): Empleado[] {
    const start = (this.currentPage - 1) * this.perPage;
    return this.filteredEmployees.slice(start, start + this.perPage);
  }

  get totalPages(): number[] {
    const total = this.totalCount();
    const current = this.currentPage;
    const pages: number[] = [];

    let start = Math.max(1, current - 2);
    let end = Math.min(total, start + 4);

    if (end - start < 4) {
      start = Math.max(1, end - 4);
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    return pages;
  }

  // ── Helpers ──
  totalCount(): number {
    return Math.ceil(this.filteredEmployees.length / this.perPage) || 1;
  }

  min(a: number, b: number) { return Math.min(a, b); }

  initials(e: Empleado) {
    const n = e.Nombre?.[0] ?? '?';
    const a = e.Apellidos?.[0] ?? '?';
    return (n + a).toUpperCase();
  }

  colorFor(id: number) { return this.COLORS[(id - 1) % this.COLORS.length]; }

  fmtSalary(n: number) { return '₡' + Number(n).toLocaleString('es-CR'); }

  fmtDate(d: string) {
    if (!d) return '—';
    const [y, m, day] = d.split('-');
    return `${day}/${m}/${y}`;
  }

  estadoLabel(e: number) {
    if (e === 1) return 'Activo';
    if (e === 2) return 'Vacaciones';
    return 'Inactivo';
  }

  statusClass(e: number) {
    if (e === 1) return 'status-active';
    if (e === 2) return 'status-vacation';
    return 'status-inactive';
  }

  countByStatus(s: number) { return this.Empleados().filter(e => e.Estado === s).length; }

  // ── Filtro / paginación ──
  filterTable() { this.currentPage = 1; }

  changePage(d: number) {
    const max = this.totalCount();
    this.currentPage = Math.max(1, Math.min(max, this.currentPage + d));
  }

  goPage(n: number) { this.currentPage = n; }

  // ── CRUD ──
  openModal(mode: 'create' | 'edit', id?: number) {
    if (mode === 'create') {
      this.editId = null;
      this.form = {
        CodigoEmpleado: '',
        Nombre: '',
        Apellidos: '',
        Identificacion: '',
        Correo: '',
        Telefono: '',
        FechaIngreso: '',
        Estado: 1,
        HoraEntrada: '',
        CuentaBancaria: 0,
        Salario: 0,
        idDepartamento: 0,
        HoraSalida: ''
      };
    } else {
      const e = this.Empleados().find(x => x.idEmpleado === id)!;
      this.editId = e.idEmpleado!;
      this.form = { ...e };
    }
    this.showFormModal = true;
  }

  saveEmployee() {
    if (!this.form.Nombre?.trim() || !this.form.Apellidos?.trim()) {
      alert('Por favor completa al menos nombre y apellidos.');
      return;
    }
    if (this.editId) {
      this.http.put<Empleado>(`${this.API_URL}actualizar`, this.form).subscribe({
        next: () => this.getEmpleados(),
        error: (err) => console.error('Error al editar:', err)
      });
    } else {
      this.http.post<Empleado>(`${this.API_URL}insertar`, this.form).subscribe({
        next: () => this.getEmpleados(),
        error: (err) => console.error('Error al crear:', err)
      });
    }
    this.showFormModal = false;
  }

  viewEmployee(id: number) {
    this.viewedEmployee = this.Empleados().find(x => x.idEmpleado === id)!;
    this.showViewModal = true;
  }

  askDelete(id: number) {
    const e = this.Empleados().find(x => x.idEmpleado === id)!;
    this.deleteTargetId = id;
    this.deleteDesc = `Estás a punto de eliminar a ${e.Nombre} ${e.Apellidos}. Esta acción no se puede deshacer.`;
    this.showDeleteModal = true;
  }

  confirmDelete() {
    this.http.delete(`${this.API_URL}eliminar?id=${this.deleteTargetId}`).subscribe({
      next: () => this.getEmpleados(),
      error: (err) => console.error('Error al eliminar:', err)
    });
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