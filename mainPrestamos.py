from fastapi import FastAPI
from datetime import datetime, timedelta
from db.client import dbClient
from bson import ObjectId
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Cambia "*" por los orígenes que deseas permitir, por ejemplo, ["http://localhost", "https://example.com"]
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE"],
    allow_headers=["*"],
)

"""Orden"""
#Aprender a guardar las versiones en git seria buena idea
#Css

"""Ideas"""
#Separar la wea por modulos pq ya esta quedando mucho en un solo archivo (Me quedo grande esta tarea)
#Taria bueno que en vez de ingresar los dias te salga un calendario de la fecha en la que se deberia devolver
#Cuando un prestamo se pasa de su fecha de devolución, este cambie de color y empieze a sumar al monto
#Haya una parte de configuración del prestamo que te deje cambiar el interes, lo que pasa cuando se vence el plazo, etc
#Cada prestamo deberia tener un ticket para que desaparezca, una vez se aprete el ticket, estos se deberian ir a un historial
#porciacaso
#En la config de prestamo, un cobro fijo o que se actualize dia a dia, en vola sin fecha
#Barra de busqueda
#Los prestamos se deberian ordenar por fecha limite

fechaActual = datetime.now().date()

def diasRestantes (fecha):

    fechaDatetime = datetime.strptime(fecha, "%Y-%m-%d").date()

    restantes = str(fechaDatetime - fechaActual)[:-13] + "dias"

    return restantes

@app.post("/insertarMonto/{monto}/{dias}/{nombre}/{detalles}")
async def insertarMonto(monto: int = None, dias : int = None, nombre : str = None, detalles : str = None):
     
    porcentajeCobroSimple = 0.05           #Para modificar esto desde la interfaz de react, podria hacer que fuera un argumento que se pasa desde el Query o que sea una variable que se maneja en otro @post (osea igual usuaria en query pero en otra función)

    cobroPorDia = monto*porcentajeCobroSimple

    cobroFinal = monto + cobroPorDia*dias

    fechaFinal = str(fechaActual + timedelta(days=dias))

    #detalles = detalles.replace(" ","%20")   #Esta wea antes era necesaria para que hubieran espacios, ns q wea paso q ya no

    #nombre = nombre.replace(" ","%20")     #Esta wea antes era necesaria para que hubieran espacios, ns q wea paso q ya no

    prestamoDict = {"Cobro final":cobroFinal, "Fecha final":fechaFinal, "Nombre":nombre, "Detalles":detalles}

    dbClient.local.prestamos.insert_one(prestamoDict)

    return cobroFinal, fechaFinal

@app.get("/obtenerPrestamos")
async def obtenerDatos():
    # Convertir ObjectId a str para cada documento
    todosLosPrestamos = [
        {**prestamo, "_id": str(prestamo["_id"]),"Dias restantes":diasRestantes(prestamo["Fecha final"])}  # Convertir ObjectId a str
        for prestamo in dbClient.local.prestamos.find()
    ]
    return todosLosPrestamos

@app.delete("/borrarPrestamo/{id}")
async def borrarPrestamo(id : str):
    dbClient.local.prestamos.find_one_and_delete({"_id": ObjectId(id)})
    return "bien"