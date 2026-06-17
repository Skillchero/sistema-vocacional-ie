import os
import psycopg2
from passlib.context import CryptContext

# Configuración de Base de Datos (Adaptada para la Nube y Local)
DB_CONFIG = {
    "host": os.environ.get("DB_HOST", "localhost"),
    "database": os.environ.get("DB_NAME", "postgres"),
    "user": os.environ.get("DB_USER", "postgres"),
    "password": os.environ.get("DB_PASSWORD", "2001"),
    "port": os.environ.get("DB_PORT", "5432")
}

# Configuración de seguridad (Encriptador de claves)
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# Función maestra para conectarse a la BD
def get_db_connection():
    return psycopg2.connect(**DB_CONFIG)