import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

interface Usuario {
  idUsuario: number;
  Nombre: string;
  Apellidos: string;
  Estado: number;           // tinyint(1): 1 = Activo, 0 = Inactivo
  FechaCreacion: string;    // date
  Clave: string;            // varchar(200) — nunca mostrar en claro
  telefono: string;
  correo: string;
  idRol: number;
  IdDepartamento: number;
  Token: string;            // varchar(500) — gestionado por el backend
}

interface RolSummary {
  idRol: number;
  nombre: string;
  total: number;
  activos: number;
  iconClass: string;
  iconSvg: string;
}

const ROLES: Record<number, string> = {
  1: 'Administrador',
  2: 'RRHH',
  3: 'Supervisor',
  4: 'Empleado',
};

const DEPARTAMENTOS: Record<number, string> = {
  1: 'TI',
  2: 'Finanzas',
  3: 'Ventas',
  4: 'RRHH',
  5: 'Operaciones',
};

@Component({
  selector: 'app-usuarios',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './usuarios.html',
  styleUrl: './usuarios.css',
})
export class Usuarios {
  readonly perPage = 8;
  readonly COLORS  = ['av-red', 'av-green', 'av-blue', 'av-amber', 'av-violet', 'av-teal'];

  showFormModal   = false;
  showViewModal   = false;
  showDeleteModal = false;
  showPass        = false;

  searchQuery  = '';
  estadoFilter = '';
  rolFilter    = '';
  deptFilter   = '';
  rolActivo    = 0;

  currentPage = 1;

  editId: number | null = null;
  form: Partial<Usuario> = {};

  viewedUsuario!: Usuario;

  deleteTargetId: number | null = null;
  deleteDesc = '';

