// Constante global para conectar con el servidor en la nube
const API_URL = 'postgresql://vocacional_db_user:Ri1D1p14Vg5z3YRS8C6bZtG0lBEpBE36@dpg-d8pbqcbeo5us73acl120-a.ohio-postgres.render.com/vocacional_db';
// Variable global temporal para guardar los registros del historial cargados
let listaHistorialGlobal = [];

document.addEventListener('DOMContentLoaded', () => {
    // =======================================================
    // 0. MOSTRAR EL NOMBRE REAL DEL ALUMNO EN LA CABECERA
    // =======================================================
    const nombreUsuario = localStorage.getItem('userNombre'); 
    const nombreElement = document.getElementById('nombre-usuario');
    if (nombreUsuario && nombreElement) {
        nombreElement.innerText = nombreUsuario;
    }

    // -> ¡VALIDAMOS SI TIENE HISTORIAL PARA DESBLOQUEAR LA TARJETA! <-
    verificarEstadoHistorial();

    // =======================================================
    // 1. LÓGICA DEL MODAL DE INSTRUCCIONES (EL TEST)
    // =======================================================
    const btnAbrirModal = document.getElementById('btn-abrir-modal');
    const modalInstrucciones = document.getElementById('modal-instrucciones');
    const btnCerrarModal = document.getElementById('btn-cerrar-modal');
    const btnCancelar = document.getElementById('btn-cancelar');

    if (btnAbrirModal && modalInstrucciones) {
        btnAbrirModal.addEventListener('click', () => {
            modalInstrucciones.classList.add('active');
        });
    }

    if (btnCerrarModal && modalInstrucciones) {
        btnCerrarModal.addEventListener('click', () => {
            modalInstrucciones.classList.remove('active');
        });
    }

    if (btnCancelar && modalInstrucciones) {
        btnCancelar.addEventListener('click', () => {
            modalInstrucciones.classList.remove('active');
        });
    }

    if (modalInstrucciones) {
        modalInstrucciones.addEventListener('click', (e) => {
            if (e.target === modalInstrucciones) {
                modalInstrucciones.classList.remove('active');
            }
        });
    }
});

// =======================================================
// VALIDACIÓN INTELIGENTE: BLOQUEAR/DESBLOQUEAR TARJETA
// =======================================================
async function verificarEstadoHistorial() {
    const idUsuario = localStorage.getItem('usuario_id');
    if (!idUsuario) return;

    try {
        // ¡PUERTO CORREGIDO A 8001!
        const respuesta = await fetch(`${API_URL}/api/historial/${idUsuario}`);
        
        if (!respuesta.ok) {
            console.warn("No se pudo conectar al historial. Código:", respuesta.status);
            return;
        }

        const datos = await respuesta.json();

        const tarjeta = document.getElementById('tarjeta-resultados');
        const btnVer = document.getElementById('btn-ver-historial');
        const msgBloqueo = document.getElementById('msg-bloqueo');

        // Si el alumno tiene al menos 1 test guardado, DESBLOQUEAMOS la tarjeta
        if (datos && datos.length > 0) {
            if (tarjeta) {
                tarjeta.classList.remove('locked');
                tarjeta.onclick = mostrarHistorial; // Le damos la habilidad de hacer clic
            }
            
            if (btnVer) {
                // Cambiamos el diseño del botón al dorado activo
                btnVer.className = 'btn-primary';
                btnVer.style.backgroundColor = 'var(--dorado-principal)';
                btnVer.innerText = 'Ver mi Historial';
                btnVer.disabled = false;
            }
            
            if (msgBloqueo) {
                // Ocultamos el mensaje rojo de "Disponible al terminar..."
                msgBloqueo.style.display = 'none';
            }
        }
        
    } catch (error) {
        console.error("Error validando el estado del historial:", error);
    }
}

// =======================================================
// 2. ABRIR EL HISTORIAL DESDE LA TARJETA
// =======================================================
function mostrarHistorial() {
    // Ocultar las tarjetas principales
    document.getElementById('vista-menu').classList.remove('vista-activa');
    document.getElementById('vista-menu').classList.add('vista-oculta');

    // Mostrar el historial
    document.getElementById('vista-historial').classList.remove('vista-oculta');
    document.getElementById('vista-historial').classList.add('vista-activa');

    // Cargar los datos desde la base de datos al abrir la vista
    cargarHistorialAlumno();
}

