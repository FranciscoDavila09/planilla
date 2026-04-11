import { Component, inject, signal, OnInit } from '@angular/core';

import { HttpClient } from '@angular/common/http';

import { FormsModule } from '@angular/forms';

interface Empleado {
  id: number;
  nombre: string;
  apellidos: string;
  cedula: string;
  telefono: string;
  correo: string;
  puesto: string;
  departamento: string;
  salario: number;
  ingreso: string;
  estado: string;
}

@Component({
  selector: 'app-empleados',
  standalone: true,
  imports: [FormsModule],   
  templateUrl: './empleados.html',
  styleUrl: './empleados.css',
})
export class Empleados {
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

  viewedEmployee!: Empleado;   // siempre se asigna antes de abrir el modal

  deleteTargetId: number | null = null;
  deleteDesc = '';

  employees: Empleado[] = [
    { id: 1,  nombre: 'María',     apellidos: 'Rodríguez López',   cedula: '1-0234-5678', telefono: '8811-2233', correo: 'maria@empresa.com',    puesto: 'Desarrolladora Senior',    departamento: 'TI',          salario: 950000,  ingreso: '2021-03-15', estado: 'Activo'     },
    { id: 2,  nombre: 'Carlos',    apellidos: 'Mendoza Torres',    cedula: '2-0987-6543', telefono: '8822-3344', correo: 'carlos@empresa.com',   puesto: 'Analista Financiero',      departamento: 'Finanzas',    salario: 820000,  ingreso: '2019-07-01', estado: 'Activo'     },
    { id: 3,  nombre: 'Sofía',     apellidos: 'Vargas Chaves',     cedula: '3-1234-7890', telefono: '8833-4455', correo: 'sofia@empresa.com',    puesto: 'Gerente de Ventas',        departamento: 'Ventas',      salario: 1100000, ingreso: '2018-01-10', estado: 'Vacaciones' },
    { id: 4,  nombre: 'Andrés',    apellidos: 'Jiménez Mora',      cedula: '1-0543-2109', telefono: '8844-5566', correo: 'andres@empresa.com',   puesto: 'Reclutador',               departamento: 'RRHH',        salario: 700000,  ingreso: '2022-06-20', estado: 'Activo'     },
    { id: 5,  nombre: 'Lucía',     apellidos: 'Pérez Solís',       cedula: '4-0321-8765', telefono: '8855-6677', correo: 'lucia@empresa.com',    puesto: 'Jefa de Operaciones',      departamento: 'Operaciones', salario: 1050000, ingreso: '2017-09-05', estado: 'Activo'     },
    { id: 6,  nombre: 'Diego',     apellidos: 'Castillo Brenes',   cedula: '2-1098-3456', telefono: '8866-7788', correo: 'diego@empresa.com',    puesto: 'DevOps Engineer',          departamento: 'TI',          salario: 980000,  ingreso: '2020-11-12', estado: 'Activo'     },
    { id: 7,  nombre: 'Valeria',   apellidos: 'Núñez Ulate',       cedula: '5-0765-4321', telefono: '8877-8899', correo: 'valeria@empresa.com',  puesto: 'Contadora',                departamento: 'Finanzas',    salario: 860000,  ingreso: '2021-01-25', estado: 'Vacaciones' },
    { id: 8,  nombre: 'Felipe',    apellidos: 'Aguilar Rojas',     cedula: '3-0432-9876', telefono: '8888-9900', correo: 'felipe@empresa.com',   puesto: 'Asesor Comercial',         departamento: 'Ventas',      salario: 750000,  ingreso: '2023-03-01', estado: 'Activo'     },
    { id: 9,  nombre: 'Daniela',   apellidos: 'Herrera Campos',    cedula: '1-0876-5432', telefono: '8800-1122', correo: 'daniela@empresa.com',  puesto: 'Diseñadora UX',            departamento: 'TI',          salario: 870000,  ingreso: '2022-08-14', estado: 'Activo'     },
    { id: 10, nombre: 'Ricardo',   apellidos: 'Soto Fallas',       cedula: '2-0543-1098', telefono: '8811-3344', correo: 'ricardo@empresa.com',  puesto: 'Auxiliar Contable',        departamento: 'Finanzas',    salario: 620000,  ingreso: '2023-07-10', estado: 'Inactivo'   },
    { id: 11, nombre: 'Camila',    apellidos: 'Quesada León',      cedula: '4-0987-6543', telefono: '8822-4455', correo: 'camila@empresa.com',   puesto: 'Analista de RRHH',         departamento: 'RRHH',        salario: 730000,  ingreso: '2021-10-03', estado: 'Activo'     },
    { id: 12, nombre: 'Pablo',     apellidos: 'Araya Badilla',     cedula: '3-0654-3219', telefono: '8833-5566', correo: 'pablo@empresa.com',    puesto: 'Técnico de Soporte',       departamento: 'TI',          salario: 680000,  ingreso: '2022-02-17', estado: 'Activo'     },
    { id: 13, nombre: 'Natalia',   apellidos: 'Mora Esquivel',     cedula: '5-0321-7654', telefono: '8844-6677', correo: 'natalia@empresa.com',  puesto: 'Supervisora',              departamento: 'Operaciones', salario: 800000,  ingreso: '2020-05-22', estado: 'Activo'     },
    { id: 14, nombre: 'Sebastián', apellidos: 'Ugalde Sancho',     cedula: '1-0789-4567', telefono: '8855-7788', correo: 'sebas@empresa.com',    puesto: 'Programador Jr.',          departamento: 'TI',          salario: 650000,  ingreso: '2024-01-08', estado: 'Activo'     },
    { id: 15, nombre: 'Adriana',   apellidos: 'Blanco Villalobos', cedula: '2-0234-8901', telefono: '8866-8899', correo: 'adriana@empresa.com',  puesto: 'Vendedora',                departamento: 'Ventas',      salario: 700000,  ingreso: '2023-09-20', estado: 'Activo'     },
    { id: 16, nombre: 'Marco',     apellidos: 'Zúñiga Madrigal',   cedula: '4-0678-2345', telefono: '8877-9900', correo: 'marco@empresa.com',    puesto: 'Coordinador',              departamento: 'Operaciones', salario: 850000,  ingreso: '2019-12-01', estado: 'Vacaciones' },
    { id: 17, nombre: 'Gabriela',  apellidos: 'Chaves Elizondo',   cedula: '3-0901-6789', telefono: '8888-0011', correo: 'gaby@empresa.com',     puesto: 'Analista TI',              departamento: 'TI',          salario: 900000,  ingreso: '2021-05-19', estado: 'Activo'     },
    { id: 18, nombre: 'Jorge',     apellidos: 'Leiva Segura',      cedula: '5-0456-1234', telefono: '8800-2233', correo: 'jorge@empresa.com',    puesto: 'Gerente Financiero',       departamento: 'Finanzas',    salario: 1300000, ingreso: '2016-08-14', estado: 'Activo'     },
    { id: 19, nombre: 'Patricia',  apellidos: 'Oviedo Romero',     cedula: '1-0123-9012', telefono: '8811-4455', correo: 'pati@empresa.com',     puesto: 'Asistente Administrativa', departamento: 'RRHH',        salario: 610000,  ingreso: '2023-11-05', estado: 'Activo'     },
    { id: 20, nombre: 'Esteban',   apellidos: 'Murillo Arce',      cedula: '2-0890-4567', telefono: '8822-5566', correo: 'esteban@empresa.com',  puesto: 'Backend Developer',        departamento: 'TI',          salario: 1020000, ingreso: '2020-03-30', estado: 'Activo'     },
    { id: 21, nombre: 'Rosa',      apellidos: 'Vega Portuguez',    cedula: '4-0567-8901', telefono: '8833-6677', correo: 'rosa@empresa.com',     puesto: 'Ejecutiva de Cuentas',     departamento: 'Ventas',      salario: 780000,  ingreso: '2022-07-18', estado: 'Activo'     },
    { id: 22, nombre: 'Manuel',    apellidos: 'Cordero Arias',     cedula: '3-0234-5679', telefono: '8844-7788', correo: 'manuel@empresa.com',   puesto: 'Auditor',                  departamento: 'Finanzas',    salario: 940000,  ingreso: '2018-10-23', estado: 'Activo'     },
    { id: 23, nombre: 'Karina',    apellidos: 'Fonseca Molina',    cedula: '5-0901-2345', telefono: '8855-8899', correo: 'karina@empresa.com',   puesto: 'Logística',                departamento: 'Operaciones', salario: 720000,  ingreso: '2021-12-14', estado: 'Activo'     },
    { id: 24, nombre: 'Ignacio',   apellidos: 'Portuguez Salas',   cedula: '1-0456-7891', telefono: '8866-9900', correo: 'ignacio@empresa.com',  puesto: 'QA Engineer',              departamento: 'TI',          salario: 860000,  ingreso: '2022-04-06', estado: 'Activo'     },
  ];

