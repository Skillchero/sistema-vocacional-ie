// Constante de tu API (Asegúrate de que sea el puerto de tu servidor local o Render)
// Como dijimos que sería local, asumo que usas tu puerto 8001
const API_URL = "http://localhost:8001"; // Cámbialo si estás usando Render en pruebas

document.getElementById('recoveryForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const userCorreo = document.getElementById('usuario').value;
    const btnSubmit = document.querySelector('.btn-submit');
    
    // Cambiamos el texto del botón mientras carga
    btnSubmit.textContent = "Enviando...";
    btnSubmit.disabled = true;

    try {
        const respuesta = await fetch(`${API_URL}/api/recuperar-clave`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ correo: userCorreo })
        });

        const data = await respuesta.json();

        if (respuesta.ok && data.status === 'success') {
            alert(`¡Solicitud enviada!\nEl administrador recibirá una notificación para cambiar la contraseña de: ${userCorreo}`);
            // Redirigir al login después de aceptar la alerta
            window.location.href = 'login.html';
        } else {
            alert("Hubo un error al enviar la solicitud. Inténtalo de nuevo.");
            btnSubmit.textContent = "Enviar Solicitud";
            btnSubmit.disabled = false;
        }

    } catch (error) {
        console.error("Error en la conexión:", error);
        alert("Error de conexión con el servidor. Verifica que esté encendido.");
        btnSubmit.textContent = "Enviar Solicitud";
        btnSubmit.disabled = false;
    }
});