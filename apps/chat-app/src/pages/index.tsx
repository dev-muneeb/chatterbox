import React, { useState, Suspense } from "react";
import { uniqueNamesGenerator, starWars, colors } from "unique-names-generator";
import SetUserDialog from '../core/setUserDialog';
import { User } from "../core/types";

const Chat = React.lazy(() => import('../core/chat'));

const USER: User = {
    room: 'chatterbox',
    name: uniqueNamesGenerator({
        dictionaries: [starWars]
    }),
    color: uniqueNamesGenerator({
        dictionaries: [colors]
    }),
};

export default function Home() {
    const [user, setUser] = useState<User | null>(null);
    const OnSaved = (room: string, name: string, color: string) => setUser({ room, name, color });

    let chatComponent = null;
    if (user) {
        chatComponent =
        (<Suspense fallback={<div>Loading...</div>}>
            <Chat user={user} />
        </Suspense>);
    }

    return (
        <>
            <SetUserDialog user={USER} onSave={OnSaved} />
            {chatComponent}
        </>
    )
}