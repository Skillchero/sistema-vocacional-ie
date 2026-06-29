import os
import psycopg2
from dotenv import load_dotenv
from passlib.context import CryptContext

# Cargar las variables del archivo .env (esencial para desarrollo local)
load_dotenv()

# Obtener la URL de conexión de la nube desde las variables de entorno
DATABASE_URL = os.getenv("DATABASE_URL")

# Configuración de Base de Datos Local (como respaldo)
DB_CONFIG_LOCAL = {
    "host": "localhost",
    "database": "postgres",
    "user": "postgres",
    "password": "2001",
    "port": "5432"
}

# Configuración de seguridad (Encriptador de claves)
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# Función maestra para conectarse a la BD
def get_db_connection():
    try:
        if DATABASE_URL:
            # Si existe la variable en el .env o en Render, se conecta a la nube
            return psycopg2.connect(DATABASE_URL)
        else:
            # Si no encuentra la variable, usa la configuración local por defecto
            return psycopg2.connect(**DB_CONFIG_LOCAL)
    except Exception as e:
        print(f"Error crítico en el conector de base de datos: {e}")
        raise e