from fastapi import FastAPI
from datetime import datetime, timedelta
from fastapi.middleware.cors import CORSMiddleware
import json
import uuid

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Cambia "*" por los orígenes que deseas permitir, por ejemplo, ["http://localhost", "https://example.com"]
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE"],
    allow_headers=["*"],
)

"""Orden"""
"""Ideas"""
#Cuando un prestamo se pasa de su fecha de devolución, este cambie de color
#Botones de info o alguna forma en que el usuario pueda ententender como funciona cada cosa



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


def buscar_por_id(lista, id_buscado):
    return next((item for item in lista if item["_id"] == id_buscado), None)

def diasRestantes (tipoCobro,opcionCobroFinal,fechaLimite):

    #Fecha limite y no se ha pasado la fecha o no se selecciono que aumentara

    if (tipoCobro == "Fecha limite" and opcionCobroFinal == "Dejar cobro fijo") or (tipoCobro == "Fecha limite" and int(datetimeToDias(fechaLimite)) >= 0 ):
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

    if (tipoCobro == "Fecha limite" and opcionCobroFinal == "Dejar cobro fijo") or (tipoCobro == "Fecha limite" and int(datetimeToDias(fechaLimite)) >= 0 ):
        return [int(cobroFinal),""]
    
    elif tipoCobro == "Acumulativo" and cadaCuantosDiasAumenta != 0:
        for i in range(int(diasPasados/cadaCuantosDiasAumenta)):

            cobroInicial *= acumulacionPorcentual/100 + 1

            cobroInicial += acumulacionFija
        diasOdia = "días" if (cadaCuantosDiasAumenta - int(diasPasados%cadaCuantosDiasAumenta)) > 1 else "día"
        return [int(cobroInicial),f"El cobro aumentara en {str(cadaCuantosDiasAumenta - int(diasPasados%cadaCuantosDiasAumenta))} {diasOdia}"]
    
    elif tipoCobro == "Fecha limite" and opcionCobroFinal == "Aumentar cobro" and int(str(datetime.strptime(fechaLimite, "%Y-%m-%d").date() - fechaActual)[:-13]) < 0:  # <-- Este codigo de aca puede dar error
        for i in range(int(diasPasados/cadaCuantosDiasAumenta)):                                                                                                    # testealo

            cobroFinal *= acumulacionPorcentual/100 + 1

            cobroFinal += acumulacionFija

        diasOdia = "días" if (cadaCuantosDiasAumenta - int(diasPasados%cadaCuantosDiasAumenta)) > 1 else "día"

        return [int(cobroFinal), f"El cobro aumentara en {str(cadaCuantosDiasAumenta - int(diasPasados%cadaCuantosDiasAumenta))} {diasOdia}"]

    else:
        return "algo esta mal"

#nombre.replace(" ","%20") vo sai si lo necesitai usar

def ordenarPrestamos(prestamos, tipoOrden):
    if tipoOrden == "Fecha de creación o actualización":
        return prestamos
    elif tipoOrden == "Cobro":   #ChatGPT MVP
        return sorted(prestamos, key=lambda x: x["Cobro"], reverse=True)
    elif tipoOrden == "Fecha de cobro":
        print("Almenos pasa por aqui")
        prestamosOrdenados = []
        i = 0
        while i < len(prestamos):
            if prestamos[i]["Tipo cobro"] == "Acumulativo":
                prestamosOrdenados.append(prestamos[i])
                del prestamos[i]
            else:
                i += 1
        return prestamosOrdenados + sorted(prestamos,key=lambda x: datetimeToDias(x["Fecha limite"]))
        

@app.post("/insertarMonto/{nombrePrestamo}/{tipoCobro}/{fechaLimitePrestamo}/{diasParaDevolucion}/{cobroFinal}/{opcionCobroFinal}/{cobroInicial}/{cadaCuantosDiasAumenta}/{acumulacionFija}/{acumulacionPorcentual}/{detallesNuevoPrestamo}")
async def insertarMonto(                               
    nombrePrestamo: str = None, tipoCobro : str = None, fechaLimitePrestamo : str = None, diasParaDevolucion : int = None, cobroFinal: int = None,
    opcionCobroFinal : str = None, cobroInicial : int = None, cadaCuantosDiasAumenta : int = None,acumulacionFija : int = None,acumulacionPorcentual : int = None, detallesNuevoPrestamo : str = None):

    fechaLimitePrestamo = str((datetime.strptime(fechaLimitePrestamo, "%d-%m-%Y") + timedelta(days=diasParaDevolucion)).date()) #Esta como al revez por dedcirlo asi de como se lo pasa react

    fechaInicial = str(fechaActual)

    prestamoDict = {
        "_id":uuid.uuid4().hex,
        "Nombre":nombrePrestamo, "Tipo cobro":tipoCobro, "Fecha limite":fechaLimitePrestamo, "Cobro final":cobroFinal, "Opción cobro final":opcionCobroFinal,"Fecha inical":fechaInicial,
        "Cobro inical":cobroInicial,"Cada cuantos dias aumenta":cadaCuantosDiasAumenta,"Acumulación fija":acumulacionFija,"Acumulación porcentual":acumulacionPorcentual,"Detalles":detallesNuevoPrestamo}

    with open("prestamos.json","r") as prestamosFile:
        prestamos = json.load(prestamosFile)

    prestamos.append(prestamoDict)

    with open("prestamos.json","w") as prestamosFile:
        json.dump(prestamos,prestamosFile,indent=4)

    return nombrePrestamo, fechaLimitePrestamo

