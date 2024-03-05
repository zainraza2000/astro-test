import React, { Fragment, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import type { Bundle } from "../types";

function classNames(...classes) {
    return classes.filter(Boolean).join(" ");
}
interface ModalProps {
    open: boolean;
    setOpen: (value: boolean) => void;
    onBundleAdd: (value: number, discount: number) => void;
    cancelButtonRef: React.MutableRefObject<any>;
    allBundles: Bundle[];
}
const AddBundleModal = (props: ModalProps) => {
    const { open, setOpen, cancelButtonRef, allBundles, onBundleAdd } = props;
    const [selectedBundle, setSelectedBundle] = useState<number>();
    const [discount, setDiscount] = useState<number>(0);
    const handleBundleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedBundle(parseInt(event.target.value));
    };

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        onBundleAdd(selectedBundle, discount);
    };

    return (
        <Transition.Root show={open} as={Fragment}>
            <Dialog
                as="div"
                className="relative z-[5000000]"
                initialFocus={cancelButtonRef}
                onClose={setOpen}
            >
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
                </Transition.Child>

                <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
                    <div className="flex min-h-full items-center justify-center p-4 text-center sm:items-center sm:p-0">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                            enterTo="opacity-100 translate-y-0 sm:scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                            leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                        >
                            <Dialog.Panel
                                className={`relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all px-10 py-16 sm:my-8 sm:w-full sm:max-w-lg`}
                            >
                                <form onSubmit={handleSubmit}>
                                    <select
                                        name="newbundle"
                                        id="newbundle"
                                        className="w-full flex justify-between items-center font-medium text-[15px] bg-slate-200 px-3 py-[10px] rounded-lg ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:outline-none "
                                        value={selectedBundle} // Set the value of the select to the state
                                        onChange={handleBundleChange}
                                    >
                                        <option disabled selected value="" className=" hidden">
                                            Bundles
                                        </option>
                                        {allBundles.map((item, i) => (
                                            <option key={i} value={item.id}>
                                                {item.Name}
                                            </option>
                                        ))}
                                    </select>
                                    <div className="flex flex-row gap-2 mt-2  items-center">
                                        <span>
                                            Discount:
                                        </span>
                                        <input
                                            type="number"
                                            value={discount}
                                            min="0"
                                            max="100"
                                            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                                setDiscount(parseInt(e.target.value))
                                            }
                                            placeholder="0-100"
                                            className=" bg-slate-200 px-2 py-2 w-[15%] text-sm rounded-md focus:outline-none"
                                        />
                                        <span>%</span>
                                    </div>
                                    <button
                                        type="submit"
                                        className=" text-center w-full px-4 py-[10px] text-sm font-semibold rounded-md mt-6 text-white bg-blue-600 disabled:bg-gray-300 disabled:text-black"
                                        disabled={!selectedBundle}
                                    >
                                        Confirm
                                    </button>
                                </form>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition.Root>
    );
};

export default AddBundleModal;
