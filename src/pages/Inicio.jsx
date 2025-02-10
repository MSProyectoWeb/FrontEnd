import Tarjeta from "../components/Tarjeta"
import { BiUser } from "react-icons/bi"
import { GiPadlock } from "react-icons/gi"
export default function Inicio() {
    return (
        <>
            <div className="grid grid-cols-2 gap-8">
                <button className="">
                    <Tarjeta className={"p-8 h-full max-w-[352px]"}>
                        <div className="flex flex-col justify-center items-center gap-9">
                            <BiUser className="text-acento" size={104} />
                            <div className="flex flex-col justify-center items-center">
                                <h1 className="text-2xl font-bold text-principal">Registro de Cliente</h1>
                                <p className="text-sm text-principal">Muestra la pantalla de registro para tus clientes</p>
                            </div>

                        </div>

                    </Tarjeta>
                </button>

                <button className="">
                    <Tarjeta className={"p-8 max-w-[352px] h-full "}>
                        <div className="flex flex-col justify-center items-center gap-9">
                            <GiPadlock className="text-acento" size={104} />
                            <div className="flex flex-col justify-center items-center">
                                <h1 className="text-2xl font-bold text-principal">Panel de Administrador</h1>
                                <p className="text-sm text-principal">Administra las operaciones de tu gimnasio y los datos de tus miembros</p>
                            </div>

                        </div>

                    </Tarjeta>
                </button>
            </div>
        </>
    )
}