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
#Cual es el proposito de que el menu se mueva si no tapa absolutamente nada? (en vola con los iconos dara igual)
#lo que pone en excalidraw
#pensar en nuevo diseño para cada prestamo dentro de la lista (y hacerlo?)
#Como hacer que no salga la scrollbar (que los tamaños esten bien bien ajustados)
#Como hacer la wea de las ventanas por encima como la del nuevo prestamo (creo que modal)
#instrucciones en excalidraw

"""Ideas"""
#Un indicativo de cuantos dias faltan para que se acumule denuevo(?
#Cuando un prestamo se pasa de su fecha de devolución, este cambie de color
#Botones de info o alguna forma en que el usuario pueda ententender como funciona cada cosa
#Haya una parte de configuración del prestamo que te deje cambiar el interes, lo que pasa cuando se vence el plazo, etc, ->
#-> una parte para cambiar el cobro a uno fijo en el momento, poner que se deje de acumular a partir de ahora (esas 2 ideas deberian ir)
#Cada prestamo deberia tener un ticket para que desaparezca, una vez se aprete el ticket, estos se deberian ir a un historial, que estara
#-> en las 3 rayas
#Los prestamos se deberian ordenar por fecha limite, dias desde que se empezo a acumular, cobro


fechaActual = datetime.now().date()

def datetimeToDias(fechaLimite):
    resultado = ""
    for letra in str(datetime.strptime(fechaLimite, "%Y-%m-%d").date() - fechaActual):
        try:
            
            int(letra)
            resultado += letra
            
        except:
            if letra == "-":
                resultado += letra
            else:
                break
    return resultado


def diasRestantes (tipoCobro,opcionCobroFinal,fechaLimite):

    #Fecha limite y no se ha pasado la fecha o no se selecciono que aumentara

    if (tipoCobro == "Fecha limite" and opcionCobroFinal == "Dejar cobro fijo") or (tipoCobro == "Fecha limite" and int(str(datetime.strptime(fechaLimite, "%Y-%m-%d").date() - fechaActual)[:-13]) >= 0 ):
        return datetimeToDias(fechaLimite) if datetime.strptime(fechaLimite, "%Y-%m-%d").date() != fechaActual else "0"
    
    elif tipoCobro == "Acumulativo":
        return "Aumentando cobro"
    
    # Si se selecciono fecha limite y se esta aumentando el cobro

    else:
        return f"Aumentando cobro {datetimeToDias(fechaLimite)}"
    

#Como la fecha limite se calcula con anterioridad, esta función solo ve si tiene que returnear esa o un guion si es que se selecciono tipo cobro acumulativo

def fechaLimiteOGuion(tipoCobro,fechaLimite):
    return fechaLimite if tipoCobro == "Fecha limite" else "-"

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

@app.post("/insertarMonto/{nombrePrestamo}/{tipoCobro}/{fechaLimitePrestamo}/{diasParaDevolucion}/{cobroFinal}/{opcionCobroFinal}/{cobroInicial}/{cadaCuantosDiasAumenta}/{acumulacionFija}/{acumulacionPorcentual}/{detallesNuevoPrestamo}")
async def insertarMonto(                               
    nombrePrestamo: str = None, tipoCobro : str = None, fechaLimitePrestamo : str = None, diasParaDevolucion : int = None, cobroFinal: int = None,
    opcionCobroFinal : str = None, cobroInicial : int = None, cadaCuantosDiasAumenta : int = None,acumulacionFija : int = None,acumulacionPorcentual : int = None, detallesNuevoPrestamo : str = None):

    fechaLimitePrestamo = str((datetime.strptime(fechaLimitePrestamo, "%d-%m-%Y") + timedelta(days=diasParaDevolucion)).date()) #Esta como al revez por dedcirlo asi de como se lo pasa react

    fechaInicial = str(fechaActual)

    prestamoDict = {
        "Nombre":nombrePrestamo, "Tipo cobro":tipoCobro, "Fecha limite":fechaLimitePrestamo, "Cobro final":cobroFinal, "Opción cobro final":opcionCobroFinal,"Fecha inical":fechaInicial,
        "Cobro inical":cobroInicial,"Cada cuantos dias aumenta":cadaCuantosDiasAumenta,"Acumulación fija":acumulacionFija,"Acumulación porcentual":acumulacionPorcentual,"Detalles":detallesNuevoPrestamo}

    dbClient.local.prestamos.insert_one(prestamoDict)

    return nombrePrestamo, fechaLimitePrestamo

@app.get("/obtenerPrestamos")
async def obtenerDatos():
    # Convertir ObjectId a str para cada documento
    todosLosPrestamos = [
        {"Nombre":prestamo["Nombre"], 
         "_id": str(prestamo["_id"]),
         "Dias restantes":diasRestantes(prestamo["Tipo cobro"],prestamo["Opción cobro final"],prestamo["Fecha limite"]),
         "Cobro":calcularCobro(prestamo["Tipo cobro"],prestamo["Opción cobro final"],prestamo["Cobro final"],prestamo["Cada cuantos dias aumenta"],prestamo["Fecha inical"],prestamo["Fecha limite"],
                               prestamo["Cobro inical"],prestamo["Acumulación fija"],prestamo["Acumulación porcentual"]),
         "Detalles":prestamo["Detalles"],
         "Fecha limite":fechaLimiteOGuion(prestamo["Tipo cobro"],prestamo["Fecha limite"])}  # Convertir ObjectId a str
        for prestamo in dbClient.local.prestamos.find()
    ]
    return todosLosPrestamos

@app.delete("/borrarPrestamo/{id}")
async def borrarPrestamo(id : str):
    dbClient.local.prestamos.find_one_and_delete({"_id": ObjectId(id)})
    return "bien"

@app.put("/actualizarPrestamo/{id}/{nombre}")
async def actualizarPrestamos(id : str, nombre : str):
    dbClient.local.prestamos.find_one_and_update({"_id": ObjectId(id)},
                                                 { '$set': { "Nombre" : nombre} })
    
    return ""