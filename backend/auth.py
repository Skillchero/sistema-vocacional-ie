from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from database import get_db_connection, pwd_context

router = APIRouter()

class LoginPayload(BaseModel):
    usuario: str 
    password: str

@router.post("/api/login")
async def login(payload: LoginPayload):
    conn = None
    cur = None
    try:
        # --- SOLUCIÓN: Limpieza de entrada ---
        # 1. Quitamos espacios accidentales
        # 2. Cortamos a 72 bytes para satisfacer el límite estricto de bcrypt
        password_limpia = payload.password.strip()[:72]
        
        conn = get_db_connection()
        cur = conn.cursor()
        
        cur.execute("""
            SELECT u.password_hash, u.rol, COALESCE(e.nombres, p.nombres) as nombres, u.usuario_id 
            FROM usuarios u
            LEFT JOIN estudiantes e ON u.usuario_id = e.usuario_id
            LEFT JOIN personal p ON u.usuario_id = p.usuario_id
            WHERE u.email = %s
        """, (payload.usuario.strip(),)) # También limpiamos el email
        
        resultado = cur.fetchone()
        
        if resultado:
            db_password_hash, rol, nombres, usuario_id = resultado
            
            # --- VERIFICACIÓN SEGURA ---
            # Verificamos que el hash realmente parezca un hash de bcrypt
            if not db_password_hash or not db_password_hash.startswith('$2'):
                 raise HTTPException(status_code=500, detail="Error de formato en seguridad de la base de datos.")

            if pwd_context.verify(password_limpia, db_password_hash):
                nombre_final = nombres if nombres else payload.usuario.split('@')[0].capitalize()
                
                return {
                    "status": "success", 
                    "rol": rol, 
                    "nombres": nombre_final, 
                    "email": payload.usuario,
                    "usuario_id": str(usuario_id)
                }
            else:
                raise HTTPException(status_code=401, detail="Contraseña incorrecta")
        else:
            raise HTTPException(status_code=401, detail="Usuario no encontrado")
            
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error en servidor: {str(e)}")
    finally:
        if cur: cur.close()
        if conn: conn.close()