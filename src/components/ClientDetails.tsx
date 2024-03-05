import { useRef, useState } from "react";
import plusIcon from "/src/assets/plus-svgrepo-com.svg";
import xIcon from "/src/assets/x-thin-svgrepo-com.svg";
import dayjs from "dayjs";

import type { Client, Package } from "../types.ts";
import type { Bundle } from "../types.ts";
import AddBundleModal from "./AddBundleModal.tsx";
import AddPackageModal from "./AddPackageModal.tsx";
interface ClientDetailsProps {
    client: Client;
    bundles: Bundle[];
    allBundles: Bundle[];
    newBundles: Bundle[];
    allPackages: Package[];
}
export default function ClientDetails(props: ClientDetailsProps) {
    const { client, bundles, allBundles, newBundles, allPackages } = props;
    const getBundlesTotal = (type: "old" | "new") => {
        if (type === "old") {
            const bundleTotal = bundles.reduce((acc, curr) => {
                let total =
                    curr.PricePerMonth_INT *
                    ((100 - getDiscount(curr.Discount_INT)) / 100);
                return acc + total;
            }, 0);
            // convert bundle total to float and return
            return bundleTotal.toFixed(2);
        } else {
            const newBundleTotal = newBundles.reduce((acc, curr) => {
                let total =
                    curr.PricePerMonth_INT *
                    ((100 - getDiscount(curr.Discount_INT)) / 100);
                return acc + total;
            }, 0);
            return newBundleTotal.toFixed(2);
        }
    };

    const [tempDiscount, setTempDiscount] = useState<number>(0);
    const getFilteredPackages = () => {
        return allPackages.filter((obj) => {
            if (
                client.ProductNewName.toLowerCase() === obj.PackageName_VC.toLowerCase()
            ) {
                return false;
            }
            return true;
        });
    };
    function formatLabel(label: string) {
        return label
            .replace(/_/g, " ")
            .replace(/INT|DT|Dt|ID|VC|FLT/g, "")
            .replace(/([a-z])([A-Z])/g, "$1 $2")
            .trim();
    }

    // function formatLabel(label: string) {
    //     return label?.replace(/_/g, " ").replace(/INT/g, "").trim();
    // }
    function formatLink(link: string) {
        // if link contains https:// or http:// dont add it otherwise add it
        if (link.includes("https://") || link.includes("http://")) {
            return link;
        } else {
            return `https://${link}`;
        }
    }

    async function handleDeleteClick(id: number) {
        try {
            const response = await fetch(
                `${import.meta.env.PUBLIC_BASE_URL}/clients/${client.Config_ID
                }/bundles/${id}`,
                {
                    method: "DELETE",
                }
            );
            if (response.ok) {
                window.location.reload();
                return;
            } else {
                throw new Error("Could not delete bundle");
            }
        } catch (e) {
            console.log(e.message ?? "Could not delete bundle");
        }
    }

    function getFilteredBundles() {
        const filtered = allBundles.filter((bundle: Bundle) => {
            if (
                newBundles.find((combinedBundle) => {
                    return bundle.BundleType_INT === combinedBundle.BundleType_INT;
                })
            )
                return false;
            return true;
        });
        return filtered;
    }

    function getDiscount(discount: number) {
        if (discount) return discount;
        return 0;
    }

    function getStatus(status: number) {
        if (typeof status === "string") return status;
        switch (status) {
            case 6:
                return "In Build";
            case 7:
                return "Live";
            default:
                return "Undetermined";
        }
    }

    function getCompanyLink() {
        return `${import.meta.env.PUBLIC_COMPANY_LINK}`.replace(
            "config_id",
            client.Config_ID?.toString()
        );
    }

    function getTicketLink() {
        return `${import.meta.env.PUBLIC_TICKET_LINK}`.replace(
            "config_id",
            client.Config_ID?.toString()
        );
    }

    async function onBundleAdd(value: number, discount = 0) {
        try {
            const url = `${import.meta.env.PUBLIC_BASE_URL}/clients/${client.Config_ID
                }/bundles?bundle_id=${value}&discount=${discount}`;
            const requestOptions = {
                method: "POST",
            };
            const response = await fetch(url, requestOptions);
            if (response.ok) {
                console.log("New bundle added");
                window.location.reload();
            } else {
                alert("Error adding new bundle");
                throw new Error("Could not add new bundle");
            }
        } catch (ex) {
            ex.message ?? "Could not add new bundle";
        }
    }
    const onPackageAdd = async (value: number) => {
        try {
            const url = `${import.meta.env.PUBLIC_BASE_URL}/clients/${client.Config_ID
                }/new-package?package_id=${value}`;
            const requestOptions = {
                method: "PUT",
            };
            const response = await fetch(url, requestOptions);
            if (response.ok) {
                console.log("New Package Updated");
                window.location.reload();
            } else {
                alert("Error updating package");
                throw new Error("Could not update package");
            }
        } catch (ex) {
            ex.message ?? "Could not update package";
        }
    };
    const [packageOpen, setPackageOpen] = useState(false);
    const packageCancelButtonRef = useRef(null);

    const [open, setOpen] = useState(false);
    const cancelButtonRef = useRef(null);

    const [monthlySubsValue, setMonthlySubsValue] = useState<number>(
        client.MonthlySubscriptionNew
    );

    const [addMonthlySubs, setAddMonthlySubs] = useState<boolean>(false);
    const [discountIndex, setDiscountIndex] = useState<number | null>(null);

    const setNewMonthlySubscription = async () => {
        const url = import.meta.env.PUBLIC_BASE_URL;
        const requestOptions = {
            method: "POST",
            body: JSON.stringify({
                value: monthlySubsValue,
            }),
        };
        try {
            const response = await fetch(
                `${import.meta.env.PUBLIC_BASE_URL}/clients/${client.Config_ID
                }/new-monthly-subscription`,
                requestOptions
            );
            if (response.ok) {
                console.log("New monthly subs updated");
                window.location.reload();
            } else {
                alert("Error updating monthy subscription");
                throw new Error("Could not update monthly subscription");
            }
        } catch (e) {
            console.log(e?.message ?? "Unknown error occurred");
        }
    };
    const setDiscount = async (value: number, bundle_id: number) => {
        const url = import.meta.env.PUBLIC_BASE_URL;
        const requestOptions = {
            method: "PUT",
        };
        try {
            const response = await fetch(
                `${import.meta.env.PUBLIC_BASE_URL}/clients/${client.Config_ID
                }/bundles/${bundle_id}/discount?discount=${value}`,
                requestOptions
            );
            if (response.ok) {
                console.log("New discount updated");
                window.location.reload();
            } else {
                alert("Error updating discount");
                throw new Error("Could not update discount");
            }
        } catch (e) {
            console.log(e?.message ?? "Unknown error occurred");
        }
    }

    return (
        <>
            <div className="bg-white  rounded-lg border ">
                <div className="xl:h-[40vh] sm:h-[50vh]">
                    <div className="px-4 py-1 sm:px-6">
                        <div className="flex gap-2">
                            <a href={getCompanyLink()} target="_blank">
                                <h3 className="text-lg leading-6 font-medium text-gray-900">
                                    {client.CompanyName_VC}
                                </h3>
                            </a>
                            <a href={getTicketLink()} target="_blank">
                                <h3 className="text-lg leading-6 font-medium text-gray-400">
                                    {"[Ticket]"}
                                </h3>
                            </a>
                        </div>
                        <p className="mt-1 max-w-2xl text-sm text-gray-500">
                            <a href={formatLink(client.VirtualPath_VC)} target="_blank">
                                {client.VirtualPath_VC}
                            </a>
                        </p>
                    </div>
                    <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
                        <dl className="grid grid-cols-3 ">
                            {Object.keys(client).map((key, index) => {
                                if (
                                    key.toLowerCase() === "companyname_vc" ||
                                    key.toLowerCase() === "virtualpath_vc" ||
                                    key.toLowerCase() === "internal_int" ||
                                    key.toLowerCase() === "paymentperiod_int" ||
                                    key.toLowerCase() === "issuspended_int" ||
                                    key.toLowerCase() === "marketing_int" ||
                                    key.toLowerCase() === "monthlysubscription_int" ||
                                    key.toLowerCase() === "monthlysubscriptionnew" ||
                                    key.toLowerCase() === "product" ||
                                    key.toLowerCase() === "productnewname" ||
                                    key.toLowerCase() === "islive_int" ||
                                    key.toLowerCase() === "created_dt" ||
                                    key.toLowerCase() === "vat_rate_flt" ||
                                    key.toLowerCase() === "usedomain_vc"
                                ) {
                                    return;
                                }
                                if (key.toLowerCase() === "renewaldate_dt") {
                                    // only show renewal date if date > today
                                    if (dayjs(client[key]).isBefore(dayjs())) {
                                        return;
                                    }
                                }
                                if (key.toLowerCase() === "paymentmethod_int") {
                                    if (client[key]?.toString() === "1") {
                                        client[key] = "DD";
                                    } else if (client[key]?.toString() === "2") {
                                        client[key] = "BACS";
                                    } else {
                                        client[key] = "N/A";
                                    }
                                }
                                if (
                                    dayjs(client[key]).isValid() &&
                                    key.toLowerCase().endsWith("dt")
                                ) {
                                    client[key] = dayjs(client[key]).format("DD MMM YYYY");
                                }
                                if (key.toLowerCase().startsWith("is")) {
                                    client[key] = client[key] ? "True" : "False";
                                }
                                if (key.toLowerCase() == "clientstatus_int") {
                                    client[key] = getStatus(client[key]);
                                }
                                return (
                                    <div
                                        key={index}
                                        className="py-1 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6"
                                    >
                                        <dt className="text-sm font-medium text-gray-500">
                                            {formatLabel(key)}
                                        </dt>
                                        <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                            {client[key]}
                                        </dd>
                                    </div>
                                );
                            })}
                        </dl>
                    </div>
                    <div className="grid grid-cols-2 border border-b-0 ">
                        <div className="py-4 px-6">Old Package: {client?.Product}</div>
                        <div className="py-4 px-6">
                            <div className=" flex flex-row gap-2">
                                New Package: {client?.ProductNewName}
                                <button
                                    className=" ml-3 px-2 py-1 bg-slate-300 hover:shadow-lg text-xs font-semibold rounded-md"
                                    onClick={() => setPackageOpen(true)}
                                >
                                    Edit
                                </button>
                            </div>
                        </div>
                        <div className="py-4 px-6">
                            Old Package Price: &pound;{client.MonthlySubscription_INT}
                        </div>
                        <div className="py-4 px-6">
                            {addMonthlySubs ? (
                                <div className=" flex flex-row gap-2">
                                    New Package Price:
                                    <input
                                        type="number"
                                        name="monthly_subscription"
                                        id="monthly_subscription"
                                        value={monthlySubsValue}
                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                            setMonthlySubsValue(e.target.value as any)
                                        }
                                        placeholder="0"
                                        className=" bg-slate-200 px-2 w-[10%] text-xs rounded-md focus:outline-none"
                                    />
                                    <button
                                        className="px-2 py-1 bg-slate-300 text-xs font-semibold rounded-md"
                                        onClick={() => {
                                            setAddMonthlySubs((prev) => !prev);
                                            setNewMonthlySubscription();
                                        }}
                                    >
                                        Set
                                    </button>
                                </div>
                            ) : (
                                <div className=" flex flex-row gap-2">
                                    New Package Price:
                                    <span>&pound;{monthlySubsValue}</span>
                                    <button
                                        className=" ml-3 px-2 py-1 bg-slate-300 hover:shadow-lg text-xs font-semibold rounded-md"
                                        onClick={() => setAddMonthlySubs((prev) => !prev)}
                                    >
                                        Edit
                                    </button>
                                </div>
                            )}
                        </div>
                        <div className="py-4 px-6">
                            Old Total: &pound;
                            {client.MonthlySubscription_INT + Number.parseFloat(getBundlesTotal("old"))}
                        </div>
                        <div className="py-4 px-6">
                            New Total: &pound;
                            {client.MonthlySubscriptionNew + Number.parseFloat(getBundlesTotal("new"))}
                        </div>
                    </div>
                </div>

                {/* BUNDLES */}
                <div className="grid grid-cols-2 xl:h-[60vh] sm:h-[50vh]">
                    {/* OLD BUNDLES */}
                    <div className="border border-b-0 border-gray-200 overflow-auto">
                        <div className=" flex justify-between items-center px-4 py-1 sm:px-6 sticky top-0 border-b border-b-gray-200 bg-white h-14">
                            <div className=" flex flex-col">
                                <h3 className="text-lg leading-6 font-medium text-gray-900">
                                    Old Bundles
                                </h3>
                            </div>
                            <p>Total: &pound;{getBundlesTotal("old")}</p>
                        </div>
                        <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
                            <dl className="h-50">
                                <div className="py-1 sm:grid sm:grid-cols-4 sm:gap-4 sm:px-6">
                                    <dt className="text-sm font-medium text-gray-500">Name</dt>
                                    <dt className="text-sm font-medium text-gray-500">Price</dt>
                                    <dt className="text-sm font-medium text-gray-500">
                                        Discount
                                    </dt>
                                    <dt className="text-sm font-medium text-gray-500">Total</dt>
                                </div>
                                {bundles.map((obj, index) => {
                                    return (
                                        <div
                                            key={index}
                                            className="py-1 sm:grid sm:grid-cols-4 sm:gap-4 sm:px-6 hover:bg-gray-200 "
                                        >
                                            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-1 flex items-center gap-1">
                                                {obj.Name}
                                            </dd>
                                            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-1">
                                                {obj.PricePerMonth_INT}
                                            </dd>
                                            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-1">
                                                {getDiscount(obj.Discount_INT)}
                                            </dd>
                                            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-1">
                                                {(obj.PricePerMonth_INT *
                                                    ((100 - getDiscount(obj.Discount_INT)) / 100)).toFixed(2)}
                                            </dd>
                                        </div>
                                    );
                                })}
                            </dl>
                        </div>
                    </div>
                    {/* ADD NEW BUNDLES */}
                    <div className="border border-b-0 border-gray-200 border-l-0 overflow-auto">
                        <div className=" flex justify-between items-center px-4 py-1 sm:px-6 sticky top-0 border-b border-b-gray-200 bg-white h-14">
                            <div className=" flex items-center gap-2">
                                <h3 className="text-lg leading-6 font-medium text-gray-900">
                                    New Bundles
                                </h3>
                                <button
                                    className="bg-slate-300 text-xs font-semibold rounded-md"
                                    onClick={() => setOpen(true)}
                                >
                                    <img
                                        src={plusIcon.src}
                                        alt="add"
                                        className="w-8 hover:shadow-lg h-8"
                                    />
                                </button>
                            </div>
                            <div className="flex items-center gap-2">
                                <p>Total: &pound;{getBundlesTotal("new")}</p>
                            </div>
                        </div>
                        <div className="border-t border-gray-200 px-4 py-1 sm:p-0">
                            <dl className="h-50">
                                <div className="py-1 sm:grid sm:grid-cols-4 sm:gap-4 sm:px-6">
                                    <dt className="text-sm font-medium text-gray-500">Name</dt>
                                    <dt className="text-sm font-medium text-gray-500">Price</dt>
                                    <dt className="text-sm font-medium text-gray-500">
                                        Discount
                                    </dt>
                                    <dt className="text-sm font-medium text-gray-500">Total</dt>
                                </div>
                                {newBundles.map((obj, index) => {
                                    return (
                                        <div
                                            key={index}
                                            className="group py-1 sm:grid sm:grid-cols-4 sm:gap-4 sm:px-6 hover:bg-gray-200 hover:cursor-pointer"
                                        >
                                            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-1 flex gap-1 items-center ">
                                                <button
                                                    onClick={() => handleDeleteClick(obj.bundle_id)}
                                                    className="invisible group-hover:visible group hover:shadow-gray-500 rounded shadow-md px-1 hover:cursor-pointer bg-slate-300"
                                                >
                                                    <img
                                                        src={xIcon.src}
                                                        alt="add"
                                                        className="w-4 hover:shadow-lg h-6"
                                                    />
                                                </button>
                                                {obj.Name}
                                            </dd>
                                            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-1">
                                                {obj.PricePerMonth_INT}
                                            </dd>
                                            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-1">
                                                <div className="">
                                                    {discountIndex === index ? (
                                                        <div className=" flex flex-row gap-2">
                                                            <input
                                                                type="number"
                                                                value={tempDiscount}
                                                                min="0"
                                                                max="100"
                                                                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                                                    setTempDiscount(e.target.value as any)
                                                                }
                                                                placeholder="0"
                                                                className=" bg-slate-200 px-2 w-[40%] text-xs rounded-md focus:outline-none"
                                                            />
                                                            <button
                                                                className="px-2 py-1 bg-slate-300 text-xs font-semibold rounded-md"
                                                                onClick={() => {
                                                                    setDiscount(tempDiscount, obj.bundle_id)
                                                                }}
                                                            >
                                                                Set
                                                            </button>
                                                        </div>
                                                    ) : (
                                                        <div className=" flex flex-row gap-2">
                                                            <span className="w-[10%]">{obj.Discount_INT}</span>
                                                            <button
                                                                className=" ml-3 px-2 py-1 bg-slate-300 hover:shadow-lg text-xs font-semibold rounded-md"
                                                                onClick={() => {
                                                                    setDiscountIndex(index)
                                                                    setTempDiscount(obj.Discount_INT)
                                                                }}
                                                            >
                                                                Edit
                                                            </button>
                                                        </div>
                                                    )}
                                                </div>
                                            </dd>
                                            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-1">
                                                {(obj.PricePerMonth_INT *
                                                    ((100 - getDiscount(obj.Discount_INT)) / 100)).toFixed(2)}
                                            </dd>
                                        </div>
                                    );
                                })}
                            </dl>
                        </div>
                    </div>
                </div>
            </div>
            <AddBundleModal
                setOpen={setOpen}
                open={open}
                cancelButtonRef={cancelButtonRef}
                allBundles={getFilteredBundles()}
                onBundleAdd={onBundleAdd}
            />
            <AddPackageModal
                onPackageAdd={onPackageAdd}
                setOpen={setPackageOpen}
                open={packageOpen}
                allPackages={getFilteredPackages()}
                cancelButtonRef={packageCancelButtonRef}
            />
        </>
    );
}