// =======================================================
// 3. CARGAR EL HISTORIAL DESDE LA BASE DE DATOS
// =======================================================
async function cargarHistorialAlumno() {
    // Jalamos el ID del usuario
    const idUsuario = localStorage.getItem('usuario_id'); 
    const contenedor = document.getElementById('contenedor-historial');

    if (!idUsuario) {
        contenedor.innerHTML = '<p class="alerta-vacio">No se encontró el ID del usuario en sesión.</p>';
        return;
    }

    try {
        // ¡PUERTO CORREGIDO A 8001!
        const respuesta = await fetch(`${API_URL}/api/historial/${idUsuario}`);
        const datos = await respuesta.json();

        // Guardamos en la variable global para no volver a consultar a la BD al abrir el pop-up
        listaHistorialGlobal = datos;
        contenedor.innerHTML = ''; // Limpiamos el contenedor

        if (!datos || datos.length === 0) {
            contenedor.innerHTML = `<p class="alerta-vacio">Aún no has resuelto el test vocacional. ¡Anímate a comenzar!</p>`;
            return;
        }

        // Pintar las tarjetas por cada registro
        datos.forEach((item, indice) => {
            // Formatear la fecha
            const fechaFormateada = new Date(item.fecha_evaluacion).toLocaleDateString('es-PE', {
                day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit'
            });

            // Número de la evaluación
            const numEvaluacion = datos.length - indice;

            const tarjeta = document.createElement('div');
            tarjeta.className = 'tarjeta-historial';
            tarjeta.innerHTML = `
                <div class="tarjeta-info">
                    <h4>Evaluación Vocacional #${numEvaluacion}</h4>
                    <p class="fecha"><i class="fas fa-calendar-alt"></i> ${fechaFormateada}</p>
                </div>
                <button class="btn-ver-informe" onclick="verDetalleHistorial(${indice})">Ver Informe Completo</button>
            `;
            contenedor.appendChild(tarjeta);
        });

    } catch (error) {
        console.error("Error al cargar el historial:", error);
        contenedor.innerHTML = '<p class="alerta-vacio" style="color: red;">Error al conectar con el servidor.</p>';
    }
}

// =======================================================
// 4. ABRIR EL POP-UP DEL INFORME DE LA IA
// =======================================================
function verDetalleHistorial(indice) {
    const registro = listaHistorialGlobal[indice];
    if (!registro) return;

    const modalInforme = document.getElementById('modal-informe');
    const cuerpoInforme = document.getElementById('modal-cuerpo-informe');
    const campoFecha = document.getElementById('modal-fecha');

    // 1. Mostrar la fecha en el modal
    campoFecha.innerText = new Date(registro.fecha_evaluacion).toLocaleDateString('es-PE');

    // 2. Parsear el informe IA
    let informeIA = registro.informe_ia;
    if (typeof informeIA === 'string') {
        try { informeIA = JSON.parse(informeIA); } catch(e) {}
    }

    // 3. Dibujar el contenido dinámicamente según lo que envíe Gemini
    let htmlContenido = '';
    
    if (typeof informeIA === 'object' && informeIA !== null) {
        for (let clave in informeIA) {
            let titulo = clave.replace(/_/g, ' ').toUpperCase();
            let valor = informeIA[clave];
            
            if (typeof valor === 'object') {
                valor = JSON.stringify(valor, null, 2);
            }

            htmlContenido += `
                <div class="seccion-informe">
                    <h3><i class="fas fa-check-circle" style="color: var(--dorado-principal);"></i> ${titulo}</h3>
                    <p>${valor}</p>
                </div>
            `;
        }
    } else {
        htmlContenido = `
            <div class="seccion-informe">
                <h3>Respuesta de la IA</h3>
                <p>${informeIA}</p>
            </div>
        `;
    }

    cuerpoInforme.innerHTML = htmlContenido;

    // 4. Mostrar el modal añadiendo la clase active
    modalInforme.classList.add('active');
}

// Función para cerrar el Visor del Informe IA
function cerrarVisorInforme() {
    document.getElementById('modal-informe').classList.remove('active');
}