document.addEventListener('DOMContentLoaded', () => {
    
    // Elementos de la interfaz
    const loaderSection = document.getElementById('loader-section');
    const reportContent = document.getElementById('report-content');

    // Elementos donde inyectaremos la respuesta de la IA
    const aiSaludo = document.getElementById('ai-saludo');
    const aiFortalezas = document.getElementById('ai-fortalezas');
    const aiMensajeFinal = document.getElementById('ai-mensaje-final');
    
    console.log("Solicitando reporte al almacenamiento local de la sesión...");

    // ACTIVIDAD 14: Intentamos recuperar el reporte real de Gemini guardado por evaluacion.js
    const reporteVocacionalRealString = localStorage.getItem('reporteVocacional');

    // Mantenemos el setTimeout de tu diseño para darle el efecto UX de carga de red
    setTimeout(() => {

        // =====================================================================
        // CASO A: SI EXISTEN DATOS REALES ENVIADOS DESDE EL BACKEND (FastAPI)
        // =====================================================================
        if (reporteVocacionalRealString) {
            console.log("¡Reporte real detectado! Procesando JSON de Gemini...");

            try {
                // 1. Convertimos el string a un objeto JSON
                const informeIA = JSON.parse(reporteVocacionalRealString);

                // 2. Ocultar el loader y mostrar el contenedor de reporte
                loaderSection.classList.add('hidden');
                reportContent.classList.remove('hidden');

                // 3. Inyectar datos en la tarjeta de Perfil/Fortalezas
                // Se busca el nombre del alumno, si no existe se usa un saludo genérico
                const nombreUsuario = localStorage.getItem('userNombre') || "Estudiante";
                aiSaludo.innerText = `¡Hola, ${nombreUsuario}! Aquí está tu informe:`;
                
                // Gemini podría devolver el análisis bajo claves como 'perfil', 'analisis', etc.
                const perfilTexto = informeIA.perfil || informeIA.analisis || "Análisis de perfil generado correctamente.";
                aiFortalezas.innerText = perfilTexto;
                
                // 4. Inyectar datos en las tarjetas de Carreras (Top 3)
                // Se asume que Gemini devuelve 'carreras_sugeridas' o 'recomendaciones'
                const carreras = informeIA.carreras_sugeridas || informeIA.recomendaciones;
                
                if (carreras && Array.isArray(carreras) && carreras.length >= 3) {
                    document.getElementById('carrera-1-titulo').innerText = carreras[0].carrera || carreras[0].titulo || "Opción 1";
                    document.getElementById('carrera-1-desc').innerText = carreras[0].justificacion || carreras[0].descripcion || "";
                    
                    document.getElementById('carrera-2-titulo').innerText = carreras[1].carrera || carreras[1].titulo || "Opción 2";
                    document.getElementById('carrera-2-desc').innerText = carreras[1].justificacion || carreras[1].descripcion || "";
                    
                    document.getElementById('carrera-3-titulo').innerText = carreras[2].carrera || carreras[2].titulo || "Opción 3";
                    document.getElementById('carrera-3-desc').innerText = carreras[2].justificacion || carreras[2].descripcion || "";
                } else if (typeof carreras === 'string') {
                    // Por si la IA mandó las carreras como un bloque de texto
                    document.getElementById('carrera-1-titulo').innerText = "Opciones Sugeridas";
                    document.getElementById('carrera-1-desc').innerText = carreras;
                    
                    // Ocultamos las tarjetas 2 y 3
                    document.querySelectorAll('.career-card')[1].style.display = 'none';
                    document.querySelectorAll('.career-card')[2].style.display = 'none';
                }

                // 5. Inyectar datos en el Mensaje Final / Plan de Acción
                const mensaje = informeIA.conclusiones || informeIA.plan_accion || "Sigue adelante con tus metas profesionales.";
                aiMensajeFinal.innerText = mensaje;

            } catch (error) {
                console.error("Error al parsear el reporte JSON:", error);
                // Si falla el parseo, caemos a un formato simple
                loaderSection.classList.add('hidden');
                reportContent.classList.remove('hidden');
                aiFortalezas.innerText = reporteVocacionalRealString.replace(/\*\*/g, '');
                
                const sectionCarreras = document.querySelector('.careers-section');
                const cardMotivacional = document.querySelector('.motivational-card');
                if (sectionCarreras) sectionCarreras.classList.add('hidden');
                if (cardMotivacional) cardMotivacional.classList.add('hidden');
            }


        // =====================================================================
        // CASO B: PLAN B / MODO DEMOSTRACIÓN (Si entran directo a resultados.html)
        // =====================================================================
        } else {
            console.log("No se detectó un test activo. Cargando datos simulados de prueba...");
            
            const reporteGeneradoIA = {
                saludo: "¡Hola Carlos! Qué gusto conocer un poco más sobre ti.",
                fortalezas: "He analizado tus respuestas y veo un perfil brillante. Tienes una fuerte inclinación hacia el razonamiento lógico, el orden y la resolución de problemas estructurados. Además, tu interest por armar cosas y la tecnología muestra que tienes una mente sumamente práctica y orientada a resultados.",
                carreras: [
                    {
                        titulo: "Ingeniería de Sistemas / Software",
                        descripcion: "Ideal para ti. Podrás crear, analizar y estructurar tecnología. Instituciones como la UCV o la UDEP en Piura tienen excelentes laboratorios para potenciar este perfil."
                    },
                    {
                        titulo: "Desarrollo de Software (Técnico)",
                        descripcion: "Si prefieres entrar rápido al mercado laboral y crear aplicaciones de inmediato, esta carrera técnica en institutos locales como SENATI encaja perfecto con tu agilidad práctica."
                    },
                    {
                        titulo: "Ingeniería Industrial",
                        descripcion: "Combina tu gusto por el orden, la logística y la optimización de procesos. La UNP y la UCV ofrecen esta carrera, ideal para tu perfil analítico y organizador."
                    }
                ],
                mensaje_final: "El mundo necesita personas analíticas y creadoras como tú. Piura está creciendo tecnológicamente, ¡así que tienes un campo gigante de oportunidades! Confía en tus capacidades y recuerda que la disciplina siempre vence al talento. ¡Mucho éxito en tu futuro!"
            };

            // 1. Ocultar el loader y mostrar el reporte
            loaderSection.classList.add('hidden');
            reportContent.classList.remove('hidden');

            // 2. Inyectar los datos simulados en el HTML original
            aiSaludo.innerText = reporteGeneradoIA.saludo;
            aiFortalezas.innerText = reporteGeneradoIA.fortalezas;
            aiFortalezas.style.whiteSpace = "normal"; // Restablecemos para el texto corto simulado
            
            // Aseguramos que la sección de carreras esté visible si se ocultó antes
            const sectionCarreras = document.querySelector('.careers-section');
            const cardMotivacional = document.querySelector('.motivational-card');
            if (sectionCarreras) sectionCarreras.classList.remove('hidden');
            if (cardMotivacional) cardMotivacional.classList.remove('hidden');

            document.getElementById('carrera-1-titulo').innerText = reporteGeneradoIA.carreras[0].titulo;
            document.getElementById('carrera-1-desc').innerText = reporteGeneradoIA.carreras[0].descripcion;
            
            document.getElementById('carrera-2-titulo').innerText = reporteGeneradoIA.carreras[1].titulo;
            document.getElementById('carrera-2-desc').innerText = reporteGeneradoIA.carreras[1].descripcion;
            
            document.getElementById('carrera-3-titulo').innerText = reporteGeneradoIA.carreras[2].titulo;
            document.getElementById('carrera-3-desc').innerText = reporteGeneradoIA.carreras[2].descripcion;

            aiMensajeFinal.innerText = reporteGeneradoIA.mensaje_final;
        }

    }, 2000); // Mantenemos tus 2 segundos de animación de carga
});