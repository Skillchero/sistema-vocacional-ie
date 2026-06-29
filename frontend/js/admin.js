// Constante global para conectar con el servidor en la nube
const API_URL = 'postgresql://vocacional_db_user:Ri1D1p14Vg5z3YRS8C6bZtG0lBEpBE36@dpg-d8pbqcbeo5us73acl120-a.ohio-postgres.render.com/vocacional_db';
document.addEventListener('DOMContentLoaded', async () => {
    console.log("Panel de Administrador cargado correctamente.");

    // ====================================================================
    // NUEVO: OBTENER NOMBRE DEL ADMIN DESDE LOCALSTORAGE
    // ====================================================================
    const nombreUsuario = localStorage.getItem('userNombre');
    const nombreElement = document.getElementById('nombre-usuario');
    if (nombreUsuario && nombreElement) {
        nombreElement.innerText = nombreUsuario;
    }
    // ====================================================================

    // ====================================================================
    // FASE 3: LÓGICA DE NOTIFICACIONES (BUZÓN DE CONTRASEÑAS)
    // ====================================================================
    cargarNotificaciones(); // Cargar la alerta apenas entras al panel

    const tarjeta = document.getElementById('tarjeta-alertas');
    const modalNotificaciones = document.getElementById('modal-notificaciones');
    const btnCerrarNotificaciones = document.getElementById('cerrar-notificaciones');

    if(tarjeta && modalNotificaciones) {
        tarjeta.addEventListener('click', () => {
            modalNotificaciones.style.display = 'block';
        });
    }

    if(btnCerrarNotificaciones && modalNotificaciones) {
        btnCerrarNotificaciones.addEventListener('click', () => {
            modalNotificaciones.style.display = 'none';
        });
    }
    // ====================================================================

    // === LÓGICA: OBTENER USUARIOS DESDE POSTGRESQL ===
    const tbody = document.getElementById('tabla-usuarios-body');
    const contadorTotal = document.getElementById('total-usuarios');

    // Solo ejecutamos la petición si estamos en la pantalla que tiene la tabla (admin_dashboard.html)
    if (tbody) {
        try {
            const response = await fetch(`${API_URL}/api/usuarios`); //conectamos con la API de base de datos en la nube
            const result = await response.json();

            // Verificamos "success" porque así lo configuramos en el backend (Paso 1)
            if (result.success) {
                tbody.innerHTML = ''; // Limpiamos la tabla por si acaso

                // Actualizamos el contador total si existe en el HTML
                if (contadorTotal) {
                    contadorTotal.innerText = result.usuarios.length;
                }

                // Recorremos la lista de usuarios y creamos una fila por cada uno
                result.usuarios.forEach(usuario => {
                    const tr = document.createElement('tr');
                    
                    // Color de la etiqueta según rol
                    let badgeClass = (usuario.rol.toLowerCase() === 'admin' || usuario.rol.toLowerCase() === 'psicólogo' || usuario.rol.toLowerCase() === 'psicologo') ? 'badge-psicologo' : 'badge-alumno';

                    // Acortamos el UUID para que se vea ordenado (ej. "a1b2c3d4...")
                    const idCorto = usuario.id_usuario.substring(0, 8);

                    tr.innerHTML = `
                        <td title="${usuario.id_usuario}"><strong>${idCorto}...</strong></td>
                        <td>${usuario.nombres} ${usuario.apellidos}</td>
                        <td>${usuario.email}</td>
                        <td><span class="badge ${badgeClass}">${usuario.rol.toUpperCase()}</span></td>
                        <td style="display: flex; gap: 5px; justify-content: center;">
                            <button class="btn-action" style="background-color: #ffc107; color: #000; padding: 5px 10px;" onclick="modificarUsuario('${usuario.id_usuario}', '${usuario.nombres}', '${usuario.apellidos}', '${usuario.email}', '${usuario.rol}')" title="Modificar">
                                <i class="fas fa-edit"></i>
                            </button>
                            <button class="btn-action" style="background-color: #dc3545; color: #fff; padding: 5px 10px;" onclick="borrarUsuario('${usuario.id_usuario}')" title="Borrar">
                                <i class="fas fa-trash"></i>
                            </button>
                            <button class="btn-action" style="padding: 5px 10px;" onclick="restablecerClave('${usuario.id_usuario}', '${usuario.email}')" title="Restablecer Clave">
                                <i class="fas fa-key"></i>
                            </button>
                        </td>
                    `;
                    tbody.appendChild(tr);
                });
            } else {
                console.error("Error del servidor:", result.detail);
                tbody.innerHTML = `<tr><td colspan="5" style="text-align: center; color: red;">Error: ${result.detail || "No se pudieron cargar los datos"}</td></tr>`;
            }
        } catch (error) {
            console.error("No se pudo conectar al servidor backend.", error);
            tbody.innerHTML = `<tr><td colspan="5" style="text-align: center; color: red;">No se pudo conectar al servidor Python. Verifica que main.py esté encendido.</td></tr>`;
        }
    }
});

