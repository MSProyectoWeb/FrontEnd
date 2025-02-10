export default function Tarjeta({ children, className }) {
    return (
        <div className={`bg-white border border-black shadow-lg p-4 rounded-lg ${className}`}>
            {children}
        </div>
    );
}
