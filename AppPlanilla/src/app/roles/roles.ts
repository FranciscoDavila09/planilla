import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

interface Rol {
  IdRol: number;
  Nombre: string;
  Descripcion: string;
  Estado: number; // tinyint(1): 1 = Activo, 0 = Inactivo
}

@Component({
  selector: 'app-roles',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './roles.html',
  styleUrl: './roles.css',
})
export class Roles {
  readonly perPage = 8;

  showFormModal   = false;
  showDeleteModal = false;
  showPass        = false;

  searchQuery  = '';
  estadoFilter = '';

  currentPage = 1;

  editId: number | null = null;
  form: Partial<Rol> = {};

  deleteTargetId: number | null = null;
  deleteDesc = '';

  roles: Rol[] = [
    { IdRol: 1, Nombre: 'Administrador', Descripcion: 'Acceso total al sistema. Gestiona usuarios, roles, configuración y reportes.', Estado: 1 },
    { IdRol: 2, Nombre: 'RRHH',          Descripcion: 'Gestión de personal, nómina, expedientes y procesos de recursos humanos.', Estado: 1 },
    { IdRol: 3, Nombre: 'Supervisor',    Descripcion: 'Supervisión de equipos de trabajo, aprobación de solicitudes y reportes de área.', Estado: 1 },
    { IdRol: 4, Nombre: 'Empleado',      Descripcion: 'Acceso básico: consulta de información personal y solicitudes propias.', Estado: 1 },
  ];

  // ── Íconos SVG por rol ──
  readonly ICON_MAP: Record<number, { cls: string; svg: string }> = {
    1: {
      cls: 'icon-admin',
      svg: '<path d="M8 2a3 3 0 100 6 3 3 0 000-6zM3 12.5C3 10.015 5.239 9 8 9s5 1.015 5 3.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><path d="M12 6l1 1 2-2" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/>',
    },
    2: {
      cls: 'icon-rrhh',
      svg: '<rect x="2" y="2" width="5" height="5" rx="1" stroke="currentColor" stroke-width="1.3"/><rect x="9" y="2" width="5" height="5" rx="1" stroke="currentColor" stroke-width="1.3"/><rect x="2" y="9" width="5" height="5" rx="1" stroke="currentColor" stroke-width="1.3"/><rect x="9" y="9" width="5" height="5" rx="1" stroke="currentColor" stroke-width="1.3"/>',
    },
    3: {
      cls: 'icon-sup',
      svg: '<circle cx="8" cy="5" r="2.5" stroke="currentColor" stroke-width="1.4"/><path d="M3 13c0-2.761 2.239-4 5-4s5 1.239 5 4" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/><path d="M11 3l1 1 2-2" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"/>',
    },
    4: {
      cls: 'icon-emp',
      svg: '<circle cx="8" cy="5" r="3" stroke="currentColor" stroke-width="1.4"/><path d="M2 13c0-3.314 2.686-5 6-5s6 1.686 6 5" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/>',
    },
  };

  defaultIconSvg = '<circle cx="8" cy="8" r="5" stroke="currentColor" stroke-width="1.4"/>';

  iconFor(id: number): { cls: string; svg: string } {
    return this.ICON_MAP[id] ?? { cls: 'icon-emp', svg: this.defaultIconSvg };
  }

  // ── Computed ──
  get filteredRoles(): Rol[] {
    const q = this.searchQuery.toLowerCase();
    return this.roles.filter(r => {
      const txt = `${r.Nombre} ${r.Descripcion}`.toLowerCase();
      const estadoOk = this.estadoFilter === '' || r.Estado === +this.estadoFilter;
      return (!q || txt.includes(q)) && estadoOk;
    });
  }

  get pageSlice(): Rol[] {
    const start = (this.currentPage - 1) * this.perPage;
    return this.filteredRoles.slice(start, start + this.perPage);
  }

  get totalPages(): number[] {
    const count = Math.ceil(this.filteredRoles.length / this.perPage) || 1;
    return Array.from({ length: count }, (_, i) => i + 1);
  }

  min(a: number, b: number) { return Math.min(a, b); }

  estadoClass(e: number) { return e === 1 ? 'status-activo' : 'status-inactivo'; }

  countByEstado(e: number) { return this.roles.filter(r => r.Estado === e).length; }

  // ── Filtro / paginación ──
  filterTable()  { this.currentPage = 1; }
  changePage(d: number) {
    const max = this.totalPages.length;
    this.currentPage = Math.max(1, Math.min(max, this.currentPage + d));
  }
  goPage(n: number) { this.currentPage = n; }

  // ── CRUD ──
  openModal(mode: 'create' | 'edit', id?: number) {
    if (mode === 'create') {
      this.editId = null;
      this.form = { Estado: 1, Nombre: '', Descripcion: '' };
    } else {
      const r = this.roles.find(x => x.IdRol === id)!;
      this.editId = r.IdRol;
      this.form = { ...r };
    }
    this.showFormModal = true;
  }

  saveRol() {
    if (!this.form.Nombre?.trim()) {
      alert('El nombre del rol es requerido.');
      return;
    }
    if (this.editId) {
      const idx = this.roles.findIndex(x => x.IdRol === this.editId);
      this.roles[idx] = { ...this.roles[idx], ...this.form } as Rol;
    } else {
      const newId = Math.max(0, ...this.roles.map(x => x.IdRol)) + 1;
      this.roles = [...this.roles, { IdRol: newId, ...this.form } as Rol];
    }
    this.showFormModal = false;
  }

  askDelete(id: number) {
    const r = this.roles.find(x => x.IdRol === id)!;
    this.deleteTargetId = id;
    this.deleteDesc = `Estás a punto de eliminar el rol "${r.Nombre}". Esta acción no se puede deshacer.`;
    this.showDeleteModal = true;
  }

  confirmDelete() {
    this.roles = this.roles.filter(x => x.IdRol !== this.deleteTargetId);
    this.deleteTargetId = null;
    this.showDeleteModal = false;
  }

  toggleEstado(id: number) {
    const idx = this.roles.findIndex(x => x.IdRol === id);
    this.roles[idx] = { ...this.roles[idx], Estado: this.roles[idx].Estado === 1 ? 0 : 1 };
  }

  onOverlayClick(event: MouseEvent, modal: 'form' | 'delete') {
    if (event.target === event.currentTarget) {
      if (modal === 'form')   this.showFormModal   = false;
      if (modal === 'delete') this.showDeleteModal = false;
    }
  }
}