import json
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Dict, Any
from psycopg2.extras import RealDictCursor

# IMPORTACIONES DE TU SISTEMA
from backend.motor_ia import procesar_y_analizar
from database import get_db_connection 

router = APIRouter()

# Estructura de datos que recibe el backend
class EvaluacionPayload(BaseModel):
    estudiante_id: str  # Recibimos el usuario_id desde JavaScript
    respuestas: Dict[str, Any] 

# =====================================================================
# 1. ENDPOINT PARA PROCESAR EL TEST Y GUARDARLO EN EL HISTORIAL (POST)
# =====================================================================
@router.post("/api/guardar-respuestas")
async def guardar_respuestas(payload: EvaluacionPayload):
    print("\n================ [ACTIVIDAD 10: CAPTURA JSONB] ================")
    print(f"📦 Datos recibidos del Usuario ID: {payload.estudiante_id}")
    
    conn = None
    cur = None
    try:
        conn = get_db_connection()
        cur = conn.cursor()
        
        # -------------------------------------------------------------------
        # ¡ACTUALIZADO! Buscamos el estudiante_id Y sus NOMBRES reales
        # -------------------------------------------------------------------
        cur.execute("SELECT estudiante_id, nombres FROM estudiantes WHERE usuario_id = %s", (payload.estudiante_id,))
        fila_estudiante = cur.fetchone()
        
        if not fila_estudiante:
            # Fallback por si es una cuenta antigua o admin/personal
            estudiante_id_real = payload.estudiante_id
            nombre_alumno = "Estudiante"
        else:
            estudiante_id_real = fila_estudiante[0]
            nombre_alumno = fila_estudiante[1] if fila_estudiante[1] else "Estudiante"
            
        print(f"✅ Estudiante encontrado: {nombre_alumno} (ID: {estudiante_id_real})")
        # -------------------------------------------------------------------
        
        # A. La IA procesa las respuestas PASÁNDOLE EL NOMBRE REAL DEL ALUMNO
        informe_generado_gemini = procesar_y_analizar(payload.respuestas, nombre_alumno)
        
        # 2. Buscamos un test_id válido en el catálogo
        cur.execute("SELECT test_id FROM evaluaciones_catalogo LIMIT 1")
        fila_test = cur.fetchone()
        test_id_real = fila_test[0] if fila_test else 1

        # Convertimos a texto string para guardarlo en la BD
        respuestas_json_texto = json.dumps(payload.respuestas)
        informe_json_texto = json.dumps(informe_generado_gemini)
        
        # INSERT en tu tabla 'resultados'
        sql = """
            INSERT INTO resultados 
            (estudiante_id, test_id, respuestas_json, informe_ia, fecha_completado)
            VALUES (%s, %s, %s, %s, CURRENT_TIMESTAMP)
        """
        cur.execute(sql, (
            estudiante_id_real, 
            test_id_real, 
            respuestas_json_texto, 
            informe_json_texto
        ))
        conn.commit()
        print(f"💾 [POSTGRESQL] Informe guardado exitosamente en la base de datos.")
        
    except Exception as e:
        print(f"❌ [ERROR BASE DE DATOS] Fallo al insertar: {str(e)}")
        if conn: 
            conn.rollback()
        raise HTTPException(status_code=500, detail=f"Error al guardar historial: {str(e)}")
    finally:
        if cur: cur.close()
        if conn: conn.close()
    
    # C. Retornamos la respuesta exitosa al Frontend
    return {
        "status": "success",
        "mensaje": "Respuestas procesadas por IA y registradas correctamente.",
        "reporte": informe_generado_gemini
    }

# =====================================================================
# 2. ENDPOINT PARA LEER EL HISTORIAL PERSONAL DEL ALUMNO (GET)
# =====================================================================
@router.get("/api/historial/{usuario_id}")
async def obtener_historial(usuario_id: str): 
    conn = None
    cur = None
    try:
        conn = get_db_connection()
        cur = conn.cursor(cursor_factory=RealDictCursor)
        
        sql = """
            SELECT 
                r.resultado_id as id_resultado, 
                e.usuario_id as id_usuario, 
                r.fecha_completado as fecha_evaluacion, 
                r.informe_ia 
            FROM resultados r
            INNER JOIN estudiantes e ON r.estudiante_id = e.estudiante_id
            WHERE e.usuario_id = %s 
            ORDER BY r.fecha_completado DESC
        """
        cur.execute(sql, (usuario_id,))
        historial_alumno = cur.fetchall()
        
        return historial_alumno
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error en el servidor al consultar el historial: {str(e)}")
    finally:
        if cur: cur.close()
        if conn: conn.close()