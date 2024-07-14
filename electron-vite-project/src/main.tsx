import React, {useState, useEffect} from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import axios from "axios";
import Select, { SingleValue } from "react-select"
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { format,addDays } from 'date-fns';
import BarsIcon from './assets/bars';
import GearIcon from './assets/gear';
import CheckIcon from './assets/check';
import HistoryIcon from './assets/history';
import {colorStyles , ordenarPorStyles} from './styles/select.tsx'
import BackIcon from './assets/back.tsx';
import PrestamoIcon from './assets/prestamoIcon.tsx';

const BotonNuevoPrestamo = ({viendoHistorial, handleAbrirCrearNuevoPrestamo} : {viendoHistorial : any, handleAbrirCrearNuevoPrestamo : any}) => {

  if (viendoHistorial == false)  return (
    <button id='botonNuevoPrestamo' className='shadow-1 justify-center bg-[#406b2e] text-white inline-flex items-center border-0 rounded-lg box-border cursor-pointer font-sans font-semibold text-[1rem] leading-[1rem] w-[16rem] max-w-[480px] min-h-[40px] min-w-0 overflow-hidden px-0 pl-[10px] pr-[10px] ml-9 text-center touch-manipulation transition duration-[0.167s] ease-[cubic-bezier(0.4,0,0.2,1)] select-none -webkit-select-none align-middle mb-4 hover:bg-[#375a28] hover:text-white focus:bg-[#375a28] focus:text-white active:bg-[#2f4d22] active:text-[rgba(255,255,255,0.7)] disabled:cursor-not-allowed disabled:bg-[rgba(0,0,0,0.08)] disabled:text-[rgba(0,0,0,0.3)]' onClick={() => handleAbrirCrearNuevoPrestamo()}>Crear nuevo prestamo</button>
  )
  return null;
}

  //Boton 3 rayas  tres Tres boton Rayas

  const MenuBoton3Rayas = ({obtenerHistorial, obtenerPrestamos}:{obtenerHistorial:any, obtenerPrestamos:any}) => {

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
          <div onClick={() => obtenerPrestamos()} className='hover:bg-[#424242] duration-200 h-[2.5rem] w-full flex flex-row cursor-pointer'>
            <div className=' flex justify-center items-center w-[2.5rem]'>
              <PrestamoIcon/>
            </div>
            <div className='flex justify-center items-center h-full w-[70%] text-xs font-medium text-white'>Prestamos</div>
          </div>
          <div onClick={() => obtenerHistorial()} className='hover:bg-[#424242] duration-200 h-[2.5rem] w-full flex flex-row cursor-pointer'>
            <div className=' flex justify-center items-center w-[2.5rem]'>
              <HistoryIcon/>
            </div>
            <div className='flex justify-center items-center h-full w-[70%] text-xs font-medium text-white'>Historial prestamos</div>
          </div>
        </div>
      </div>
    )
  }

