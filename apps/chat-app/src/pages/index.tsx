import Head from "next/head";
import React, { useState, Suspense } from "react";
import { uniqueNamesGenerator, starWars } from "unique-names-generator";
import { COLORS } from "../core/constant";
import SetUserDialog from '../core/setUserDialog';
import { User } from "../core/types";

const Chat = React.lazy(() => import('../core/chat'));

const USER: User = {
    room: 'chatterbox',
    name: uniqueNamesGenerator({
        dictionaries: [starWars]
    }),
    color: uniqueNamesGenerator({
        dictionaries: [COLORS]
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
            <Head>
                <title>ChatterBox</title>
                <meta name="viewport" content="initial-scale=1.0, width=device-width" />
            </Head>
            <SetUserDialog user={USER} onSave={OnSaved} />
            {chatComponent}
        </>
    )
}