// ====================================================================
// Funciones REALES para Modificar Usuario
// ====================================================================

// 1. Abre el modal e inyecta los datos actuales
function modificarUsuario(id, nombres, apellidos, correo, rol) {
    document.getElementById('mod-id').value = id;
    document.getElementById('mod-nombres').value = nombres;
    document.getElementById('mod-apellidos').value = apellidos;
    document.getElementById('mod-correo').value = correo;
    document.getElementById('mod-rol').value = rol;
    
    document.getElementById('modal-modificar').style.display = 'block';
}

// 2. Conecta el formulario con el backend para guardar cambios
const formModificar = document.getElementById('form-modificar-usuario');
if (formModificar) {
    formModificar.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const btnGuardar = document.getElementById('btn-guardar-cambios');
        btnGuardar.innerText = "Guardando...";
        btnGuardar.disabled = true;

        const idUsuario = document.getElementById('mod-id').value;
        const dataActualizada = {
            nombres: document.getElementById('mod-nombres').value,
            apellidos: document.getElementById('mod-apellidos').value,
            correo: document.getElementById('mod-correo').value,
            rol: document.getElementById('mod-rol').value
        };

        try {
            const response = await fetch(`${API_URL}/api/usuarios/${idUsuario}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(dataActualizada)
            });
            
            const result = await response.json();
            
            if (response.ok && result.status === 'success') {
                alert("✅ ¡Datos del usuario actualizados correctamente!");
                document.getElementById('modal-modificar').style.display = 'none';
                window.location.reload(); // Recargamos para ver los cambios en la tabla
            } else {
                alert(`Error al actualizar: ${result.detail}`);
            }
        } catch (error) {
            console.error("Error:", error);
            alert("Error de conexión con el servidor.");
        } finally {
            btnGuardar.innerText = "Guardar Cambios";
            btnGuardar.disabled = false;
        }
    });
}

// ====================================================================
// Funciones para Borrar Usuario
// ====================================================================
async function borrarUsuario(idUsuario) {
    // 1. Alerta de confirmación para evitar borrados por accidente
    const confirmacion = confirm(`¿Estás completamente seguro de que deseas eliminar al usuario con ID: ${idUsuario.substring(0,8)}...? \n\nEsta acción no se puede deshacer.`);
    
    if (confirmacion) {
        try {
            // 2. Llamamos a la API de Python con el método DELETE
            const response = await fetch(`${API_URL}/api/usuarios/${idUsuario}`, {
                method: 'DELETE'
            });
            
            const result = await response.json();
            
            // 3. Evaluamos la respuesta
            if (response.ok && result.status === 'success') {
                alert("🗑️ ¡Usuario eliminado correctamente de la base de datos!");
                window.location.reload(); // Recargamos la página para actualizar la tabla y el contador
            } else {
                alert(`Error al eliminar: ${result.detail || result.mensaje}`);
            }
        } catch (error) {
            console.error("Error de conexión:", error);
            alert("No se pudo conectar al servidor. Verifica que main.py esté corriendo en el puerto 8001.");
        }
    }
}

// ====================================================================
// Lógica REAL para el formulario de Crear Usuario
// ====================================================================
const rolSelect = document.getElementById('rol');
const datosAlumno = document.getElementById('datosAlumno');

if (rolSelect && datosAlumno) {
    rolSelect.addEventListener('change', () => {
        if (rolSelect.value === 'alumno') {
            datosAlumno.style.display = 'flex';
        } else {
            datosAlumno.style.display = 'none';
        }
    });
}

const crearUsuarioForm = document.getElementById('crearUsuarioForm');

if (crearUsuarioForm) {
    crearUsuarioForm.addEventListener('submit', async function(e) {
        e.preventDefault(); // Evita que la página se recargue

        // 1. Capturamos los datos exactos de tus IDs del HTML
        const nombres = document.getElementById('nombres').value;
        const apellidos = document.getElementById('apellidos').value;
        const correo = document.getElementById('correo_usuario').value;
        const rol = document.getElementById('rol').value; // Captura 'alumno', 'psicologo' o 'admin'
        const password = document.getElementById('password_nueva').value;
        const grado = document.getElementById('grado')?.value || null;
        const seccion = document.getElementById('seccion')?.value || null;

        // Cambiamos el botón para mostrar que está cargando
        const btnSave = document.querySelector('.btn-save');
        btnSave.innerText = "Registrando en Base de Datos...";
        btnSave.disabled = true;

        try {
            const response = await fetch(`${API_URL}/api/crear-usuario`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    nombres: nombres,
                    apellidos: apellidos,
                    correo: correo,
                    rol: rol,
                    password: password,
                    grado: grado,
                    seccion: seccion
                })
            });

            const result = await response.json();

            // 3. Verificamos la respuesta
            if (response.ok && result.status === 'success') {
                alert(`¡Éxito! Usuario registrado correctamente.\n\nEl sistema lo guardó en la tabla 'usuarios' y en la tabla correspondiente a su rol.`);
                window.location.href = 'admin_dashboard.html'; // Volvemos a la tabla principal
            } else {
                alert(`Error al registrar: ${result.detail}`);
                btnSave.innerText = "Registrar Usuario";
                btnSave.disabled = false;
            }

        } catch (error) {
            console.error("Error:", error);
            alert("No se pudo conectar al servidor Python. Verifica que main.py esté corriendo en el puerto 8001.");
            btnSave.innerText = "Registrar Usuario";
            btnSave.disabled = false;
        }
    });
}

// ====================================================================
// Función REAL para restablecer clave de usuario
// ====================================================================
async function restablecerClave(idUsuario, usuarioCorreo) {
    // 1. Abrimos una ventana nativa para que el Admin escriba la clave
    const nuevaClave = prompt(`Restablecer contraseña para:\n${usuarioCorreo}\n\nIngrese la nueva contraseña (Ej: Número de DNI o Cerna2026):`);

    // Si el Admin presiona "Cancelar" o deja el campo vacío, detenemos todo
    if (!nuevaClave || nuevaClave.trim() === "") {
        alert("Operación cancelada. No se realizó ningún cambio.");
        return;
    }

    // 2. Conectamos con el backend para guardar la nueva clave
    try {
        const response = await fetch(`${API_URL}/api/usuarios/${idUsuario}/password`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ password: nuevaClave })
        });

        const result = await response.json();

        // 3. Evaluamos la respuesta de la base de datos
        if (response.ok && result.status === 'success') {
            alert(`✅ ¡Éxito! La contraseña para ${usuarioCorreo} ha sido cambiada a:\n\n${nuevaClave}\n\nPor favor, indique al usuario que inicie sesión con esta clave.`);
            
            // Simulación visual: Desactivar el botón para indicar que ya se atendió
            if (event && event.target) {
                event.target.classList.remove('btn-urgent');
                event.target.innerText = 'Clave Restablecida';
                event.target.disabled = true;
                event.target.style.opacity = '0.5';
            }
        } else {
            alert(`Error al guardar la contraseña: ${result.detail}`);
        }
    } catch (error) {
        console.error("Error de conexión:", error);
        alert("No se pudo conectar al servidor. Verifica que main.py esté encendido en el puerto 8001.");
    }
}

// ====================================================================
// FASE 3: FUNCIONES PARA EL BUZÓN DE NOTIFICACIONES (CONTRASEÑAS)
// ====================================================================

// 1. Función para cargar las notificaciones desde la BD
async function cargarNotificaciones() {
    try {
        const response = await fetch(`${API_URL}/api/notificaciones-pendientes`);
        const data = await response.json();

        if (data.status === 'success') {
            const numPendientes = data.notificaciones.length;
            
            // Actualizamos el número en la tarjeta HTML
            const contadorAlertas = document.getElementById('contador-alertas');
            if (contadorAlertas) {
                contadorAlertas.innerText = `${numPendientes} pendientes`;
            }
            
            // Llenamos la ventana Modal
            const lista = document.getElementById('lista-notificaciones');
            if (lista) {
                lista.innerHTML = ""; // Limpiamos lo anterior

                if (numPendientes === 0) {
                    lista.innerHTML = "<p style='text-align:center; color:gray;'>No hay solicitudes nuevas. ¡Todo al día!</p>";
                } else {
                    data.notificaciones.forEach(noti => {
                        lista.innerHTML += `
                            <div style="background: #f9f9f9; padding: 15px; margin-bottom: 10px; border-left: 4px solid #d9534f; border-radius: 4px; display: flex; justify-content: space-between; align-items: center;">
                                <div>
                                    <strong style="color:#333;">${noti.correo}</strong><br>
                                    <small style="color: #777;">Fecha: ${noti.fecha}</small>
                                </div>
                                <button onclick="atenderNotificacion(${noti.id}, '${noti.correo}')" style="background: #28a745; color: white; border: none; padding: 8px 12px; cursor: pointer; border-radius: 4px;">✅ Marcar Lista</button>
                            </div>
                        `;
                    });
                }
            }
        }
    } catch (error) {
        console.error("Error al cargar notificaciones:", error);
    }
}

// 2. Función para marcar una notificación como atendida
async function atenderNotificacion(id, correo) {
    if(confirm(`¿Ya cambiaste la contraseña de ${correo} usando el botón Modificar (✏️) en la tabla principal?\n\nSi es así, presiona Aceptar para borrar esta notificación.`)) {
        try {
            const response = await fetch(`${API_URL}/api/notificaciones-atendidas/${id}`, {
                method: 'PUT'
            });
            const data = await response.json();
            
            if(data.status === 'success') {
                alert("¡Notificación atendida correctamente!");
                cargarNotificaciones(); // Recargamos para que desaparezca de la lista y se actualice el número
            }
        } catch(error) {
            console.error("Error al actualizar:", error);
        }
    }
}