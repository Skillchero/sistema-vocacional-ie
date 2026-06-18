// ====================================================================
// CONFIGURACIÓN PROFESIONAL
// ====================================================================
const API_URL = "https://api-vocacional-cerna.onrender.com";

document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');

    // 1. Animación de revelado: Hace aparecer el login con un efecto suave
    const reveals = document.querySelectorAll('.reveal');
    reveals.forEach((element) => {
        setTimeout(() => {
            element.classList.add('active');
        }, 100);
    });

    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault(); // Evita que la página parpadee

            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;

            try {
                // USO DE LA CONSTANTE PROFESIONAL
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
                    
                    // Guardamos los datos clave en el navegador
                    localStorage.setItem('usuario_id', data.usuario_id);
                    localStorage.setItem('userNombre', data.nombres);
                    localStorage.setItem('userEmail', email);
                    localStorage.setItem('userRole', data.rol);

                    // Pasamos el rol a minúsculas para evitar errores
                    const rolUsuario = data.rol.toLowerCase(); 

                    // 🚦 EL SEMÁFORO DE ROLES 🚦
                    if (rolUsuario === 'admin' || rolUsuario === 'administrador') {
                        window.location.href = 'admin_dashboard.html';
                    } else if (rolUsuario === 'psicologo' || rolUsuario === 'tutor') {
                        window.location.href = 'dashboard_psicologo.html';
                    } else if (rolUsuario === 'alumno' || rolUsuario === 'estudiante') {
                        window.location.href = 'alumno_inicio.html';
                    } else {
                        alert("Error: El rol '" + data.rol + "' no tiene una pantalla asignada.");
                    }

                } else {
                    // Contraseña incorrecta o usuario no existe
                    alert("Error: " + (data.detail || "Credenciales incorrectas"));
                }

            } catch (error) {
                console.error("Error:", error);
                alert("No hay conexión con el servidor de Render. Verifica tu internet.");
            }
        });
    }
});