# =====================================================================
# backend/motor_ia.py
# Módulo de Inteligencia Artificial y Procesamiento Lógico
# =====================================================================

import os
import json
from google import genai
from google.genai import types

# 1. CONFIGURACIÓN DE CONEXIÓN A LA API SEGURA (Variables de entorno)
# Render le pasará tu clave real a través de "GEMINI_API_KEY"
API_KEY = os.environ.get("GEMINI_API_KEY") 
cliente = genai.Client(api_key=API_KEY)

# =====================================================================
# ACTIVIDAD 14: FUNCIÓN GENERADORA DEL REPORTE
# =====================================================================
def generar_recomendacion_vocacional(nombre_alumno, respuestas_test, sueno_profesional):
    
    instruccion_sistema = (
        "Eres un orientador vocacional experto, empático y motivador del sistema educativo de Perú. "
        "Trabajas para la I.E. Leonor Cerna de Valdiviezo en la ciudad de Piura. "
        "Tu misión es analizar el perfil de los estudiantes de secundaria y darles recomendaciones "
        "realistas y viables basadas estrictamente en la oferta educativa de la región Piura, "
        "la cual incluye opciones universitarias y técnicas como la Universidad Nacional de Piura (UNP), "
        "Universidad de Piura (UDEP), Universidad César Vallejo (UCV), SENATI, entre otras instituciones locales. "
        "\n\n"
        "REGLA CRÍTICA DE ÉTICA Y NEUTRALIDAD: Debes ser totalmente objetivo. "
        "Las recomendaciones académicas y profesionales deben justificarse ÚNICAMENTE en las respuestas del test "
        "del alumno. IGNORA temas de tecnología o software a menos que sus respuestas lo indiquen claramente."
    )

    prompt_usuario = f"""
    Analiza el siguiente perfil del estudiante basado estrictamente en sus respuestas del test:
    - Nombre del estudiante: {nombre_alumno}
    - Respuestas marcadas en el test vocacional: 
    {respuestas_test}
    - Lo que el alumno escribió sobre sus sueños y dudas: "{sueno_profesional}"
    
    Por favor, redacta un informe vocacional dirigido directamente al estudiante. 
    ES OBLIGATORIO QUE TU RESPUESTA SEA ÚNICA Y EXCLUSIVAMENTE UN OBJETO JSON VÁLIDO.
    No incluyas código markdown (como ```json), solo devuelve el objeto puro con esta estructura exacta:
    
    {{
        "saludo": "¡Hola, {nombre_alumno}! Es un gusto para mí...",
        "perfil": "Aquí redacta el análisis de sus fortalezas y perfil basado en sus respuestas.",
        "carreras_sugeridas": [
            {{
                "titulo": "Nombre de Carrera 1 (Institución sugerida)",
                "descripcion": "Breve explicación de por qué encaja con su perfil."
            }},
            {{
                "titulo": "Nombre de Carrera 2 (Institución sugerida)",
                "descripcion": "Breve explicación de por qué encaja con su perfil."
            }},
            {{
                "titulo": "Nombre de Carrera 3 (Institución sugerida)",
                "descripcion": "Breve explicación de por qué encaja con su perfil."
            }}
        ],
        "conclusiones": "Un mensaje final motivador para su futuro en Piura."
    }}
    """
    
    try:
        respuesta = cliente.models.generate_content(
            model='gemini-2.5-flash',
            contents=prompt_usuario,
            config=types.GenerateContentConfig(
                system_instruction=instruccion_sistema, 
                temperature=0.7 
            )
        )
        
        # Limpieza de seguridad por si Gemini incluye etiquetas de código markdown
        texto_limpio = respuesta.text.replace("```json", "").replace("```", "").strip()
        
        # Convertimos el texto a un diccionario de Python para enviarlo perfecto al Frontend
        return json.loads(texto_limpio)
        
    except Exception as e:
        # En caso de error, devolvemos una estructura JSON válida de emergencia
        return {
            "saludo": f"¡Hola, {nombre_alumno}!",
            "perfil": f"Hubo un error al procesar tu análisis con la IA: {str(e)}",
            "carreras_sugeridas": [],
            "conclusiones": "Por favor, intenta realizar el test más tarde."
        }

# =====================================================================
# ACTIVIDAD 13: MOTOR DE PROCESAMIENTO DE DATOS 
# =====================================================================
# ¡ACTUALIZADO! Ahora recibe el parámetro nombre_alumno desde evaluacion.py
def procesar_y_analizar(respuestas_json, nombre_alumno="Estudiante"): 
    print("🧠 [MOTOR IA]: Analizando las respuestas recibidas en formato JSON...")

    # 1. Extraemos el sueño profesional (la pregunta abierta)
    sueno_profesional = respuestas_json.pop("15", "El alumno no especificó su sueño profesional.")

    # 2. Agrupamos TODAS las demás respuestas para que la IA las lea
    respuestas_texto = ""
    for pregunta, respuesta in respuestas_json.items():
        respuestas_texto += f"- Pregunta {pregunta}: {respuesta}\n"

    # Si por algún motivo llegan vacías las respuestas
    if not respuestas_texto.strip():
        respuestas_texto = "El alumno no marcó ninguna opción específica."

    # 3. Llamamos a Gemini INYECTANDO EL NOMBRE REAL
    print(f"🤖 [MOTOR IA]: Consultando a Google Gemini para el alumno: {nombre_alumno}...")
    informe_final = generar_recomendacion_vocacional(
        nombre_alumno=nombre_alumno,
        respuestas_test=respuestas_texto,
        sueno_profesional=sueno_profesional
    )
    
    print("✅ [MOTOR IA]: Reporte generado exitosamente.")
    return informe_final

# =====================================================================
# BLOQUE DE PRUEBA LOCAL (Simulador)
# =====================================================================
if __name__ == "__main__":
    print("Iniciando prueba local del Motor de IA...\n")
    
    # Hacemos una prueba extrema: perfil de ciencias de la salud
    json_simulado = {
        "1": "Me encanta la biología, anatomía y ayudar a personas enfermas.",
        "2": "Estar en hospitales o laboratorios investigando virus.",
        "15": "Quiero curar personas y salvar vidas en Piura."
    }
    
    reporte = procesar_y_analizar(json_simulado, "Jorge Luis")
    
    print("\n================ REPORTE VOCACIONAL GENERADO ================")
    # Imprimimos formateado para validar que sea un JSON correcto
    print(json.dumps(reporte, indent=4, ensure_ascii=False))
    print("=============================================================")