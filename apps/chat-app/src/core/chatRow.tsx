import { useEffect, useRef } from "react";
import { Message } from "./types";

export type Props =  { data: Message[], index: number, setSize: (index: number, height: number | undefined) => void, windowWidth: number }

export const ChatRow = ({ data, index, setSize, windowWidth }: Props) => {
    const rowRef = useRef<HTMLDivElement>(null);
    const item = data[index];

    useEffect(() => {
        setSize(index, rowRef?.current?.getBoundingClientRect().height);
    }, [setSize, index, windowWidth]);

    return (
        <div ref={rowRef} key={index} className="p-3 dark:text-white">
            <span className="`text-md font-bold mr-2" style={{ color: item.user.color }}>{item.user.name}</span>
            <span className={`${item.server ? 'italic' : ''}`}>{item.text}</span>
        </div>
    );
};