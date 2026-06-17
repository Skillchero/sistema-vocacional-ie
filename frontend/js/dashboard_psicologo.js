document.addEventListener('DOMContentLoaded', () => {
    
    // =====================================================================
    // LÓGICA DE CONTROL DE IDENTIDAD Y ROLES DINÁMICOS
    // =====================================================================
    const urlParams = new URLSearchParams(window.location.search);
    const rolDesdeUrl = urlParams.get('rol'); 
    const nombreDesdeUrl = urlParams.get('nombre');

    const nombreGuardado = localStorage.getItem('userNombre');
    const roleFinal = rolDesdeUrl || localStorage.getItem('userRole') || 'Psicologo';
    const nameFinal = nombreDesdeUrl || nombreGuardado || "Usuario";

    const userDisplay = document.getElementById('user-display');
    const sidebarRole = document.getElementById('sidebar-role');

    if (sidebarRole) {
        if (roleFinal.toLowerCase() === 'psicologo' || roleFinal.toLowerCase() === 'psicólogo') {
            sidebarRole.innerText = "Panel Psicología";
        } else {
            sidebarRole.innerText = "Panel Tutoría";
        }
    }

    if (userDisplay) {
        userDisplay.innerText = nameFinal;
    }

    // =====================================================================
    // LÓGICA DE BASE DE DATOS REAL (PYTHON + POSTGRESQL)
    // =====================================================================
    let todosLosAlumnos = []; 

    const tablaAlumnos = document.getElementById('tabla-alumnos');
    const buscador = document.getElementById('buscador');
    const filtroSeccion = document.getElementById('filtro-seccion');
    
    const elTotalAlumnos = document.getElementById('total-alumnos');
    const elTotalEvaluados = document.getElementById('total-evaluados');
    const elTotalPendientes = document.getElementById('total-pendientes');

    async function cargarAlumnos() {
        try {
            const response = await fetch('http://localhost:8001/api/psicologo/alumnos');
            const result = await response.json();

            if (result.status === "success") {
                todosLosAlumnos = result.data;
                actualizarMetricas(todosLosAlumnos);
                renderizarTabla(todosLosAlumnos);
            } else {
                mostrarError("Error al cargar los datos de la base de datos.");
            }
        } catch (error) {
            console.error("Error Fetch:", error);
            mostrarError("No se pudo conectar al servidor Python (Verifica main.py).");
        }
    }

    function renderizarTabla(datos) {
        if (!tablaAlumnos) return;
        tablaAlumnos.innerHTML = '';
        
        if (datos.length === 0) {
            mostrarError("No se encontraron registros de estudiantes con esos datos.");
            return;
        }

        datos.forEach(alumno => {
            const tr = document.createElement('tr');
            
            const tieneTest = alumno.intentos > 0;
            const estadoTexto = tieneTest ? 'Completado' : 'Pendiente';
            const badgeClass = tieneTest ? 'badge completado' : 'badge pendiente';
            
            // LLAMADA AL ENDPOINT: Enviamos alumno.usuario_id que requiere la API de historial
            const actionButton = tieneTest 
                ? `<div style="text-align: center;"><button onclick="abrirInformePsicologo('${alumno.usuario_id}')" class="btn-ver" style="cursor: pointer; background: #3D52A0; color: white; border: none; padding: 5px 10px; border-radius: 5px;">Ver Informe</button></div>`
                : `<div style="text-align: center;"><span class="txt-null" style="color: #999;">Pendiente</span></div>`;

            const idCorto = alumno.estudiante_id.substring(0, 8).toUpperCase();

            tr.innerHTML = `
                <td><code>${idCorto}</code></td>
                <td><strong>${alumno.apellidos}</strong>, ${alumno.nombres}</td>
                <td>5to ${alumno.seccion || '-'}</td>
                <td>${tieneTest ? 'Registrado' : '-'}</td>
                <td><span class="${badgeClass}">${estadoTexto} ${tieneTest ? `(${alumno.intentos})` : ''}</span></td>
                <td>${actionButton}</td>
            `;
            tablaAlumnos.appendChild(tr);
        });
    }

    function filtrarData() {
        const busqueda = buscador.value.toLowerCase().trim();
        const opcionSelect = filtroSeccion.value; 
        const seccionBuscada = opcionSelect === 'todos' ? 'todos' : opcionSelect.replace("5to ", "").trim();

        const resultadoFiltrado = todosLosAlumnos.filter(alumno => {
            const nombreCompleto = `${alumno.nombres} ${alumno.apellidos}`.toLowerCase();
            const coincideTexto = nombreCompleto.includes(busqueda) || alumno.estudiante_id.includes(busqueda);
            const coincideSeccion = seccionBuscada === 'todos' || alumno.seccion === seccionBuscada;
            return coincideTexto && coincideSeccion;
        });

        renderizarTabla(resultadoFiltrado);
    }

    function actualizarMetricas(lista) {
        const total = lista.length;
        const evaluados = lista.filter(a => a.intentos > 0).length;
        const pendientes = total - evaluados;

        if(elTotalAlumnos) elTotalAlumnos.innerText = total;
        if(elTotalEvaluados) elTotalEvaluados.innerText = evaluados;
        if(elTotalPendientes) elTotalPendientes.innerText = pendientes;
    }

    function mostrarError(mensaje) {
        tablaAlumnos.innerHTML = `<tr><td colspan="6" style="text-align: center; color: #64748b; padding: 2.5rem;">${mensaje}</td></tr>`;
    }

    if (buscador) buscador.addEventListener('input', filtrarData);
    if (filtroSeccion) filtroSeccion.addEventListener('change', filtrarData);

    cargarAlumnos();
});

