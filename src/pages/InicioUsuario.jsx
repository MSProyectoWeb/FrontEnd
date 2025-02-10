import TarjetaUsuario from "../components/TarjetaUsuario"
import Chat from "../components/Chat"
export default function Inicio() {
    return (
        <div className="gap-3 flex-col border-[2px] border-principal px-52 h-fit w-[75%] flex justify-center items-center rounded-2xl">
           <TarjetaUsuario></TarjetaUsuario>
            <Chat/>
        </div>
    )
}