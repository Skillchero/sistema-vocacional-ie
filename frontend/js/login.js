// Constante global para conectar con el servidor en la nube
const API_URL = 'https://api-vocacional-cerna.onrender.com';
document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');

    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault(); // Evita que la página parpadee

            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;

            try {
                // 1. Enviamos los datos a Python (Puerto 8001)
                const response = await fetch(`${API_URL}/api/login`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        usuario: email,
                        password: password
                    })
                });

                const data = await response.json();

                // 2. Si la contraseña es correcta, evaluamos el ROL
                if (response.ok && data.status === 'success') {
                    
                    // ========================================================
                    // ¡ACTUALIZADO: GUARDAMOS LOS DATOS CLAVE EN EL NAVEGADOR!
                    // ========================================================
                    localStorage.setItem('usuario_id', data.usuario_id); // <-- ¡LA LÍNEA MÁGICA PARA EL UUID!
                    localStorage.setItem('userNombre', data.nombres);
                    localStorage.setItem('userEmail', email);
                    // ========================================================

                    // Pasamos el rol a minúsculas para evitar errores (ej. "Admin" vs "admin")
                    const rolUsuario = data.rol.toLowerCase(); 

                    // 🚦 EL SEMÁFORO DE ROLES 🚦
                    if (rolUsuario === 'admin' || rolUsuario === 'administrador') {
                        // Perfil 1: Administrador
                        window.location.href = 'admin_dashboard.html';
                        
                    } else if (rolUsuario === 'psicologo' || rolUsuario === 'tutor') {
                        // Perfil 2: Psicólogo / Tutor
                        window.location.href = 'dashboard_psicologo.html'; 
                        
                    } else if (rolUsuario === 'alumno' || rolUsuario === 'estudiante') {
                        // Perfil 3: Alumno
                        window.location.href = 'alumno_inicio.html';
                        
                    } else {
                        // Por si hay un rol mal escrito en la base de datos
                        alert("Error: El rol '" + data.rol + "' no tiene una pantalla asignada en el sistema.");
                    }

                } else {
                    // Contraseña incorrecta o usuario no existe
                    alert("Error: " + data.detail);
                }

            } catch (error) {
                console.error("Error:", error);
                alert("No hay conexión con el servidor. Verifica que main.py esté encendido.");
            }
        });
    }
});