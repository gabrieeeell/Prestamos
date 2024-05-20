import React, {useState, useEffect} from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import axios from "axios";

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

  //States que manejan cuando abre la ventana de confirmar y ayudan a enviarle el index que se tiene que borrar

  const [confirmarFinalizacionIsOpen, setConfirmarFinalizacionIsOpen] = useState(false)
  const [indexConfirmarFinalizacion, setIndexConfirmarFinalizacion] = useState(0)

  // Buscador


  //Ventana que se abre al apretar el ticket

  const ConfirmarFinalizarPrestamo = ({isOpen = false, index = 777}) => {
  
    if (!isOpen) return null;
  
    return (
      <div className='confirmarFinalizacionPrestamoDiv'>
        <h2>Estas seguro de querer finalizar este prestamo?</h2>
        <button onClick={() => setConfirmarFinalizacionIsOpen(false)}>Cancelar</button>
        <button onClick={() => borrarPrestamo(index)}>Confirmar</button>
      </div>
    )
  }

  const [nombreBuscador, cambiarNombreBuscador] = useState("");
  //Lista de prestamos

  return (
    <>
    <Buscador nombreBuscador={nombreBuscador} cambiarNombreBuscador={cambiarNombreBuscador}/>
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
  </>
  )
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  
  <>
  <NuevoPrestamo/>
  <Lista/>
  </>
)
