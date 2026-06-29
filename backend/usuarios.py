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

        # Modificado: Usamos LEFT JOIN para buscar los nombres en estudiantes O en personal
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

        return {
            "success": True,
            "usuarios": lista_usuarios
        }

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error al cargar usuarios: {str(e)}"
        )


@router.post("/api/crear-usuario")
async def crear_usuario(payload: NuevoUsuarioPayload):
    conn = None
    try:
        print("\n===== DATOS RECIBIDOS =====")
        print(payload.dict())
        print("===========================\n")

        hash_seguro = pwd_context.hash(payload.password)

        conn = get_db_connection()
        cur = conn.cursor()

        # 1. Crear usuario principal
        cur.execute("""
            INSERT INTO usuarios
            (
                usuario_id,
                email,
                password_hash,
                rol,
                fecha_registro
            )
            VALUES
            (
                uuid_generate_v4(),
                %s,
                %s,
                %s,
                CURRENT_TIMESTAMP
            )
            RETURNING usuario_id
        """, (
            payload.correo,
            hash_seguro,
            payload.rol
        ))

        nuevo_usuario_id = cur.fetchone()[0]
        print("UUID GENERADO:", nuevo_usuario_id)

        # 2. EVALUAMOS EL ROL PARA VER EN QUÉ TABLA GUARDAR LOS NOMBRES
        rol_limpio = payload.rol.lower()

        # Crear alumno
        if rol_limpio == "alumno" or rol_limpio == "estudiante":
            if not payload.grado or not payload.seccion:
                raise HTTPException(
                    status_code=400,
                    detail="Los alumnos deben tener grado y sección."
                )

            cur.execute("""
                INSERT INTO estudiantes
                (
                    estudiante_id,
                    usuario_id,
                    nombres,
                    apellidos,
                    grado,
                    seccion
                )
                VALUES
                (
                    uuid_generate_v4(),
                    %s,
                    %s,
                    %s,
                    %s,
                    %s
                )
            """, (
                nuevo_usuario_id,
                payload.nombres,
                payload.apellidos,
                payload.grado,
                payload.seccion
            ))
            print("Alumno insertado correctamente en la tabla 'estudiantes'")

        # NUEVA LÓGICA: Si es Psicólogo, Tutor o Admin, guardamos en la tabla 'personal'
        elif rol_limpio in ["psicologo", "psicólogo", "tutor", "admin", "administrador"]:
            cur.execute("""
                INSERT INTO personal
                (
                    personal_id,
                    usuario_id,
                    nombres,
                    apellidos
                )
                VALUES
                (
                    uuid_generate_v4(),
                    %s,
                    %s,
                    %s
                )
            """, (
                nuevo_usuario_id,
                payload.nombres,
                payload.apellidos
            ))
            print(f"Personal insertado correctamente en la tabla 'personal' con rol: {payload.rol}")

        conn.commit()
        cur.close()
        conn.close()

        return {
            "status": "success",
            "mensaje": "Usuario creado correctamente"
        }

    except psycopg2.IntegrityError as e:
        if conn:
            conn.rollback()
        print("\n===== ERROR SQL =====")
        print(type(e))
        print(str(e))
        print("=====================\n")
        raise HTTPException(
            status_code=400,
            detail=str(e)
        )

    except Exception as e:
        if conn:
            conn.rollback()
        print("\n===== ERROR GENERAL =====")
        print(type(e))
        print(str(e))
        print("=========================\n")
        raise HTTPException(
            status_code=500,
            detail=str(e)
        )

# =====================================================================
# NUEVA RUTA PARA EL DOCENTE/PSICÓLOGO: OBTENER ALUMNOS, SECCIÓN E INTENTOS
# =====================================================================
@router.get("/api/psicologo/alumnos")
async def obtener_alumnos_psicologo():
    conn = None
    cur = None
    try:
        conn = get_db_connection()
        cur = conn.cursor()
        
        # Hacemos un JOIN entre usuarios, estudiantes y contamos sus resultados
        # CORRECCIÓN APLICADA AQUÍ: Agregamos u.usuario_id al final del SELECT
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
        lista_alumnos = []
        
        for a in alumnos_db:
            lista_alumnos.append({
                "estudiante_id": str(a[0]),
                "nombres": a[1],
                "apellidos": a[2],
                "seccion": a[3],
                "intentos": a[4],
                "usuario_id": str(a[5])  # CORRECCIÓN APLICADA AQUÍ: Enviamos el ID al Frontend
            })
            
        return {
            "status": "success",
            "data": lista_alumnos
        }
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error al cargar alumnos: {str(e)}"
        )
    finally:
        if cur:
            cur.close()
        if conn:
            conn.close()

