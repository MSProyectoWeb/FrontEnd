import { useState, useEffect } from 'react';
import StatusBadge from './StatusBadge';
import ActionButton from './ActionButton';
import { useNavigate } from 'react-router-dom';

export default function MembershipTable() {
  const [members, setMembers] = useState([]);
  const [selectedType, setSelectedType] = useState('SEMANAL');
  const [isRenewing, setIsRenewing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedMemberId, setSelectedMemberId] = useState(null);
  const [selectedSuscription, setSelectedSuscription] = useState(null);
  const [editingMember, setEditingMember] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_URL_SERVER}/users`);
      if (!response.ok) throw new Error('Network response was not ok');
      const data = await response.json();
      setMembers(data);
    } catch (error) {
      console.error('Error fetching members:', error);
    }
  };

  const handleEdit = (member) => {
    setEditingMember(member);
    setIsEditing(true);
  };

  const handleSaveEdit = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_URL_SERVER}/users/${editingMember.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nombre: editingMember.nombre,
          apellido: editingMember.apellido,
          fechaNac: editingMember.fechaNac,
          direccion: editingMember.direccion,
        })
      });

      if (!response.ok) throw new Error('Error al actualizar');

      await fetchMembers();
      setIsEditing(false);
      setEditingMember(null);
    } catch (error) {
      console.error('Error updating member:', error);
    }
  };

  const handleRenewal = (userId, suscripcionId) => {
    if(suscripcionId === null) return;
    setSelectedSuscription(suscripcionId);
    setSelectedMemberId(userId);
    setIsRenewing(true);
  };

  const confirmRenewal = async () => {
    if (!selectedMemberId) return;

    try {
      const response = await fetch(`${import.meta.env.VITE_URL_SERVER}/subscriptions/${selectedSuscription}/renovar?tipoSuscripcion=${selectedType}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) throw new Error('Error al renovar');

      await fetchMembers();
      setIsRenewing(false);
      setSelectedMemberId(null);
    } catch (error) {
      console.error('Error renovando:', error);
    }
  };

  const handleDelete = (userId, suscripcionId) => {
    if(suscripcionId === null) return;
    setSelectedMemberId(userId);
    setSelectedSuscription(suscripcionId);
    setIsDeleting(true);
  };

  const confirmDelete = async () => {
    if (!selectedMemberId) return;

    try {
      const response = await fetch(`${import.meta.env.VITE_URL_SERVER}/subscriptions/${selectedSuscription}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Error al eliminar miembro');

      await fetchMembers();
      setIsDeleting(false);
      setSelectedMemberId(null);
    } catch (error) {
      console.error('Error eliminando:', error);
    }
  };

  const getStatus = (suscripcion) => {
    if (!suscripcion) return 'Expired';

    const fechaFin = new Date(suscripcion.fechaFin);
    const today = new Date();

    if (fechaFin < today) return 'Expired';
    return 'Active';
  };

  return (
    <div className="w-full min-h-[600px] p-8 mx-2 space-y-6 border-2 border-black rounded-2xl">
      {/* Modal de edición */}
      {isEditing && editingMember && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h3 className="text-lg font-semibold mb-4">Editar Miembro</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nombre
                </label>
                <input
                  type="text"
                  value={editingMember.nombre}
                  onChange={(e) => setEditingMember({
                    ...editingMember,
                    nombre: e.target.value
                  })}
                  className="w-full p-2 border rounded"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Apellido
                </label>
                <input
                  type="text"
                  value={editingMember.apellido}
                  onChange={(e) => setEditingMember({
                    ...editingMember,
                    apellido: e.target.value
                  })}
                  className="w-full p-2 border rounded"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Fecha de Nacimiento
                </label>
                <input
                  type="date"
                  value={editingMember.fechaNac.split('T')[0]}
                  onChange={(e) => setEditingMember({
                    ...editingMember,
                    fechaNac: e.target.value
                  })}
                  className="w-full p-2 border rounded"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Dirección
                </label>
                <input
                  type="text"
                  value={editingMember.direccion}
                  onChange={(e) => setEditingMember({
                    ...editingMember,
                    direccion: e.target.value
                  })}
                  className="w-full p-2 border rounded"
                />
              </div>
            </div>
            
            <div className="flex justify-end gap-2 mt-6">
              <button
                onClick={() => {
                  setIsEditing(false);
                  setEditingMember(null);
                }}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancelar
              </button>
              <button
                onClick={handleSaveEdit}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Guardar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de renovación */}
      {isRenewing && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-lg font-semibold mb-4">Renovar Membresía</h3>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="w-full p-2 border rounded mb-4"
            >
              <option value="SEMANAL">Semanal</option>
              <option value="MENSUAL">Mensual</option>
              <option value="TRIMESTRAL">Trimestral</option>
              <option value="ANUAL">Anual</option>
            </select>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setIsRenewing(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancelar
              </button>
              <button
                onClick={confirmRenewal}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de confirmación de eliminación */}
      {isDeleting && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-lg font-semibold mb-4">Confirmar Eliminación</h3>
            <p>¿Estás seguro de que deseas eliminar este miembro?</p>
            <div className="flex justify-end gap-2 mt-4">
              <button
                onClick={() => setIsDeleting(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancelar
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tabla de miembros */}
      <div className="bg-white rounded-lg overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="text-left py-6 px-8 whitespace-nowrap">Nombre</th>
              <th className="text-left py-6 px-8 whitespace-nowrap">Estado de Membresía</th>
              <th className="text-left py-6 px-8 whitespace-nowrap">Fecha de Ingreso</th>
              <th className="text-left py-6 px-8 whitespace-nowrap">Tipo de Suscripción</th>
              <th className="text-left py-6 px-8 whitespace-nowrap">Fecha Fin</th>
              <th className="text-left py-6 px-8 whitespace-nowrap">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {members.map((member) => (
              <tr key={member.id} className="border-b last:border-b-0 hover:bg-gray-50">
                <td className="py-6 px-8 whitespace-nowrap">
                  {member.nombre} {member.apellido}
                </td>
                <td className="py-6 px-8 whitespace-nowrap">
                  <StatusBadge status={getStatus(member.suscripcion)} />
                </td>
                <td className="py-6 px-8 whitespace-nowrap">
                  {member.suscripcion ? new Date(member.suscripcion.fechaCreacion).toLocaleDateString() : 'N/A'}
                </td>
                <td className="py-6 px-8 whitespace-nowrap">
                  {member.suscripcion ? member.suscripcion.tipo : 'Sin suscripción'}
                </td>
                <td className="py-6 px-8 whitespace-nowrap">
                  {member.suscripcion ? new Date(member.suscripcion.fechaFin).toLocaleDateString() : 'N/A'}
                </td>
                <td className="py-6 px-8 whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    <ActionButton 
                      type="editar" 
                      text="Editar" 
                      onClick={() => handleEdit(member)}
                    />
                    <ActionButton
                      type="renovar"
                      text="Renovar"
                      onClick={() => handleRenewal(member.id, member.suscripcion?.id ?? null)}
                    />
                    <ActionButton
                      type="delete"
                      text="Eliminar"
                      onClick={() => handleDelete(member.id, member.suscripcion?.id ?? null)}
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}