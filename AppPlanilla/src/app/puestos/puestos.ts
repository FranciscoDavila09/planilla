import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

interface Puesto {
  idPuestos: number;
  NombrePuesto: string;
  Descripcion: string;
  SalarioBase: number;
  Estado: string;
  idEmpleado?: number;
  idUsuario?: number;
}

interface Empleado { id: number; nombre: string; }
interface Usuario  { id: number; nombre: string; }

@Component({
  selector: 'app-puestos',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './puestos.html',
  styleUrl: './puestos.css',
})
export class Puestos {
  readonly COLORS = ['av-red', 'av-green', 'av-blue', 'av-amber', 'av-violet', 'av-teal'];
  readonly perPage = 8;

  showFormModal   = false;
  showViewModal   = false;
  showDeleteModal = false;

  searchQuery  = '';
  estadoFiltro = '';
  currentPage  = 1;

  editId: number | null = null;
  form: Partial<Puesto> = {};
  viewedPuesto!: Puesto;
  deleteTargetId: number | null = null;

  empleados: Empleado[] = [
    { id: 1,  nombre: 'María Rodríguez López'    },
    { id: 2,  nombre: 'Carlos Mendoza Torres'    },
    { id: 3,  nombre: 'Sofía Vargas Chaves'      },
    { id: 4,  nombre: 'Andrés Jiménez Mora'      },
    { id: 5,  nombre: 'Lucía Pérez Solís'        },
    { id: 6,  nombre: 'Diego Castillo Brenes'    },
    { id: 7,  nombre: 'Valeria Núñez Ulate'      },
    { id: 8,  nombre: 'Felipe Aguilar Rojas'     },
    { id: 9,  nombre: 'Daniela Herrera Campos'   },
    { id: 10, nombre: 'Ricardo Soto Fallas'      },
  ];

  usuarios: Usuario[] = [
    { id: 1, nombre: 'Admin RH'       },
    { id: 2, nombre: 'Supervisor TI'  },
    { id: 3, nombre: 'Gerente RRHH'   },
  ];

  puestos: Puesto[] = [
    { idPuestos: 1,  NombrePuesto: 'Desarrollador Senior',      Descripcion: 'Desarrollo de software, revisión de código y mentoría del equipo técnico.',          SalarioBase: 950000,  Estado: 'Activo',   idEmpleado: 1,  idUsuario: 1 },
    { idPuestos: 2,  NombrePuesto: 'Analista Financiero',       Descripcion: 'Análisis de estados financieros, proyecciones y reportes de gestión.',               SalarioBase: 820000,  Estado: 'Activo',   idEmpleado: 2,  idUsuario: 1 },
    { idPuestos: 3,  NombrePuesto: 'Gerente de Ventas',         Descripcion: 'Liderazgo del equipo comercial, gestión de clientes y cumplimiento de metas.',       SalarioBase: 1100000, Estado: 'Activo',   idEmpleado: 3,  idUsuario: 1 },
    { idPuestos: 4,  NombrePuesto: 'Reclutador',                Descripcion: 'Proceso de selección de personal, entrevistas y onboarding de nuevos empleados.',    SalarioBase: 700000,  Estado: 'Activo',   idEmpleado: 4,  idUsuario: 3 },
    { idPuestos: 5,  NombrePuesto: 'Jefe de Operaciones',       Descripcion: 'Supervisión de procesos operativos, logística y control de calidad.',                SalarioBase: 1050000, Estado: 'Activo',   idEmpleado: 5,  idUsuario: 1 },
    { idPuestos: 6,  NombrePuesto: 'DevOps Engineer',           Descripcion: 'Gestión de infraestructura, CI/CD, contenedores y monitoreo de sistemas.',           SalarioBase: 980000,  Estado: 'Activo',   idEmpleado: 6,  idUsuario: 2 },
    { idPuestos: 7,  NombrePuesto: 'Contadora',                 Descripcion: 'Contabilidad general, declaraciones fiscales y conciliaciones bancarias.',           SalarioBase: 860000,  Estado: 'Activo',   idEmpleado: 7,  idUsuario: 1 },
    { idPuestos: 8,  NombrePuesto: 'Asesor Comercial',          Descripcion: 'Atención al cliente, prospección y cierre de ventas.',                               SalarioBase: 750000,  Estado: 'Activo',   idEmpleado: 8,  idUsuario: 1 },
    { idPuestos: 9,  NombrePuesto: 'Diseñador UX',              Descripcion: 'Diseño de interfaces, investigación de usuarios y prototipado.',                     SalarioBase: 870000,  Estado: 'Activo',   idEmpleado: 9,  idUsuario: 2 },
    { idPuestos: 10, NombrePuesto: 'Auxiliar Contable',         Descripcion: 'Apoyo en registros contables, facturación y archivo de documentos.',                 SalarioBase: 620000,  Estado: 'Inactivo', idEmpleado: 10, idUsuario: 1 },
    { idPuestos: 11, NombrePuesto: 'Gerente Financiero',        Descripcion: 'Dirección del área financiera, presupuestos y estrategia de inversión.',             SalarioBase: 1300000, Estado: 'Activo',   idUsuario: 1 },
    { idPuestos: 12, NombrePuesto: 'Backend Developer',         Descripcion: 'Desarrollo de APIs, microservicios y bases de datos.',                               SalarioBase: 1020000, Estado: 'Activo',   idUsuario: 2 },
    { idPuestos: 13, NombrePuesto: 'QA Engineer',               Descripcion: 'Pruebas de software, automatización y aseguramiento de calidad.',                   SalarioBase: 860000,  Estado: 'Activo',   idUsuario: 2 },
    { idPuestos: 14, NombrePuesto: 'Asistente Administrativa',  Descripcion: 'Soporte administrativo, agenda ejecutiva y gestión documental.',                     SalarioBase: 610000,  Estado: 'Activo',   idUsuario: 3 },
    { idPuestos: 15, NombrePuesto: 'Técnico de Soporte',        Descripcion: 'Soporte técnico a usuarios, mantenimiento de equipos y helpdesk.',                  SalarioBase: 680000,  Estado: 'Activo',   idUsuario: 2 },
  ];

