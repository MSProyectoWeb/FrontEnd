const StatusBadge = ({ status }) => {
    const colors = {
      'Actived': 'bg-[#C3F6D4]',
      'Suspended': 'bg-[#FFF1C0]',
      'Expired': 'bg-[#FECACA]'
    };
  
    return (
      <span className={`inline-block w-40 text-center px-3 py-1 rounded-full ${colors[status] || 'bg-gray-200'}`}>
        {status}
      </span>
    );
  };
  
  export default StatusBadge;