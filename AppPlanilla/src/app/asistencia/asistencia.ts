import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';

interface ControlAsistencia {
  idControlAsistencia: number;
  idEmpleados: number;
  nombreEmpleado: string;
  fecha: string;
  horaEntrada: string;
  horaSalida: string;
  estado: string;
  observacion?: string;
  idUsuarios?: number; // si tiene valor = registrado por admin, null = empleado
}

interface Empleado {
  id: number;
  nombre: string;
}

@Component({
  selector: 'app-asistencia',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './asistencia.html',
  styleUrl: './asistencia.css',
})
export class Asistencia implements OnInit, OnDestroy {
  readonly COLORS = ['av-red', 'av-green', 'av-blue', 'av-amber', 'av-violet', 'av-teal'];
  readonly perPage = 8;

  // ── Modales ──
  showFormModal   = false;
  showMarcaModal  = false;
  showDeleteModal = false;

  // ── Filtros ──
  searchQuery  = '';
  fechaFiltro  = '';
  estadoFiltro = '';

  // ── Paginación ──
  currentPage = 1;

  // ── Form ──
  editId: number | null = null;
  form: Partial<ControlAsistencia> = {};

  // ── Marca ──
  marcaEmpleadoId: number | string = '';
  horaActual = '';
  fechaActual = '';
  private clockInterval: any;

  // ── Eliminar ──
  deleteTargetId: number | null = null;

  // ── Empleados (catálogo) ──
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

  // ── Registros ──
  registros: ControlAsistencia[] = [
    { idControlAsistencia: 1,  idEmpleados: 1,  nombreEmpleado: 'María Rodríguez López',  fecha: '2026-03-21', horaEntrada: '07:58', horaSalida: '17:02', estado: 'Presente',  idUsuarios: undefined },
    { idControlAsistencia: 2,  idEmpleados: 2,  nombreEmpleado: 'Carlos Mendoza Torres',  fecha: '2026-03-21', horaEntrada: '08:15', horaSalida: '17:00', estado: 'Tardanza',  idUsuarios: undefined },
    { idControlAsistencia: 3,  idEmpleados: 3,  nombreEmpleado: 'Sofía Vargas Chaves',    fecha: '2026-03-21', horaEntrada: '',      horaSalida: '',      estado: 'Ausente',   idUsuarios: 1 },
    { idControlAsistencia: 4,  idEmpleados: 4,  nombreEmpleado: 'Andrés Jiménez Mora',    fecha: '2026-03-21', horaEntrada: '07:55', horaSalida: '17:05', estado: 'Presente',  idUsuarios: undefined },
    { idControlAsistencia: 5,  idEmpleados: 5,  nombreEmpleado: 'Lucía Pérez Solís',      fecha: '2026-03-21', horaEntrada: '08:00', horaSalida: '',      estado: 'Presente',  idUsuarios: undefined },
    { idControlAsistencia: 6,  idEmpleados: 6,  nombreEmpleado: 'Diego Castillo Brenes',  fecha: '2026-03-21', horaEntrada: '08:30', horaSalida: '17:00', estado: 'Tardanza',  idUsuarios: undefined },
    { idControlAsistencia: 7,  idEmpleados: 7,  nombreEmpleado: 'Valeria Núñez Ulate',    fecha: '2026-03-21', horaEntrada: '',      horaSalida: '',      estado: 'Permiso',   idUsuarios: 1 },
    { idControlAsistencia: 8,  idEmpleados: 8,  nombreEmpleado: 'Felipe Aguilar Rojas',   fecha: '2026-03-21', horaEntrada: '07:50', horaSalida: '17:10', estado: 'Presente',  idUsuarios: undefined },
    { idControlAsistencia: 9,  idEmpleados: 9,  nombreEmpleado: 'Daniela Herrera Campos', fecha: '2026-03-20', horaEntrada: '08:00', horaSalida: '17:00', estado: 'Presente',  idUsuarios: undefined },
    { idControlAsistencia: 10, idEmpleados: 10, nombreEmpleado: 'Ricardo Soto Fallas',    fecha: '2026-03-20', horaEntrada: '',      horaSalida: '',      estado: 'Ausente',   idUsuarios: 1 },
    { idControlAsistencia: 11, idEmpleados: 1,  nombreEmpleado: 'María Rodríguez López',  fecha: '2026-03-20', horaEntrada: '07:59', horaSalida: '17:01', estado: 'Presente',  idUsuarios: undefined },
    { idControlAsistencia: 12, idEmpleados: 2,  nombreEmpleado: 'Carlos Mendoza Torres',  fecha: '2026-03-20', horaEntrada: '08:00', horaSalida: '17:00', estado: 'Presente',  idUsuarios: undefined },
    { idControlAsistencia: 13, idEmpleados: 3,  nombreEmpleado: 'Sofía Vargas Chaves',    fecha: '2026-03-19', horaEntrada: '08:05', horaSalida: '17:00', estado: 'Presente',  idUsuarios: undefined },
    { idControlAsistencia: 14, idEmpleados: 4,  nombreEmpleado: 'Andrés Jiménez Mora',    fecha: '2026-03-19', horaEntrada: '08:45', horaSalida: '17:00', estado: 'Tardanza',  idUsuarios: undefined },
    { idControlAsistencia: 15, idEmpleados: 5,  nombreEmpleado: 'Lucía Pérez Solís',      fecha: '2026-03-19', horaEntrada: '07:55', horaSalida: '17:05', estado: 'Presente',  idUsuarios: undefined },
    { idControlAsistencia: 16, idEmpleados: 6,  nombreEmpleado: 'Diego Castillo Brenes',  fecha: '2026-03-19', horaEntrada: '',      horaSalida: '',      estado: 'Ausente',   idUsuarios: 1 },
  ];