// =====================================================================
// CONSUMO DE LA API DE HISTORIAL REAL DESDE EL DASHBOARD DEL PSICÓLOGO
// =====================================================================
async function abrirInformePsicologo(usuarioId) { 
    const modalInforme = document.getElementById('modal-informe');
    const cuerpoInforme = document.getElementById('modal-cuerpo-informe');
    const campoFecha = document.getElementById('modal-fecha');

    // Cambiamos el display del modal a activo usando estilos en línea (flex)
    if (modalInforme) {
        modalInforme.style.display = 'flex';
    }
    
    cuerpoInforme.innerHTML = '<div style="text-align:center; padding: 40px;"><i class="fas fa-spinner fa-spin fa-3x" style="color:#3D52A0;"></i><br><br>Obteniendo informe de la base de datos...</div>';
    campoFecha.innerText = '--/--/----';

    try {
        // Ejecuta la consulta directa a tu API usando el ID de la cuenta del alumno
        const respuesta = await fetch(`http://127.0.0.1:8001/api/historial/${usuarioId}`);
        const datos = await respuesta.json();

        if (respuesta.ok && datos.length > 0) {
            const registro = datos[0]; // Tomamos el test más reciente
            
            campoFecha.innerText = new Date(registro.fecha_evaluacion).toLocaleDateString('es-PE', {
                day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit'
            });

            // Parseamos y dibujamos el informe de la IA tal como lo hace tu alumno.js
            let informeIA = registro.informe_ia;
            if (typeof informeIA === 'string') {
                try { informeIA = JSON.parse(informeIA); } catch(e) {}
            }

            let htmlContenido = '';
            if (typeof informeIA === 'object' && informeIA !== null) {
                for (let clave in informeIA) {
                    let titulo = clave.replace(/_/g, ' ').toUpperCase();
                    let valor = informeIA[clave];
                    
                    if (typeof valor === 'object') {
                        valor = JSON.stringify(valor, null, 2);
                    }

                    htmlContenido += `
                        <div class="seccion-informe" style="margin-bottom: 20px; border-left: 3px solid #E5A91E; padding-left: 15px;">
                            <h3 style="color: #3D52A0; margin-bottom: 5px; font-size:1.15rem;"><i class="fas fa-check-circle" style="color: #E5A91E;"></i> ${titulo}</h3>
                            <p style="line-height: 1.6; color: #444; margin: 0;">${valor}</p>
                        </div>
                    `;
                }
            } else {
                htmlContenido = `<div class="seccion-informe"><h3>Respuesta de la IA</h3><p>${informeIA}</p></div>`;
            }

            cuerpoInforme.innerHTML = htmlContenido;
        } else {
            cuerpoInforme.innerHTML = "<p style='color:red; text-align:center; padding: 20px;'>Este estudiante no tiene un informe válido generado por la IA en su historial.</p>";
        }

    } catch (error) {
        console.error("Error al cargar el historial:", error);
        cuerpoInforme.innerHTML = "<p style='color:red; text-align:center; padding: 20px;'>Error al conectar con el servidor. Verifica que main.py esté encendido.</p>";
    }
}

function cerrarVisorInforme() {
    const modalInforme = document.getElementById('modal-informe');
    if (modalInforme) {
        modalInforme.style.display = 'none';
    }
}