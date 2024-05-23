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
#Como introducir fecha en la ventana nuevo prestamo
# (haciendo)Tengo que ver de que formas puedo dar fechas directamente desde typescript/react por que tengo que hacer la ventana de nuevo prestamo
#Pestaña
#Saber como trabajar por capas en css
#Css

"""Ideas"""
#La funcion obtener prestamos deberia venir con una funcion que actualiza los precios
#Separar la wea por modulos pq ya esta quedando mucho en un solo archivo (Me quedo grande esta tarea)
#Taria bueno que en vez de ingresar los dias te salga un calendario de la fecha en la que se deberia devolver
#Cuando un prestamo se pasa de su fecha de devolución, este cambie de color y empieze a sumar al monto
#Haya una parte de configuración del prestamo que te deje cambiar el interes, lo que pasa cuando se vence el plazo, etc
#Cada prestamo deberia tener un ticket para que desaparezca, una vez se aprete el ticket, estos se deberian ir a un historial
#porciacaso
#Los prestamos se deberian ordenar por fecha limite
#Si se selecciona cobro de tipo acomulativo

fechaActual = datetime.now().date()

def diasRestantes (fecha):

    fechaDatetime = datetime.strptime(fecha, "%Y-%m-%d").date()

    restantes = str(fechaDatetime - fechaActual)[:-13] + "dias"

    return restantes

#nombre.replace(" ","%20") vo sai si lo necesitai usar

@app.post("/insertarMonto/{nombrePrestamo}/{tipoCobro}/{fechaLimitePrestamo}/{diasParaDevolucion}/{cobroFinal}/{opcionCobroFinal}/{cobroInicial}/{cadaCuantosDiasAumenta}/{acumulacionFija}/{acumulacionPorcentual}")
async def insertarMonto(                               
    nombrePrestamo: str = None, tipoCobro : str = None, fechaLimitePrestamo : str = None, diasParaDevolucion : int = None, cobroFinal: int = None,
    opcionCobroFinal : str = None, cobroInicial : int = None, cadaCuantosDiasAumenta : int = None,acumulacionFija : int = None,acumulacionPorcentual : int = None):

    fechaLimitePrestamo = str((datetime.strptime(fechaLimitePrestamo, "%d/%m/%Y") + timedelta(days=diasParaDevolucion)).date()) #Esta como al revez por dedcirlo asi de como se lo pasa react

    prestamoDict = {
        "Nombre":nombrePrestamo, "Tipo cobro":tipoCobro, "Fecha limite":fechaLimitePrestamo, "Cobro final":cobroFinal, "Opción cobro final":opcionCobroFinal,
        "Cobro inical":cobroInicial,"Cada cuantos dias aumenta":cadaCuantosDiasAumenta,"Acumulación fija":acumulacionFija,"Acumulación porcentual":acumulacionPorcentual}

    dbClient.local.prestamos.insert_one(prestamoDict)

    return nombrePrestamo, fechaLimitePrestamo

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