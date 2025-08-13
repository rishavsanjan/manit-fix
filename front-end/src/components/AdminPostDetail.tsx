import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

interface Issues {
    id: string,
    title: string
    status: string
    createdAt: string
    catogery: string
    location: string
    description: string
    AdminstrativeComments: AdminstrativeComments[]
}

interface AdminstrativeComments extends Issues {
    type: String
    comment: string
}


export default function AdminPostDetail({ }) {
    const navigate = useNavigate();

    const { postId } = useParams();
    const [issueDetail, setIssueDetails] = useState<Issues | null>(null);
    const [comment, setComment] = useState('');
    const [commentType, setCommentType] = useState('');
    const [comments, setComments] = useState<AdminstrativeComments[]>([]);
    const [newStatus, setNewStatus] = useState('');
    const getDashBoardDetails = async () => {
        const token = localStorage.getItem('token');
        const response = await axios(`http://127.0.0.1:8787/protected/admin/issue-detail/${postId}`, {
            method: 'get',
            headers: {
                'Authorization': 'Bearer ' + token
            }
        })
        setIssueDetails(response.data.issue);
        setComments(response.data.issue.AdminstrativeComments);
        console.log(response.data)
    }

    const addComment = async (e: React.FormEvent) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('comment', comment);
        formData.append('commentType', commentType);
        const token = localStorage.getItem('token');
        const response = await axios(`http://127.0.0.1:8787/protected/admin/add-comment`, {
            method: 'post',
            headers: {
                'Authorization': 'Bearer ' + token
            },
            data: {
                comment, commentType, postId
            }
        })
        console.log(response.data);
        setComments(prev => [...prev, response.data.addComment]);
        setComment('');
        setCommentType('');
    }

    const updateStatus = async (e: React.FormEvent) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('newStatus', newStatus);
        const token = localStorage.getItem('token');
        const response = await axios(`http://127.0.0.1:8787/protected/admin/update-status`, {
            method: 'post',
            headers: {
                'Authorization': 'Bearer ' + token
            },
            data: {
                newStatus, postId
            }
        })
        setIssueDetails(prev => {
            if (prev?.status) {
                return {
                    ...prev,
                    status: newStatus
                }
            }
            return prev;
        })

        console.log(response.data);
    }

    useEffect(() => {
        getDashBoardDetails();
    }, []);
    console.log(newStatus);
    function formatFullDateTime(isoString: string): string {
        const date = new Date(isoString);

        const options: Intl.DateTimeFormatOptions = {
            year: 'numeric',
            month: 'long', // Full month name
            day: 'numeric',
            hour: 'numeric',
            minute: '2-digit',
            hour12: true // AM/PM
        };

        return date.toLocaleString('en-US', options);
    }
    console.log(newStatus)
    return (
        <>
            <button onClick={() => navigate(-1)} className="bg-gray-100 md:hidden m-4 w-40 flex rounded-xl px-4 py-2 hover:-translate-x-2 transition-all duration-300">
                <h1 className="self-start"> ← Back to reports</h1>
            </button>
            <div className="m-4 border border-gray-200 rounded-xl flex flex-col gap-4 ">

                <div className="flex md:flex-row flex-col justify-between items-center bg-[#2F4255] text-white py-6 px-4 rounded-t-xl">
                    <button onClick={() => navigate(-1)} className="bg-gray-500 md:flex hidden rounded-xl px-4 py-2 hover:-translate-x-2 transition-all duration-300">
                        <h1>Back to reports</h1>
                    </button>
                    <div className="flex flex-col items-center gap-2 ">
                        <h1 className="text-4xl font-thin">Report Details</h1>
                        <h1 className="font-bold text-gray-400 text-sm">Administrative Dashboard</h1>
                    </div>
                    <div></div>
                </div>
                <div className="flex md:flex-row flex-col justify-between">
                    <div className="flex flex-col gap-2 m-6 border md:w-full border-gray-200 rounded-xl p-4">
                        <div className="bg-yellow-200 self-start p-1 rounded-full px-4">
                            <p className="text-yellow-700 font-bold text-sm">{issueDetail?.status}</p>
                        </div>
                        <div className="bg-gray-100 rounded-xl border-l-4 border-blue-500 p-3">
                            <p className="text-sm font-medium">REPORT ID</p>
                            <p className=" text-gray-500">{issueDetail?.id}</p>
                        </div>
                        <div className="bg-gray-100 rounded-xl border-l-4 border-blue-500 p-3">
                            <p className="text-sm font-medium">TITLE</p>
                            <p className=" text-gray-500">{issueDetail?.title}</p>
                        </div>
                        <div className="bg-gray-100 rounded-xl border-l-4 border-blue-500 p-3">
                            <p className="text-sm font-medium">CATOGERY</p>
                            <p className=" text-gray-500">{issueDetail?.catogery}</p>
                        </div>
                        <div className="bg-gray-100 rounded-xl border-l-4 border-blue-500 p-3">
                            <p className="text-sm font-medium">LOCATION</p>
                            <p className=" text-gray-500">{issueDetail?.location}</p>
                        </div>
                        <div className="bg-gray-100 rounded-xl border-l-4 border-blue-500 p-3">
                            <p className="text-sm font-medium">CREATED AT</p>
                            <p className=" text-gray-500">{formatFullDateTime(issueDetail?.createdAt || 'N/A')}</p>
                        </div>
                        <div className="bg-gradient-to-r from-[#6AB4FC] to-[#198CE7] p-4 rounded-xl">
                            <p className="text-white ">DESCRIPTION</p>
                            <span className="text-white">{issueDetail?.description || 'N/A'}</span>
                        </div>
                    </div>
                    <div className="md:w-1/3   m-6 border border-gray-200 rounded-xl p-4">
                        <form onSubmit={updateStatus} className="flex flex-col gap-4" action="">
                            <h1 className="font-bold text-xl">Quick Actions</h1>
                            <select required
                                className="w-full border-2 p-2 border-gray-300 rounded-md focus:border-blue-500 
                        outline-none transition-colors duration-300" defaultValue="" onChange={(e) => { setNewStatus(e.target.value) }}
                            >
                                <option disabled value="">{issueDetail?.status}</option>
                                <option disabled={issueDetail?.status === 'Pending' ? true : false} value="Pending">Pending</option>
                                <option disabled={issueDetail?.status === 'Resolved' ? true : false} value="Resolved">Resolved</option>

                                <option disabled={issueDetail?.status === 'InProgress' ? true : false} value="InProgress">In Progress</option>
                            </select>
                            <button type="submit" className="hover:-translate-y-1 transition-all duration-300 hover:shadow-[#7cb6f0]
                     hover:shadow-md bg-gradient-to-r from-[#6AB4FC] to-[#198CE7] p-2 px-4 rounded-xl text-white font-bold">UPDATE STATUS</button>

                        </form>


                    </div>
                </div>
                <div className="flex flex-col gap-4 border border-gray-200 rounded-xl p-4 m-4">
                    <h1 className="text-2xl font-bold">📝Adminstrative Comments</h1>
                    <form onSubmit={addComment}>
                        <div>
                            <p className="text-gray-500">Comment Type</p>
                            <select required
                                className="w-full border-2 p-2 border-gray-300 rounded-md focus:border-blue-500 outline-none transition-colors duration-300"
                                onChange={(e) => { setCommentType(e.target.value) }} defaultValue="" >
                                <option value="" disabled>Select a comment type</option>
                                <option value="internal">Internal</option>
                                <option value="public">Public Statement</option>
                                <option value="status">Status Change</option>
                            </select>
                        </div>
                        <div>
                            <h1 className="text-gray-500">Comment</h1>
                            <textarea required onChange={(e) => { setComment(e.target.value) }} className="w-full  focus:border-blue-500 outline-none transition-colors duration-300 pb-8 border-2 p-2 border-gray-300 rounded-md"
                                placeholder="Enter adminstrative comments here..." name="" id=""></textarea>
                        </div>
                        <div className="gap-2 flex">
                            <button type="submit" className="cursor-pointer hover:-translate-y-1 transition-all duration-300 hover:shadow-[#746acb] hover:shadow-md bg-gradient-to-r from-[#7668EB] to-[#968DF9] p-2 px-4 rounded-xl text-white font-bold">ADD COMMENT</button>
                            <button type="reset" onClick={() => { setComment('') }} className="cursor-pointer hover:-translate-y-1 transition-all duration-300 hover:shadow-[#7cb6f0] hover:shadow-md bg-gradient-to-r from-[#6AB4FC] to-[#198CE7] p-2 px-4 rounded-xl text-white font-bold">CLEAR</button>
                        </div>
                    </form>
                    <h1 className="font-semibold text-lg">Previous Comments</h1>
                    {
                        comments.map((item) => {
                            return (
                                <div className="bg-gray-100 rounded-xl border-l-4 border-blue-500 p-3 py-5 gap-2 flex flex-col" key={item.id}>
                                    <div className="flex justify-between">
                                        <h1 className="font-medium">Admin User ({item.type})</h1>
                                        <p>{formatFullDateTime(item.createdAt)}</p>
                                    </div>
                                    <p>{item.comment}</p>
                                </div>
                            )
                        })
                    }
                    {
                        comments.length === 0 &&
                        <div>
                            <h1 className="text-center text-xl text-gray-400 font-medium">No Comments has been made by the adminstartion yet!</h1>
                        </div>
                    }
                </div>


            </div>
        </>

    )
}