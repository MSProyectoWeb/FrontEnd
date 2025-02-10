import { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';

export default function Chat() {
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);
    const [user, setUser] = useState(null);
    const [activeUsers, setActiveUsers] = useState([]);
    const socketRef = useRef();
    const chatRef = useRef();

    useEffect(() => {
        const userString = localStorage.getItem('user');
        if (userString) {
            const userData = JSON.parse(userString);
            setUser(userData);
            initializeSocket(userData);
        }

        return () => {
            if (socketRef.current) {
                socketRef.current.disconnect();
            }
        };
    }, []);

    const initializeSocket = (userData) => {
        socketRef.current = io(`${import.meta.env.VITE_URL_SERVER}`, {
            transports: ['websocket']
        });

        // Unirse al chat con ID único
        socketRef.current.emit('join', {
            userId: userData.id,
            username: `${userData.nombre} ${userData.apellido}`
        });

        // Escuchar nuevos mensajes con verificación de duplicados
        socketRef.current.on('newMessage', (message) => {
            setMessages(prev => {
                // Verificar si el mensaje ya existe
                const isDuplicate = prev.some(msg => 
                    msg.timestamp === message.timestamp && 
                    msg.userId === message.userId && 
                    msg.content === message.content
                );
                if (isDuplicate) return prev;
                
                return [...prev, {
                    userId: message.userId,
                    name: message.user,
                    message: message.content,
                    timestamp: message.timestamp,
                    time: new Date(message.timestamp).toLocaleTimeString(),
                }];
            });
        });

        // Escuchar eventos de usuario con verificación
        socketRef.current.on('userJoined', ({ userId, username }) => {
            setMessages(prev => {
                const isDuplicate = prev.some(msg => 
                    msg.type === 'system' && 
                    msg.userId === userId && 
                    msg.message.includes(username)
                );
                if (isDuplicate) return prev;

                return [...prev, {
                    type: 'system',
                    userId,
                    message: `${username} se ha unido al chat`,
                    timestamp: Date.now(),
                    time: new Date().toLocaleTimeString(),
                }];
            });
        });

        socketRef.current.on('userLeft', ({ userId, username }) => {
            setMessages(prev => {
                const isDuplicate = prev.some(msg => 
                    msg.type === 'system' && 
                    msg.userId === userId && 
                    msg.message.includes(username)
                );
                if (isDuplicate) return prev;

                return [...prev, {
                    type: 'system',
                    userId,
                    message: `${username} ha dejado el chat`,
                    timestamp: Date.now(),
                    time: new Date().toLocaleTimeString(),
                }];
            });
        });

        // Actualizar lista de usuarios activos
        socketRef.current.on('getActiveUsers', (users) => {
            setActiveUsers(users.filter((userItem, index, self) => 
                self.findIndex(u => u.userId === userItem.userId) === index
            ));
        });
    };

    // Auto-scroll al último mensaje
    useEffect(() => {
        if (chatRef.current) {
            chatRef.current.scrollTop = chatRef.current.scrollHeight;
        }
    }, [messages]);

    const handleSendMessage = () => {
        if (!message.trim() || !user) return;

        const messageData = {
            userId: user.id,
            user: `${user.nombre} ${user.apellido}`,
            content: message.trim(),
            timestamp: Date.now(),
        };

        socketRef.current.emit('message', messageData);
        setMessage('');
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    return (
        <div className="flex h-[600px] gap-4">
            <div className="w-48 bg-white rounded-lg p-4">
                <h3 className="font-bold mb-3">Usuarios Activos</h3>
                <ul className="space-y-2">
                    {activeUsers.map((user) => (
                        <li key={user.userId} className="text-sm">
                            {user.username}
                        </li>
                    ))}
                </ul>
            </div>

            <div className="flex-1 p-4 rounded-lg bg-white flex flex-col">
                <div ref={chatRef} className="flex-1 overflow-y-auto p-4 space-y-4">
                    {messages.map((msg, index) => {
                        if (msg.type === 'system') {
                            return (
                                <div key={`${msg.userId}-${msg.timestamp}`} 
                                     className="text-center text-gray-500 text-sm italic">
                                    {msg.message}
                                    <span className="text-xs ml-2">{msg.time}</span>
                                </div>
                            );
                        }

                        const isOwnMessage = user && msg.userId === user.id;

                        return (
                            <div key={`${msg.userId}-${msg.timestamp}`} 
                                 className={`space-y-1 ${isOwnMessage ? 'ml-auto' : ''}`}>
                                <p className={`font-medium ${isOwnMessage ? 'text-right' : ''}`}>
                                    {msg.name}
                                </p>
                                <div className={`p-3 rounded-2xl max-w-[80%] ${
                                    isOwnMessage 
                                        ? 'bg-blue-500 text-white ml-auto' 
                                        : 'bg-gray-100'
                                }`}>
                                    {msg.message}
                                </div>
                                <p className={`text-sm text-gray-500 ${isOwnMessage ? 'text-right' : ''}`}>
                                    {msg.time}
                                </p>
                            </div>
                        );
                    })}
                </div>

                <div className="flex gap-2 p-4 border-t">
                    <input
                        type="text"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="Escribe un mensaje..."
                        className="flex-1 p-3 border rounded-lg"
                    />
                    <button
                        onClick={handleSendMessage}
                        className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors"
                    >
                        Enviar
                    </button>
                </div>
            </div>
        </div>
    );
}