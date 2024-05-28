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
#Hacer los detalles xdd
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

def diasRestantes (tipoCobro,opcionCobroFinal,fechaLimite):

    #Fecha limite y no se ha pasado la fecha o no se selecciono que aumentara

    if (tipoCobro == "Fecha limite" and opcionCobroFinal == "Dejar cobro fijo") or (tipoCobro == "Fecha limite" and int(str(datetime.strptime(fechaLimite, "%Y-%m-%d").date() - fechaActual)[:-13]) >= 0 ):
        return str(datetime.strptime(fechaLimite, "%Y-%m-%d").date() - fechaActual)[:-13] if datetime.strptime(fechaLimite, "%Y-%m-%d").date() != fechaActual else "0"
    
    elif tipoCobro == "Acumulativo":
        return "Aumentando cobro"
    
    # Si se selecciono fecha limite y se esta aumentando el cobro

    else:
        return "Aumentando cobro ",str(datetime.strptime(fechaLimite, "%Y-%m-%d") - datetime.now())[:-13]
    

def calcularCobro(tipoCobro,opcionCobroFinal,cobroFinal,cadaCuantosDiasAumenta,fechaInicial,fechaLimite,cobroInicial,acumulacionFija,acumulacionPorcentual):

    diasPasados = abs( int( str(datetime.strptime(fechaInicial, "%Y-%m-%d").date() - datetime.now().date())[:-13] ) ) if datetime.strptime(fechaInicial, "%Y-%m-%d").date() != datetime.now().date() else 0

    if (tipoCobro == "Fecha limite" and opcionCobroFinal == "Dejar cobro fijo") or (tipoCobro == "Fecha limite" and int(str(datetime.strptime(fechaLimite, "%Y-%m-%d").date() - fechaActual)[:-13]) >= 0 ):
        return int(cobroFinal)
    
    elif tipoCobro == "Acumulativo" and cadaCuantosDiasAumenta != 0:
        for i in range(int(diasPasados/cadaCuantosDiasAumenta)):

            cobroInicial *= acumulacionPorcentual/100 + 1

            cobroInicial += acumulacionFija

        return int(cobroInicial)
    
    elif tipoCobro == "Fecha limite" and opcionCobroFinal == "Aumentar cobro" and int(str(datetime.strptime(fechaLimite, "%Y-%m-%d").date() - fechaActual)[:-13]) < 0:
        for i in range(int(diasPasados/cadaCuantosDiasAumenta) + 1):

            cobroFinal *= acumulacionPorcentual/100 + 1

            cobroFinal += acumulacionFija

        return int(cobroFinal)

    else:
        return "algo esta mal"

#nombre.replace(" ","%20") vo sai si lo necesitai usar

@app.post("/insertarMonto/{nombrePrestamo}/{tipoCobro}/{fechaLimitePrestamo}/{diasParaDevolucion}/{cobroFinal}/{opcionCobroFinal}/{cobroInicial}/{cadaCuantosDiasAumenta}/{acumulacionFija}/{acumulacionPorcentual}")
async def insertarMonto(                               
    nombrePrestamo: str = None, tipoCobro : str = None, fechaLimitePrestamo : str = None, diasParaDevolucion : int = None, cobroFinal: int = None,
    opcionCobroFinal : str = None, cobroInicial : int = None, cadaCuantosDiasAumenta : int = None,acumulacionFija : int = None,acumulacionPorcentual : int = None):

    fechaLimitePrestamo = str((datetime.strptime(fechaLimitePrestamo, "%d-%m-%Y") + timedelta(days=diasParaDevolucion)).date()) #Esta como al revez por dedcirlo asi de como se lo pasa react

    fechaInicial = str(fechaActual)

    prestamoDict = {
        "Nombre":nombrePrestamo, "Tipo cobro":tipoCobro, "Fecha limite":fechaLimitePrestamo, "Cobro final":cobroFinal, "Opción cobro final":opcionCobroFinal,"Fecha inical":fechaInicial,
        "Cobro inical":cobroInicial,"Cada cuantos dias aumenta":cadaCuantosDiasAumenta,"Acumulación fija":acumulacionFija,"Acumulación porcentual":acumulacionPorcentual}

    dbClient.local.prestamos.insert_one(prestamoDict)

    return nombrePrestamo, fechaLimitePrestamo

@app.get("/obtenerPrestamos")
async def obtenerDatos():
    # Convertir ObjectId a str para cada documento
    todosLosPrestamos = [
        {"Nombre":prestamo["Nombre"], "_id": str(prestamo["_id"]),"Dias restantes":diasRestantes(prestamo["Tipo cobro"],prestamo["Opción cobro final"],prestamo["Fecha limite"]),
         "Cobro":calcularCobro(prestamo["Tipo cobro"],prestamo["Opción cobro final"],prestamo["Cobro final"],prestamo["Cada cuantos dias aumenta"],prestamo["Fecha inical"],prestamo["Fecha limite"],
                               prestamo["Cobro inical"],prestamo["Acumulación fija"],prestamo["Acumulación porcentual"])}  # Convertir ObjectId a str
        for prestamo in dbClient.local.prestamos.find()
    ]
    return todosLosPrestamos

@app.delete("/borrarPrestamo/{id}")
async def borrarPrestamo(id : str):
    dbClient.local.prestamos.find_one_and_delete({"_id": ObjectId(id)})
    return "bien"