  // ── Computed ──
  get filteredEmployees(): Empleado[] {
    const q = this.searchQuery.toLowerCase();
    return this.employees.filter(e => {
      const full = `${e.nombre} ${e.apellidos} ${e.cedula} ${e.puesto}`.toLowerCase();
      return (
        (!q || full.includes(q)) &&
        (!this.statusFilter || e.estado === this.statusFilter) &&
        (!this.deptFilter   || e.departamento === this.deptFilter)
      );
    });
  }

  get pageSlice(): Empleado[] {
    const start = (this.currentPage - 1) * this.perPage;
    return this.filteredEmployees.slice(start, start + this.perPage);
  }

  get totalPages(): number[] {
    const count = Math.ceil(this.filteredEmployees.length / this.perPage) || 1;
    return Array.from({ length: count }, (_, i) => i + 1);
  }

  // ── Helpers ──
  min(a: number, b: number) { return Math.min(a, b); }
  initials(e: Empleado)     { return (e.nombre[0] + e.apellidos[0]).toUpperCase(); }
  colorFor(id: number)      { return this.COLORS[(id - 1) % this.COLORS.length]; }
  fmtSalary(n: number)      { return '₡' + Number(n).toLocaleString('es-CR'); }
  fmtDate(d: string) {
    if (!d) return '—';
    const [y, m, day] = d.split('-');
    return `${day}/${m}/${y}`;
  }
  statusClass(s: string) {
    if (s === 'Activo')     return 'status-active';
    if (s === 'Vacaciones') return 'status-vacation';
    return 'status-inactive';
  }
  countByStatus(s: string) { return this.employees.filter(e => e.estado === s).length; }

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
      this.form = { estado: 'Activo' };
    } else {
      const e = this.employees.find(x => x.id === id)!;
      this.editId = e.id;
      this.form = { ...e };
    }
    this.showFormModal = true;
  }

  saveEmployee() {
    if (!this.form.nombre?.trim() || !this.form.apellidos?.trim()) {
      alert('Por favor completa al menos nombre y apellidos.');
      return;
    }
    if (this.editId) {
      const idx = this.employees.findIndex(x => x.id === this.editId);
      this.employees[idx] = { ...this.employees[idx], ...this.form } as Empleado;
    } else {
      const newId = Math.max(0, ...this.employees.map(x => x.id)) + 1;
      this.employees = [...this.employees, { id: newId, ...this.form } as Empleado];
    }
    this.showFormModal = false;
  }

  viewEmployee(id: number) {
    this.viewedEmployee = this.employees.find(x => x.id === id)!;
    this.showViewModal = true;
  }

  askDelete(id: number) {
    const e = this.employees.find(x => x.id === id)!;
    this.deleteTargetId = id;
    this.deleteDesc = `Estás a punto de eliminar a ${e.nombre} ${e.apellidos}. Esta acción no se puede deshacer.`;
    this.showDeleteModal = true;
  }

  confirmDelete() {
    this.employees = this.employees.filter(x => x.id !== this.deleteTargetId);
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
