import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function Boton({ texto = null, onClick, tipoBoton, icono = null, className = "", showText = true }) {

    const [hover, setHover] = useState(false);

    let clases
    let roundedClass
    let backgroundColor
    let border;

    const establecerClases = () => {
        clases = `${className} `;
        roundedClass = "rounded-xl";

        switch (tipoBoton) {
            case "primario":
                clases += "px-[24px] py-[16px] bg-acento flex-row-reverse text-fondo shadow-xl";
                break;

            case "secundario":
                clases += "bg-blue-500";
                break;

            case "botonMenu":
                roundedClass = "rounded-full";
                border = hover ? "border-2 border-fondo" : "border-2 border-transparent";
                backgroundColor = hover ? " bg-fondo" : " bg-transparent";
                clases += "px-[16px] py-[8px] font-bold flex-row-reverse text-principal";
                break;

            case "botonMenuSelected":
                roundedClass = "rounded-full";
                backgroundColor = "bg-acento";
                clases += "px-[16px] py-[8px] font-bold bg-acento flex-row-reverse text-fondo";
                break;

            default:
                // Puedes definir un estilo por defecto o dejarlo vacío
                break;
        }
    }

    const textVariants = {
        visible: {
            width: "auto",
            opacity: 1,
            marginLeft: "0.5rem",
            transition: { duration: 0.3 },
        },
        hidden: {
            width: 0,
            opacity: 0,
            marginLeft: 0,
            transition: { duration: 0.3 },

        },
    };

    establecerClases();



    return (
        <button
            className={`flex items-center gap-3 justify-between ${roundedClass} ${backgroundColor} ${clases}`}
            onClick={onClick}
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
        >
            <span className="text-2xl">
                {icono}
            </span>
            <motion.span
                className="whitespace-nowrap overflow-hidden"
                variants={textVariants}
                animate={showText ? "visible" : "hidden"}
            >
                {texto}
            </motion.span>
        </button>
    );
}
