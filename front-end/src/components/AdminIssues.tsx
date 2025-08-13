import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

interface Issues {
    id: string,
    title: string
    status: string
    createdAt: string
    catogery: string
}

export default function AdminIssues() {
    const [issues, setIssues] = useState<Issues[]>([]);
    const getDashBoardDetails = async () => {
        const token = localStorage.getItem('token');
        const response = await axios(`http://127.0.0.1:8787/protected/admin/issues`, {
            method: 'post',
            headers: {
                'Authorization': 'Bearer ' + token
            }
        })
        setIssues(response.data.issues)
        console.log(response.data)
    }


    useEffect(() => {
        getDashBoardDetails();
    }, []);

    function formatDate(isoString: string): string {
        const date = new Date(isoString);

        const options: Intl.DateTimeFormatOptions = {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
        };

        return date.toLocaleDateString('en-GB', options);
    }


    return (
        <div >
            
            <div className="m-4 border border-gray-200  rounded-xl">
                <div className="p-4">
                    <h1 className="text-black font-medium text-xl">Recent Reports</h1>
                </div>

                <div className="flex flex-row justify-between bg-gray-100 p-4 mb-2">
                    <div>
                        <p className="text-gray-600 font-medium">Issue</p>
                    </div>
                    <div className="flex w-56 justify-between">
                        <p className="text-gray-600 font-medium">Catogery</p>
                        <p className="text-gray-600 font-medium mr-2">Status</p>
                    </div>
                    <div>
                        <p className="text-gray-600 font-medium w-20">Time</p>
                    </div>
                </div>
                <div>
                    {
                        issues.map((item) => {
                            return (
                                <Link to={`/admin/issue-detail/${item.id}`}>
                                    <div className="flex flex-col justify-center cursor-pointer">
                                        <div className="flex flex-row justify-between p-4 mb-2 items-center">
                                            <div>
                                                <h1 className="w-20">{item.title}</h1>
                                            </div>
                                            <div className="flex flex-row w-56 justify-between items-center ">
                                                <h1 className="w-20">{item.catogery}</h1>
                                                <select required
                                                    className="w-24 border-2 border-gray-300 rounded-lg focus:border-blue-500 outline-none transition-colors duration-300"
                                                    defaultValue={item.status}
                                                >

                                                    <option value="Resolved">Resolved</option>
                                                    <option value="InProgress">In Progress</option>
                                                    <option value="Pending">Pending</option>

                                                </select>
                                            </div>
                                            <div>
                                                <h1 className="w-24">{formatDate(item.createdAt)}</h1>
                                            </div>


                                        </div>
                                        <div className="border-b border-gray-300 "></div>
                                    </div>
                                </Link>



                            )
                        })
                    }
                </div>
            </div>
        </div>
    )
}