  ngOnInit() {
    this.actualizarReloj();
    this.clockInterval = setInterval(() => this.actualizarReloj(), 1000);
    // Fecha de hoy por defecto en el filtro
    const hoy = new Date().toISOString().split('T')[0];
    this.fechaFiltro = hoy;
  }

  ngOnDestroy() {
    clearInterval(this.clockInterval);
  }

  private actualizarReloj() {
    const now = new Date();
    this.horaActual = now.toLocaleTimeString('es-CR', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    this.fechaActual = now.toLocaleDateString('es-CR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  }

  // ── Computed ──
  get filteredRegistros(): ControlAsistencia[] {
    const q = this.searchQuery.toLowerCase();
    return this.registros.filter(r =>
      (!q || r.nombreEmpleado.toLowerCase().includes(q)) &&
      (!this.fechaFiltro || r.fecha === this.fechaFiltro) &&
      (!this.estadoFiltro || r.estado === this.estadoFiltro)
    );
  }

  get pageSlice(): ControlAsistencia[] {
    const start = (this.currentPage - 1) * this.perPage;
    return this.filteredRegistros.slice(start, start + this.perPage);
  }

  get totalPages(): number[] {
    const count = Math.ceil(this.filteredRegistros.length / this.perPage) || 1;
    return Array.from({ length: count }, (_, i) => i + 1);
  }

  // ── Helpers ──
  min(a: number, b: number) { return Math.min(a, b); }

  inicialesNombre(nombre: string) {
    const partes = nombre.split(' ');
    return (partes[0][0] + (partes[1]?.[0] ?? '')).toUpperCase();
  }

  colorFor(id: number) { return this.COLORS[(id - 1) % this.COLORS.length]; }

  fmtFecha(f: string) {
    if (!f) return '—';
    const [y, m, d] = f.split('-');
    return `${d}/${m}/${y}`;
  }

  calcularHoras(entrada: string, salida: string): string {
    if (!entrada || !salida) return '—';
    const [eh, em] = entrada.split(':').map(Number);
    const [sh, sm] = salida.split(':').map(Number);
    const minutos = (sh * 60 + sm) - (eh * 60 + em);
    if (minutos <= 0) return '—';
    const h = Math.floor(minutos / 60);
    const m = minutos % 60;
    return `${h}h ${m.toString().padStart(2, '0')}m`;
  }

  estadoClass(s: string) {
    if (s === 'Presente')  return 'status-active';
    if (s === 'Tardanza')  return 'status-tardanza';
    if (s === 'Permiso')   return 'status-vacation';
    return 'status-inactive';
  }

  countByEstado(estado: string) {
    const hoy = new Date().toISOString().split('T')[0];
    return this.registros.filter(r => r.fecha === hoy && r.estado === estado).length;
  }

  getPorcentaje() {
    const hoy = new Date().toISOString().split('T')[0];
    const hoyRegistros = this.registros.filter(r => r.fecha === hoy);
    if (!hoyRegistros.length) return 0;
    const presentes = hoyRegistros.filter(r => r.estado === 'Presente' || r.estado === 'Tardanza').length;
    return Math.round((presentes / hoyRegistros.length) * 100);
  }

  // ── Filtro / paginación ──
  filterTable() { this.currentPage = 1; }
  changePage(d: number) {
    const max = this.totalPages.length;
    this.currentPage = Math.max(1, Math.min(max, this.currentPage + d));
  }
  goPage(n: number) { this.currentPage = n; }

  onEmpleadoChange() {
    const emp = this.empleados.find(e => e.id === Number(this.form.idEmpleados));
    if (emp) this.form.nombreEmpleado = emp.nombre;
  }

  // ── CRUD ──
  openModal(mode: 'manual' | 'edit', registro?: ControlAsistencia) {
    if (mode === 'manual') {
      this.editId = null;
      const hoy = new Date().toISOString().split('T')[0];
      this.form = { fecha: hoy, estado: 'Presente', idUsuarios: 1 };
    } else if (registro) {
      this.editId = registro.idControlAsistencia;
      this.form = { ...registro };
    }
    this.showFormModal = true;
  }

  saveRegistro() {
    if (!this.form.idEmpleados || !this.form.fecha) {
      alert('Por favor selecciona un empleado y una fecha.');
      return;
    }
    if (this.editId) {
      const idx = this.registros.findIndex(r => r.idControlAsistencia === this.editId);
      this.registros[idx] = { ...this.registros[idx], ...this.form } as ControlAsistencia;
    } else {
      const newId = Math.max(0, ...this.registros.map(r => r.idControlAsistencia)) + 1;
      this.registros = [...this.registros, { idControlAsistencia: newId, ...this.form } as ControlAsistencia];
    }
    this.showFormModal = false;
  }

  marcarEntrada() {
    this.marcaEmpleadoId = '';
    this.showMarcaModal = true;
  }

  registrarMarca(tipo: 'entrada' | 'salida') {
    if (!this.marcaEmpleadoId) { alert('Selecciona un empleado.'); return; }
    const emp = this.empleados.find(e => e.id === Number(this.marcaEmpleadoId))!;
    const hoy = new Date().toISOString().split('T')[0];
    const ahora = new Date().toLocaleTimeString('es-CR', { hour: '2-digit', minute: '2-digit' });
    const existente = this.registros.find(r => r.idEmpleados === emp.id && r.fecha === hoy);

    if (existente) {
      if (tipo === 'entrada') existente.horaEntrada = ahora;
      else existente.horaSalida = ahora;
      this.registros = [...this.registros];
    } else {
      const newId = Math.max(0, ...this.registros.map(r => r.idControlAsistencia)) + 1;
      const hora = new Date();
      const esHoraNormal = hora.getHours() < 8 || (hora.getHours() === 8 && hora.getMinutes() === 0);
      this.registros = [...this.registros, {
        idControlAsistencia: newId,
        idEmpleados: emp.id,
        nombreEmpleado: emp.nombre,
        fecha: hoy,
        horaEntrada: tipo === 'entrada' ? ahora : '',
        horaSalida: tipo === 'salida' ? ahora : '',
        estado: hora.getHours() > 8 ? 'Tardanza' : 'Presente',
      }];
    }
    this.showMarcaModal = false;
  }

  askDelete(id: number) {
    this.deleteTargetId = id;
    this.showDeleteModal = true;
  }

  confirmDelete() {
    this.registros = this.registros.filter(r => r.idControlAsistencia !== this.deleteTargetId);
    this.deleteTargetId = null;
    this.showDeleteModal = false;
  }

  onOverlayClick(event: MouseEvent, modal: 'form' | 'marca' | 'delete') {
    if (event.target === event.currentTarget) {
      if (modal === 'form')   this.showFormModal   = false;
      if (modal === 'marca')  this.showMarcaModal  = false;
      if (modal === 'delete') this.showDeleteModal = false;
    }
  }
}