import { useState } from "react";

interface ModelProps {
    isActive: string,
    setIsActive: React.Dispatch<React.SetStateAction<string>>;
}



export const AdminMobileSidebar: React.FC<ModelProps> = ({ setIsActive, isActive }) => {
    const [isOpen, setIsOpen] = useState(false);
    console.log('hello')

    return (
        <div className="relative sm:hidden flex">
            <button
                onClick={() => setIsOpen(true)}
                className="p-4 text-gray-700 focus:outline-none"
            >
                <svg
                    className="w-8 h-8"
                    fill="none"
                    stroke="black"
                    strokeWidth={2}
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M4 6h16M4 12h16M4 18h16"
                    />
                </svg>
            </button>

            {isOpen && (
                <div
                    className="fixed inset-0 bg-black opacity-35 z-30"
                    onClick={() => setIsOpen(false)}
                />
            )}

            <div
                className={`fixed top-0 left-0 h-full w-1/2 bg-white shadow-lg z-40 transform transition-transform duration-300 ${isOpen ? "translate-x-0" : "-translate-x-full"
                    }`}
            >
                <div className=" space-y-4 bg-gray-800 h-full flex flex-col">
                    <button
                        onClick={() => setIsOpen(false)}
                        className="text-white hover:text-gray-700 absolute top-4 right-4"
                    >
                        ✕
                    </button>

                    <div className="flex flex-row gap-2 p-4 items-center">
                        <img className="sm:w-7 sm:h-7 w-5 h-5" src="https://img.icons8.com/?size=100&id=49454&format=png&color=000000"></img>
                        <h1 className="font-extrabold sm:text-xl text-sm text-[#6975DD] ">FixMyCampus</h1>
                    </div>
                    <div className="p-2">
                        <h1 className="bg-gray-500 rounded-full w-full font-bold px-3 py-2 text-gray-200">Admin Panel</h1>
                    </div>
                    <div className="border-b border-gray-300 p-2"></div>
                    <div className="flex flex-col gap-3 mt-4">
                        <h1 onClick={() => { setIsActive('dashboard') }}
                            className={`${isActive === 'dashboard' ? 'border-l-2 border-blue-500 bg-gray-500 opacity-90 text-white' : 'text-white'} p-3 text-white`}>Dashboard</h1>
                        <h1 onClick={() => { setIsActive('report') }}
                            className={`${isActive === 'report' ? 'border-l-2 border-blue-500 bg-gray-500 opacity-90 text-white' : 'text-white'} p-3 text-white`}>Reports</h1>
                        <h1 onClick={() => { setIsActive('issues') }}
                            className={`${isActive === 'issues' ? 'border-l-2 border-blue-500 bg-gray-500 opacity-90 text-white' : 'text-white'} p-3 text-white`}>Manage Issues</h1>
                    </div>
                </div>
            </div>
        </div>
    );
}

