import psycopg2
from passlib.context import CryptContext

# Configuración de Base de Datos
DB_CONFIG = {
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
    return psycopg2.connect(**DB_CONFIG)