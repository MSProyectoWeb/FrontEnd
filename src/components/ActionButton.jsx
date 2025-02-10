const ActionButton = ({ type, text, onClick}) => {
    const styles = {
      editar: 'text-blue-500',
      renovar: 'text-green-500',
      delete: 'text-red-500'
    };
  
    return (
      <button 
        className={`${styles[type]} rounded-full border border-current px-4 py-1 hover:bg-gray-50`}
        onClick={onClick}
      >
        {text}
      </button>
    );
  };
  
  export default ActionButton;