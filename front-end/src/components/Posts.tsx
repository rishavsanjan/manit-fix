import axios from "axios";
import { useEffect, useState } from "react";
import 'aos/dist/aos.css';
//@ts-ignore
import AOS from 'aos';
import { Link } from "react-router-dom";



interface Posts {
    id: string
    title: string,
    description: string,
    image: string,
    location: string,
    catogery: string
    votes: Vote
    Comment: Comment[]
    createdAt: string
    status: string
}

interface Vote {
    upvote: number
    downvote: number
    userReaction: 'UpVote' | 'DownVote' | null
}

interface Comment {
    id: number
}

export default function Posts() {
    const [posts, setPosts] = useState<Posts[]>([]);
    const [page, setPage] = useState(0);
    const [filter, setFilter] = useState('All Issues');
    const [likeHover, setLikeHoverHover] = useState(false);
    const [dislikeHover, setDislikeHover] = useState(false);
    const [isActive, setIsActive] = useState('All Issues');
    const [loading, setLoading] = useState(false);

    const filterOptions = [
        {
            id: 1,
            title: 'All Issues'
        },
        {
            id: 2,
            title: 'Hostel'
        },
        {
            id: 3,
            title: 'Mess'
        },
        {
            id: 4,
            title: 'Wi-Fi'
        },
        {
            id: 5,
            title: 'Academc'
        },
        {
            id: 6,
            title: 'Pending'
        },
        {
            id: 7,
            title: 'Resolved'
        },
        {
            id: 8,
            title: 'Transport'
        }
    ]

    useEffect(() => {
        AOS.init({
            duration: 600,
            easing: 'ease-out-cubic',
            once: false,
        });
    }, []);

    const getPosts = async () => {
        const token = localStorage.getItem('token');
        const response = await axios(`http://127.0.0.1:8787/protected/getposts?skip=${page * 10}&take=10&type=${filter}`, {
            method: 'get',
            headers: {
                'Authorization': 'Bearer ' + token
            }
        })
        setPosts(response.data.response)

    }

    useEffect(() => {
        getPosts();
    }, [filter])

    function formatTimeAgo(timestamp: string) {
        const now = new Date();
        const past = new Date(timestamp);
        //@ts-ignore
        const diffInSeconds = Math.floor((now - past) / 1000);

        const units = [
            { label: 'year', seconds: 31536000 },
            { label: 'month', seconds: 2592000 },
            { label: 'week', seconds: 604800 },
            { label: 'day', seconds: 86400 },
            { label: 'hour', seconds: 3600 },
            { label: 'minute', seconds: 60 },
        ];

        for (let unit of units) {
            const value = Math.floor(diffInSeconds / unit.seconds);
            if (value >= 1) {
                return value === 1 ? `1 ${unit.label} ago` : `${value} ${unit.label}s ago`;
            }
        }

        return 'just now';
    }


    const addVote = async (vote: 'UpVote' | 'DownVote', postId: string, currentReaction: 'UpVote' | 'DownVote' | null) => {
        const token = localStorage.getItem('token');
        if (currentReaction === null) {
            const response = await axios(`http://127.0.0.1:8787/protected/addvote`, {
                method: 'post',
                headers: {
                    'Authorization': 'Bearer ' + token
                },
                data: {
                    vote, postId
                }
            })

            setPosts(prevPosts =>
                prevPosts.map((post) => {
                    if (post.id !== postId) return post;
                    const newVotes = { ...post.votes };
                    if (vote === 'UpVote') {
                        newVotes.upvote += 1;
                    }
                    if (vote === 'DownVote') {
                        newVotes.downvote += 1;
                    }
                    newVotes.userReaction = vote;
                    return {
                        ...post,
                        votes: newVotes
                    }
                })
            )
            return;
        }

        const response = await axios({
            method: 'PUT',
            url: `http://127.0.0.1:8787/protected/updatevote`,
            headers: {
                'Authorization': 'Bearer ' + token
            },
            data: {
                vote,
                postId
            }
        });
        setPosts(prevPosts =>
            prevPosts.map(post => {
                if (post.id !== postId) return post;
                const newVotes = { ...post.votes };
                if (vote === 'UpVote') {
                    newVotes.upvote += 1;
                    newVotes.downvote -= 1;
                };
                if (vote === 'DownVote') {
                    newVotes.downvote += 1
                    newVotes.upvote -= 1;
                };
                newVotes.userReaction = vote;
                return {
                    ...post,
                    votes: newVotes
                };
            }))
        return;


    }

    const removeVote = async (currentReaction: 'DownVote' | 'UpVote', postId: string,) => {
        const token = localStorage.getItem('token');

        const response = await axios({
            method: 'delete',
            url: `http://127.0.0.1:8787/protected/removevote`,
            headers: {
                'Authorization': 'Bearer ' + token
            },
            data: {
                postId
            }
        });
        setPosts(prevPosts =>
            prevPosts.map(post => {
                if (post.id !== postId) return post;
                const newVotes = { ...post.votes };
                if (currentReaction === 'UpVote') newVotes.upvote -= 1;
                if (currentReaction === 'DownVote') newVotes.downvote -= 1;
                newVotes.userReaction = null;
                return {
                    ...post,
                    votes: newVotes
                }
            })
        )
    }

    console.log(posts)

    return (
        <div className="bg-gray-50 mt-16">
            <div className="flex flex-col gap-4 mb-8">
                <h1 className="text-5xl  text-purple-400 font-extrabold text-center">Campus Issues</h1>
                <p className="text-gray-500 text-center text-lg">Community-reported issues across campus • Vote to prioritize • Track progress</p>
            </div>
            <div className="flex flex-row p-4  m-4   xl:px-[300px] lg:px-60 md:px-24  flex-wrap ">
                {
                    Object.values(filterOptions).map((item) => {
                        return (
                            <button
                                key={item.id}
                                onClick={() => { setIsActive(item.title); setFilter(item.title) }}
                                className={`${isActive === item.title ? 'bg-[#6366F1] text-white' : 'text-gray-500'} 
                                border-2 border-gray-200 shadow-sm p-2 px-4 rounded-full cursor-pointer 
                                hover:border-[#6366F1] outline-none hover:-translate-y-0.5 transition-all duration-300
                                mr-4 mb-2
                            `}>
                                <h1 className={`${isActive === item.title ? '' : 'hover:text-[#6366F1]'} text-sm  font-medium `}>{item.title}</h1>
                            </button>
                        )
                    })
                }
            </div>

            <div className="p-4  m-4 gap-8 flex flex-col xl:px-[300px] lg:px-60 md:px-24 px-4">
                {
                    posts?.map((item, index) => {
                        return (
                            <Link key={index} to={`/posts/${item.id}`}>
                                <div data-aos="fade-up" key={index} className="flex cursor-pointer flex-col gap-2 mb-4 border border-gray-200 shadow-2xl rounded-xl p-4 ">
                                    <h1 className="text-black text-xl font-medium ">{item.title}</h1>
                                    <div className="flex-row flex items-center gap-4 justify-between">
                                        <div className="flex-row flex gap-2">
                                            <div className="bg-green-200 border border-green-400 rounded-full px-4 p-1">
                                                <h1 className="text-green-500 font-medium text-sm">{item.catogery}</h1>
                                            </div>
                                            <h1 className="text-gray-500">📍{item.location}</h1>
                                            <h1 className="text-gray-500">{formatTimeAgo(item.createdAt)}</h1>
                                        </div>
                                        <div className="bg-red-200 border border-red-400 rounded-full px-4 p-1">
                                            <h1 className="text-red-500 font-medium text-sm">{item.status}</h1>
                                        </div>

                                    </div>
                                    <p className="text-gray-500">{item.description}</p>
                                    <img className="w-full " src={item.image}></img>
                                    <div className="bg-[#FAFBFC] flex-row flex items-center justify-between ">
                                        <div className="flex-row flex items-center gap-4">
                                            {
                                                item.votes.userReaction === 'UpVote' &&
                                                <button className="cursor-pointer" onClick={() => { removeVote('UpVote', item.id) }}>
                                                    <div className="bg-green-500 border-2 border-gray-400  rounded-lg p-2 duration-300 transition-all hover:-translate-y-1">
                                                        <img className="w-5 h-5" src="https://img.icons8.com/?size=100&id=pv7WFzr1v33d&format=png&color=FFFFFF"></img>
                                                    </div>
                                                </button>
                                            }
                                            {<button

                                                onClick={() => { addVote('UpVote', item.id, item.votes.userReaction) }}
                                                className="cursor-pointer" onMouseEnter={() => setLikeHoverHover(true)}
                                                onMouseLeave={() => setLikeHoverHover(false)}>
                                                {
                                                    item.votes.userReaction !== 'UpVote'
                                                    &&
                                                    <>
                                                        {
                                                            likeHover
                                                                ?
                                                                <div className="bg-green-500 border-2 border-gray-400  rounded-lg p-2 duration-300 transition-all hover:-translate-y-1">
                                                                    <img className="w-5 h-5" src="https://img.icons8.com/?size=100&id=pv7WFzr1v33d&format=png&color=FFFFFF"></img>
                                                                </div>

                                                                :
                                                                <div className=" border-2 border-gray-400 bg-white rounded-lg p-2 duration-300  transition-all hover:-translate-y-1">
                                                                    <img className="w-5 h-5" src="https://img.icons8.com/?size=100&id=1DXLLAyIsNYu&format=png&color=1A1A1A"></img>
                                                                </div>
                                                        }
                                                    </>

                                                }

                                            </button>}
                                            <h1 className="text-2xl text-gray-400 font-bold">{item.votes.upvote - item.votes.downvote}</h1>

                                            {
                                                item.votes.userReaction === 'DownVote' &&
                                                <button className="cursor-pointer" onClick={() => { removeVote('DownVote', item.id) }}>
                                                    <div className="bg-red-500 border-2 border-gray-400  rounded-lg p-2 transition-all hover:-translate-y-1 duration-300">
                                                        <img className="w-5 h-5" src="https://img.icons8.com/?size=100&id=94055&format=png&color=FFFFFF"></img>
                                                    </div>
                                                </button>
                                            }
                                            <button
                                                onClick={() => { addVote('DownVote', item.id, item.votes.userReaction) }} className="cursor-pointer"
                                                onMouseEnter={() => setDislikeHover(true)}
                                                onMouseLeave={() => setDislikeHover(false)}>
                                                {
                                                    item.votes.userReaction !== 'DownVote'
                                                    &&
                                                    <>
                                                        {
                                                            dislikeHover ?
                                                                <div className="bg-red-500 border-2 border-gray-400  rounded-lg p-2 transition-all hover:-translate-y-1 duration-300">
                                                                    <img className="w-5 h-5" src="https://img.icons8.com/?size=100&id=94055&format=png&color=FFFFFF"></img>
                                                                </div>

                                                                :
                                                                <div className=" border-2 border-gray-400 bg-white rounded-lg p-2 transition-all hover:-translate-y-1 duration-300">
                                                                    <img className="w-5 h-5" src="https://img.icons8.com/?size=100&id=94055&format=png&color=1A1A1A"></img>
                                                                </div>
                                                        }
                                                    </>
                                                }
                                            </button>
                                        </div>

                                        <div className="flex flex-row gap-2">
                                            <img className="w-8 h-8" src="https://img.icons8.com/?size=100&id=81488&format=png&color=000000" alt="" />
                                            <h1 className="text-xl font-medium">{item.Comment.length} comments</h1>
                                        </div>

                                    </div>
                                </div>
                            </Link>

                        )
                    })
                }
            </div>
        </div >
    )
}