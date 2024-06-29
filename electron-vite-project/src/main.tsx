import React, {useState, useEffect} from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import axios from "axios";
import Select, { SingleValue } from "react-select"
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { format } from 'date-fns';
import BarsIcon from './assets/bars';

const Buscador = ({ nombreBuscador, cambiarNombreBuscador }: { nombreBuscador: string, cambiarNombreBuscador: (value: string) => void }) => {

  return (
    <>
      <svg className="absolute left-2 top-[0.7rem] fill-[#9e9ea7] w-[1.3rem] h-[1.3rem]" aria-hidden="true" viewBox="0 0 24 24"><g><path d="M21.53 20.47l-3.66-3.66C19.195 15.24 20 13.214 20 11c0-4.97-4.03-9-9-9s-9 4.03-9 9 4.03 9 9 9c2.215 0 4.24-.804 5.808-2.13l3.66 3.66c.147.146.34.22.53.22s.385-.073.53-.22c.295-.293.295-.767.002-1.06zM3.5 11c0-4.135 3.365-7.5 7.5-7.5s7.5 3.365 7.5 7.5-3.365 7.5-7.5 7.5-7.5-3.365-7.5-7.5z"></path></g></svg>
      <input id="buscador" className='shadow-1 w-[50rem] h-[40px] leading-[28px] px-4 pl-10 border-2 border-transparent rounded-lg outline-none text-[#9594ad] placeholder-[#9e9ea7] focus:outline-none focus:border-[rgba(63,62,63,0.4)] focus:shadow-[0_5px_15px_rgba(17,17,17,0.35)] hover:outline-none hover:border-[rgba(63,62,63,0.4)] hover:shadow-[0_5px_15px_rgba(17,17,17,0.35)] transition duration-300 ease-in-out' value={nombreBuscador} onChange={(event) => cambiarNombreBuscador(event.target.value)} placeholder='Buscar por nombre'></input>
    </>
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

  const [prestamos, cambiarPrestamos] = useState([{"_id":"","Nombre":"","Dias restantes":7777,"Cobro":Number,"Detalles":"","Fecha limite":""}]);
  
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

  async function crearPrestamo (
    nombrePrestamo:string,
    tipoCobro:string,
    fechaLimitePrestamo:string,
    diasParaDevolucion:number,
    cobroFinal:number,
    opcionCobroFinal:string,
    cobroInicial:number,
    cadaCuantosDiasAumenta:number,
    acumulacionFija:number,
    acumulacionPorcentual:number,
    detallesNuevoPrestamo:string
  ){
    await axios.post(
      `http://127.0.0.1:8000/insertarMonto/${nombrePrestamo}/${tipoCobro}/${fechaLimitePrestamo}/${diasParaDevolucion}/${cobroFinal}/${opcionCobroFinal}/${cobroInicial}/${cadaCuantosDiasAumenta}/${acumulacionFija}/${acumulacionPorcentual}/${detallesNuevoPrestamo}`)

    obtenerPrestamos()
  }

  //States que manejan cuando abre la ventana de confirmar y ayudan a enviarle el index que se tiene que borrar

  const [confirmarFinalizacionIsOpen, setConfirmarFinalizacionIsOpen] = useState(false)
  const [indexConfirmarFinalizacion, setIndexConfirmarFinalizacion] = useState(0)


  //Ventana que se abre al apretar el ticket

  const ConfirmarFinalizarPrestamo = ({isOpen = false, index = 7777}) => {
  
    if (!isOpen) return null;
  
    return (
      <div id="confirmarFinalizacionPrestamoDiv" className='bg-gray-700'>
        <h2>Estas seguro de querer finalizar este prestamo?</h2>
        <button onClick={() => setConfirmarFinalizacionIsOpen(false)}>Cancelar</button>
        <button onClick={() => borrarPrestamo(index)}>Confirmar</button>
      </div>
    )
  }

  //Boton Nuevo prestamo

  const BotonNuevoPrestamo = () => {

    return (
      <button id='botonNuevoPrestamo' className='shadow-1 justify-center bg-[#406b2e] text-white inline-flex items-center border-0 rounded-lg box-border cursor-pointer font-sans font-semibold text-[1rem] leading-[1rem] w-[15rem] max-w-[480px] min-h-[40px] min-w-0 overflow-hidden px-0 pl-[10px] pr-[10px] ml-8 text-center touch-manipulation transition duration-[0.167s] ease-[cubic-bezier(0.4,0,0.2,1)] select-none -webkit-select-none align-middle mb-4 hover:bg-[#375a28] hover:text-white focus:bg-[#375a28] focus:text-white active:bg-[#2f4d22] active:text-[rgba(255,255,255,0.7)] disabled:cursor-not-allowed disabled:bg-[rgba(0,0,0,0.08)] disabled:text-[rgba(0,0,0,0.3)]' onClick={() => setVentanaNuevoPrestamoIsOpen(true)}>Crear nuevo prestamo</button>
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

  // useState para guardar los detalles

  const [detallesNuevoPrestamo,setdetallesNuevoPrestamo] = useState("")

  //Boton 3 rayas

  const MenuBoton3Rayas = () => {
    return (
      <div className="bg-oscuro shadow-1 w-14 h-full left-0 justify-center flex" id='menu3Rayas'>
        <button id='boton3Rayas' className='justify-center items-center bg-oscuro rounded-[1.5rem] border-0 w-[2.5rem] h-[2.5rem] cursor-pointer flex list-none mt-[0.3rem] text-center transition-all duration-200 align-baseline whitespace-nowrap select-none -webkit-select-none touch-manipulation hover:bg-[#474747]'> 
          <BarsIcon/>
        </button>
      </div>
    )
  }

  const BotonConfiguracionPrestamo = () => {
    return (
      <button>⚙</button>
    )
  }

  //Ventana Nuevo Prestamo

  const VentanaNuevoPrestamo = ({isOpen = false}) => {

    if (!isOpen) return null;

    return (
      <div id="ventanaNuevoPrestamoDiv" className='bg-gray-600'>
        <button className='botonCancelarNuevoPrestamo' onClick={() => setVentanaNuevoPrestamoIsOpen(false)}>X</button>
        <div className='divNombreNuevoPrestamo'>
          <label htmlFor='inputNombre'>Nombre:</label>
          <input id="inputNombre" defaultValue={nombreNuevoPrestamo} onBlur={(e) => setNombreNuevoPrestamo(e.target.value)}></input>
          <label htmlFor='detallesInput'>Detalles: </label>
          <input id="detallesInput" defaultValue={detallesNuevoPrestamo} onBlur={(e) => setdetallesNuevoPrestamo(e.target.value)}></input>
          <span>Tipo de cobro: </span>                          
          <Select className='w-24' options={opcionesFechaOAcumulativo} onChange={selectFechaLimiteOAcumulativo} defaultValue={{label:fechaLimiteOAcumulativoSelected,value:fechaLimiteOAcumulativoSelected}}/>
        </div>

        <SeccionFechaLimiteOAcumulativo fechaLimiteIsSelected = {fechaLimiteOAcumulativoSelected}/>
        <div className="divBotonCrearNuevoPrestamo">
          <button onClick={() => crearPrestamo(nombreNuevoPrestamo,fechaLimiteOAcumulativoSelected,fechaNuevoPrestamoString,diasParaLaDevolucion,cobro,aumentarCobroIsOpen,cobroInicial,cadaCuantosDias,aumentoFijo,aumentoPorcentual,detallesNuevoPrestamo)}>Crear nuevo prestamo</button>
        </div>
      </div>
    )
  }

  // Fecha limite o acomulativo sección de ventana nuevo prestamo
  //Tengo que ver si esto de abrir como una "ventana dentro de otra" no genera problemas como que la ventana interna
  //este abierta sin que lo este la más externa, o por su cuenta se necesita que la ventana externa este abierta
  //para que funcione esta

  //useStates para que se guarden: Fecha seleccionada, dias para la devolución, si debe mostrarse el div de aumentar cobro
  //, el cobro

  const [fechaNuevoPrestamoString,setFechaNuevoPrestamoString] = useState(format(new Date(),"dd-MM-yyyy")) 

  const [fechaNuevoPrestamoDate,setFechaNuevoPrestamoDate] = useState(new Date())

  const separarFechaStringYDate = (fecha:Date) => {
    setFechaNuevoPrestamoString(format(fecha,"dd-MM-yyyy"))
    setFechaNuevoPrestamoDate(fecha)
  }

  const [diasParaLaDevolucion, setDiasParaLaDevolucion] = useState(0)

  const [aumentarCobroIsOpen,setAumentarCobroIsOpen] = useState("Dejar cobro fijo");

  const [cobro,setCobro] = useState(Number())

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

    if (fechaLimiteIsSelected == "Acumulativo") {
      return (<DivAumentoCobro aumentarCobroIsOpen = {"Aumentar cobro"}/>)
      
    }

    const filtroDiasPasados = (date:Date) => new Date() <= date

    return (
      <div id="seccionFechaLimiteSelected" className='bg-gray-800'>
        <div className="divFechaLimiteODias">
          <div>
            <DatePicker selected={fechaNuevoPrestamoDate} dateFormat="dd/MM/yyyy" filterDate={filtroDiasPasados} onChange={(date:Date) => separarFechaStringYDate(date)}/>
            <label htmlFor='inputODias'>O Dias:</label>
            <input id="inputODias" defaultValue={diasParaLaDevolucion} onBlur={(event) => setDiasParaLaDevolucion(Number(event.target.value))}></input>
          </div>
          <div>
            <label htmlFor='inputCobro'>Cobro:</label>
            <input id="inputCobro" defaultValue={cobro} onBlur={(event) => setCobro(Number(event.target.value))}></input>
          </div>
          <span>Acción al pasarse la fecha:</span>
          <Select options={opcionesFijoOAumentar} onChange={(event) => selectFijoOAumentar(event)} defaultValue={{label:aumentarCobroIsOpen,value:aumentarCobroIsOpen}}/>
          {/*componente aumento cobro*/}
          <DivAumentoCobro aumentarCobroIsOpen = {aumentarCobroIsOpen}/>
        </div>
      </div>
    )
  }

  //State para guardar el cobro inicial

  const [cobroInicial, setCobroInicial] = useState(0)

  // Veo que se selecciono en fechaLimiteOAcumulativoSelected para ver si tengo que ver un cobro inicial o no (en excalidraw es claro)

  const CobroInicial = ({cobroInicialIsOpen = "Fecha limite"}) => {
    if (cobroInicialIsOpen == "Fecha limite") return null;

    return (
      <div>
        <label htmlFor='inputCobroInicial'>Cobro inicial:</label>
        <input id='inputCobroInicial' defaultValue={cobroInicial} onBlur={(event) => setCobroInicial(Number(event.target.value))}></input>
      </div>
    )
  }

  //State que guarda: cada cuantos dias aumentar el cobro, el aumento fijo

  const [cadaCuantosDias,setCadaCuantosDias] = useState(1)

  const [aumentoFijo,setAumentoFijo] = useState(0)

  const [aumentoPorcentual,setAumentoPorcentual] = useState(0)

  const DivAumentoCobro = ({aumentarCobroIsOpen = "Dejar cobro fijo"}) => {
    if (aumentarCobroIsOpen == "Dejar cobro fijo") return null;

    return (
      <div>
        <CobroInicial cobroInicialIsOpen = {fechaLimiteOAcumulativoSelected}/>
        <div>
          <label htmlFor='inputCadaCuantosDias'>Cada cuantos días:</label>
          <input id='inputCadaCuantosDias' defaultValue={cadaCuantosDias} onBlur={(event) => setCadaCuantosDias(Number(event.target.value))}></input>
        </div>
        <div>
          <label htmlFor='inputAumentoFijo'>Aumento fijo:</label>
          <input id='inputAumentoFijo' defaultValue={aumentoFijo} onBlur={(event) => setAumentoFijo(Number(event.target.value))}></input>
        </div>
        <div>
          <label htmlFor='inputAumentoPorcentual'>Aumento porcentual:  %</label>
          <input id='inputAumentoPorcentual' defaultValue={aumentoPorcentual} onBlur={(event) => setAumentoPorcentual(Number(event.target.value))}></input>
        </div>
      </div>
    )
  }

  const[ventanaNuevoPrestamoIsOpen,setVentanaNuevoPrestamoIsOpen] = useState(false)
  

  const [nombreBuscador, cambiarNombreBuscador] = useState("");

  //Lista de prestamos

  return (
    <>
    <div id="divPrincipal" className='flex flex-col w-[80rem] m-12 '>
      <div className='flex flex-row relative'>
        <Buscador nombreBuscador={nombreBuscador} cambiarNombreBuscador={cambiarNombreBuscador}/>
        <BotonNuevoPrestamo/>
      </div>
      <div id="divLista" className='bg-oscuro rounded-1 shadow-1 h-96'> {/*Después subir por que eran 33 rem*/}
        <ul>
          {prestamos.map((prestamo, index) => {
            if (prestamo["Nombre"].toLowerCase().includes(nombreBuscador.toLowerCase())) {
              return (
                <div key={index}>
                  <BotonConfiguracionPrestamo/>
                  <li>{[JSON.stringify(prestamo["Nombre"]),JSON.stringify(prestamo["Dias restantes"]),JSON.stringify(prestamo["Cobro"]),JSON.stringify(prestamo["Detalles"]),JSON.stringify(prestamo["Fecha limite"])]}</li>
                  <button onClick={() => handleFinalizarPrestamo(index)}>X</button>
                </div>
              );
            } else {
              return null; // No renderizar nada si la condición no se cumple
            }
          })}
        </ul>
      </div>
    </div>
    <MenuBoton3Rayas/>
    <ConfirmarFinalizarPrestamo isOpen={confirmarFinalizacionIsOpen} index={indexConfirmarFinalizacion}/>
    <VentanaNuevoPrestamo isOpen={ventanaNuevoPrestamoIsOpen}/>
  </>
  )
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  
  <>
  <Lista/>
  </>
)
