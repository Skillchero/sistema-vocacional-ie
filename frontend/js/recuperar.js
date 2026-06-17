document.getElementById('recoveryForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const user = document.getElementById('usuario').value;
    alert(`Solicitud enviada para: ${user}. El administrador recibirá la notificación.`);
    window.location.href = 'login.html';
});