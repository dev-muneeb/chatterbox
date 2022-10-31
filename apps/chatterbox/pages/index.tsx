import { useState } from "react";
import { uniqueNamesGenerator, starWars, colors } from "unique-names-generator";
import Chat, { User } from "./chat";
import SetUserDialog from './setUserDialog';


const USER: User = {
    name: uniqueNamesGenerator({
        dictionaries: [starWars]
    }),
    color: uniqueNamesGenerator({
        dictionaries: [colors]
    }),
};

export default function Home() {
    const [user, setUser] = useState<User | null>(null);
    const OnSaved = (name: string, color: string) => setUser({ name, color });

    return (
        <>
            <SetUserDialog name={USER.name} color={USER.color} onSave={OnSaved} />
            {user ? <Chat user={user || USER} /> : null}
        </>
    )
}