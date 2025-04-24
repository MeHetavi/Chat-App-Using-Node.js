'use client';
import { useState, useEffect, useRef } from 'react';
import { Socket, io } from 'socket.io-client';

type Message = {
    from: string;
    text: string;
}

export default function ChatRoom() {
    const [username, setUsername] = useState('');
    const [room, setRoom] = useState("");
    const [messages, setMessages] = useState<Message[]>([]);
    const [text, setText] = useState('');

    const socketRef = useRef<Socket | null>(null);

    const handleJoinRoom = () => {
        const socket = io('http://localhost:8080');
        socketRef.current = socket;
        const u = prompt('Enter your username:') || 'Anonymous'
        const r = prompt('Enter room id: ') || "1";
        setUsername(u);
        setRoom(r);
        socket.emit('join-room', { username: u, room: r });

    }

    useEffect(() => {
        if (socketRef.current) {
            socketRef.current.on('message', (msg: Message) => {
                console.log('Here')
                setMessages(prev => [...prev, msg]);
            });

            // Cleanup function to remove the listener
            return () => {
                socketRef.current?.off('message');
            };
        }
    }, [socketRef.current]); // Only re-run when socket changes

    const sendMessag = () => {
        socketRef?.current?.emit('chat', text);
        setText("")
    }

    const handleLeave = () => {
        socketRef.current?.emit('disconnect-user', username);
        socketRef.current?.disconnect();
        socketRef.current = null
    }

    return (
        <div className='flex justify-center text-center align-center mt-[10px]'>
            {
                socketRef.current ?
                    <div>
                        {room}
                        <div>
                            <ul id='chat' className='mt-5 border border-black p-3 w-[90vw] '>
                                {messages.map((message, index) => (
                                    <li key={index}>{message.from}: {message.text}</li>
                                ))}
                            </ul>
                        </div>
                        <input type="text" value={text} onChange={(e) => setText(e.target.value)}
                            className='border border-black p-2'
                            placeholder='Type message...' />
                        <button onClick={sendMessag} className='cursor-pointer bg-blue-950 rounded p-2 text-amber-50'>Send</button>
                        <button onClick={handleLeave} className='cursor-pointer bg-blue-950 rounded p-2 text-amber-50'>Leave Room</button>

                    </div>
                    :
                    <>
                        <button onClick={handleJoinRoom} className='cursor-pointer bg-blue-950 rounded p-2 text-amber-50'>Join Room</button>
                    </>

            }
        </div>
    )
}
