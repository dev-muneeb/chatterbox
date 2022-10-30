import { useEffect, useRef, useState } from "react";
import { io, Socket } from 'socket.io-client';
import { uniqueNamesGenerator, starWars, colors } from 'unique-names-generator';

export type Message = {
    text: string;
    userId: string;
    color: string;
}

let socket: Socket;

const USER = {
    userId: uniqueNamesGenerator({
        dictionaries: [starWars]
    }),
    color: uniqueNamesGenerator({
        dictionaries: [colors]
    }),
};

export default function Home() {
    const [messages, setMessages] = useState<Message[]>([]);
    const [message, setMessage] = useState<Message>();
    const viewRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        socket = io("http://localhost:5500", {
            transports: ["websocket"],
            auth: USER
        });
        socket.on('chat-message', (message: Message) => {
            setMessages((prev) => [...prev, message]);
        });

        return () =>  {
            socket.disconnect()
        };
    }, []);

    useEffect(() =>{
        viewRef?.current?.scrollTo({
            top: viewRef?.current?.scrollHeight,
            left: 0,
            behavior: 'smooth'
        });

    }, [messages])

    const handleChange = (e: React.FormEvent<HTMLInputElement>): void => {
        setMessage({ text: e.currentTarget.value, ...USER });
    }

    const handleSend = (e: React.SyntheticEvent) => {
        e.preventDefault();
        if(socket.connected && message?.text) {
            socket.emit('chat-message', message);
            setMessage({ ...USER, text: '' });
        }
    }

    return (
    <div className="mt-5 mr-5 ml-5 mb-5">
        <div className="text-gray-900 bg-gray-50 rounded-lg border border-gray-300 dark:bg-gray-700 dark:border-gray-600">
            <div ref={viewRef} className="overflow-auto" style={{ height: '80vh' }}>
                <ul className="divide-y-2 dark:divide-gray-100">
                    {messages.map((item, index) => (
                    <li key={index} className="p-3 dark:text-white">
                        <span className="`text-md font-bold mr-2" style={{ color: item.color }}>{item.userId}</span>
                        {item.text}
                    </li>
                    ))}
                </ul>
            </div>
        </div>
        <form onSubmit={handleSend} className="mt-10">   
           <div className="relative">
                <input 
                    id="message"
                    className="block p-4 pl-10 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                    type="text"
                    onChange={handleChange}
                    value={message?.text}
                    placeholder="Type your message" 
                />
                <button type="submit" className="text-white absolute right-2.5 bottom-2.5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Send</button>
            </div>
        </form>
    </div>
    )
  }
  