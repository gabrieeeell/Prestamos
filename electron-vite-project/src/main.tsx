import React, {useState, useEffect} from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import axios from "axios";
import Select, { SingleValue } from "react-select"
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { format } from 'date-fns';
import BarsIcon from './assets/bars';
import GearIcon from './assets/gear';
import CheckIcon from './assets/check';
import HistoryIcon from './assets/history';
import {colorStyles} from './styles/select.tsx'


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

  //Lo que pasa cuando se apreta la tuerca

  function handleActualizarPrestamo(cambiarIndex = 0) {
    setConfiguracionPrestamoIsOpen(true)
    setIndexConfigurarPrestamo(cambiarIndex)
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
  async function actualizarPrestamo(index:number, nuevoNombre = "Cambiado") {
    const idPrestamo = prestamos[index]["_id"]
    await axios.put(
    `http://127.0.0.1:8000/actualizarPrestamo/${idPrestamo}/${nuevoNombre}`
    )
  }

  //States que manejan cuando se abre la ventana de configuración de prestamo

  const [configuracionPrestamoIsOpen,setConfiguracionPrestamoIsOpen] = useState(false)
  const [indexConfigurarPrestamo,setIndexConfigurarPrestamo] = useState(0)

  //States que manejan cuando abre la ventana de confirmar y ayudan a enviarle el index que se tiene que borrar

  const [confirmarFinalizacionIsOpen, setConfirmarFinalizacionIsOpen] = useState(false)
  const [indexConfirmarFinalizacion, setIndexConfirmarFinalizacion] = useState(0)


  //Ventana que aparece al apretar la tuerca

  const ConfiguracionPrestamo = ({isOpen = false, index = -1}) => {
    if (!isOpen) return null;

    return (<>
    <div className='w-[50%] h-[50%] absolute top-0 left-0 right-0 bottom-0 m-auto bg-slate-500'>
      <button onClick={() => setConfiguracionPrestamoIsOpen(false)}>cerrar</button>
      <button onClick={() => actualizarPrestamo(index)}>Actualizar</button>
    </div>
    </>)
  }

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

  //Boton 3 rayas  tres Tres boton Rayas


  const MenuBoton3Rayas = () => {

    const [menuIsAbierto,setMenuIsAbierto] = useState(false)

    const handleMenuIsAbierto = () => {
      if (menuIsAbierto == true) {
        setMenuIsAbierto(false)
      } else {
        setMenuIsAbierto(true)
      }
    }
  
    useEffect(() => {
      const menuDiv = document.getElementById("menu3Rayas");
      if (menuIsAbierto == true) {
        menuDiv.classList.remove('translate-x-[7.5rem]')
      } else {
        menuDiv.classList.add('translate-x-[7.5rem]')
      }
    }, [menuIsAbierto])
  

    return (
      <div className=''>
        <div  id='menu3Rayas' className="bg-oscuro flex-col ease-linear shadow-1 w-[10rem] absolute translate-x-[7.5rem] duration-300 h-full right-0 flex">
          <button onClick={handleMenuIsAbierto} id='boton3Rayas' className='justify-center items-center bg-oscuro rounded-[1.5rem] border-0 w-[2.5rem] h-[2.5rem] cursor-pointer flex list-none mt-[0.3rem] text-center transition-all duration-200 align-baseline whitespace-nowrap select-none -webkit-select-none touch-manipulation hover:bg-[#474747]'> 
            <BarsIcon/>
          </button>
          <div className='hover:bg-[#424242] duration-200 h-[2.5rem] w-full flex flex-row cursor-pointer'>
            <div className=' flex justify-center items-center w-[2.5rem]'>
              <HistoryIcon/>
            </div>
            <div className='flex justify-center items-center h-full w-[70%] text-xs font-medium text-white'>Historial prestamos</div>
          </div>
        </div>
      </div>
    )
  }

  const BotonConfiguracionPrestamo = () => {
    return (
      <div>
        <GearIcon/>
      </div>
      
    )
  }

  const BotonFinalizarPrestamo = () => {
    return (
      <div>
        <CheckIcon/>
      </div>
      
    )
  }

  //Ventana Nuevo Prestamo

  const VentanaNuevoPrestamo = ({isOpen = false}) => {

    if (!isOpen) return null;

    return (
      <>
        <div id="fondoNegroVentanaNuevoPrestamo" className='absolute w-[100%] h-[100%] bg-black opacity-40'></div>
        <div id="ventanaNuevoPrestamoDiv" className='bg-[#333333] border-[#313131] border-2 w-[75%] h-[80%] rounded-1 absolute m-auto left-0 right-0 top-0 bottom-4'>
          <div className='divNombreNuevoPrestamo'> {/*#3E3F40*/}
            <div>
              <label htmlFor='inputNombre' className="block mb-2 text-sm font-medium text-[white]">Nombre:</label>
              <input  defaultValue={nombreNuevoPrestamo} onBlur={(e) => setNombreNuevoPrestamo(e.target.value)} type="text" id="inputNombre" className="text-[white] w-[70%] bg-[#272727] border border-[#333333] text-sm rounded-lg  block p-2.5 focus:outline-none focus:border-[white] focus:ring-[white]" placeholder="Nombre..." required />
            </div>
            <div className="mb-6">
              <label htmlFor='detallesInput' className="block mb-2 text-sm font-medium text-[white] dark:text-white">Detalles:</label>
              <input type="text" id='detallesInput' defaultValue={detallesNuevoPrestamo} onBlur={(e) => setdetallesNuevoPrestamo(e.target.value)} className="text-[white] w-[70%] bg-[#272727] border border-[#333333] text-sm rounded-lg  block p-4 focus:outline-none focus:border-[white] focus:ring-[white]" placeholder='Detalles...'></input>
            </div>
            
            <label htmlFor="selectTipoPrestamo" className="block text-sm font-medium text-[white]">Tipo de cobro:</label>                         
            <Select id="selectTipoPrestamo" options={opcionesFechaOAcumulativo} styles={colorStyles} onChange={selectFechaLimiteOAcumulativo} defaultValue={{label:fechaLimiteOAcumulativoSelected,value:fechaLimiteOAcumulativoSelected}}/>
          </div>

          <SeccionFechaLimiteOAcumulativo fechaLimiteIsSelected = {fechaLimiteOAcumulativoSelected}/>

          <div className='absolute flex flex-row justify-center ml-[33%] items-center gap-4 mr-5 bottom-0'>
            <div className="divBotonCrearNuevoPrestamo">
              <button className="text-white border border-[#313131] bg-[#272727] hover:bg-[#2e2e2e] font-medium rounded-lg text-sm px-5 py-2 me-2 mb-2" onClick={() => crearPrestamo(nombreNuevoPrestamo,fechaLimiteOAcumulativoSelected,fechaNuevoPrestamoString,diasParaLaDevolucion,cobro,aumentarCobroIsOpen,cobroInicial,cadaCuantosDias,aumentoFijo,aumentoPorcentual,detallesNuevoPrestamo)}>Crear nuevo prestamo</button>
            </div>
            <button onClick={() => setVentanaNuevoPrestamoIsOpen(false)} id="botonCancelarNuevoPrestamo" type="button" className="text-white border border-[#313131] bg-[#272727] hover:bg-[#2e2e2e] font-medium rounded-lg text-sm px-5 py-2 me-2 mb-2">Cancelar</button>
            </div>
          </div>
      </>
    
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
      <div id="seccionFechaLimiteSelected" className=''>
        <div className="divFechaLimiteODias">
          <div className='flex flex-row items-center gap-4'>
            <label htmlFor="selectFecha" className="block text-sm font-medium text-[white]">Elegir fecha</label>
            <DatePicker id="selectFecha" className='text-[white] font-normal bg-[#272727] border border-[#333333]  text-sm rounded-lg  block p-2.5 focus:outline-none focus:border-[white] focus:ring-[white]' selected={fechaNuevoPrestamoDate} dateFormat="dd/MM/yyyy" filterDate={filtroDiasPasados} onChange={(date:Date) => separarFechaStringYDate(date)}/>
            <label htmlFor="inputODias" className="block text-sm font-medium text-[white]">O dias</label>
            <input  defaultValue={diasParaLaDevolucion} onBlur={(event) => setDiasParaLaDevolucion(Number(event.target.value))} type="text" id="inputODias" className="text-[white] w-[20%] bg-[#272727] border border-[#333333] text-sm rounded-lg  block p-2.5 focus:outline-none focus:border-[white] focus:ring-[white]" placeholder="Días" required />
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
          <label htmlFor='inputCobroInicial' className="block mb-2 text-sm font-medium text-[white]">Cobro inicial:</label>
          <input id='inputCobroInicial' defaultValue={cobroInicial} onBlur={(event) => setCobroInicial(Number(event.target.value))} type="text" className="text-[white] w-[70%] bg-[#272727] border border-[#333333] text-sm rounded-lg  block p-2.5 focus:outline-none focus:border-[white] focus:ring-[white]" placeholder=""/>
      </div>
    )
  }

  //Div fecha Limite (la función verifica si el prestamo tiene alguna fecha limite que mostrar)
/*
  const DivFechaLimite = ({fechaLimiteOGuion}: { fechaLimiteOGuion: string }) => {
    if (fechaLimiteOGuion == '"-"') {
      return null
    } else {
      return (
        <div id="divFechaLimite" className='bg-[#585858] h-1/4 rounded-r-full pr-4 mt-1 pl-5 text-white rounded-lg w-60 font-sans font-semibold shadow-1'>Fecha limite:{fechaLimiteOGuion}</div>
      )
    }
  }
*/
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
              <label htmlFor='inputCadaCuantosDias' className="block mb-2 text-sm font-medium text-[white]">Cada cuantos días:</label>
              <input id='inputCadaCuantosDias' defaultValue={cadaCuantosDias} onBlur={(event) => setCadaCuantosDias(Number(event.target.value))} type="text" className="text-[white] w-[70%] bg-[#272727] border border-[#333333] text-sm rounded-lg  block p-2.5 focus:outline-none focus:border-[white] focus:ring-[white]" placeholder=""/>
        </div>
        <div>
              <label htmlFor='inputAumentoFijo' className="block mb-2 text-sm font-medium text-[white]">Aumento fijo:</label>
              <input id='inputAumentoFijo' defaultValue={aumentoFijo} onBlur={(event) => setAumentoFijo(Number(event.target.value))} type="text" className="text-[white] w-[70%] bg-[#272727] border border-[#333333] text-sm rounded-lg  block p-2.5 focus:outline-none focus:border-[white] focus:ring-[white]" placeholder=""/>
        </div>
        <div>
            <label htmlFor='inputAumentoPorcentual' className="block mb-2 text-sm font-medium text-[white]">Aumento porcentual:  %</label>
            <input id='inputAumentoPorcentual' defaultValue={aumentoPorcentual} onBlur={(event) => setAumentoPorcentual(Number(event.target.value))} type="text" className="text-[white] w-[70%] bg-[#272727] border border-[#333333] text-sm rounded-lg  block p-2.5 focus:outline-none focus:border-[white] focus:ring-[white]" placeholder=""/>
        </div>
      </div>
    )
  }

  const[ventanaNuevoPrestamoIsOpen,setVentanaNuevoPrestamoIsOpen] = useState(false)
  

  const [nombreBuscador, cambiarNombreBuscador] = useState("");

  //Lista de prestamos

  return (
    <>
    <div id="divPrincipal" className='flex flex-col w-[80rem] duration-500 left-0 m-12'>
      <div className='flex flex-row relative'>
        <Buscador nombreBuscador={nombreBuscador} cambiarNombreBuscador={cambiarNombreBuscador}/>
        <BotonNuevoPrestamo/>
      </div>
      <div id="probandoEncerrarDivLista" className='w-[73rem] shadow-1 shadow-interno bg-[#333333] rounded-1 h-[33rem]'>
        <div id="divLista" className='w-11/12 overflow-y-auto bg-transparent rounded-1 h-[33rem]'> {/*Después subir por que eran 33 rem*/}
  
          
        
          <ul className='w-full'>
            
            {prestamos.map((prestamo, index) => {
              if (prestamo["Nombre"].toLowerCase().includes(nombreBuscador.toLowerCase())) {
                return (
                  <div className=" w-[100%] h-28 flex-row items-center justify-center flex" key={index}>
                    <div className='border border-2 w-[97%] h-[95%] border-[#313131] rounded-3xl bg-opacity-[10%] bg-gray-400 flex flex-row'>
                      <div className='flex flex-col overflow-hidden w-[28%]'>
                        <div className='h-[70%] w-[95%] overflow-hidden flex items-end ml-8 text-[#d3d3d3] font-medium'>{prestamo["Nombre"]}</div>
                        <div className='h-[30%] w-[95%] mb-8 flex items-center ml-8 text-[#969696] font-normal text-sm'>Fecha: {prestamo["Fecha limite"]}</div>
                      </div>
                      <div className='w-[20%] flex items-center box-border m-0 p-0 justify-center text-[#969696] font-normal text-sm'>
                        En x dias aumenta el cobro
                      </div>
                      <div className='w-[20%] my-2.5 flex ml-6 items-center text-center box-border m-0 p-0 justify-center text-[#969696] font-normal text-sm'>
                        {prestamo["Detalles"]}
                      </div>
                      <div className='w-[15%] flex items-center text-center box-border m-0 p-0 justify-center text-[#d3d3d3] font-medium'>
                        ${JSON.stringify(prestamo["Cobro"])}
                      </div>
                      <div className='w-[17%] flex items-center text-center box-border m-0 p-0 justify-center'>
                        <div className='w-[40%] flex flex-row gap-4 items-center text-center box-border m-0 p-0 justify-center'>
                          <div onClick={() => handleActualizarPrestamo(index)}>
                            <BotonConfiguracionPrestamo/>
                          </div>
                          <div onClick={() => handleFinalizarPrestamo(index)}>
                            <BotonFinalizarPrestamo/>
                          </div>

                        </div>
                      </div>
                    </div>

                  </div>
                );
              } else {
                return null; // No renderizar nada si la condición no se cumple
              }
            })}
          </ul>
        </div>
      </div>
    </div>
    <MenuBoton3Rayas/>
    <ConfirmarFinalizarPrestamo isOpen={confirmarFinalizacionIsOpen} index={indexConfirmarFinalizacion}/>
    <ConfiguracionPrestamo isOpen={configuracionPrestamoIsOpen} index={indexConfigurarPrestamo}/>
    <VentanaNuevoPrestamo isOpen={ventanaNuevoPrestamoIsOpen}/>
  </>
  )
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  
  <>
  <Lista/>
  </>
)