@app.get("/obtenerPrestamos/{ordenarPor}")
async def obtenerDatos(ordenarPor : str):
    # Convertir ObjectId a str para cada documento
    with open("prestamos.json","r") as prestamos:
        todosLosPrestamos = [
            {"Nombre":prestamo["Nombre"], 
            "_id": str(prestamo["_id"]),
            "Dias restantes":diasRestantes(prestamo["Tipo cobro"],prestamo["Opción cobro final"],prestamo["Fecha limite"]),
            "Cobro":calcularCobro(prestamo["Tipo cobro"],prestamo["Opción cobro final"],prestamo["Cobro final"],prestamo["Cada cuantos dias aumenta"],prestamo["Fecha inical"],prestamo["Fecha limite"],
                                prestamo["Cobro inical"],prestamo["Acumulación fija"],prestamo["Acumulación porcentual"])[0],
            "Detalles":prestamo["Detalles"],
            "Fecha limite":fechaLimiteOGuion(prestamo["Tipo cobro"],prestamo["Fecha limite"]),# Convertir ObjectId a str
            "Cobro inical":prestamo["Cobro inical"],
            "Tipo cobro":prestamo["Tipo cobro"],
            "Accion al pasar fecha":prestamo["Opción cobro final"],
            "Cada cuantos dias aumenta":prestamo["Cada cuantos dias aumenta"],
            "Acumulación fija":prestamo["Acumulación fija"],
            "Acumulación porcentual":prestamo["Acumulación porcentual"],
            "Cobro final":prestamo["Cobro final"],
            "Dias para aumento": calcularCobro(prestamo["Tipo cobro"],prestamo["Opción cobro final"],prestamo["Cobro final"],prestamo["Cada cuantos dias aumenta"],prestamo["Fecha inical"],prestamo["Fecha limite"],
                                prestamo["Cobro inical"],prestamo["Acumulación fija"],prestamo["Acumulación porcentual"])[1]}  
            for prestamo in json.load(prestamos)
        ]

    todosLosPrestamos = ordenarPrestamos(todosLosPrestamos,ordenarPor)

    return todosLosPrestamos

@app.delete("/borrarPrestamo/{id}")
async def borrarPrestamo(id : str):
    with open("prestamos.json","r") as prestamos:
        prestamosLista = json.load(prestamos)
        prestamoBorrado = buscar_por_id(prestamosLista,id)
        prestamosLista.remove(prestamoBorrado)

    with open("prestamos.json","w") as prestamos:
        json.dump(prestamosLista,prestamos,indent=4)

    with open("historial.json","r") as historial:
        prestamosHistorial = json.load(historial)
        prestamoBorrado['Fecha eliminación'],prestamoBorrado['Dias para borrarse'] = str(fechaActual), 14
        prestamosHistorial.append(prestamoBorrado)

    with open("historial.json","w") as historial:
        json.dump(prestamosHistorial,historial,indent=4)

    return None

@app.put(
        "/actualizarPrestamo/{id}/{nombre}/{tipoCobro}/{fechaLimite}/{diasParaDevolucion}/{cobroFinal}/{opcionCobroFinal}/{cobroInicial}/{cadaCuantosDias}/{acumulacionFija}/{acumulacionPorcentual}/{detalles}")
async def actualizarPrestamos(id : str, nombre : str,tipoCobro : str,cobroFinal:int , detalles : str, fechaLimite: str,diasParaDevolucion:int,opcionCobroFinal:str, cobroInicial:int,
                              cadaCuantosDias:int,acumulacionFija : int, acumulacionPorcentual : int):

    fechaLimite = str((datetime.strptime(fechaLimite, "%d-%m-%Y") + timedelta(days=diasParaDevolucion)).date())
    #ChatGPT MVP
    with open("prestamos.json","r") as prestamos:
        prestamosLista = json.load(prestamos)
        prestamoActualizado = buscar_por_id(prestamosLista,id)
        prestamosLista[prestamosLista.index(prestamoActualizado)].update({ "Nombre" : nombre,
                                                                "Tipo cobro":tipoCobro,
                                                                "Fecha limite":fechaLimite,
                                                                "Cobro final":cobroFinal,
                                                                "Opción cobro final":opcionCobroFinal,
                                                                "Cobro inical":cobroInicial,
                                                                "Cada cuantos dias aumenta":cadaCuantosDias,
                                                                "Acumulación fija":acumulacionFija,
                                                                "Acumulación porcentual":acumulacionPorcentual,
                                                                "Fecha inical":fechaLimite,
                                                                "Detalles":detalles},
                                                             )
    with open("prestamos.json","w") as prestamos:
        json.dump(prestamosLista,prestamos,indent=4)
    
    return None
                                                            #Solo puede seleccionar fechas futuras