const Buscador = ({viendoHistorial,nombreBuscador, cambiarNombreBuscador }: {viendoHistorial:boolean ,nombreBuscador: string, cambiarNombreBuscador: (value: string) => void }) => {

  if (viendoHistorial == true) return (
    <>
      <svg className="absolute left-2 top-[0.7rem] fill-[#9e9ea7] w-[1.3rem] h-[1.3rem]" aria-hidden="true" viewBox="0 0 24 24"><g><path d="M21.53 20.47l-3.66-3.66C19.195 15.24 20 13.214 20 11c0-4.97-4.03-9-9-9s-9 4.03-9 9 4.03 9 9 9c2.215 0 4.24-.804 5.808-2.13l3.66 3.66c.147.146.34.22.53.22s.385-.073.53-.22c.295-.293.295-.767.002-1.06zM3.5 11c0-4.135 3.365-7.5 7.5-7.5s7.5 3.365 7.5 7.5-3.365 7.5-7.5 7.5-7.5-3.365-7.5-7.5z"></path></g></svg>
      <input id="buscador" className='shadow-1 w-[71rem] h-[40px] leading-[28px] px-4 pl-10 border-2 border-transparent rounded-lg outline-none text-[#9594ad] placeholder-[#9e9ea7] focus:outline-none focus:border-[rgba(63,62,63,0.4)] focus:shadow-[0_5px_15px_rgba(17,17,17,0.35)] hover:outline-none hover:border-[rgba(63,62,63,0.4)] hover:shadow-[0_5px_15px_rgba(17,17,17,0.35)] transition duration-300 ease-in-out' value={nombreBuscador} onChange={(event) => cambiarNombreBuscador(event.target.value)} placeholder='Buscar por nombre'></input>
    </>
  )
  return (
    <>
      <svg className="absolute left-2 top-[0.7rem] fill-[#9e9ea7] w-[1.3rem] h-[1.3rem]" aria-hidden="true" viewBox="0 0 24 24"><g><path d="M21.53 20.47l-3.66-3.66C19.195 15.24 20 13.214 20 11c0-4.97-4.03-9-9-9s-9 4.03-9 9 4.03 9 9 9c2.215 0 4.24-.804 5.808-2.13l3.66 3.66c.147.146.34.22.53.22s.385-.073.53-.22c.295-.293.295-.767.002-1.06zM3.5 11c0-4.135 3.365-7.5 7.5-7.5s7.5 3.365 7.5 7.5-3.365 7.5-7.5 7.5-7.5-3.365-7.5-7.5z"></path></g></svg>
      <input id="buscador" className='shadow-1 w-[53rem] h-[40px] leading-[28px] px-4 pl-10 border-2 border-transparent rounded-lg outline-none text-[#9594ad] placeholder-[#9e9ea7] focus:outline-none focus:border-[rgba(63,62,63,0.4)] focus:shadow-[0_5px_15px_rgba(17,17,17,0.35)] hover:outline-none hover:border-[rgba(63,62,63,0.4)] hover:shadow-[0_5px_15px_rgba(17,17,17,0.35)] transition duration-300 ease-in-out' value={nombreBuscador} onChange={(event) => cambiarNombreBuscador(event.target.value)} placeholder='Buscar por nombre'></input>
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

  const [fechaAntigua,setFechaAntigua] = useState(new Date())
  const [fechaAntiguaString,setFechaAntiguaString] = useState(format(new Date(),"dd-MM-yyyy")) 

  const [idActualizar,setIdActualizar] = useState("")

  //Lo que pasa cuando se apreta la tuerca

  function handleActualizarPrestamo(cambiarIndex = 0) {
    setActualizandoPrestamo(true)
    if (actualizandoPrestamo == true) {
      setVentanaNuevoPrestamoIsOpen(true)
    }
    setNombreNuevoPrestamo(prestamos[cambiarIndex]["Nombre"])
    setdetallesNuevoPrestamo(prestamos[cambiarIndex]["Detalles"])
    setCadaCuantosDias(prestamos[cambiarIndex]["Cada cuantos dias aumenta"])
    setAumentoFijo(prestamos[cambiarIndex]["Acumulación fija"])
    setAumentoPorcentual(prestamos[cambiarIndex]["Acumulación porcentual"])
    setCobroInicial(prestamos[cambiarIndex]["Cobro inical"]) //Tendra que ser inical noma error de arrastre
    setCobroActual(prestamos[cambiarIndex]["Cobro"])
    setCobroActualSinCambiar(prestamos[cambiarIndex]["Cobro"])
    setIdActualizar(prestamos[cambiarIndex]["_id"])
    setCobro(prestamos[cambiarIndex]["Cobro final"])    //Realmente state setCobro maneja el cobro final

    if (prestamos[cambiarIndex]["Fecha limite"] != "-") {
      setFechaNuevoPrestamoDate(addDays((new Date(prestamos[cambiarIndex]["Fecha limite"])),1))
      setFechaAntigua(addDays((new Date(prestamos[cambiarIndex]["Fecha limite"])),1))
      setFechaAntiguaString(format(addDays((new Date(prestamos[cambiarIndex]["Fecha limite"])),1),"dd-MM-yyyy"))
    } else {
      setFechaNuevoPrestamoDate(new Date())
      setFechaAntigua(new Date())
    }
    setFechaLimiteOAcumulativoSelected(prestamos[cambiarIndex]["Tipo cobro"])
    setAumentarCobroIsOpen(prestamos[cambiarIndex]["Accion al pasar fecha"])
  }

    //States que manejan cuando abre la ventana de confirmar y ayudan a enviarle el index que se tiene que borrar

    const [confirmarFinalizacionIsOpen, setConfirmarFinalizacionIsOpen] = useState(false)
    const [indexConfirmarFinalizacion, setIndexConfirmarFinalizacion] = useState(0)
  
    const [actualizandoPrestamo, setActualizandoPrestamo] = useState(false)

  useEffect(() => {
    if (actualizandoPrestamo == true) {
      setVentanaNuevoPrestamoIsOpen(true)
    }
  },[actualizandoPrestamo])

  // State que se usara para guardar los prestamos

  const [prestamos, cambiarPrestamos] = useState([{"_id":"","Nombre":"","Dias restantes":7777,"Cobro":Number,"Detalles":"","Fecha limite":"","Cobro inical":Number,"Tipo cobro":"","Accion al pasar fecha":"","Cada cuantos dias aumenta":Number,"Acumulación fija":Number,"Acumulación porcentual":Number,"Cobro final":Number,"Dias para aumento":""}]);
  
  const [ordenarPor,setOrdenarPor] = useState("Fecha de creación o actualización")

  // Solicitudes

  async function obtenerPrestamos () {

    const responsePrestamos = (await axios.get(`http://127.0.0.1:8000/obtenerPrestamos/${ordenarPor}`)).data
  
    cambiarPrestamos(responsePrestamos)

    setViendoHistorial(false)

    return {}
  
  }

  async function borrarPrestamo (index:number){

    const idPrestamo = prestamos[index]["_id"]

    await axios.delete(`http://127.0.0.1:8000/borrarPrestamo/${idPrestamo}`)

    obtenerPrestamos()

    setConfirmarFinalizacionIsOpen(false)
  }

  // Historial
  async function obtenerHistorial() {

    const responseHistorial = (await axios.delete("http://127.0.0.1:8000/obtenerHistorial")).data

    setHistorial(responseHistorial)
    setViendoHistorial(true)
  }

  async function recuperarPrestamo(index:number) {
    const idPrestamo = historial[index]["_id"]
    await axios.delete(`http://127.0.0.1:8000/recuperarPrestamo/${idPrestamo}`)
    setConfirmarFinalizacionIsOpen(false)
    obtenerHistorial()
  }

  const [historial,setHistorial] = useState([{"Nombre":"","_id":"","Dias restantes":Number,"Cobro":Number,"Detalles":"","Fecha limite":"","Dias para borrarse":Number}])

  const [viendoHistorial,setViendoHistorial] = useState(false)

  const LeerMas = ({detalles} : {detalles : any}) => {
    if (detalles.length > 103) {
      return (
        <div onClick={() => handleOpenLeerMas(detalles)} className='font-medium cursor-pointer hover:underline'>
          Leer mas...
        </div>
      )
    } else return null;
  }

  const [leerMasIsOpen,setLeerMasIsOpen] = useState(false)

  const [detallesLeerMas,setDetallesLeerMas] = useState("")

  function handleOpenLeerMas(detalles : any) {
    setDetallesLeerMas(detalles)
    setLeerMasIsOpen(true)
  }

  const VentanaLeerMas = () => {
    if (leerMasIsOpen == true) return (
      <>
        <div className='z-10 absolute w-[100%] h-[100%] bg-black opacity-50' onClick={() => setLeerMasIsOpen(false)}></div>
        <div className='absolute inset-x-0 top-0 bottom-0 flex justify-center items-center'>
          <div
            className='z-20 bg-[#3E3F40] border-[#313131] box-border p-4 text-[#969696] font-normal text-sm rounded-3xl w-[33rem] m-auto'>
            {detallesLeerMas}
          </div>
        </div>
      </>
    )
  }

  const ListaOHistorial = () => {
    const hList = "h-[8.1rem]"
    if (viendoHistorial == false) return(
      <ul className='w-full'>
            
            {prestamos.map((prestamo, index) => {
              if (prestamo["Nombre"].toLowerCase().includes(nombreBuscador.toLowerCase())) {
                return (
                  <div className={`w-[100%] ${hList} flex-row items-center justify-center flex`} key={index}>
                    <div className='border border-2 w-[97%] h-[95%] border-[#313131] rounded-3xl bg-opacity-[10%] bg-gray-400 flex flex-row'>
                      <div className='flex flex-col overflow-hidden w-[28%]'>
                        <div className='h-[70%] w-[95%] overflow-hidden flex items-end ml-8 text-[#d3d3d3] font-medium'>{prestamo["Nombre"]}</div>
                        <div className='h-[30%] w-[95%] mb-8 flex items-center ml-8 text-[#969696] font-normal text-sm'>Fecha: {prestamo["Fecha limite"]}</div>
                      </div>
                      <div className='w-[20%] flex items-center box-border m-0 p-0 justify-center text-[#969696] font-normal text-sm'>
                        {prestamo["Dias para aumento"]}
                      </div>
                        <div className={`w-[20%] flex-col my-2.5 flex ml-6 ${prestamo["Detalles"].length > 103 ? "items-start" : "items-center"} box-border p-0 justify-center text-[#969696] font-normal text-sm`}>
                          <span className={`line-clamp-4 overflow-hidden text-ellipsis ${prestamo["Detalles"].length > 103 ? "text-left" : "text-center"} break-all `}>
                            {prestamo["Detalles"]}
                          </span>
                          <LeerMas detalles={prestamo["Detalles"]}/>
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
    )
    if (viendoHistorial == true) return(
      <ul className='w-full'>
            
            {historial.map((prestamo, index) => {
              if (prestamo["Nombre"].toLowerCase().includes(nombreBuscador.toLowerCase())) {
                return (
                  <div className={`w-[100%] ${hList} flex-row items-center justify-center flex`} key={index}>
                    <div className='border border-2 w-[97%] h-[95%] border-[#313131] rounded-3xl bg-opacity-[10%] bg-gray-400 flex flex-row'>
                      <div className='flex flex-col overflow-hidden w-[28%]'>
                        <div className='h-[70%] w-[95%] overflow-hidden flex items-end ml-8 text-[#d3d3d3] font-medium'>{prestamo["Nombre"]}</div>
                        <div className='h-[30%] w-[95%] mb-8 flex items-center ml-8 text-[#969696] font-normal text-sm'>Fecha: {prestamo["Fecha limite"]}</div>
                      </div>
                      <div className='w-[24%] flex items-center box-border m-0 p-0 justify-center text-[#969696] font-normal text-sm'>
                        En {JSON.stringify(prestamo["Dias para borrarse"])} días se elimina el prestamo
                      </div>
                        <div className={`w-[20%] flex-col my-2.5 flex ml-6 ${prestamo["Detalles"].length > 103 ? "items-start" : "items-center"} box-border p-0 justify-center text-[#969696] font-normal text-sm`}>
                          <span className={`line-clamp-4 overflow-hidden text-ellipsis ${prestamo["Detalles"].length > 103 ? "text-left" : "text-center"} break-all `}>
                            {prestamo["Detalles"]}
                          </span>
                          <LeerMas detalles={prestamo["Detalles"]}/>
                        </div>
                      <div className='w-[16%] flex items-center text-center box-border m-0 p-0 justify-center text-[#d3d3d3] font-medium'>
                        ${JSON.stringify(prestamo["Cobro"])}
                      </div>
                      <div className='w-[12%] flex items-center text-center box-border m-0 p-0 justify-center'>
                        <div className='w-[40%] flex flex-row gap-4 items-center text-center box-border m-0 p-0 justify-center'>
                          <div onClick={() => setConfirmarFinalizacionIsOpen(true)}>
                            <BackIcon/>
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
    )
  }

  function textoBorrarORestaurar() {
    if (viendoHistorial == true) {
      return "¿Estas seguro de querer restaurar este prestamo?"
    } else {
      return "¿Estas seguro de querer finalizar este prestamo?"
    }
  }

  function handleBorrarORestaurar(index:number) {
    if (viendoHistorial == false) {
      borrarPrestamo(index)
    } else {
      recuperarPrestamo(index)
    }
  }

  //Ventana que se abre al apretar el ticket

  const ConfirmarFinalizarPrestamo = ({isOpen = false, index = 7777}) => {
  
    if (!isOpen) return null;
  
    return (
      <>
        <div id="fondoNegroVentanaFinalizar" onClick={() => setConfirmarFinalizacionIsOpen(false)} className='absolute w-[100%] h-[100%] bg-black opacity-40'></div>
        <div id="FinalizarPrestamoDiv" className='bg-[#2c2c2c] shadow-2xl border-[#313131] p-4 border-2 w-[35rem] h-[11rem] rounded-2xl box-border absolute m-auto left-0 right-0 top-0 bottom-4' >
          <div className='flex flex-col justify-center items-center'>
            <span className="flex flex-col h-[3.5rem] justify-center items-center mt-3 mb-1 text-base font-medium text-[white]">{textoBorrarORestaurar()}</span>
            <div className='flex flex-row justify-center items-center h-[4rem] gap-6'>
              <button className="w-[6.6rem] text-white border border-[#313131] bg-[#272727] hover:bg-[#2e2e2e] focus:bg-[#303030] font-medium rounded-lg text-sm px-5 py-2 me-2 mb-2" onClick={() => setConfirmarFinalizacionIsOpen(false)}>Cancelar</button>
              <button className="w-[6.6rem] text-white border border-[#313131] bg-[#272727] hover:bg-[#2e2e2e] focus:bg-[#303030] font-medium rounded-lg text-sm px-5 py-2 me-2 mb-2" onClick={() => handleBorrarORestaurar(index)}>Confirmar</button>
            </div>
          </div>
        </div>
      </>
    )
  }

  //useState para ver si la sección fechaLimite o acomulativo esta seleccionada

  const [fechaLimiteOAcumulativoSelected, setFechaLimiteOAcumulativoSelected] = useState("Fecha limite")

  //Boton Nuevo prestamo

  function handleAbrirCrearNuevoPrestamo() {
    setActualizandoPrestamo(false)
    if (actualizandoPrestamo == false) {
      setVentanaNuevoPrestamoIsOpen(true)
    }
    setvolverACalcularCobroState(false)
  }

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

  async function handleCrearOActualizar(
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
    detallesNuevoPrestamo:string,
    fechaAntigua:string,   //Esta es la que se selecciona cuando se tiene activado volver a calcular prestamo

  ) {
    if (detallesNuevoPrestamo == "") {
      detallesNuevoPrestamo = "-"
    }
    if (actualizandoPrestamo == false) {
      var url = `http://127.0.0.1:8000/insertarMonto/${nombrePrestamo}/${tipoCobro}/${fechaLimitePrestamo}/${diasParaDevolucion}/${cobroFinal}/${opcionCobroFinal}/${cobroInicial}/${cadaCuantosDiasAumenta}/${acumulacionFija}/${acumulacionPorcentual}/${detallesNuevoPrestamo}`
      url = url.replace("?","%3F")
      await axios.post(
        url)
    } else {
      if (volverACalcularCobroState == true) {
        var url = `http://127.0.0.1:8000/actualizarPrestamo/${idActualizar}/${nombrePrestamo}/${tipoCobro}/${fechaAntiguaString}/${diasParaDevolucion}/${cobroFinal}/${opcionCobroFinal}/${cobroInicial}/${cadaCuantosDiasAumenta}/${acumulacionFija}/${acumulacionPorcentual}/${detallesNuevoPrestamo}`
        url = url.replace("?","%3F")
        await axios.put(
          url
        )
      } else {
        var url = `http://127.0.0.1:8000/actualizarPrestamoParcialmente/${idActualizar}/${nombrePrestamo}/${tipoCobro}/${fechaNuevoPrestamoString}/${diasParaDevolucion}/${cobroActual}/${opcionCobroFinal}/${cadaCuantosDiasAumenta}/${acumulacionFija}/${acumulacionPorcentual}/${detallesNuevoPrestamo}`
        url = url.replace("?","%3F")
        await axios.put(url)
      }
    }
    obtenerPrestamos()
    setVentanaNuevoPrestamoIsOpen(false)
  }

  function textoBotonCrearOActualizar() {
    if (actualizandoPrestamo == false) {
      return "Crear nuevo prestamo"
    } else {
      return "Actualizar prestamo"
    }
  }

  const InputCobroActual = ({ volverACalcularCobroState = false }) => {

    const VolverACalcularCobro = () => {

      function handleCambiarVolverACalcular(event:any) {
        setvolverACalcularCobroState(event.target.checked)
      }

      if (!actualizandoPrestamo) return null;
      else {
        return(
          <div className="flex items-center ml-5">
              <input checked={volverACalcularCobroState} onChange={handleCambiarVolverACalcular} id="checkBoxCalcularCobro" type="checkbox" value="" className="border relative custom-checkbox appearance-none w-4 h-4 bg-[#3E3F40] border-[#333333]  rounded focus:ring-[white] focus:ring-1"></input>
              <label htmlFor="checkBoxCalcularCobro" className="ms-2 text-sm font-medium text-white">Volver a calcular cobro</label>
          </div>
        )
        
      }
    } 
    
    if (volverACalcularCobroState == false && actualizandoPrestamo == true) return (
      <div className='absolute bottom-[3.2rem]'>
        <label htmlFor="inputCobroActual" className="block text-sm mb-1 font-medium text-[white]">Cobro actual:</label>
        <div className='flex items-center w-[22rem] flex-row'>
            <input type="number" defaultValue={cobroActual} onBlur={(event) => setCobroActual(Number(event.target.value))} id="inputCobroActual" className="w-[10rem] bg-[#272727] border text-sm rounded-lg  block p-2.5 focus:outline-none text-[#bebebe] border-[#3d3d3d] focus:border-[#727272] focus:ring-[white]" placeholder="" />
            <VolverACalcularCobro/>
        </div>
      </div>
    )
    if (volverACalcularCobroState == true && actualizandoPrestamo == true)return (
      <div className='absolute bottom-[3.2rem]'>
        <label htmlFor="inputCobro" className="block text-sm mb-1 font-medium text-[#acacac]">Cobro actual:</label>
        <div className='flex items-center w-[22rem] flex-row'>
            <input disabled type="number" defaultValue={cobroActualSinCambiar} id="inputCobro" className="w-[10rem] bg-[#2c2c2c] border text-sm rounded-lg  block p-2.5 focus:outline-none text-[#8a8a8a] border-[#3d3d3d] focus:border-[#727272] focus:ring-[white]" placeholder="" />
            <VolverACalcularCobro/>
        </div>
      </div>
    )
    return null;
  }

  //Ventana Nuevo Prestamo

  const VentanaNuevoPrestamo = ({isOpen = false}) => {
    
    function handleCrear(    nombrePrestamo:string,
      tipoCobro:string,
      fechaLimitePrestamo:string,
      diasParaDevolucion:number,
      cobroFinal:number,
      opcionCobroFinal:string,
      cobroInicial:number,
      cadaCuantosDiasAumenta:number,
      acumulacionFija:number,
      acumulacionPorcentual:number,
      detallesNuevoPrestamo:string,
      fechaAntigua:string,){
        handleCrearOActualizar(nombrePrestamo,tipoCobro,fechaLimitePrestamo,diasParaDevolucion,cobroFinal,opcionCobroFinal,cobroInicial,cadaCuantosDiasAumenta,acumulacionFija,acumulacionPorcentual,detallesNuevoPrestamo,fechaAntigua)
        nombreObligatorio()
      }

    function nombreObligatorio(){
      if (nombreNuevoPrestamo == "") {
        setNombreObligatorioVisible(true)
        setTimeout(() => {
          setNombreObligatorioVisible(false);
        }, 2000);
      }
    }
    
    function handleCancelarPrestamo() {
      setVentanaNuevoPrestamoIsOpen(false)
      if (actualizandoPrestamo == true) {
        setNombreNuevoPrestamo("");setdetallesNuevoPrestamo("");setCobro(0);setFechaLimiteOAcumulativoSelected("Fecha limite");setFechaNuevoPrestamoDate(new Date());setDiasParaLaDevolucion(0);setCadaCuantosDias(1);setAumentoFijo(0);setAumentoPorcentual(0);setCobroInicial(0)
      }
    }

    const [isNombreObligatorioVisible,setNombreObligatorioVisible] = useState(false)

    if (!isOpen) return null;

    return (
      <>
        <div id="fondoNegroVentanaNuevoPrestamo" className='absolute w-[100%] h-[100%] bg-black opacity-40'></div>
        <div id="ventanaNuevoPrestamoDiv" className='bg-[#333333] shadow-interno border-[#313131] p-4 border-2 w-[62rem] h-[37rem] rounded-1 box-border absolute m-auto left-0 right-0 top-0 bottom-4'>
          <div className='flex flex-row w-[100%]'>
            <div className='flex flex-col w-[50%] justify-center'>
            <div>
              <div className='flex flex-row items-center'>
                <label htmlFor='inputNombre' className="block mt-2 mb-1 text-sm font-medium text-[white]">Nombre:</label>
                <span className={`text-[#969696] font-normal text-sm ml-4 mt-2 mb-1 transition-opacity duration-300 ${isNombreObligatorioVisible ? 'opacity-100' : 'opacity-0'}`}>*Campo obligatorio*</span>
              </div>
              <input  defaultValue={nombreNuevoPrestamo} onBlur={(e) => setNombreNuevoPrestamo(e.target.value)} type="text" id="inputNombre" className="w-[95%] bg-[#272727] border text-sm rounded-lg  block p-2.5 focus:outline-none text-[#bebebe] border-[#3d3d3d] focus:border-[#727272] focus:ring-[white]" placeholder="Nombre..." required />
            </div>
              <label htmlFor="selectTipoPrestamo" className="mt-3 mb-1 block text-sm font-medium text-[white]">Tipo de cobro:</label>                         
              <Select isSearchable={false} className='mb-[0.35rem]' id="selectTipoPrestamo" options={opcionesFechaOAcumulativo} styles={colorStyles} onChange={selectFechaLimiteOAcumulativo} defaultValue={{label:fechaLimiteOAcumulativoSelected,value:fechaLimiteOAcumulativoSelected}}/>
            </div>
            <div className='flex flex-col w-[50%] justify-center'>
              <label htmlFor='detallesInput' className="block mt-2 mb-1 text-sm font-medium text-[white]">Detalles:</label>
              <textarea id='detallesInput' defaultValue={detallesNuevoPrestamo} onBlur={(e) => setdetallesNuevoPrestamo(e.target.value)} className="h-[7.6rem] resize-none p-2 mb-[0.35rem] w-[95%] bg-[#272727] border text-[#bebebe] border-[#3d3d3d] focus:border-[#727272] text-sm box-border rounded-lg focus:outline-none focus:ring-[white]" placeholder='Detalles...'></textarea>
            </div>
            
          </div>

          <SeccionFechaLimiteOAcumulativo fechaLimiteIsSelected = {fechaLimiteOAcumulativoSelected}/>

          <InputCobroActual volverACalcularCobroState={volverACalcularCobroState}/>

          <div className='absolute flex flex-row justify-center ml-[33%] items-center gap-4 mr-5 bottom-0'>
            <div className="divBotonCrearNuevoPrestamo">
              <button className="text-white border border-[#313131] bg-[#272727] hover:bg-[#2e2e2e] focus:bg-[#303030] font-medium rounded-lg text-sm px-5 py-2 me-2 mb-2" onClick={() => handleCrear(nombreNuevoPrestamo,fechaLimiteOAcumulativoSelected,fechaNuevoPrestamoString,diasParaLaDevolucion,cobro,aumentarCobroIsOpen,cobroInicial,cadaCuantosDias,aumentoFijo,aumentoPorcentual,detallesNuevoPrestamo,fechaAntiguaString)}>{textoBotonCrearOActualizar()}</button>
            </div>        
              <button onClick={() => handleCancelarPrestamo()} id="botonCancelarNuevoPrestamo" type="button" className="text-white border border-[#313131] bg-[#272727] hover:bg-[#2e2e2e] focus:bg-[#303030] font-medium rounded-lg text-sm px-5 py-2 me-2 mb-2">Cancelar</button>
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
    setFechaAntigua(fecha)
  }

  const CobroElemento = () => {
    if (actualizandoPrestamo == true && fechaLimiteOAcumulativoSelected == "Fecha limite" && cobroActual == cobro) return (
      <div className='flex flex-col w-[50%]'>
        <label htmlFor="inputCobro" className="block text-sm mb-1 font-medium text-[white]">Cobro:</label>
        <input type="number" defaultValue={cobroActual} value={cobroActual} onBlur={(event) => setCobroActual(Number(event.target.value))} id="inputCobro" className="w-[95%] bg-[#272727] border text-sm rounded-lg  block p-2.5 focus:outline-none text-[#bebebe] border-[#3d3d3d] focus:border-[#727272] focus:ring-[white]" placeholder="" />
      </div>
    )
    return (
      <div className='flex flex-col w-[50%]'>
        <label htmlFor="inputCobro" className="block text-sm mb-1 font-medium text-[white]">Cobro:</label>
        <input type="number" defaultValue={cobro} onBlur={(event) => setCobro(Number(event.target.value))} id="inputCobro" className="w-[95%] bg-[#272727] border text-sm rounded-lg  block p-2.5 focus:outline-none text-[#bebebe] border-[#3d3d3d] focus:border-[#727272] focus:ring-[white]" placeholder="" />
      </div>
    )
  }

  const separarFechaAntiguaStringYDate = (fecha:Date) => {
    setFechaAntiguaString(format(fecha,"dd-MM-yyyy"))
    setFechaAntigua(fecha)
  }

  const [diasParaLaDevolucion, setDiasParaLaDevolucion] = useState(0)

  const [aumentarCobroIsOpen,setAumentarCobroIsOpen] = useState("Dejar cobro fijo");

  const [cobro,setCobro] = useState(Number)

  const opcionesFijoOAumentar = [
    {label:"Dejar cobro fijo",value:"Dejar cobro fijo"},
    {label:"Aumentar cobro",value:"Aumentar cobro"}
  ]

  const opcionesOrdenarPor = [
    {label:"Fecha de creación o actualización", value:"Fecha de creación o actualización"},
    {label:"Cobro", value:"Cobro"},
    {label:"Fecha de cobro", value:"Fecha de cobro"}
  ]

  const selectFijoOAumentar = (event:SingleValue<{label:string;value:string}>,) => {

    if (event.value == "Dejar cobro fijo") {

      setAumentarCobroIsOpen("Dejar cobro fijo")

    } else if (event.value == "Aumentar cobro") {

      setAumentarCobroIsOpen("Aumentar cobro")

    }

  }

  function handleCambiarOrden(event:SingleValue<{label:string;value:string}>,){
    if (event) {setOrdenarPor(event.value)}
    return null
  }

  useEffect(() => {
    obtenerPrestamos()
  },[ordenarPor])

  const [volverACalcularCobroState,setvolverACalcularCobroState] = useState(false)

  const SeccionFechaLimiteOAcumulativo = ({fechaLimiteIsSelected = "Fecha limite"}) =>{

    if (fechaLimiteIsSelected == "Acumulativo") {
      return (<DivAumentoCobro aumentarCobroIsOpen = {"Aumentar cobro"}/>)
      
    }
 
    const filtroDiasPasados = (date:Date) => new Date() <= date

    // Si se esta volviendo a calcular el cobro se pueden seleccionar dias que ya pasaron, en caso contrario o de crear un prestamo, no se puede

    const DatePickerVariable = () => {
      if (volverACalcularCobroState == false) return (
        <DatePicker id="selectFecha" className='font-normal bg-[#272727] border text-sm rounded-lg  block p-2.5 focus:outline-none text-[#bebebe] border-[#3d3d3d] focus:border-[#727272] focus:ring-[white]' selected={fechaNuevoPrestamoDate} dateFormat="dd/MM/yyyy" filterDate={filtroDiasPasados} onChange={(date:Date) => separarFechaStringYDate(date)}/>
      )
      return (
        <DatePicker id="selectFecha" className='font-normal bg-[#272727] border text-sm rounded-lg  block p-2.5 focus:outline-none text-[#bebebe] border-[#3d3d3d] focus:border-[#727272] focus:ring-[white]' selected={fechaAntigua} dateFormat="dd/MM/yyyy" onChange={(date:Date) => separarFechaAntiguaStringYDate(date)}/>
      )
    }

    return (
      <div id="seccionFechaLimiteSelected" className=''>
        <div className="divFechaLimiteODias">
          <div className='flex flex-row items-center gap-4 mt-3'>
            <label htmlFor="selectFecha" className="block text-sm font-medium text-[white]">Fecha de cobro:</label>
            <DatePickerVariable/>
            <label htmlFor="inputODias" className="block text-sm font-medium text-[white]">+</label>
            <input  defaultValue={diasParaLaDevolucion} onBlur={(event) => setDiasParaLaDevolucion(Number(event.target.value))} type="number" id="inputODias" className="w-[20%] bg-[#272727] border text-[#bebebe] border-[#3d3d3d] focus:border-[#727272] text-sm rounded-lg  block p-2.5 focus:outline-none focus:ring-[white]" placeholder="Días"  />
            <label htmlFor="inputODias" className="block text-sm font-medium text-[white]">días</label>
          </div>
          <div className='flex flex-row w-[100%] mt-5'>
            <CobroElemento/>
            <div className='flex flex-col w-[50%]'>
              <label htmlFor='selectOpcionAlPasarse' className="block mb-1 text-sm font-medium text-[white]">Acción al pasarse la fecha:</label>
              <Select isSearchable={false} id='selectOpcionAlPasarse' options={opcionesFijoOAumentar} onChange={(event) => selectFijoOAumentar(event)} styles={colorStyles} defaultValue={{label:aumentarCobroIsOpen,value:aumentarCobroIsOpen}}/>
            </div>
          </div>
          <DivAumentoCobro aumentarCobroIsOpen = {aumentarCobroIsOpen}/>
        </div>
      </div>
    )
  }

  //State para guardar el cobro inicial

  const [cobroInicial, setCobroInicial] = useState(0)

  //Handle que maneja el cobro inicial

  function handleCambiarCobroInicial(event:any){  
    if (fechaLimiteOAcumulativoSelected == "Fecha limite") return null
      
    setCobroInicial(Number(event.target.value))
  
  } 


  //State que guarda: cada cuantos dias aumentar el cobro, el aumento fijo

  const [cadaCuantosDias,setCadaCuantosDias] = useState(1)

  const [aumentoFijo,setAumentoFijo] = useState(0)

  const [aumentoPorcentual,setAumentoPorcentual] = useState(0)
  
  const CobroInicialInput = () => {
  if (fechaLimiteOAcumulativoSelected == "Acumulativo" && volverACalcularCobroState == true || fechaLimiteOAcumulativoSelected == "Acumulativo" && actualizandoPrestamo == false) return (
    <div>
        <label htmlFor='inputCobroInicial' className="block mt-2 mb-1 text-sm font-medium text-[white]">Cobro inicial:</label>
        <input id='inputCobroInicial' defaultValue={cobroInicial} onBlur={(event) => handleCambiarCobroInicial(event)} type="number" className="w-[95%] bg-[#272727] border text-sm rounded-lg  block p-2.5 focus:outline-none text-[#bebebe] border-[#3d3d3d] focus:border-[#727272] focus:ring-[white]" placeholder=""/>
    </div>
  )
  return null;
  }


  const DivAumentoCobro = ({aumentarCobroIsOpen = "Dejar cobro fijo"}) => {
    if (aumentarCobroIsOpen == "Dejar cobro fijo") return null;
    
    return (
      <div>
        <div className='flex flex-row w-[100%]'>
          <div className='flex flex-col w-[50%]'>
            <div className=''>
                <label htmlFor='inputAumentoPorcentual' className="block mt-2 mb-1 text-sm font-medium text-[white]">Aumento porcentual:  %</label>
                <input id='inputAumentoPorcentual' defaultValue={aumentoPorcentual} onBlur={(event) => setAumentoPorcentual(Number(event.target.value))} type="number" className="w-[95%] bg-[#272727] border text-sm rounded-lg  block p-2.5 focus:outline-none text-[#bebebe] border-[#3d3d3d] focus:border-[#727272] focus:ring-[white]" placeholder=""/>
            </div>
            <div>
                  <label htmlFor='inputCadaCuantosDias' className="block mt-2 mb-1 text-sm font-medium text-[white]">Cada cuantos días:</label>
                  <input id='inputCadaCuantosDias' defaultValue={cadaCuantosDias} onBlur={(event) => setCadaCuantosDias(Number(event.target.value))} type="number" className="w-[95%] bg-[#272727] border text-sm rounded-lg  block p-2.5 focus:outline-none text-[#bebebe] border-[#3d3d3d] focus:border-[#727272] focus:ring-[white]" placeholder=""/>
            </div>
          </div>
          <div className='flex flex-col w-[50%]'>
            <div className=''>
                <label htmlFor='inputAumentoFijo' className="block mt-2 mb-1 text-sm font-medium text-[white]">Aumento fijo:</label>
                <input id='inputAumentoFijo' defaultValue={aumentoFijo} onBlur={(event) => setAumentoFijo(Number(event.target.value))} type="number" className="w-[95%] bg-[#272727] border text-sm rounded-lg  block p-2.5 focus:outline-none text-[#bebebe] border-[#3d3d3d] focus:border-[#727272] focus:ring-[white]" placeholder=""/>
            </div>
            <CobroInicialInput/>
          </div>
        </div>
      </div>
    )
  }

  const[ventanaNuevoPrestamoIsOpen,setVentanaNuevoPrestamoIsOpen] = useState(false)
  

  const [nombreBuscador, cambiarNombreBuscador] = useState("");

  const [cobroActual,setCobroActual] = useState(Number);

  const [cobroActualSinCambiar,setCobroActualSinCambiar] = useState(Number);

  //Lista de prestamos

  return (
    <>
    <div id="divPrincipal" className='flex flex-col w-[80rem] duration-500 m-12'>
      <div className='flex flex-row relative ml-3'>
        <Buscador viendoHistorial={viendoHistorial} nombreBuscador={nombreBuscador} cambiarNombreBuscador={cambiarNombreBuscador}/>
        <BotonNuevoPrestamo viendoHistorial={viendoHistorial} handleAbrirCrearNuevoPrestamo={handleAbrirCrearNuevoPrestamo}/>
      </div>
      <div id="probandoEncerrarDivLista" className={`w-[73rem] shadow-interno bg-[#333333] rounded-1 h-[33rem] ${viendoHistorial ? "my-4" : "my-0"} }`}>
        <div id="divLista" className='w-11/12 overflow-y-auto bg-transparent rounded-1 h-[33rem]'> {/*Después subir por que eran 33 rem*/}
          <div className='ml-5 flex w-[30rem] flex-row h-[10%] items-center'>
              <label htmlFor='selectOrden' className='font-semibold text-[#bebebe]'>Ordenar por:</label>
              <Select isSearchable={false} id="selectOrden" options={opcionesOrdenarPor} onChange={(event) => handleCambiarOrden(event)} styles={ordenarPorStyles} defaultValue={{label:ordenarPor,value:ordenarPor}}/>
          </div>
          <ListaOHistorial/>
        </div>
      </div>
    </div>
    <MenuBoton3Rayas obtenerHistorial={() => obtenerHistorial()} obtenerPrestamos={() => obtenerPrestamos()}/>
    <ConfirmarFinalizarPrestamo isOpen={confirmarFinalizacionIsOpen} index={indexConfirmarFinalizacion}/>
    <VentanaNuevoPrestamo isOpen={ventanaNuevoPrestamoIsOpen}/>
    <VentanaLeerMas/>
  </>
  )
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  
  <>
  <Lista/>
  </>
)
