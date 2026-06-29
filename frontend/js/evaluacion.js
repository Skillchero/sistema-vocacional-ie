// Constante global para conectar con el servidor en la nube
const API_URL = 'https://api-vocacional-cerna.onrender.com';
document.addEventListener('DOMContentLoaded', () => {
    // Batería de 15 Preguntas
    const preguntas = [
        { id: 1, tipo: 'cerrada', pregunta: "1. Si pudieras elegir una sola materia para estudiar todo el año, ¿cuál elegirías?", opciones: ["Matemáticas, Física o Química (Cálculo y ciencias exactas).", "Comunicación, Arte o Historia (Lectura, expresión y sociedad).", "Computación, Robótica o Talleres técnicos (Crear y armar cosas).", "Psicología, Tutoría o Educación Física (Trabajar con personas y bienestar)."] },
        { id: 2, tipo: 'cerrada', pregunta: "2. ¿Cómo prefieres pasar la mayor parte de tu tiempo libre?", opciones: ["Investigando temas nuevos, leyendo o armando estrategias.", "Dibujando, tocando un instrumento, escribiendo o creando contenido.", "Jugando videojuegos, explorando tecnología o arreglando cosas en casa.", "Saliendo con amigos, en actividades grupales o ayudando a otros."] },
        { id: 3, tipo: 'cerrada', pregunta: "3. Cuando te enfrentas a un problema difícil, ¿cuál es tu primera reacción?", opciones: ["Analizo los datos, busco la lógica y estructuro una solución paso a paso.", "Busco una forma creativa, diferente o 'fuera de la caja' para resolverlo.", "Tomo el liderazgo, organizo a los demás y tomo decisiones rápidas.", "Pido opiniones, converso con mi equipo y buscamos una solución juntos."] },
        { id: 4, tipo: 'cerrada', pregunta: "4. ¿En qué tipo de ambiente te imaginas trabajando en el futuro?", opciones: ["En un laboratorio, clinic o centro de investigación.", "En un estudio de diseño, teatro, o viajando constantemente.", "En una oficina corporativa, banco o dirigiendo tu propia empresa.", "En campo, construcciones, plantas industriales o al aire libre."] },
        { id: 5, tipo: 'cerrada', pregunta: "5. En un trabajo grupal del colegio, ¿qué rol sueles asumir naturalmente?", opciones: ["El que investiga a fondo, recopila la información y revisa que todo tenga sentido.", "El que diseña las diapositivas, hace la carátula y le da el toque visual.", "El líder que expone, reparte los temas y organiza los tiempos.", "El conciliador que ayuda a los compañeros que no entienden y mantiene la paz."] },
        { id: 6, tipo: 'cerrada', pregunta: "6. ¿Qué tipo de noticias o videos en internet captan más tu atención?", opciones: ["Descubrimientos científicos, avances médicos o documentales de naturaleza.", "Economía, negocios, emprendimientos o política local e internacional.", "Lanzamientos de nuevos celulares, inteligencia artificial o motores.", "Temas de salud mental, derechos humanos, o causas sociales."] },
        { id: 7, tipo: 'cerrada', pregunta: "7. ¿Cuál de estas herramientas te resultaría más fascinante usar todos los días?", opciones: ["Un microscopio, instrumentos de medición o software de datos.", "Una cámara profesional, un lienzo o un programa de diseño gráfico.", "Hojas de cálculo (Excel), agendas de negocios y gráficos financieros.", "Manuales de maquinaria, planos arquitectónicos o herramientas de taller."] },
        { id: 8, tipo: 'cerrada', pregunta: "8. Si tuvieras que ser voluntario en una ONG en Piura, ¿qué harías?", opciones: ["Ayudar en la logística, administrando las donaciones y el presupuesto.", "Diseñar los afiches y las campañas de publicidad para redes sociales.", "Ir al campo a construir casas, limpiar playas o plantar árboles.", "Dar clases de refuerzo a niños o asistir a adultos mayores."] },
        { id: 9, tipo: 'cerrada', pregunta: "9. ¿Qué valoras más a la hora de pensar en tu futuro trabajo?", opciones: ["El descubrimiento: poder investigar y encontrar verdades o curas.", "La independencia: tener libertad para expresar mis ideas sin horarios estrictos.", "El liderazgo y éxito económico: dirigir proyectos grandes y ganar bien.", "El servicio: sentir que mi trabajo mejora la vida de mi comunidad."] },
        { id: 10, tipo: 'cerrada', pregunta: "10. ¿Cómo te llevas con las reglas estrictas y las rutinas diarias?", opciones: ["Me encantan; prefiero tener instrucciones claras, orden y saber qué esperar.", "Me frustran un poco; prefiero la flexibilidad y hacer las cosas a mi modo.", "Las sigo si son lógicas, pero si encuentro una forma más eficiente, la propongo.", "Me adapto fácilmente si eso ayuda a que el grupo funcione mejor."] },
        { id: 11, tipo: 'cerrada', pregunta: "11. ¿Por qué te suelen buscar tus amigos o familiares cuando necesitan ayuda?", opciones: ["Para que les explique tareas difíciles de matemáticas o ciencias.", "Para pedirme un consejo personal o porque sé escuchar muy bien.", "Para que les arregle la computadora, el internet o algún aparato.", "Para que les ayude a organizar un evento, fiesta o vender algo."] },
        { id: 12, tipo: 'cerrada', pregunta: "12. Elige el gran reto que más te emocionaría resolver:", opciones: ["Encontrar la cura para una enfermedad compleja.", "Escribir un libro o dirigir una película que impacte a millones.", "Fundar una startup tecnológica que revolucione el mercado peruano.", "Diseñar y construir un puente o edificio moderno para tu ciudad."] },
        { id: 13, tipo: 'cerrada', pregunta: "13. ¿Cómo prefieres aprender algo nuevo (como usar un programa o armar un mueble)?", opciones: ["Leyendo el manual completo antes de tocar cualquier pieza.", "Viendo un tutorial en video y fijándome en los detalles visuales.", "Empezando a armarlo directamente, aprendiendo mediante la práctica y el error.", "Pidiéndole a alguien que ya sepa que me explique paso a paso."] },
        { id: 14, tipo: 'cerrada', pregunta: "14. Selecciona la frase que mejor te describa:", opciones: ["Soy una persona curiosa, analítica y me gusta llegar al fondo de las cosas.", "Soy una persona creativa, original y muy conectada con mis emociones.", "Soy una persona práctica, de acción rápida y me gusta ver resultados físicos.", "Soy una persona empática, comunicativa y disfruto trabajar en equipo."] },
        { id: 15, tipo: 'abierta', pregunta: "15. Finalmente, cuéntale a la IA en tus propias palabras: ¿Cuáles son tus mayores sueños profesionales? ¿Qué carreras o institutos tienes en mente actualmente (ej: UCV, UNP, SENATI), y qué dudas tienes sobre tu futuro? Sé sincero(a)." }
    ];

    let preguntaActual = 0;
    const respuestas = {};

    const questionContainer = document.getElementById('question-container');
    const btnNext = document.getElementById('btn-next');
    const btnPrev = document.getElementById('btn-prev');
    const btnSubmit = document.getElementById('btn-submit');
    const progressBar = document.getElementById('progress-bar');
    const currentQNum = document.getElementById('current-q-num');
    const totalQNum = document.getElementById('total-q-num');
    const loadingOverlay = document.getElementById('loading-overlay');

    totalQNum.innerText = preguntas.length;
    renderQuestion();

    function renderQuestion() {
        const q = preguntas[preguntaActual];
        currentQNum.innerText = preguntaActual + 1;
        progressBar.style.width = `${((preguntaActual) / preguntas.length) * 100}%`;

        let html = `<h2 class="question-text">${q.pregunta}</h2>`;

        if (q.tipo === 'cerrada') {
            html += `<div class="options-grid">`;
            const letras = ['A', 'B', 'C', 'D'];
            q.opciones.forEach((opcion, index) => {
                const isSelected = respuestas[q.id] === opcion ? 'selected' : '';
                html += `
                    <div class="option-card ${isSelected}" data-value="${opcion}">
                        <div class="option-letter">${letras[index]}</div>
                        <div class="option-text">${opcion}</div>
                    </div>`;
            });
            html += `</div>`;
        } else {
            html += `<textarea id="respuesta-abierta" class="open-answer" placeholder="Escribe aquí... (Mínimo 20 caracteres)">${respuestas[q.id] || ''}</textarea>`;
        }

        questionContainer.innerHTML = html;
        validateNavigation();
        validateInputs(q);
    }

    function validateInputs(q) {
        if (q.tipo === 'cerrada') {
            btnNext.disabled = !respuestas[q.id];
        } else {
            const txt = document.getElementById('respuesta-abierta');
            if (txt) {
                const isValid = txt.value.trim().length >= 20;
                btnNext.disabled = !isValid;
                btnSubmit.disabled = !isValid;
            }
        }
    }

    function attachEventListeners(q) {
        if (q.tipo === 'cerrada') {
            document.querySelectorAll('.option-card').forEach(opt => {
                opt.addEventListener('click', function() {
                    document.querySelectorAll('.option-card').forEach(o => o.classList.remove('selected'));
                    this.classList.add('selected');
                    respuestas[q.id] = this.getAttribute('data-value');
                    btnNext.disabled = false;
                });
            });
        } else {
            const txt = document.getElementById('respuesta-abierta');
            if (txt) {
                txt.addEventListener('input', function() {
                    respuestas[q.id] = this.value;
                    const isValid = this.value.trim().length >= 20;
                    btnNext.disabled = !isValid;
                    btnSubmit.disabled = !isValid;
                });
            }
        }
    }

    function validateNavigation() {
        btnPrev.classList.toggle('hidden', preguntaActual === 0);
        if (preguntaActual === preguntas.length - 1) {
            btnNext.classList.add('hidden');
            btnSubmit.classList.remove('hidden');
        } else {
            btnNext.classList.remove('hidden');
            btnSubmit.classList.add('hidden');
        }
    }

    // Usar una delegación de eventos o re-adjuntar cada vez que renderiza
    document.addEventListener('click', (e) => {
        const card = e.target.closest('.option-card');
        if (card) {
            const q = preguntas[preguntaActual];
            document.querySelectorAll('.option-card').forEach(o => o.classList.remove('selected'));
            card.classList.add('selected');
            respuestas[q.id] = card.getAttribute('data-value');
            btnNext.disabled = false;
        }
    });

    btnNext.addEventListener('click', () => { 
        if (preguntaActual < preguntas.length - 1) { 
            preguntaActual++; 
            renderQuestion(); 
        } 
    });
    
    btnPrev.addEventListener('click', () => { 
        if (preguntaActual > 0) { 
            preguntaActual--; 
            renderQuestion(); 
        } 
    });

    // Escuchador dinámico específico para el área de texto
    questionContainer.addEventListener('input', (e) => {
        if (e.target.id === 'respuesta-abierta') {
            const q = preguntas[preguntaActual];
            respuestas[q.id] = e.target.value;
            const isValid = e.target.value.trim().length >= 20;
            btnSubmit.disabled = !isValid;
        }
    });

    // =======================================================
    // ENVIAR DATOS, GUARDAR JSONB Y REDIRIGIR A RESULTADOS
    // =======================================================
    btnSubmit.addEventListener('click', async () => {
        loadingOverlay.classList.add('active');
        
        const idUsuario = localStorage.getItem('usuario_id') || localStorage.getItem('userId');

        if (!idUsuario) {
            alert("Error: No se encontró la sesión del usuario. Por favor, vuelve a iniciar sesión.");
            window.location.href = 'login.html';
            return;
        }

        try {
            const response = await fetch(`${API_URL}/api/guardar-respuestas`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    estudiante_id: idUsuario, 
                    respuestas: respuestas 
                })
            });

            const data = await response.json();
            
            if (response.ok && data.status === "success") {
                console.log("¡Test procesado con éxito por la IA y persistido en DB!");
                
                // Convertimos el objeto JSON de Gemini a String para pasarlo de página
                const reporteTexto = typeof data.reporte === 'object' ? JSON.stringify(data.reporte) : data.reporte;
                localStorage.setItem('reporteVocacional', reporteTexto);
                
                // ¡AQUÍ ASEGURAMOS TU REDIRECCIÓN ORIGINAL AL INFORME DE LA IA!
                window.location.href = 'resultados.html';
            } else {
                alert("Hubo un problema al procesar tu test en la IA: " + (data.detail || "Error interno"));
                loadingOverlay.classList.remove('active');
            }
            
        } catch (error) {
            console.error("Error al conectar con Python:", error);
            alert("Error: El servidor Python está apagado o hay un problema de conexión.");
            loadingOverlay.classList.remove('active');
        }
    });
});