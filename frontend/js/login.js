document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');

    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault(); // Evita que la página parpadee

            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;

            try {
                // 1. Enviamos los datos a Python (URL OFICIAL DE RENDER)
                const response = await fetch('https://api-vocacional-cerna.onrender.com/api/login', {
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
                    localStorage.setItem('userRole', data.rol); // Guardamos el rol para futuras consultas

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