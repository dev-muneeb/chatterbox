import { useState } from "react";
import { uniqueNamesGenerator, starWars, colors } from "unique-names-generator";
import Chat, { User } from "./chat";
import SetUserDialog from './setUserDialog';


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

    return (
        <>
            <SetUserDialog room={USER.room} name={USER.name} color={USER.color} onSave={OnSaved} />
            {user ? <Chat user={user || USER} /> : null}
        </>
    )
}