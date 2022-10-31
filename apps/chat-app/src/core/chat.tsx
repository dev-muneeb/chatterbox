import { useEffect, useRef, useState, useCallback } from "react";
import { io, Socket } from 'socket.io-client';
import { VariableSizeList as List, } from "react-window";
import AutoSizer from "react-virtualized-auto-sizer";
import { Message, User } from "./types";
import { CHAT_SERVER_URL } from "./constant";
import { useWindowResize } from './useWindowResize';
import { ChatRow } from './chatRow';

export type Props = {
    user: User
}

let socket: Socket;

export default function Chat(props: Props) {
    const { user } = props;
    const [messages, setMessages] = useState<Message[]>([]);
    const [message, setMessage] = useState<Message>();
    const viewRef = useRef<List<any>>(null);
    const sizeMap = useRef<any>({});
    const setSize = useCallback((index: number, size: number | undefined) => {
        sizeMap.current = { ...sizeMap.current, [index]: size };
        viewRef?.current?.resetAfterIndex(index);
    }, []);
    const getSize = (index: number) => sizeMap?.current[index] || 50;
    const [windowWidth] = useWindowResize();

    useEffect(() => {
        socket = io(CHAT_SERVER_URL, {
            transports: ["websocket", "polling"],
            auth: user
        });
        socket.on('chat-message', (message: Message) => {
            setMessages((prev) => [...prev, message]);
        });

        return () => {
            socket.disconnect()
        };
    }, [user]);

    useEffect(() => {
        viewRef?.current?.scrollToItem(messages.length - 1);
    }, [messages])

    const handleChange = (e: React.FormEvent<HTMLInputElement>): void => {
        setMessage({ text: e.currentTarget.value, user });
    }

    const handleSend = (e: React.SyntheticEvent) => {
        e.preventDefault();
        if (socket.connected && message?.text) {
            socket.emit('chat-message', message);
            setMessage({ user, text: '' });
        }
    }

    return (
        <div className="mt-5 mr-5 ml-5 mb-5" style={{ height: '80vh' }}>
            <AutoSizer>
                {({ height, width }) => (
                    <List
                        className="text-gray-900 bg-gray-50 rounded-lg border border-gray-300 dark:bg-gray-700 dark:border-gray-600"
                        height={height}
                        itemCount={messages.length}
                        itemSize={getSize}
                        width={width}
                        ref={viewRef}
                    >
                        {({ index, style }) => (
                            <div key={index} style={style}>
                                <ChatRow
                                    data={messages}
                                    index={index}
                                    setSize={setSize}
                                    windowWidth={windowWidth}
                                />
                            </div>
                        )}
                    </List>
                )}
            </AutoSizer>
            <form onSubmit={handleSend} className="mt-10 fixed bottom-5 left-5 right-5">
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
