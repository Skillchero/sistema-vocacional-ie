# =====================================================================
# main.py - Director de Orquesta (FastAPI)
# =====================================================================
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# Importamos nuestros módulos (routers)
from backend import auth, usuarios, evaluacion

app = FastAPI(title="Sistema Vocacional Leonor Cerna", version="1.0")

# Configuración CORS para la NUBE (Permite que GitHub Pages se conecte)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # El asterisco permite conexiones desde cualquier URL en internet
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# =====================================================================
# ENCHUFAMOS LOS MÓDULOS AQUÍ
# =====================================================================
app.include_router(auth.router)
app.include_router(usuarios.router)
app.include_router(evaluacion.router)

print("🚀 Servidor iniciado y módulos cargados correctamente.")