  // ── Computed ──
  get filteredPuestos(): Puesto[] {
    const q = this.searchQuery.toLowerCase();
    return this.puestos.filter(p =>
      (!q || p.NombrePuesto.toLowerCase().includes(q) || p.Descripcion?.toLowerCase().includes(q)) &&
      (!this.estadoFiltro || p.Estado === this.estadoFiltro)
    );
  }

  get pageSlice(): Puesto[] {
    const start = (this.currentPage - 1) * this.perPage;
    return this.filteredPuestos.slice(start, start + this.perPage);
  }

  get totalPages(): number[] {
    const count = Math.ceil(this.filteredPuestos.length / this.perPage) || 1;
    return Array.from({ length: count }, (_, i) => i + 1);
  }

  // ── Helpers ──
  min(a: number, b: number) { return Math.min(a, b); }

  colorFor(id: number) { return this.COLORS[(id - 1) % this.COLORS.length]; }

  fmtSalary(n: number) { return '₡' + Number(n).toLocaleString('es-CR'); }

  estadoClass(s: string) {
    return s === 'Activo' ? 'status-active' : 'status-inactive';
  }

  countByEstado(e: string) { return this.puestos.filter(p => p.Estado === e).length; }

  getSalarioPromedio() {
    if (!this.puestos.length) return '₡0';
    const avg = this.puestos.reduce((s, p) => s + p.SalarioBase, 0) / this.puestos.length;
    return this.fmtSalary(Math.round(avg));
  }

  getSalarioMaximo() {
    if (!this.puestos.length) return '₡0';
    return this.fmtSalary(Math.max(...this.puestos.map(p => p.SalarioBase)));
  }

  getNombreEmpleado(id: number) {
    return this.empleados.find(e => e.id === id)?.nombre ?? '—';
  }

  getNombreUsuario(id: number) {
    return this.usuarios.find(u => u.id === id)?.nombre ?? '—';
  }

  // ── Filtro / paginación ──
  filterTable() { this.currentPage = 1; }
  changePage(d: number) {
    const max = this.totalPages.length;
    this.currentPage = Math.max(1, Math.min(max, this.currentPage + d));
  }
  goPage(n: number) { this.currentPage = n; }

  // ── CRUD ──
  openModal(mode: 'create' | 'edit', id?: number) {
    if (mode === 'create') {
      this.editId = null;
      this.form = { Estado: 'Activo' };
    } else {
      const p = this.puestos.find(x => x.idPuestos === id)!;
      this.editId = p.idPuestos;
      this.form = { ...p };
    }
    this.showViewModal = false;
    this.showFormModal = true;
  }

  savePuesto() {
    if (!this.form.NombrePuesto?.trim()) {
      alert('Por favor ingresa el nombre del puesto.');
      return;
    }
    if (this.editId) {
      const idx = this.puestos.findIndex(p => p.idPuestos === this.editId);
      this.puestos[idx] = { ...this.puestos[idx], ...this.form } as Puesto;
    } else {
      const newId = Math.max(0, ...this.puestos.map(p => p.idPuestos)) + 1;
      this.puestos = [...this.puestos, { idPuestos: newId, ...this.form } as Puesto];
    }
    this.showFormModal = false;
  }

  viewPuesto(id: number) {
    this.viewedPuesto = this.puestos.find(p => p.idPuestos === id)!;
    this.showViewModal = true;
  }

  editFromView() {
    this.showViewModal = false;
    this.openModal('edit', this.viewedPuesto.idPuestos);
  }

  askDelete(id: number) {
    this.deleteTargetId = id;
    this.showDeleteModal = true;
  }

  confirmDelete() {
    this.puestos = this.puestos.filter(p => p.idPuestos !== this.deleteTargetId);
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