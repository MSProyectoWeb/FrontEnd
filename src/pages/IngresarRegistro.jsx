import React from "react";
import Tarjeta from "../components/Tarjeta";
import Boton from "../components/Boton";
import Input from "../components/Atomos/Input";
export default function IngresarRegistro() {
    return (
        <Tarjeta className={"p-8 max-w-[494px] w-full"}>
            <form className="flex flex-col justify-center items-center gap-9">
                <div className="w-full flex flex-col justify-center items-center">
                    <h1 className="text-4xl font-bold text-principal font-bebas">BIENVENIDO A TU GYM!</h1>
                    <p className="text-sm text-principal self">Resgitra tu asistencia</p>
                </div>

                <Input
                    label="C. I."
                    id="cedula"
                    type="text"
                    placeholder="17xxxxxxxxx"
                    maxLength="10"
                />
                <Boton tipoBoton="primario" className="" texto={"Registrar Asistencia"} />
            </form>

        </Tarjeta>
    )
}