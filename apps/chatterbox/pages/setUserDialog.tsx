import { Dialog, Transition } from '@headlessui/react'
import { Fragment, useState } from 'react'
import ColorCombo from './colorCombo';

export type Props = {
    name: string;
    color: string;
    onSave: (name: string, color: string) => void;
}

export default function SetUserDialog(props: Props) {
    const { onSave } = props;
    let [isOpen, setIsOpen] = useState(true);
    let [color, setColor] = useState(props.color);
    let [name, setName] = useState(props.name);

    function closeModal() {
        setIsOpen(false)
    }

    function saveHandler() {
        onSave(name, color);
        setIsOpen(false)
    }

    function changeHandler(e: React.FormEvent<HTMLInputElement>) {
        setName(e.target?.value)
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
                                        as="h3"
                                        className="text-lg font-medium leading-6 text-white"
                                    >
                                        Please enter your name and select color
                                    </Dialog.Title>
                                    <div className="mt-4">
                                        <input onChange={changeHandler} className="shadow appearance-none border rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" type="text" placeholder="Enter Name" value={name} />
                                    </div>
                                    <div className="mt-4">
                                        <ColorCombo selectedColor={color} onSelectColor={(color) => setColor(color)} />
                                    </div>
                                    <div className="mt-4">
                                        <button
                                            type="button"
                                            className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                                            onClick={saveHandler}
                                        >
                                            Save
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
