# BORRAR SI ME DOY CUENTA DE QUE YA NO LO USE

from pydantic import BaseModel
from datetime import date

class Prestamo(BaseModel):
    montoFinal : int | None
    fechaAsignada : date | None       
    nombre : str | None
    detalles : str | None
    id : str | None