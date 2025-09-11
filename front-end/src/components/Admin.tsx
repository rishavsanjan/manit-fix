import axios from "axios";
import { useEffect, useState } from "react"
import AdminIssues from "./AdminIssues";
import { AdminMobileSidebar } from "../modals/AdminMobileSidebar";



export default function Admin() {

    const [isActive, setIsActive] = useState('dashboard');

    const getDashBoardDetails = async () => {
        const token = localStorage.getItem('token');
        const response = await axios(`http://127.0.0.1:8787/protected/admin/dashboard`, {
            method: 'post',
            headers: {
                'Authorization': 'Bearer ' + token
            }
        })
        console.log(response.data)
    }

    useEffect(() => {
        getDashBoardDetails();
    }, []);
    return (
        <div className="flex ">

            <div className="xl:w-1/5 w-1/2 bg-gray-800 md:flex flex-col hidden">

                <div className="flex flex-row gap-2 p-4">
                    <img className="w-7 h-7" src="https://img.icons8.com/?size=100&id=49454&format=png&color=000000"></img>
                    <h1 className="font-extrabold sm:text-xl text-xl text-[#6975DD] ">FixMyCampus</h1>
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
            {
                isActive === 'dashboard' &&
                <>

                    <div className="flex flex-col">
                        <div className=" border-b py-8 px-4 border-gray-200 flex flex-row items-center">
                            <AdminMobileSidebar isActive={isActive} setIsActive={setIsActive} />
                            <h1 className="text-2xl font-extrabold">Dashboard</h1>

                        </div>
                        <div className="flex flex-row flex-wrap self-start justify-between">
                            <div className="flex flex-col m-8 p-4 sm:w-68  md:w-56 lg:w-80 hover:-translate-y-2 transition-all *
                    duration-300 hover:shadow-xl   w-full self-start border border-gray-200 rounded-xl shadow-md">
                                <div className="flex flex-row justify-between items-center text-gray-400 font-bold">
                                    <p>Pending Issues</p>
                                    <p className="bg-yellow-200 p-2 rounded-xl">⌛</p>
                                </div>
                                <div className="mt-4">
                                    <p className="text-black pb-2 font-bold text-4xl">+3</p>
                                    <p className="text-green-600 text-md font-bold ">+3 from yesterday</p>
                                </div>

                            </div>
                            <div className="flex flex-col m-8 p-4 sm:w-68  md:w-56 lg:w-80 hover:-translate-y-2 transition-all *
                    duration-300 hover:shadow-xl   w-full self-start border border-gray-200 rounded-xl shadow-md">
                                <div className="flex flex-row justify-between items-center text-gray-400 font-bold">
                                    <p>In Progress</p>
                                    <p className="bg-blue-200 p-2 rounded-xl">🔁</p>
                                </div>
                                <div className="mt-4">
                                    <p className="text-black pb-2 font-bold text-4xl">5</p>
                                    <p className="text-green-600 text-md font-bold ">+3 from yesterday</p>
                                </div>

                            </div>
                            <div className="flex flex-col m-8 p-4 sm:w-68  md:w-56 lg:w-80 hover:-translate-y-2 transition-all *
                    duration-300 hover:shadow-xl   w-full self-start border border-gray-200 rounded-xl shadow-md">
                                <div className="flex flex-row justify-between items-center text-gray-400 font-bold">
                                    <p>Resolved Today</p>
                                    <p className="bg-green-200 p-2 rounded-xl ">✅</p>
                                </div>
                                <div className="mt-4">
                                    <p className="text-black pb-2 font-bold text-4xl">5</p>
                                    <p className="text-green-600 text-md font-bold ">+3 from yesterday</p>
                                </div>

                            </div>
                            <div className="flex flex-col m-8 p-4 sm:w-68  md:w-56 lg:w-80 hover:-translate-y-2 transition-all *
                    duration-300 hover:shadow-xl   w-full self-start border border-gray-200 rounded-xl shadow-md">
                                <div className="flex flex-row justify-between items-center text-gray-400 font-bold">
                                    <p>Total Issues</p>
                                    <p className="bg-red-200 p-2 rounded-xl ">📊</p>
                                </div>
                                <div className="mt-4">
                                    <p className="text-black pb-2 font-bold text43xl">5</p>
                                    <p className="text-green-600 text-md font-bold ">+3 from yesterday</p>
                                </div>

                            </div>
                        </div>
                    </div>
                </>


            }
            {
                isActive === 'issues' && (
                    <div className="flex flex-col w-full ">
                        <div className=" border-b py-8 px-4 border-gray-200 flex flex-row items-center">
                            <AdminMobileSidebar isActive={isActive} setIsActive={setIsActive} />
                            <h1 className="text-2xl font-extrabold">Issues</h1>
                        </div>

                        <AdminIssues />
                    </div>

                )
            }
        </div>
    )
}