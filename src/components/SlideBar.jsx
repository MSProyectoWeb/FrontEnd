import React, { useState } from "react";
import Boton from "./Boton";
import { BiSearch, BiDumbbell, BiUser, BiLabel, BiBox, BiLink, BiTrophy } from "react-icons/bi";
import { CiBullhorn } from "react-icons/ci";
import { HiOutlineCog } from "react-icons/hi";
import { motion } from "framer-motion";


export default function SlideBar() {
    const [mouseEnterOnMenu, setMouseEnterOnMenu] = useState(false);

    const menu = [
        {
            texto: "Dashboard",
            onClick: () => console.log("Home"),
            tipoBoton: "botonMenuSelected",
            icono: <BiDumbbell />,
        },
        {
            texto: "Miembros",
            onClick: () => console.log("Home"),
            tipoBoton: "botonMenu",
            icono: <BiUser />,
        },
        
        {
            texto: "Productos",
            onClick: () => console.log("Home"),
            tipoBoton: "botonMenu",
            icono: <BiSearch />,
        },
        {
            texto: "Membresias",
            onClick: () => console.log("Home"),
            tipoBoton: "botonMenu",
            icono: <BiBox />,
        },
        {
            texto: "Anuncios",
            onClick: () => console.log("Home"),
            tipoBoton: "botonMenu",
            icono: <CiBullhorn />,
        },
        {
            texto: "Referencias",
            onClick: () => console.log("Home"),
            tipoBoton: "botonMenu",
            icono: <BiLink />,
        },
        {
            texto: "Ingresar",
            onClick: () => console.log("Home"),
            tipoBoton: "botonMenu",
            icono: <BiTrophy />,
        }
        
    ]

    return (
        <motion.nav
            className="border px-3 py-4 border-black h-full overflow-hidden"
            onMouseEnter={() => setMouseEnterOnMenu(true)}
            onMouseLeave={() => setMouseEnterOnMenu(false)}
            animate={{ width: mouseEnterOnMenu ? 229 : 80 }}
            transition={{ duration: 0.3 }}
        >
            <ul className="flex flex-col h-full justify-between">
                <div className="flex flex-col gap-3">
                    {menu.map((item, index) => (
                        <li key={index}>
                            <Boton
                                className="w-full"
                                texto={item.texto}
                                onClick={item.onClick}
                                tipoBoton={item.tipoBoton}
                                icono={item.icono}
                                showText={mouseEnterOnMenu}
                            />
                        </li>
                    ))}
                </div>
                <Boton
                    className="w-full"
                    texto="Configuración"
                    onClick={() => console.log("Configuración")}
                    tipoBoton="botonMenu"
                    icono={<HiOutlineCog />}
                    showText={mouseEnterOnMenu}
                />
            </ul>
        </motion.nav>
    );
}