  usuarios: Usuario[] = [
    { idUsuario: 1,  Nombre: 'María',     Apellidos: 'Rodríguez López',   Estado: 1, FechaCreacion: '2021-03-15', Clave: '', telefono: '8811-2233', correo: 'maria@empresa.com',   idRol: 1, IdDepartamento: 1, Token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MX0.SflKxwRJSMeKKF2QT4fwpMeJf36POk' },
    { idUsuario: 2,  Nombre: 'Carlos',    Apellidos: 'Mendoza Torres',    Estado: 1, FechaCreacion: '2019-07-01', Clave: '', telefono: '8822-3344', correo: 'carlos@empresa.com',  idRol: 2, IdDepartamento: 4, Token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6Mn0.Abc123Token' },
    { idUsuario: 3,  Nombre: 'Sofía',     Apellidos: 'Vargas Chaves',     Estado: 1, FechaCreacion: '2018-01-10', Clave: '', telefono: '8833-4455', correo: 'sofia@empresa.com',   idRol: 3, IdDepartamento: 3, Token: '' },
    { idUsuario: 4,  Nombre: 'Andrés',    Apellidos: 'Jiménez Mora',      Estado: 1, FechaCreacion: '2022-06-20', Clave: '', telefono: '8844-5566', correo: 'andres@empresa.com',  idRol: 4, IdDepartamento: 4, Token: '' },
    { idUsuario: 5,  Nombre: 'Lucía',     Apellidos: 'Pérez Solís',       Estado: 1, FechaCreacion: '2017-09-05', Clave: '', telefono: '8855-6677', correo: 'lucia@empresa.com',   idRol: 3, IdDepartamento: 5, Token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NX0.XyzToken456' },
    { idUsuario: 6,  Nombre: 'Diego',     Apellidos: 'Castillo Brenes',   Estado: 1, FechaCreacion: '2020-11-12', Clave: '', telefono: '8866-7788', correo: 'diego@empresa.com',   idRol: 4, IdDepartamento: 1, Token: '' },
    { idUsuario: 7,  Nombre: 'Valeria',   Apellidos: 'Núñez Ulate',       Estado: 0, FechaCreacion: '2021-01-25', Clave: '', telefono: '8877-8899', correo: 'valeria@empresa.com', idRol: 4, IdDepartamento: 2, Token: '' },
    { idUsuario: 8,  Nombre: 'Felipe',    Apellidos: 'Aguilar Rojas',     Estado: 1, FechaCreacion: '2023-03-01', Clave: '', telefono: '8888-9900', correo: 'felipe@empresa.com',  idRol: 4, IdDepartamento: 3, Token: '' },
    { idUsuario: 9,  Nombre: 'Daniela',   Apellidos: 'Herrera Campos',    Estado: 1, FechaCreacion: '2022-08-14', Clave: '', telefono: '8800-1122', correo: 'daniela@empresa.com', idRol: 4, IdDepartamento: 1, Token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6OX0.DhToken789' },
    { idUsuario: 10, Nombre: 'Ricardo',   Apellidos: 'Soto Fallas',       Estado: 0, FechaCreacion: '2023-07-10', Clave: '', telefono: '8811-3344', correo: 'ricardo@empresa.com', idRol: 4, IdDepartamento: 2, Token: '' },
    { idUsuario: 11, Nombre: 'Camila',    Apellidos: 'Quesada León',      Estado: 1, FechaCreacion: '2021-10-03', Clave: '', telefono: '8822-4455', correo: 'camila@empresa.com',  idRol: 2, IdDepartamento: 4, Token: '' },
    { idUsuario: 12, Nombre: 'Pablo',     Apellidos: 'Araya Badilla',     Estado: 1, FechaCreacion: '2022-02-17', Clave: '', telefono: '8833-5566', correo: 'pablo@empresa.com',   idRol: 4, IdDepartamento: 1, Token: '' },
    { idUsuario: 13, Nombre: 'Natalia',   Apellidos: 'Mora Esquivel',     Estado: 1, FechaCreacion: '2020-05-22', Clave: '', telefono: '8844-6677', correo: 'natalia@empresa.com', idRol: 3, IdDepartamento: 5, Token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTN9.Nat13Token' },
    { idUsuario: 14, Nombre: 'Sebastián', Apellidos: 'Ugalde Sancho',     Estado: 1, FechaCreacion: '2024-01-08', Clave: '', telefono: '8855-7788', correo: 'sebas@empresa.com',   idRol: 4, IdDepartamento: 1, Token: '' },
    { idUsuario: 15, Nombre: 'Adriana',   Apellidos: 'Blanco Villalobos', Estado: 1, FechaCreacion: '2023-09-20', Clave: '', telefono: '8866-8899', correo: 'adriana@empresa.com', idRol: 4, IdDepartamento: 3, Token: '' },
  ];

  // ── Computed ──
  get filteredUsuarios(): Usuario[] {
    const q = this.searchQuery.toLowerCase();
    return this.usuarios.filter(u => {
      const txt = `${u.Nombre} ${u.Apellidos} ${u.correo} ${DEPARTAMENTOS[u.IdDepartamento] ?? ''}`.toLowerCase();
      const estadoOk = this.estadoFilter === '' || u.Estado === +this.estadoFilter;
      const rolOk    = !this.rolFilter    || u.idRol === +this.rolFilter;
      const deptOk   = !this.deptFilter   || u.IdDepartamento === +this.deptFilter;
      return (!q || txt.includes(q)) && estadoOk && rolOk && deptOk;
    });
  }

  get pageSlice(): Usuario[] {
    const start = (this.currentPage - 1) * this.perPage;
    return this.filteredUsuarios.slice(start, start + this.perPage);
  }

  get totalPages(): number[] {
    const count = Math.ceil(this.filteredUsuarios.length / this.perPage) || 1;
    return Array.from({ length: count }, (_, i) => i + 1);
  }

  // ── Helpers ──
  min(a: number, b: number) { return Math.min(a, b); }

  initials(u: Usuario) {
    return ((u.Nombre?.[0] ?? '') + (u.Apellidos?.[0] ?? '')).toUpperCase();
  }

  colorFor(id: number) { return this.COLORS[(id - 1) % this.COLORS.length]; }

  fmtDate(d: string) {
    if (!d) return '—';
    const [y, m, day] = d.split('-');
    return `${day}/${m}/${y}`;
  }

  rolNombre(id: number)  { return ROLES[id] ?? `Rol #${id}`; }
  deptNombre(id: number) { return DEPARTAMENTOS[id] ?? `Depto. #${id}`; }

  rolClass(id: number) {
    const map: Record<number, string> = { 1: 'rol-admin', 2: 'rol-rrhh', 3: 'rol-sup', 4: 'rol-emp' };
    return map[id] ?? '';
  }

  estadoClass(e: number) { return e === 1 ? 'status-activo' : 'status-inactivo'; }

  countByEstado(e: number) { return this.usuarios.filter(u => u.Estado === e).length; }

  countAdmins() { return this.usuarios.filter(u => u.idRol === 1).length; }

  /** Resumen de usuarios por rol para las cards superiores */
  rolesSummary(): RolSummary[] {
    const iconMap: Record<number, { cls: string; svg: string }> = {
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
    return [1, 2, 3, 4].map(idRol => {
      const users = this.usuarios.filter(u => u.idRol === idRol);
      return {
        idRol,
        nombre: ROLES[idRol],
        total:   users.length,
        activos: users.filter(u => u.Estado === 1).length,
        iconClass: iconMap[idRol].cls,
        iconSvg:   iconMap[idRol].svg,
      };
    });
  }

  setRol(idRol: number) {
    // Toggle: si ya estaba activo, limpia el filtro
    if (this.rolActivo === idRol) {
      this.rolActivo = 0;
      this.rolFilter = '';
    } else {
      this.rolActivo = idRol;
      this.rolFilter = String(idRol);
    }
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
    this.showPass = false;
    if (mode === 'create') {
      this.editId = null;
      this.form = {
        Estado: 1,
        FechaCreacion: new Date().toISOString().slice(0, 10),
        idRol: 4,
        IdDepartamento: 1,
        Clave: '',
        Token: '',
      };
    } else {
      const u = this.usuarios.find(x => x.idUsuario === id)!;
      this.editId = u.idUsuario;
      // No pre-cargar la clave — el admin la deja vacía si no quiere cambiarla
      this.form = { ...u, Clave: '' };
    }
    this.showFormModal = true;
  }

  saveUsuario() {
    if (!this.form.Nombre?.trim() || !this.form.Apellidos?.trim()) {
      alert('Nombre y apellidos son requeridos.');
      return;
    }
    if (!this.form.correo?.trim()) {
      alert('El correo es requerido.');
      return;
    }
    if (this.editId) {
      const idx = this.usuarios.findIndex(x => x.idUsuario === this.editId);
      const updated = { ...this.usuarios[idx], ...this.form };
      // Si la clave quedó vacía en edición, conservar la anterior
      if (!this.form.Clave?.trim()) updated.Clave = this.usuarios[idx].Clave;
      this.usuarios[idx] = updated as Usuario;
    } else {
      const newId = Math.max(0, ...this.usuarios.map(x => x.idUsuario)) + 1;
      this.usuarios = [...this.usuarios, {
        idUsuario: newId,
        Token: '',
        ...this.form,
      } as Usuario];
    }
    this.showFormModal = false;
  }

  viewUsuario(id: number) {
    this.viewedUsuario = this.usuarios.find(x => x.idUsuario === id)!;
    this.showViewModal = true;
  }

  askDelete(id: number) {
    const u = this.usuarios.find(x => x.idUsuario === id)!;
    this.deleteTargetId = id;
    this.deleteDesc = `Estás a punto de eliminar al usuario ${u.Nombre} ${u.Apellidos} (${u.correo}). Esta acción no se puede deshacer.`;
    this.showDeleteModal = true;
  }

  confirmDelete() {
    this.usuarios = this.usuarios.filter(x => x.idUsuario !== this.deleteTargetId);
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