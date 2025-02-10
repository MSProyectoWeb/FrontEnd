import Fondo1 from "../assets/imgs/Fondo1.jpg";

export default function FirstLayout({ children }) {
    return (
        <div className="relative h-screen w-full">
            <img
                src={Fondo1}
                alt="firstlayout"
                className="absolute inset-0 h-full w-full object-cover"
            />
            <div className="relative z-10 flex items-center justify-center h-full">
                {children}
            </div>
        </div>
    );
}
