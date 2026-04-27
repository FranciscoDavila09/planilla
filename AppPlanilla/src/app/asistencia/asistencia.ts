import { Component, OnInit, OnDestroy, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';

interface ControlAsistencia {
  idControlAsistencia: number;
  idEmpleados: number;
  nombreEmpleado: string;
  HoraEntrada: string;
  HoraSalida: string;
  estado: string;
  observacion?: string;
  idUsuarios?: number;
  fecha: string | null; // Cambiado para permitir null explícito
}

interface Empleado {
  idEmpleado: number;
  Nombre: string;
  Apellidos: string;
}

@Component({
  selector: 'app-asistencia',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './asistencia.html',
  styleUrl: './asistencia.css',
})
export class Asistencia implements OnInit, OnDestroy {
  private readonly http = inject(HttpClient);
  private readonly API_URL = 'http://localhost';
  private readonly ASISTENCIA_URL = `${this.API_URL}/ControlAsistenciaServicio/`;
  private readonly EMPLEADO_URL = `${this.API_URL}/EmpleadoServicio/`;

  protected readonly Registros = signal<ControlAsistencia[]>([]);
  protected readonly Empleados = signal<Empleado[]>([]);

  readonly COLORS = ['av-red', 'av-green', 'av-blue', 'av-amber', 'av-violet', 'av-teal'];
  readonly perPage = 8;

  // ── Modales ──
  showFormModal = false;
  showMarcaModal = false;
  showDeleteModal = false;

  // ── Filtros ──
  searchQuery = '';
  fechaFiltro = '';
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

  ngOnInit() {
    this.actualizarReloj();
    this.clockInterval = setInterval(() => this.actualizarReloj(), 1000);
    
    // Inicializamos con la fecha de hoy para el filtro por defecto
    const hoy = new Date().toISOString().split('T')[0];
    this.fechaFiltro = '';
    
    this.getEmpleados(); // Primero empleados para poder mapear nombres
    this.getRegistros();
  }

  ngOnDestroy() {
    clearInterval(this.clockInterval);
  }

  private actualizarReloj() {
    const now = new Date();
    this.horaActual = now.toLocaleTimeString('es-CR', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    this.fechaActual = now.toLocaleDateString('es-CR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  }

  // ── HTTP GET ──
 getRegistros(): void {
  this.http.get<any[]>(`${this.ASISTENCIA_URL}listarControlAsistencia`).subscribe({
    next: (data) => {
      const empleados = this.Empleados();
      const mapped: ControlAsistencia[] = data.map(r => {
        const emp = empleados.find(e => e.idEmpleado === r.idEmpleados);
        
        // El TIMESTAMP viene como "2026-04-26 19:13:08" o con "T"
        // Extraemos solo la parte de la fecha para el filtro
        let fechaLimpia = r.Fecha || r.fecha;
        if (fechaLimpia && typeof fechaLimpia === 'string') {
          fechaLimpia = fechaLimpia.split(' ')[0].split('T')[0];
        }

        return {
          ...r, // Copiamos las propiedades originales
          nombreEmpleado: emp ? `${emp.Nombre} ${emp.Apellidos}` : '—',
          fecha: fechaLimpia || null, // Esto es lo que usará el filtro y fmtFecha
          estado: r.estado || 'Presente'
        };
      });
      this.Registros.set(mapped);
    }
  });
}

  getEmpleados(): void {
    this.http.get<Empleado[]>(`${this.EMPLEADO_URL}listarEmpleados`).subscribe({
      next: (data) => this.Empleados.set(data),
      error: (err) => console.error('Error al obtener empleados:', err)
    });
  }

  // ── HTTP POST ──
  crearRegistro(registro: Partial<ControlAsistencia>): void {
    const body = {
      HoraEntrada: registro.HoraEntrada,
      HoraSalida: registro.HoraSalida|| null,
      idEmpleados: registro.idEmpleados,
      idUsuarios: registro.idUsuarios ?? 1,
      Fecha: registro.fecha // Enviamos con F mayúscula para el backend
    };

    this.http.post(`${this.ASISTENCIA_URL}insertar`, body).subscribe({
      next: () => this.getRegistros(),
      error: (err) => console.error('Error al crear registro:', err)
    });
  }

  // ── HTTP PUT ──
  actualizarRegistro(registro: Partial<ControlAsistencia>): void {
    const body = {
      idControlAsistencia: registro.idControlAsistencia,
      HoraEntrada: registro.HoraEntrada,
      HoraSalida: registro.HoraSalida,
      idEmpleados: registro.idEmpleados,
      idUsuarios: registro.idUsuarios ?? 1,
      Fecha: registro.fecha // Aseguramos enviar la fecha editada
    };

    this.http.put(`${this.ASISTENCIA_URL}actualizar`, body).subscribe({
      next: () => this.getRegistros(),
      error: (err) => console.error('Error al actualizar registro:', err)
    });
  }

  // ── HTTP DELETE ──
  eliminarRegistro(id: number): void {
    this.http.delete(`${this.ASISTENCIA_URL}eliminar`, { params: { id } }).subscribe({
      next: () => this.getRegistros(),
      error: (err) => console.error('Error al eliminar registro:', err)
    });
  }

  // ── Computed ──
  get filteredRegistros(): ControlAsistencia[] {
    const q = this.searchQuery.toLowerCase();
    const f = this.fechaFiltro;

    return this.Registros().filter(r => {
      const coincideNombre = !q || r.nombreEmpleado?.toLowerCase().includes(q);
      const coincideEstado = !this.estadoFiltro || r.estado === this.estadoFiltro;
      
      // Si no hay filtro de fecha, muestra todo (incluyendo null)
      // Si hay filtro, solo muestra coincidencias exactas (null desaparece)
      const coincideFecha = !f || r.fecha === f;

      return coincideNombre && coincideEstado && coincideFecha;
    });
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
    if (!nombre || nombre === '—') return '?';
    const partes = nombre.split(' ');
    return (partes[0][0] + (partes[1]?.[0] ?? '')).toUpperCase();
  }

  colorFor(id: number) { return this.COLORS[(id - 1) % this.COLORS.length]; }

  fmtFecha(f: string | null) {
    if (!f) return 'null'; // Texto explícito para registros viejos
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
    if (s === 'Presente') return 'status-active';
    if (s === 'Tardanza') return 'status-tardanza';
    if (s === 'Permiso')  return 'status-vacation';
    return 'status-inactive';
  }

  countByEstado(estado: string) {
    const hoy = new Date().toISOString().split('T')[0];
    return this.Registros().filter(r => r.fecha === hoy && r.estado === estado).length;
  }

  getPorcentaje() {
    const hoy = new Date().toISOString().split('T')[0];
    const hoyRegistros = this.Registros().filter(r => r.fecha === hoy);
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
    const emp = this.Empleados().find(e => e.idEmpleado === Number(this.form.idEmpleados));
    if (emp) this.form.nombreEmpleado = `${emp.Nombre} ${emp.Apellidos}`;
  }

  // ── CRUD ──
  openModal(mode: 'manual' | 'edit', registro?: ControlAsistencia) {
    if (mode === 'manual') {
      this.editId = null;
      this.form = { 
        HoraEntrada: '', 
        HoraSalida: '', 
        estado: 'Presente', 
        idUsuarios: 1,
        fecha: new Date().toISOString().split('T')[0] // Sugerir fecha hoy
      };
    } else if (registro) {
      this.editId = registro.idControlAsistencia;
      this.form = { ...registro };
    }
    this.showFormModal = true;
  }

  saveRegistro() {
    if (!this.form.idEmpleados) {
      alert('Por favor selecciona un empleado.');
      return;
    }
    if (this.editId) {
      this.actualizarRegistro({ ...this.form, idControlAsistencia: this.editId });
    } else {
      this.crearRegistro(this.form);
    }
    this.showFormModal = false;
  }

  marcarEntrada() {
    this.marcaEmpleadoId = '';
    this.showMarcaModal = true;
  }

 registrarMarca(tipo: 'entrada' | 'salida') {
  if (!this.marcaEmpleadoId) {
    alert('Selecciona un empleado.');
    return;
  }

  const ahora = new Date().toLocaleTimeString('es-CR', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  });

  const hoy = new Date().toISOString().split('T')[0];

  const registroHoy = this.Registros().find(r =>
    r.idEmpleados === Number(this.marcaEmpleadoId) &&
    r.fecha === hoy
  );

  // ───── ENTRADA ─────
 // ───── ENTRADA ─────
  if (tipo === 'entrada') {

    if (registroHoy) {
      alert('Este empleado ya marcó entrada hoy');
      return;
    }

    this.crearRegistro({
      idEmpleados: Number(this.marcaEmpleadoId),
      HoraEntrada: ahora,
      HoraSalida: '', // 👈 Cambia null por un string vacío
      fecha: hoy,
      estado: 'Presente'
    });

  }

  // ───── SALIDA ─────
  if (tipo === 'salida') {

    if (!registroHoy) {
      alert('Primero debe marcar entrada');
      return;
    }

    if (registroHoy.HoraSalida) {
      alert('La salida ya fue registrada');
      return;
    }

    this.actualizarRegistro({
      idControlAsistencia: registroHoy.idControlAsistencia,
      HoraEntrada: registroHoy.HoraEntrada,
      HoraSalida: ahora,
      idEmpleados: registroHoy.idEmpleados,
      fecha: hoy
    });
  }

  this.showMarcaModal = false;
}

  askDelete(id: number) {
    this.deleteTargetId = id;
    this.showDeleteModal = true;
  }

  confirmDelete() {
    if (this.deleteTargetId !== null) {
      this.eliminarRegistro(this.deleteTargetId);
    }
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