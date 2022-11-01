import { Dialog, Transition } from '@headlessui/react'
import { Fragment, useState } from 'react'
import ColorCombo from './colorCombo';
import { User } from './types';

export type Props = {
    user: User;
    onSave: (room: string, name: string, color: string) => void;
}

export default function SetUserDialog(props: Props) {
    const { user, onSave } = props;
    const [isOpen, setIsOpen] = useState(true);
    const [room, setRoom] = useState(user.room);
    const [color, setColor] = useState(user.color);
    const [name, setName] = useState(user.name);


    function closeModal() {
        setIsOpen(false)
    }

    function saveHandler() {
        onSave(room, name, color);
        setIsOpen(false)
    }

    function changeNameHandler(e: React.FormEvent<HTMLInputElement>) {
        setName(e.currentTarget.value)
    }

    function changeRoomHandler(e: React.FormEvent<HTMLInputElement>) {
        setRoom(e.currentTarget.value)
    }

    return (
        <>
            <Transition appear show={isOpen} as={Fragment}>
                <Dialog as="div" className="relative" onClose={() => { }}>
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <div className="fixed inset-0 bg-black bg-opacity-25" />
                    </Transition.Child>

                    <div className="fixed inset-0 overflow-y-auto">
                        <div className="flex min-h-full items-center justify-center p-4 text-center">
                            <Transition.Child
                                as={Fragment}
                                enter="ease-out duration-300"
                                enterFrom="opacity-0 scale-95"
                                enterTo="opacity-100 scale-100"
                                leave="ease-in duration-200"
                                leaveFrom="opacity-100 scale-100"
                                leaveTo="opacity-0 scale-95"
                            >
                                <Dialog.Panel className="h-96 w-full max-w-md transform overflow-hidden rounded-2xl text-gray-900 bg-gray-50 rounded-lg border border-gray-300 dark:bg-gray-700 dark:border-gray-600 p-6 text-left align-middle shadow-xl transition-all">
                                    <Dialog.Title
                                        as="h2"
                                        className="text-center text-lg font-lg font-bold leading-6 text-white"
                                    >
                                        ChatterBox
                                    </Dialog.Title>
                                    <div className="mt-4">
                                        <input onChange={changeRoomHandler} className="shadow appearance-none border rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" type="text" placeholder="Enter lobby name" value={room} />
                                    </div>
                                    <div className="mt-4">
                                        <input onChange={changeNameHandler} className="shadow appearance-none border rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" type="text" placeholder="Enter your name" value={name} />
                                    </div>
                                    <div className="mt-4">
                                        <ColorCombo selectedColor={color} onSelectColor={(color) => setColor(color)} />
                                    </div>
                                    <div className="mt-4">
                                        <button
                                            type="button"
                                            className="w-full inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                                            onClick={saveHandler}
                                        >
                                            Start Chatting
                                        </button>
                                    </div>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition>
        </>
    )
}
