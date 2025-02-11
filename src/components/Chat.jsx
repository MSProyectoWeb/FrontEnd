import { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';
import { useNavigate } from 'react-router-dom';

export default function Chat() {
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);
    const [user, setUser] = useState(null);
    const [activeUsers, setActiveUsers] = useState([]);
    const [connected, setConnected] = useState(false);
    const socketRef = useRef(null);
    const chatRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('access_token');
        const userString = localStorage.getItem('user');

        if (!token || !userString) {
            navigate('/login');
            return;
        }

        // Inicializar socket con reconexión
        socketRef.current = io(`${import.meta.env.VITE_URL_SERVER}`, {
            reconnection: true,
            reconnectionAttempts: 5,
            reconnectionDelay: 1000,
            auth: {
                token: `Bearer ${token}`
            }
        });

        // Configurar eventos del socket
        setupSocketEvents();

        // Cleanup al desmontar
        return () => {
            if (socketRef.current) {
                socketRef.current.disconnect();
            }
        };
    }, [navigate]);

    const setupSocketEvents = () => {
        const socket = socketRef.current;
        const userData = JSON.parse(localStorage.getItem('user'));
        setUser(userData);

        socket.on('connect', () => {
            console.log('Conectado al servidor');
            setConnected(true);
            
            // Unirse al chat con el nombre de usuario
            socket.emit('join', `${userData.nombre} ${userData.apellido}`);
            socket.emit('getActiveUsers');
        });

        socket.on('disconnect', () => {
            console.log('Desconectado del servidor');
            setConnected(false);
            addSystemMessage('Desconectado del servidor. Intentando reconectar...');
        });

        socket.on('newMessage', (message) => {
            addMessage(message);
        });

        socket.on('userJoined', (username) => {
            addSystemMessage(`${username} se ha unido al chat`);
            socket.emit('getActiveUsers');
        });

        socket.on('userLeft', (username) => {
            if (username) {
                addSystemMessage(`${username} ha dejado el chat`);
                socket.emit('getActiveUsers');
            }
        });

        socket.on('getActiveUsers', (users) => {
            setActiveUsers(users);
        });

        // Manejo de errores
        socket.on('connect_error', (error) => {
            console.error('Error de conexión:', error);
            if (error.message === 'Authentication error') {
                localStorage.removeItem('access_token');
                localStorage.removeItem('user');
                navigate('/login');
                return;
            }
            addSystemMessage('Error de conexión con el servidor');
        });

        socket.on('error', (error) => {
            console.error('Error:', error);
            addSystemMessage('Ha ocurrido un error');
        });
    };

    const addMessage = (message) => {
        const time = new Date(message.timestamp).toLocaleTimeString();
        setMessages(prev => [...prev, {
            type: 'message',
            user: message.user,
            content: message.content,
            time: time,
            isOwn: user && `${user.nombre} ${user.apellido}` === message.user
        }]);
    };

    const addSystemMessage = (content) => {
        setMessages(prev => [...prev, {
            type: 'system',
            content,
            time: new Date().toLocaleTimeString()
        }]);
    };

    const handleSendMessage = () => {
        if (!message.trim() || !connected) return;

        socketRef.current.emit('message', {
            content: message.trim()
        });

        setMessage('');
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    // Auto-scroll al último mensaje
    useEffect(() => {
        if (chatRef.current) {
            chatRef.current.scrollTop = chatRef.current.scrollHeight;
        }
    }, [messages]);

    return (
        <div className="flex h-[600px] gap-4">
            {/* Lista de usuarios activos */}
            <div className="w-48 bg-white rounded-lg p-4">
                <h3 className="font-bold mb-3">Usuarios Activos</h3>
                <ul className="space-y-2">
                    {activeUsers.map((username, index) => (
                        <li key={index} className="text-sm">
                            {username}
                        </li>
                    ))}
                </ul>
            </div>

            {/* Área del chat */}
            <div className="flex-1 p-4 rounded-lg bg-white flex flex-col">
                <div ref={chatRef} className="flex-1 overflow-y-auto p-4 space-y-4">
                    {messages.map((msg, index) => (
                        <div key={index} className={`${msg.type === 'system' ? 'text-center text-gray-500 italic' : ''}`}>
                            {msg.type === 'system' ? (
                                <>
                                    <span className="text-sm">{msg.content}</span>
                                    <span className="text-xs ml-2">{msg.time}</span>
                                </>
                            ) : (
                                <div className={`space-y-1 ${msg.isOwn ? 'ml-auto' : ''}`}>
                                    <p className={`font-medium ${msg.isOwn ? 'text-right' : ''}`}>
                                        {msg.user}
                                    </p>
                                    <div className={`p-3 rounded-2xl max-w-[80%] ${
                                        msg.isOwn 
                                            ? 'bg-blue-500 text-white ml-auto' 
                                            : 'bg-gray-100'
                                    }`}>
                                        {msg.content}
                                    </div>
                                    <p className={`text-sm text-gray-500 ${msg.isOwn ? 'text-right' : ''}`}>
                                        {msg.time}
                                    </p>
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                {/* Input para mensajes */}
                <div className="flex gap-2 p-4 border-t">
                    <input
                        type="text"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="Escribe un mensaje..."
                        className="flex-1 p-3 border rounded-lg"
                        disabled={!connected}
                    />
                    <button
                        onClick={handleSendMessage}
                        disabled={!connected}
                        className={`px-6 py-2 rounded-lg transition-colors ${
                            connected 
                                ? 'bg-blue-500 text-white hover:bg-blue-600' 
                                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        }`}
                    >
                        Enviar
                    </button>
                </div>
            </div>
        </div>
    );
}