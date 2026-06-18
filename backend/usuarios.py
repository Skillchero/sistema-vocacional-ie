from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import psycopg2

from database import get_db_connection, pwd_context

router = APIRouter()

class NuevoUsuarioPayload(BaseModel):
    nombres: str
    apellidos: str
    correo: str
    rol: str
    password: str
    # Solo para alumnos
    grado: str | None = None
    seccion: str | None = None

@router.get("/api/usuarios")
async def obtener_usuarios():
    try:
        conn = get_db_connection()
        cur = conn.cursor()

        cur.execute("""
            SELECT 
                u.usuario_id, 
                COALESCE(e.nombres, p.nombres, 'Sin Nombre') AS nombres,
                COALESCE(e.apellidos, p.apellidos, '') AS apellidos,
                u.rol,
                u.email
            FROM usuarios u
            LEFT JOIN estudiantes e ON u.usuario_id = e.usuario_id
            LEFT JOIN personal p ON u.usuario_id = p.usuario_id
            ORDER BY u.fecha_registro DESC
        """)

        usuarios_db = cur.fetchall()
        cur.close()
        conn.close()

        lista_usuarios = []
        for u in usuarios_db:
            lista_usuarios.append({
                "id_usuario": str(u[0]),
                "nombres": u[1],
                "apellidos": u[2],
                "rol": u[3],
                "email": u[4]
            })

        return {"success": True, "usuarios": lista_usuarios}

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al cargar usuarios: {str(e)}")

@router.post("/api/crear-usuario")
async def crear_usuario(payload: NuevoUsuarioPayload):
    conn = None
    try:
        # --- BLINDAJE DE SEGURIDAD ---
        # 1. Aseguramos que sea una cadena de texto plana
        password_str = str(payload.password)
        # 2. Quitamos espacios innecesarios
        password_limpia = password_str.strip()
        
        # 3. Validamos longitud antes de encriptar para evitar el error de bcrypt
        if len(password_limpia) > 72:
            password_limpia = password_limpia[:72]
            
        hash_seguro = pwd_context.hash(password_limpia)
        # -----------------------------

        conn = get_db_connection()
        cur = conn.cursor()

        cur.execute("""
            INSERT INTO usuarios (usuario_id, email, password_hash, rol, fecha_registro)
            VALUES (uuid_generate_v4(), %s, %s, %s, CURRENT_TIMESTAMP)
            RETURNING usuario_id
        """, (payload.correo.strip(), hash_seguro, payload.rol.strip()))

        nuevo_usuario_id = cur.fetchone()[0]
        rol_limpio = payload.rol.lower().strip()

        if rol_limpio in ["alumno", "estudiante"]:
            cur.execute("""
                INSERT INTO estudiantes (estudiante_id, usuario_id, nombres, apellidos, grado, seccion)
                VALUES (uuid_generate_v4(), %s, %s, %s, %s, %s)
            """, (nuevo_usuario_id, payload.nombres.strip(), payload.apellidos.strip(), payload.grado.strip(), payload.seccion.strip()))

        elif rol_limpio in ["psicologo", "psicólogo", "tutor", "admin", "administrador"]:
            cur.execute("""
                INSERT INTO personal (personal_id, usuario_id, nombres, apellidos)
                VALUES (uuid_generate_v4(), %s, %s, %s)
            """, (nuevo_usuario_id, payload.nombres.strip(), payload.apellidos.strip()))

        conn.commit()
        cur.close()
        conn.close()

        return {"status": "success", "mensaje": "Usuario creado correctamente"}

    except Exception as e:
        if conn: conn.rollback()
        # Imprimir el error en consola para saber qué falló
        print(f"DEBUG: Error al crear usuario: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error: {str(e)}")

@router.get("/api/psicologo/alumnos")
async def obtener_alumnos_psicologo():
    conn = None
    cur = None
    try:
        conn = get_db_connection()
        cur = conn.cursor()
        
        cur.execute("""
            SELECT 
                e.estudiante_id,
                e.nombres,
                e.apellidos,
                e.seccion,
                (SELECT COUNT(*) FROM resultados r WHERE r.estudiante_id = e.estudiante_id) as intentos,
                u.usuario_id
            FROM usuarios u
            JOIN estudiantes e ON u.usuario_id = e.usuario_id
            WHERE u.rol IN ('alumno', 'estudiante')
            ORDER BY e.seccion ASC, e.apellidos ASC
        """)
        
        alumnos_db = cur.fetchall()
        lista_alumnos = [
            {"estudiante_id": str(a[0]), "nombres": a[1], "apellidos": a[2], "seccion": a[3], "intentos": a[4], "usuario_id": str(a[5])}
            for a in alumnos_db
        ]
        
        return {"status": "success", "data": lista_alumnos}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al cargar alumnos: {str(e)}")
    finally:
        if cur: cur.close()
        if conn: conn.close()

@router.delete("/api/usuarios/{usuario_id}")
async def eliminar_usuario(usuario_id: str):
    conn = None
    try:
        conn = get_db_connection()
        cur = conn.cursor()
        cur.execute("DELETE FROM estudiantes WHERE usuario_id = %s", (usuario_id,))
        cur.execute("DELETE FROM personal WHERE usuario_id = %s", (usuario_id,))
        cur.execute("DELETE FROM usuarios WHERE usuario_id = %s", (usuario_id,))
        conn.commit()
        cur.close()
        conn.close()
        return {"status": "success", "mensaje": "Usuario eliminado correctamente"}
    except Exception as e:
        if conn: conn.rollback()
        raise HTTPException(status_code=500, detail=f"Error al eliminar usuario: {str(e)}")