@app.put(
    "/actualizarPrestamoParcialmente/{id}/{nombre}/{tipoCobro}/{fechaLimite}/{diasParaDevolucion}/{cobroActual}/{opcionCobroFinal}/{cadaCuantosDias}/{acumulacionFija}/{acumulacionPorcentual}/{detalles}")
async def actualizarPrestamosParcialmente(id : str, nombre : str,tipoCobro : str,cobroActual:int , detalles : str, fechaLimite: str,diasParaDevolucion:int,opcionCobroFinal:str,
                              cadaCuantosDias:int,acumulacionFija : int, acumulacionPorcentual : int):
    
    fechaLimite = str((datetime.strptime(fechaLimite, "%d-%m-%Y") + timedelta(days=diasParaDevolucion)).date())

    with open("prestamos.json","r") as prestamos:
        prestamosLista = json.load(prestamos)
        prestamoActualizado = buscar_por_id(prestamosLista,id)
        print(prestamoActualizado)
        prestamosLista[prestamosLista.index(prestamoActualizado)].update({ "Nombre" : nombre,
                                                                            "Tipo cobro":tipoCobro,
                                                                            "Fecha limite":fechaLimite,
                                                                            "Cobro final":cobroActual,
                                                                            "Opción cobro final":opcionCobroFinal,
                                                                            "Cobro inical":cobroActual,
                                                                            "Cada cuantos dias aumenta":cadaCuantosDias,
                                                                            "Acumulación fija":acumulacionFija,
                                                                            "Acumulación porcentual":acumulacionPorcentual,
                                                                            "Fecha inical":str(fechaActual),
                                                                            "Detalles":detalles},
                                                                            )
    with open("prestamos.json","w") as prestamos:
        json.dump(prestamosLista,prestamos,indent=4)

    return None

@app.delete("/obtenerHistorial")                                                   #Que un @get borre datos, es una mala practica
async def obtenerHistorial():
    with open("historial.json","r") as historial:
        prestamosDelHistorial = json.load(historial)
    for prestamo in prestamosDelHistorial:
        if int(datetimeToDias(prestamo["Fecha eliminación"])) < -14:
            prestamosDelHistorial.remove(prestamo)
        else:
            prestamosDelHistorial[prestamosDelHistorial.index(prestamo)]["Dias para borrarse"] = 14 - abs(int(datetimeToDias(prestamo["Fecha eliminación"])))
    
    with open("historial.json","w") as historial:
        json.dump(prestamosDelHistorial,historial,indent=4)

    with open("historial.json","r") as historial:
        todosLosPrestamos = [
            {"Nombre":prestamo["Nombre"], 
            "_id": str(prestamo["_id"]),
            "Dias restantes":diasRestantes(prestamo["Tipo cobro"],prestamo["Opción cobro final"],prestamo["Fecha limite"]),
            "Cobro":calcularCobro(prestamo["Tipo cobro"],prestamo["Opción cobro final"],prestamo["Cobro final"],prestamo["Cada cuantos dias aumenta"],prestamo["Fecha inical"],prestamo["Fecha limite"],
                                prestamo["Cobro inical"],prestamo["Acumulación fija"],prestamo["Acumulación porcentual"])[0],
            "Detalles":prestamo["Detalles"],
            "Fecha limite":fechaLimiteOGuion(prestamo["Tipo cobro"],prestamo["Fecha limite"]),# Convertir ObjectId a str
            "Dias para borrarse":prestamo["Dias para borrarse"]}  
            for prestamo in json.load(historial)]

    return todosLosPrestamos
    
@app.delete("/recuperarPrestamo/{id}")
async def recuperarPrestamo(id : str):
    with open("historial.json","r") as historial:
        listaHistorial = json.load(historial)
        prestamoRecuperado = buscar_por_id(listaHistorial,id)
        listaHistorial.remove(prestamoRecuperado)
    with open("historial.json","w") as historial:
        json.dump(listaHistorial,historial,indent=4)
    with open("prestamos.json","r") as prestamos:
        prestamosLista = json.load(prestamos) + [prestamoRecuperado]
    with open("prestamos.json","w") as prestamos:
        json.dump(prestamosLista,prestamos,indent=4)

    return None
    