# =====================================================================
# NUEVA RUTA PARA ELIMINAR UN USUARIO
# =====================================================================
@router.delete("/api/usuarios/{usuario_id}")
async def eliminar_usuario(usuario_id: str):
    conn = None
    try:
        conn = get_db_connection()
        cur = conn.cursor()

        # 1. Borramos de las tablas hijas primero (para evitar errores de clave foránea)
        cur.execute("DELETE FROM estudiantes WHERE usuario_id = %s", (usuario_id,))
        cur.execute("DELETE FROM personal WHERE usuario_id = %s", (usuario_id,))
        
        # 2. Finalmente, borramos de la tabla principal
        cur.execute("DELETE FROM usuarios WHERE usuario_id = %s", (usuario_id,))
        
        conn.commit()
        cur.close()
        conn.close()
        
        return {"status": "success", "mensaje": "Usuario eliminado correctamente"}

    except Exception as e:
        if conn:
            conn.rollback()
        raise HTTPException(status_code=500, detail=f"Error al eliminar usuario: {str(e)}")

        # ====================================================================
# NUEVO: RUTA PARA RESTABLECER CONTRASEÑA DEL USUARIO
# ====================================================================
class UpdatePasswordPayload(BaseModel):
    password: str

@router.put("/api/usuarios/{usuario_id}/password")
async def actualizar_password(usuario_id: str, payload: UpdatePasswordPayload):
    conn = None
    cur = None
    try:
        # 1. Encriptamos la nueva contraseña que escribió el Admin
        hash_seguro = pwd_context.hash(payload.password)
        conn = get_db_connection()
        cur = conn.cursor()

        # 2. Actualizamos la base de datos
        cur.execute("""
            UPDATE usuarios
            SET password_hash = %s
            WHERE usuario_id = %s
        """, (hash_seguro, usuario_id))

        if cur.rowcount == 0:
            raise HTTPException(status_code=404, detail="Usuario no encontrado en la base de datos")

        conn.commit()
        return {"status": "success", "message": "Contraseña actualizada correctamente"}
    
    except Exception as e:
        if conn:
            conn.rollback()
        raise HTTPException(status_code=500, detail=f"Error al actualizar la contraseña: {str(e)}")
    finally:
        if cur:
            cur.close()
        if conn:
            conn.close()

            # ====================================================================
# NUEVO: RUTA PARA ACTUALIZAR DATOS DEL USUARIO
# ====================================================================
class ActualizarUsuarioPayload(BaseModel):
    nombres: str
    apellidos: str
    correo: str
    rol: str

@router.put("/api/usuarios/{usuario_id}")
async def actualizar_datos_usuario(usuario_id: str, payload: ActualizarUsuarioPayload):
    conn = None
    cur = None
    try:
        conn = get_db_connection()
        cur = conn.cursor()

        # 1. Actualizamos el correo y rol en la tabla principal de usuarios
        cur.execute("""
            UPDATE usuarios 
            SET email = %s, rol = %s 
            WHERE usuario_id = %s
        """, (payload.correo, payload.rol, usuario_id))

        # 2. Actualizamos nombres y apellidos dependiendo de si es alumno o personal
        if payload.rol.lower() == 'alumno':
            cur.execute("""
                UPDATE estudiantes 
                SET nombres = %s, apellidos = %s 
                WHERE usuario_id = %s
            """, (payload.nombres, payload.apellidos, usuario_id))
        else:
            cur.execute("""
                UPDATE personal 
                SET nombres = %s, apellidos = %s 
                WHERE usuario_id = %s
            """, (payload.nombres, payload.apellidos, usuario_id))

        conn.commit()
        return {"status": "success", "message": "Datos modificados correctamente"}
    
    except Exception as e:
        if conn:
            conn.rollback()
        raise HTTPException(status_code=500, detail=f"Error al actualizar: {str(e)}")
    finally:
        if cur:
            cur.close()
        if conn:
            conn.close()