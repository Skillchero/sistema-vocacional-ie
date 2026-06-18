// ====================================================================
// CONFIGURACIÓN PROFESIONAL
// ====================================================================
const API_URL = "https://api-vocacional-cerna.onrender.com";

document.addEventListener('DOMContentLoaded', async () => {
    console.log("Panel de Administrador cargado correctamente.");

    // ====================================================================
    // OBTENER NOMBRE DEL ADMIN DESDE LOCALSTORAGE
    // ====================================================================
    const nombreUsuario = localStorage.getItem('userNombre');
    const nombreElement = document.getElementById('nombre-usuario');
    if (nombreUsuario && nombreElement) {
        nombreElement.innerText = nombreUsuario;
    }

    // === LÓGICA: OBTENER USUARIOS DESDE POSTGRESQL ===
    const tbody = document.getElementById('tabla-usuarios-body');
    const contadorTotal = document.getElementById('total-usuarios');

    if (tbody) {
        try {
            // Usamos la constante API_URL
            const response = await fetch(`${API_URL}/api/usuarios`); 
            const result = await response.json();

            if (result.success) {
                tbody.innerHTML = ''; 

                if (contadorTotal) {
                    contadorTotal.innerText = result.usuarios.length;
                }

                result.usuarios.forEach(usuario => {
                    const tr = document.createElement('tr');
                    
                    let badgeClass = (usuario.rol.toLowerCase() === 'admin' || usuario.rol.toLowerCase() === 'psicólogo' || usuario.rol.toLowerCase() === 'psicologo') ? 'badge-psicologo' : 'badge-alumno';
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
            tbody.innerHTML = `<tr><td colspan="5" style="text-align: center; color: red;">No se pudo conectar al servidor en la nube.</td></tr>`;
        }
    }
});

// ====================================================================
// Funciones para los Botones de Acciones
// ====================================================================
function modificarUsuario(id) {
    alert(`Preparando para modificar al usuario con ID:\n${id}`);
}

async function borrarUsuario(idUsuario) {
    const confirmacion = confirm(`¿Estás seguro de eliminar al usuario ${idUsuario.substring(0,8)}...?`);
    
    if (confirmacion) {
        try {
            // Usamos la constante API_URL
            const response = await fetch(`${API_URL}/api/usuarios/${idUsuario}`, {
                method: 'DELETE'
            });
            
            const result = await response.json();
            
            if (response.ok && result.status === 'success') {
                alert("🗑️ ¡Usuario eliminado!");
                window.location.reload(); 
            } else {
                alert(`Error al eliminar: ${result.detail || result.mensaje}`);
            }
        } catch (error) {
            console.error("Error de conexión:", error);
            alert("No se pudo conectar al servidor.");
        }
    }
}

// ====================================================================
// Lógica para Crear Usuario
// ====================================================================
const rolSelect = document.getElementById('rol');
const datosAlumno = document.getElementById('datosAlumno');

if (rolSelect && datosAlumno) {
    rolSelect.addEventListener('change', () => {
        datosAlumno.style.display = (rolSelect.value === 'alumno') ? 'flex' : 'none';
    });
}

const crearUsuarioForm = document.getElementById('crearUsuarioForm');

if (crearUsuarioForm) {
    crearUsuarioForm.addEventListener('submit', async function(e) {
        e.preventDefault(); 

        const nombres = document.getElementById('nombres').value;
        const apellidos = document.getElementById('apellidos').value;
        const correo = document.getElementById('correo_usuario').value;
        const rol = document.getElementById('rol').value;
        const password = document.getElementById('password_nueva').value;
        const grado = document.getElementById('grado')?.value || null;
        const seccion = document.getElementById('seccion')?.value || null;

        const btnSave = document.querySelector('.btn-save');
        btnSave.innerText = "Registrando...";
        btnSave.disabled = true;

        try {
            // Usamos la constante API_URL
            const response = await fetch(`${API_URL}/api/crear-usuario`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ nombres, apellidos, correo, rol, password, grado, seccion })
            });

            const result = await response.json();

            if (response.ok && result.status === 'success') {
                alert(`¡Éxito! Usuario registrado.`);
                window.location.href = 'admin_dashboard.html';
            } else {
                alert(`Error: ${result.detail}`);
                btnSave.innerText = "Registrar Usuario";
                btnSave.disabled = false;
            }
        } catch (error) {
            alert("Error de conexión con el servidor.");
            btnSave.innerText = "Registrar Usuario";
            btnSave.disabled = false;
        }
    });
}

function restablecerClave(usuarioCorreo) {
    if(confirm(`¿Restablecer clave para ${usuarioCorreo}?`)) {
        alert("¡Clave restablecida!");
    }
}