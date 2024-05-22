import React, {useState, useEffect} from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import axios from "axios";
import Select, { SingleValue } from "react-select"
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const NuevoPrestamo = () => {
  return (
    <div>
      Nuevo prestamo
    </div>
  )
}

const Buscador = ({ nombreBuscador, cambiarNombreBuscador }: { nombreBuscador: string, cambiarNombreBuscador: (value: string) => void }) => {

  return (
    <input value={nombreBuscador} onChange={(event) => cambiarNombreBuscador(event.target.value)} placeholder='Buscar por nombre'></input>
  )
};


const Lista = () => {

  //Hace que se ejecute una sola vez la función cuando se monta el componente

  useEffect(() => {
    obtenerPrestamos()
  }, []);

  //Lo que pasa cuando se apreta el ticket

  function handleFinalizarPrestamo (cambiarIndex = 0) {
    setConfirmarFinalizacionIsOpen(true)
    setIndexConfirmarFinalizacion(cambiarIndex)
  }

  // State que se usara para guardar los prestamos

  const [prestamos, cambiarPrestamos] = useState([{"_id":"","Nombre":"","Cobro final":2,"Fecha final":"","Detalles":""}]);
  
  // Solicitudes

  async function obtenerPrestamos () {

    const responsePrestamos = (await axios.get("http://127.0.0.1:8000/obtenerPrestamos")).data
  
    cambiarPrestamos(responsePrestamos)

    return {}
  
  }

  async function borrarPrestamo (index:number){

    const idPrestamo = prestamos[index]["_id"]

    await axios.delete(`http://127.0.0.1:8000/borrarPrestamo/${idPrestamo}`)

    obtenerPrestamos()

    setConfirmarFinalizacionIsOpen(false)
  }

  async function crearPrestamo (montoInicial:number,nombrePrestamo:string,diasRestantesPrestamo:number,fechaLimitePrestamo:string,tipoAcumulacion:string,cadaCuantosDiasAcumula:number,acumulacionPorcentual:number,acumulacionFija:number){

  }

  //States que manejan cuando abre la ventana de confirmar y ayudan a enviarle el index que se tiene que borrar

  const [confirmarFinalizacionIsOpen, setConfirmarFinalizacionIsOpen] = useState(false)
  const [indexConfirmarFinalizacion, setIndexConfirmarFinalizacion] = useState(0)


  //Ventana que se abre al apretar el ticket

  const ConfirmarFinalizarPrestamo = ({isOpen = false, index = 7777}) => {
  
    if (!isOpen) return null;
  
    return (
      <div className='confirmarFinalizacionPrestamoDiv'>
        <h2>Estas seguro de querer finalizar este prestamo?</h2>
        <button onClick={() => setConfirmarFinalizacionIsOpen(false)}>Cancelar</button>
        <button onClick={() => borrarPrestamo(index)}>Confirmar</button>
      </div>
    )
  }

  //Boton Nuevo prestamo

  const BotonNuevoPrestamo = () => {

    return (
      <button onClick={() => setVentanaNuevoPrestamoIsOpen(true)}>Nuevo Prestamo</button>
    )
  }

  //useState para ver si la sección fechaLimite o acomulativo esta seleccionada

  const [fechaLimiteOAcumulativoSelected, setFechaLimiteOAcumulativoSelected] = useState("Fecha limite")

  //Logica necesaria para que el option funcione

  const opcionesFechaOAcumulativo = [
    {label:"Fecha limite", value:"Fecha limite"},
    {label:"Acumulativo", value:"Acumulativo"}
  ]

  const selectFechaLimiteOAcumulativo = (event:SingleValue<{label:string;value:string}>,) => {

    if (event.value == "Fecha limite") {

      setFechaLimiteOAcumulativoSelected("Fecha limite")

    } else if (event.value == "Acumulativo") {

      setFechaLimiteOAcumulativoSelected("Acumulativo")

    }
  }

  // useState para guardar lo que se ponga en el Nombre

  const [nombreNuevoPrestamo,setNombreNuevoPrestamo] = useState("")

  //Ventana Nuevo Prestamo

  const VentanaNuevoPrestamo = ({isOpen = false}) => {

    if (!isOpen) return null;

    return (
      <div className='ventanaNuevoPrestamoDiv'>
          <div className='divNombreNuevoPrestamo'>
            <span>Nombre: </span>
            <input defaultValue={nombreNuevoPrestamo} onBlur={(e) => setNombreNuevoPrestamo(e.target.value)}></input>
          </div>
          <div className='divTipoCobro'>
            <span>Tipo de cobro: </span>                          
              <Select options={opcionesFechaOAcumulativo} onChange={selectFechaLimiteOAcumulativo} defaultValue={{label:fechaLimiteOAcumulativoSelected,value:fechaLimiteOAcumulativoSelected}}/>
          </div>

          <SeccionFechaLimiteOAcumulativo fechaLimiteIsSelected = {fechaLimiteOAcumulativoSelected}/>

      </div>
    )
  }

  // Fecha limite o acomulativo sección de ventana nuevo prestamo
  //Tengo que ver si esto de abrir como una "ventana dentro de otra" no genera problemas como que la ventana interna
  //este abierta sin que lo este la más externa, o por su cuenta se necesita que la ventana externa este abierta
  //para que funcione esta

  //useStates para que se guarden: Fecha seleccionada, dias para la devolución, si debe mostrarse el div de aumentar cobro

  const [fechaNuevoPrestamo,setFechaNuevoPrestamo] = useState(new Date())

  const [diasParaLaDevolucion, setDiasParaLaDevolucion] = useState(0)

  const [aumentarCobroIsOpen,setAumentarCobroIsOpen] = useState("Dejar cobro fijo");

  const opcionesFijoOAumentar = [
    {label:"Dejar cobro fijo",value:"Dejar cobro fijo"},
    {label:"Aumentar cobro",value:"Aumentar cobro"}
  ]

  const selectFijoOAumentar = (event:SingleValue<{label:string;value:string}>,) => {

    if (event.value == "Dejar cobro fijo") {

      setAumentarCobroIsOpen("Dejar cobro fijo")

    } else if (event.value == "Aumentar cobro") {

      setAumentarCobroIsOpen("Aumentar cobro")

    }

  }

  const SeccionFechaLimiteOAcumulativo = ({fechaLimiteIsSelected = "Fecha limite"}) =>{

    if (fechaLimiteIsSelected == "Acumulativo") return null;//componente aumento cobro

    const filtroDiasPasados = (date:Date) => new Date() <= date

    return (
      <div className='seccionFechaLimiteSelected'>
        <div className="divFechaLimiteODias">
          <DatePicker selected={fechaNuevoPrestamo} filterDate={filtroDiasPasados} onChange={(date:Date) => setFechaNuevoPrestamo(date)}/>
          <span> o Dias:</span>
          <input defaultValue={diasParaLaDevolucion} onBlur={(event) => setDiasParaLaDevolucion(Number(event.target.value))}></input>
          <span>Acción al pasarse la fecha:</span>
          <Select options={opcionesFijoOAumentar} onChange={(event) => selectFijoOAumentar(event)} defaultValue={{label:aumentarCobroIsOpen,value:aumentarCobroIsOpen}}/>
          {/*componente aumento cobro*/}
          <DivAumentoCobro aumentarCobroIsOpen = {aumentarCobroIsOpen}/>
        </div>
      </div>
    )
  }

  const DivAumentoCobro = ({aumentarCobroIsOpen = "Dejar cobro fijo"}) => {
    if (aumentarCobroIsOpen == "Dejar cobro fijo") return null;

    return (
      <div>Esta esta esta</div>
    )
  }

  const[ventanaNuevoPrestamoIsOpen,setVentanaNuevoPrestamoIsOpen] = useState(false)
  

  const [nombreBuscador, cambiarNombreBuscador] = useState("");

  //Lista de prestamos

  return (
    <>
    <Buscador nombreBuscador={nombreBuscador} cambiarNombreBuscador={cambiarNombreBuscador}/>
    <BotonNuevoPrestamo/>
    <ul>
      {prestamos.map((prestamo, index) => {
        if (prestamo["Nombre"].toLowerCase().includes(nombreBuscador.toLowerCase())) {
          return (
            <div key={index}>
              <li>{JSON.stringify(prestamo)}</li>
              <button onClick={() => handleFinalizarPrestamo(index)}>X</button>
            </div>
          );
        } else {
          return null; // No renderizar nada si la condición no se cumple
        }
      })}
    </ul>
    <ConfirmarFinalizarPrestamo isOpen={confirmarFinalizacionIsOpen} index={indexConfirmarFinalizacion}/>
    <VentanaNuevoPrestamo isOpen={ventanaNuevoPrestamoIsOpen}/>
  </>
  )
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  
  <>
  <NuevoPrestamo/>
  <Lista/>
  </>
)
