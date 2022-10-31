export type User = {
    room: string;
    name: string;
    color: string;
}


export type Message = {
    text: string;
    user: User;
    server?: boolean;
}