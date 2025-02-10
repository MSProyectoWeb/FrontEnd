
import Boton from './Boton';
   // components/Header.jsx
export default function Header() {
    return (
      <header className="flex justify-between items-center p-4 bg-zinc-800 text-white">
        <h1 className="text-xl font-medium">Inicio</h1>
        <Boton 
          texto="Create Plan"
          onClick={() => console.log('Create Plan clicked')}
          tipoBoton="primario"
        />
      </header>
    );
   }