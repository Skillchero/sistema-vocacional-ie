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

    // === LÓGICA: OBTENER USUARIOS DESDE POSTGRESQL ===
    const tbody = document.getElementById('tabla-usuarios-body');
    const contadorTotal = document.getElementById('total-usuarios');

    // Solo ejecutamos la petición si estamos en la pantalla que tiene la tabla (admin_dashboard.html)
    if (tbody) {
        try {
            // ¡URL OFICIAL DE RENDER ACTUALIZADA AQUÍ!
            const response = await fetch('https://api-vocacional-cerna.onrender.com/api/usuarios'); 
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
                            <button class="btn-action" style="background-color: #ffc107; color: #000; padding: 5px 10px;" onclick="modificarUsuario('${usuario.id_usuario}')" title="Modificar">
                                <i class="fas fa-edit"></i>
                            </button>
                            <button class="btn-action" style="background-color: #dc3545; color: #fff; padding: 5px 10px;" onclick="borrarUsuario('${usuario.id_usuario}')" title="Borrar">
                                <i class="fas fa-trash"></i>
                            </button>
                            <button class="btn-action" style="padding: 5px 10px;" onclick="restablecerClave('${usuario.email}')" title="Restablecer Clave">
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
            tbody.innerHTML = `<tr><td colspan="5" style="text-align: center; color: red;">No se pudo conectar al servidor Python de Render.</td></tr>`;
        }
    }
});

// ====================================================================
// Funciones para los Botones de Acciones (Modificar / Borrar)
// ====================================================================
function modificarUsuario(id) {
    // Aquí a futuro programaremos la apertura de una ventana modal o redirección
    alert(`Preparando para modificar al usuario con ID:\n${id}\n\n(Próximamente abriremos un formulario con sus datos precargados)`);
}

async function borrarUsuario(idUsuario) {
    // 1. Alerta de confirmación para evitar borrados por accidente
    const confirmacion = confirm(`¿Estás completamente seguro de que deseas eliminar al usuario con ID: ${idUsuario.substring(0,8)}...? \n\nEsta acción no se puede deshacer.`);
    
    if (confirmacion) {
        try {
            // 2. ¡URL OFICIAL DE RENDER ACTUALIZADA AQUÍ! (Llamamos a la API con método DELETE)
            const response = await fetch(`https://api-vocacional-cerna.onrender.com/api/usuarios/${idUsuario}`, {
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
            alert("No se pudo conectar al servidor de Render.");
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
            // ¡URL OFICIAL DE RENDER ACTUALIZADA AQUÍ!
            const response = await fetch('https://api-vocacional-cerna.onrender.com/api/crear-usuario', {
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
            alert("No se pudo conectar al servidor de Render.");
            btnSave.innerText = "Registrar Usuario";
            btnSave.disabled = false;
        }
    });
}

// ====================================================================
// Función para simular el restablecimiento de clave (Se mantiene intacta)
// ====================================================================
function restablecerClave(usuarioCorreo) {
    // Alerta de confirmación de navegador
    const confirmacion = confirm(`¿Estás seguro de que deseas restablecer la contraseña para el usuario: ${usuarioCorreo}?`);
    
    if(confirmacion) {
        // Aquí en el futuro llamaremos a nuestra API de FastAPI
        alert(`¡Éxito! Se ha generado una nueva contraseña temporal para ${usuarioCorreo} y se ha actualizado en la base de datos.`);
        
        // Simulación visual: si el botón decía "Atender Solicitud", lo cambiamos a estado normal
        if(event && event.target) {
            event.target.classList.remove('btn-urgent');
            event.target.innerText = 'Clave Restablecida';
            event.target.disabled = true;
            event.target.style.opacity = '0.5';
        }
    }
}