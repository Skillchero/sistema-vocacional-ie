from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from database import get_db_connection, pwd_context

# Inicializamos el "mini-módulo"
router = APIRouter()

# Modelo de datos para el Login
class LoginPayload(BaseModel):
    usuario: str 
    password: str

@router.post("/api/login")
async def login(payload: LoginPayload):
    conn = None
    cur = None
    try:
        conn = get_db_connection()
        cur = conn.cursor()
        
        # Unimos usuarios con estudiantes Y con la nueva tabla personal.
        # ¡AQUÍ AGREGAMOS u.usuario_id AL SELECT!
        cur.execute("""
            SELECT u.password_hash, u.rol, COALESCE(e.nombres, p.nombres) as nombres, u.usuario_id 
            FROM usuarios u
            LEFT JOIN estudiantes e ON u.usuario_id = e.usuario_id
            LEFT JOIN personal p ON u.usuario_id = p.usuario_id
            WHERE u.email = %s
        """, (payload.usuario,))
        resultado = cur.fetchone()
        
        if resultado:
            # ¡AQUÍ EXTRAEMOS EL usuario_id DESDE LA FILA DE LA BASE DE DATOS!
            db_password_hash, rol, nombres, usuario_id = resultado
            
            if pwd_context.verify(payload.password, db_password_hash):
                
                # ========================================================
                # LA SOLUCIÓN AQUÍ: Si tiene nombre, lo usa. 
                # Si no tiene (cuenta antigua), usa el texto antes del '@' del correo.
                # ========================================================
                if nombres:
                    nombre_final = nombres
                else:
                    # Ejemplo: de "admin@colegio.edu.pe" saca "Admin"
                    nombre_final = payload.usuario.split('@')[0].capitalize()
                
                # Retornamos el nombre real o el nombre de la cuenta JUNTO AL usuario_id
                return {
                    "status": "success", 
                    "rol": rol, 
                    "nombres": nombre_final, 
                    "email": payload.usuario,
                    "usuario_id": str(usuario_id) # ¡AQUÍ ENVIAMOS EL ID EN FORMATO TEXTO PARA EL UUID!
                }
            else:
                raise HTTPException(status_code=401, detail="Contraseña incorrecta")
        else:
            raise HTTPException(status_code=401, detail="Usuario no encontrado")
            
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error en base de datos: {str(e)}")
    finally:
        if cur:
            cur.close()
        if conn:
            conn.close()


# =======================================================
# Ruta para consultar el historial (Se mantiene intacto por si lo usas)
# =======================================================
@router.get("/api/historial")
async def obtener_historial(email: str):
    conn = None
    cur = None
    try:
        conn = get_db_connection()
        cur = conn.cursor()
        
        cur.execute("""
            SELECT fecha_registro, carrera_sugerida 
            FROM resultados 
            WHERE email = %s 
            ORDER BY fecha_registro DESC
        """, (email,))
        historial_db = cur.fetchall()
        
        lista_historial = [{"fecha": str(fila[0]), "carrera": fila[1]} for fila in historial_db]
        
        return {"historial": lista_historial}
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al obtener historial: {str(e)}")
    finally:
        if cur:
            cur.close()
        if conn:
            conn.close()