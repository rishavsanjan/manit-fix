import axios from "axios";
import { useEffect, useState } from "react";



interface Posts {
    id: string
    title: string,
    description: string,
    image: string,
    location: string,
    catogery: string
    votes: Vote
}

interface Vote {
    upvote: number
    downvote: number
    userReaction: 'UpVote' | 'DownVote' | null
}

export default function Posts() {
    const [posts, setPosts] = useState<Posts[]>([]);
    const [page, setPage] = useState(0);
    const [filter, setFilter] = useState('default');
    const [likeHover, setLikeHoverHover] = useState(false);
    const [dislikeHover, setDislikeHover] = useState(false);


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
    }, [])

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
        <div>
            <h1 className="text-5xl  text-purple-400 font-extrabold text-center">Campus Issues</h1>
            <p className="text-gray-500 text-center">Community-reported issues across campus • Vote to prioritize • Track progress</p>
            <div className="p-4  m-4    gap-8 flex flex-col">
                {
                    posts?.map((item, index) => {
                        return (
                            <div key={index} className="flex flex-col gap-2 mb-4 border border-gray-200 shadow-2xl rounded-xl p-4">
                                <h1 className="text-black text-xl font-medium ">{item.title}</h1>
                                <div className="flex-row flex items-center gap-4">
                                    <div className="bg-green-200 border border-green-400 rounded-full px-4 p-1">
                                        <h1 className="text-green-500 font-medium text-sm">{item.catogery}</h1>
                                    </div>

                                    <h1 className="text-gray-500">📍{item.location}</h1>
                                </div>
                                <p className="text-gray-500">{item.description}</p>
                                <img className="w-full " src={item.image}></img>
                                <div className="bg-[#FAFBFC] flex-row flex items-center">
                                    {
                                        item.votes.userReaction === 'UpVote' &&
                                        <button className="pl-2" onClick={() => { removeVote('UpVote', item.id) }}>
                                            <div className="bg-green-500 border-2 border-gray-400  rounded-lg p-2 duration-300 transition-all hover:-translate-y-1">
                                                <img className="w-5 h-5" src="https://img.icons8.com/?size=100&id=pv7WFzr1v33d&format=png&color=FFFFFF"></img>
                                            </div>
                                        </button>
                                    }
                                    <button
                                        onClick={() => { addVote('UpVote', item.id, item.votes.userReaction) }}
                                        className="p-4" onMouseEnter={() => setLikeHoverHover(true)}
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

                                    </button>
                                    <h1 className="text-2xl text-gray-400 font-bold">{item.votes.upvote - item.votes.downvote}</h1>

                                    {
                                        item.votes.userReaction === 'DownVote' &&
                                        <button onClick={() => { removeVote('DownVote', item.id) }}>
                                            <div className="bg-red-500 border-2 border-gray-400  rounded-lg p-2 transition-all hover:-translate-y-1 duration-300">
                                                <img className="w-5 h-5" src="https://img.icons8.com/?size=100&id=94055&format=png&color=FFFFFF"></img>
                                            </div>
                                        </button>
                                    }
                                    <button
                                        onClick={() => { addVote('DownVote', item.id, item.votes.userReaction) }} className="p-4"
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
                            </div>
                        )
                    })
                }
            </div>
        </div >
    )
}