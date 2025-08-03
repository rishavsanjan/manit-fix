import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ClipLoader from "react-spinners/ClipLoader";


interface Post {
    id: string
    title: string,
    description: string,
    image: string,
    location: string,
    catogery: string
    createdAt: string | undefined
    status: string
    Comment: Comment[]
    CommentReactions: CommentReactions[]
    userId: string
}


interface CommentReactions {
    id: string
    commentId: string
    type: string | null
    userId: string
}

interface Comment {
    id: string
    text: string
    user: User
    parentId: string
    replies: Replies[]
    CommentReactions: CommentReactions[]
    userId: string
    comment: Comment[]

}

interface User {
    id: string
    name: string
    picture: string
}

interface Replies {
    replies: Replies[]
    comment: Comment[]
}

export default function PostDetail() {
    const { postId } = useParams();
    const [post, setPost] = useState<Post | null>(null)
    const [loading, setLoading] = useState(false);
    const [comment, setComment] = useState('');
    const [comments, setComments] = useState<Comment[]>([]);
    const [rootReply, setRootReply] = useState<{
        name: string
        id: string
        picture: string
    } | null>(null);
    const [viewReply, setViewReply] = useState(false);
    const [repliesData, setRepliesData] = useState<Comment[]>([]);
    const [renderReplyActive, setRenderReplyActive] = useState<string[]>([]);
    const [replyText, setReplyText] = useState('');
    const [userId, setUserId] = useState('');
    const getPostDetail = async () => {
        const token = localStorage.getItem('token');
        const response = await axios(`http://127.0.0.1:8787/protected/postdetail/${postId}`, {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + token
            }
        })
        setPost(response.data.response);
        setComments(response.data.response.Comment);
        setUserId(response.data.userId)
    }

    useEffect(() => {
        getPostDetail()
    }, [])

    const addComment = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true)
        const formData = new FormData();
        formData.append('comment', comment);
        const token = localStorage.getItem('token');
        const response = await axios(`http://127.0.0.1:8787/protected/addcomment`, {
            method: 'post',
            headers: {
                'Authorization': 'Bearer ' + token
            },
            data: {
                comment, postId
            }
        })
        setComment('');
        setComments(prev => [...prev, response.data.fullComment]);
        setLoading(false);
    }

    const addRootReply = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        const token = localStorage.getItem('token');
        const response = await axios(`http://127.0.0.1:8787/protected/addreplyto`, {
            method: 'post',
            headers: {
                'Authorization': 'Bearer ' + token
            },
            data: {
                replyText, postId, parentId: rootReply?.id
            }
        })
        setReplyText('');

        setRootReply(null)

        setComments(prev =>
            prev.map((item) => {
                if (item.id !== rootReply?.id) return item;
                return {
                    ...item,
                    replies: [...item.replies, response.data.addReply]
                }
            })
        )


        renderReply(rootReply!.id)
        setLoading(false)
    }

    const renderReply = async (parentId: string) => {
        const token = localStorage.getItem('token');

        const response = await axios(`http://127.0.0.1:8787/protected/getreplies`, {
            method: 'post',
            headers: {
                'Authorization': 'Bearer ' + token
            },
            data: {
                parentId, postId
            }
        })
        setRepliesData(prev => [...prev, response.data.replies])

        setRenderReplyActive(prev => [...prev, parentId]);
        setViewReply(true)


    }
    function formatTimeAgo(timestamp: string | undefined) {
        const now = new Date();
        //@ts-ignore
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

    const handleLike = async (commentId: string) => {
        const token = localStorage.getItem('token');

        const response = await axios(`http://127.0.0.1:8787/protected/likecomment`, {
            method: 'post',
            headers: {
                'Authorization': 'Bearer ' + token
            },
            data: {
                postId, commentId
            }
        })

        const updatedComment = {
            commentId: commentId,
            type: 'like',
            userId: userId
        }

        let run = 0;
        setComments(prev =>
            prev.map((item) => {
                if (item.parentId) return item;
                if (item.id === commentId && run === 0) {
                    //@ts-ignore
                    item.CommentReactions.push(updatedComment)
                    run++;
                    return item
                }
                return item;

            })
        )

        run = 0;

        setRepliesData(prev =>
            prev.filter(replyGroup =>
                //@ts-ignore
                replyGroup.some(reply => {
                    if (reply.id === commentId && run === 0) {
                        reply.CommentReactions.push(updatedComment);
                        run++;
                        return reply;
                    }
                    return reply
                })
            )
        );
    }

    const handleRemoveLike = async (commentId: string) => {
        const token = localStorage.getItem('token');

        const response = await axios(`http://127.0.0.1:8787/protected/removelike`, {
            method: 'post',
            headers: {
                'Authorization': 'Bearer ' + token
            },
            data: {
                postId, commentId
            }
        })
        console.log(response.data);



        setComments(prev =>
            prev.map((item) => {
                if (item.id === commentId) {
                    const updatedReactions = item.CommentReactions.filter(
                        (reaction) => reaction.userId !== userId
                    );

                    return {
                        ...item,
                        CommentReactions: updatedReactions
                    };
                }
                return item;
            })
        );

        setRepliesData(prev =>
            prev.map(replyGroup =>
                //@ts-ignore
                replyGroup.map(reply => {
                    if (reply.id === commentId) {
                        return {
                            ...reply,
                            CommentReactions: reply.CommentReactions.filter(
                                //@ts-ignore
                                reaction => reaction.userId !== userId
                            )
                        };
                    }
                    return reply;
                })
            )
        );



    }

    console.log(comments)


    const renderViewReply = (parentId: string) => {
        const flat = repliesData.flat(Infinity)
        const data = flat.filter(obj => obj.parentId === parentId)

        return (
            <div>
                {
                    data.map((item, index) => {
                        const isTrue = renderReplyActive.find(obj => obj === item.id)
                        const isLiked = item.CommentReactions.find(obj => { if (obj.userId === userId) return true });

                        return (
                            <div key={index} className="flex flex-col p-4 pl-8">
                                <div className="flex flex-row items-center gap-4">
                                    <img className="w-10 h-10 rounded-full mb-4 border-gray-300 border-2 " src={item.user.picture} alt="" />
                                    <div className=" flex flex-col ">
                                        <div className={`${rootReply?.id === item.id ? 'bg-blue-300' : 'bg-gray-300'}  p-2 rounded-3xl px-4`}>
                                            <h1 className="font-medium">{item.user.name}</h1>
                                            <h1>{item.text}</h1>
                                        </div>
                                        <div className="gap-4 flex flex-row justify-between ml-4">
                                            <div className="flex flex-row gap-4">
                                                <button onClick={() => { handleRemoveLike(item.id) }} className={`${isLiked ? 'text-blue-500' : 'text-gray-700'}  hover:underline cursor-pointer`}>{isLiked && 'Unlike'} </button>
                                                <button onClick={() => { handleLike(item.id) }} className={`${isLiked ? 'text-blue-500' : 'text-gray-700'}  hover:underline cursor-pointer`}>{!isLiked && 'Like'} </button>

                                                <button onClick={() => setRootReply({
                                                    id: item.id,
                                                    name: item.user.name,
                                                    picture: item.user.picture
                                                })} className="text-gray-700 hover:underline cursor-pointer">Reply
                                                </button>
                                            </div>
                                            <div className="flex flex-row items-center">
                                                {
                                                    isLiked
                                                        ?
                                                        <img className="w-5 h-5" src="https://img.icons8.com/?size=100&id=X0bivhUe8Vuv&format=png&color=000000" alt="" />
                                                        :
                                                        <img className="w-5 h-5" src="https://img.icons8.com/?size=100&id=FVllQWSruriW&format=png&color=000000" alt="" />
                                                }

                                                <p className="text-gray-500 font-bold">{item?.CommentReactions?.length || 0}</p>
                                            </div>
                                        </div>

                                    </div>
                                </div>
                                {
                                    rootReply?.id === item.id &&
                                    <form onSubmit={addRootReply}>
                                        <div className="w-full flex flex-row items-center gap-4 pl-8 justify-between">
                                            <img className="w-10 h-10 rounded-full mb-4 border-gray-300 border-2 " src={rootReply.picture} alt="" />
                                            <textarea value={replyText} onChange={(e) => { setReplyText(e.target.value) }} placeholder={`Reply to ${rootReply.name}...`} className="bg-gray-300 rounded-2xl p-2 mt-2 w-full
                                                        focus:border-blue-500 outline-none border-2 border-gray-300 transition-all duration-300
                                                        " name="" id=""></textarea>
                                            <button type="submit" className="cursor-pointer ">
                                                {loading ?
                                                    <div className="items-center justify-center flex gap-1"><ClipLoader color="#fff" size={20} /> Uploading...</div>
                                                    :
                                                    <img className="w-5 h-5 " src="https://img.icons8.com/?size=100&id=AdrKKYXG06TU&format=png&color=000000" alt="" />
                                                }
                                            </button>

                                        </div>
                                    </form>

                                }
                                {
                                    item.replies.length > 0 && !isTrue &&
                                    <>
                                        <div onClick={() => { renderReply(item.id) }} className="ml-6  pl-4 mt-2 relative cursor-pointer">
                                            <h1 className="text-gray-500 font-medium pl-16">View {item.replies.length} Reply</h1>
                                        </div>
                                    </>
                                }
                                {
                                    isTrue &&
                                    <>
                                        <div onClick={() => {
                                            const filter = renderReplyActive.filter(obj => obj !== item.id);
                                            setRenderReplyActive(filter)
                                            setRepliesData(prev =>
                                                prev.filter(replyGroup =>
                                                    //@ts-ignore
                                                    !replyGroup.some(reply => reply.parentId === item.id)
                                                )
                                            );

                                        }} className="ml-6  pl-4 mt-2 relative cursor-pointer">
                                            <h1 className="text-gray-500 font-medium pl-16">Hide Replies</h1>
                                        </div>
                                    </>
                                }
                                {
                                    isTrue &&
                                    <div>
                                        {renderViewReply(item.id)}
                                    </div>

                                }


                            </div>
                        )
                    })
                }
            </div>
        )
    }

    return (
        <div className="p-4 flex flex-col gap-4">
            <div className="hover:bg-blue-50 self-start transition-all duration-300">
                <h1 className="text-md text-blue-500 font-medium">← Back to All Issues</h1>
            </div>
            <div className="sm:mx-12 md:mx-32 lg:mx-64 border border-gray-200 rounded-xl p-4 shadow-sm  gap-4 flex flex-col">
                <div className="flex flex-row justify-between items-center">
                    <h1 className="font-bold text-3xl">{post?.title}</h1>
                    <div className="bg-red-200 border border-red-400 rounded-full px-4 p-1">
                        <h1 className="text-red-500 font-medium text-sm">{post?.status}</h1>
                    </div>
                </div>

                <div className="flex flex-row gap-4 items-center">
                    <div className="bg-green-200 border border-green-400 rounded-full px-4 p-1">
                        <h1 className="text-green-500 font-medium text-sm">{post?.catogery}</h1>
                    </div>

                    <h1 className="text-gray-500 text-sm font-medium">📍{post?.location}</h1>
                    <h1 className="text-gray-500">{formatTimeAgo(post?.createdAt)}</h1>

                </div>
                <h1 className="text-gray-500">{post?.description}</h1>
                <img src={post?.image} alt="" />
            </div>
            <div className="flex flex-col  border border-gray-200 rounded-xl shadow-sm  sm:mx-12 md:mx-32 lg:mx-64 mb-4">
                <div className=" p-4 border-b border-b-gray-200">
                    <h1 className="font-medium text-xl">Discussion</h1>
                    <p className="text-gray-400 text-sm ">{post?.Comment?.length || 0} comments</p>
                </div>
                <form onSubmit={addComment}>
                    <div className="p-4 bg-gray-100">
                        <textarea value={comment} required onChange={(e) => { setComment(e.target.value) }}
                            className="w-full p-2 border-2 rounded-xl border-gray-300 font-medium focus:border-blue-500
                                outline-none transition-colors duration-300 h-32 bg-white "
                            placeholder="Share your thoughts, experiences, or suggestions about this issue..." name="" id=""></textarea>
                    </div>
                    <div className="p-4 w-full">
                        <button type="submit" className="bg-blue-500 w-full text-white p-2 rounded-2xl bg-gradient-to-r from-blue-400
                            to-blue-600 hover:bg-gradient-to-r hover:from-[#6068F1] hover:to-[#8936EA] 
                            transition-colors duration-1000 cursor-pointer
                            " >   {loading ? <div className="items-center justify-center flex gap-1"><ClipLoader color="#fff" size={20} /> Uploading...</div> : "Submit"}

                        </button>
                    </div>
                </form>
            </div>
            <div className="flex flex-col  border border-gray-200 rounded-xl shadow-sm  sm:mx-12 md:mx-32 lg:mx-64">
                {
                    comments.length === 0
                        ?
                        <div className="p-4">
                            <p className="text-xl text-gray-500 text-center">No comments yet!</p>
                        </div>
                        :
                        <>
                            {
                                comments.map((item, index) => {
                                    if (item.parentId) {
                                        return;
                                    }
                                    const isTrue = renderReplyActive.find(obj => obj === item.id);
                                    const isLiked = item.CommentReactions.find(obj => { if (obj.userId === userId && obj.type === 'like') return true });
                                    console.log(isLiked)
                                    return (
                                        <div key={index} className="flex flex-col sm:p-4 p-2">
                                            <div className="flex flex-row items-center gap-4">
                                                <img className="w-10 h-10 rounded-full mb-4 border-gray-300 border-2 " src={item.user.picture} alt="" />
                                                <div className=" flex flex-col ">
                                                    <div className={`${rootReply?.id === item.id ? 'bg-blue-300' : 'bg-gray-300'}  p-2 rounded-3xl px-4`}>
                                                        <h1 className="sm:text-md text-sm font-medium">{item.user.name}</h1>
                                                        <h1 className="sm:text-md text-sm">{item.text}</h1>
                                                    </div>
                                                    <div className="gap-4 flex flex-row justify-between ">
                                                        <div className="flex flex-row gap-4">
                                                            <button onClick={() => { handleRemoveLike(item.id) }} className={`${isLiked ? 'text-blue-500' : 'text-gray-700'}  hover:underline cursor-pointer`}>{isLiked && 'Unlike'} </button>
                                                            <button onClick={() => { handleLike(item.id) }} className={`${isLiked ? 'text-blue-500' : 'text-gray-700'}  hover:underline cursor-pointer`}>{!isLiked && 'Like'} </button>                                                            <button onClick={() => setRootReply({
                                                                id: item.id,
                                                                name: item.user.name,
                                                                picture: item.user.picture
                                                            })} className="text-gray-700 hover:underline cursor-pointer">Reply
                                                            </button>
                                                        </div>
                                                        <div className="flex flex-row items-center">
                                                            {
                                                                isLiked
                                                                    ?
                                                                    <img className="w-5 h-5" src="https://img.icons8.com/?size=100&id=X0bivhUe8Vuv&format=png&color=000000" alt="" />
                                                                    :
                                                                    <img className="w-5 h-5" src="https://img.icons8.com/?size=100&id=FVllQWSruriW&format=png&color=000000" alt="" />
                                                            }

                                                            <p className="text-gray-500 font-bold">{item?.CommentReactions?.length || 0}</p>
                                                        </div>
                                                    </div>

                                                </div>
                                            </div>
                                            {
                                                rootReply?.id === item.id &&
                                                <form onSubmit={addRootReply}>
                                                    <div className="w-full flex flex-row items-center gap-4 pl-8 justify-between">
                                                        <img className="w-10 h-10 rounded-full mb-4 border-gray-300 border-2 " src={rootReply.picture} alt="" />
                                                        <textarea value={replyText} onChange={(e) => { setReplyText(e.target.value) }} placeholder={`Reply to ${rootReply.name}...`}
                                                            className={`bg-gray-300 rounded-2xl p-2 mt-2 w-full
                                                        focus:border-blue-500 outline-none border-2 border-gray-300 transition-all duration-300 sm:text-xl text-xs 
                                                        `} name="" id=""></textarea>
                                                        <button type="submit" className="cursor-pointer ">
                                                            {loading ?
                                                                <div className="items-center justify-center flex gap-1"><ClipLoader color="#fff" size={20} /> Uploading...</div>
                                                                :
                                                                <img className="w-5 h-5 " src="https://img.icons8.com/?size=100&id=AdrKKYXG06TU&format=png&color=000000" alt="" />
                                                            }
                                                        </button>

                                                    </div>
                                                </form>

                                            }
                                            {
                                                item.replies.length > 0 && !isTrue &&
                                                <>
                                                    <div onClick={() => { renderReply(item.id) }} className="ml-6  pl-4 mt-2 relative cursor-pointer">
                                                        <h1 className="text-gray-500 font-medium pl-16">View {item.replies.length} Reply</h1>
                                                    </div>
                                                </>
                                            }
                                            {
                                                isTrue &&
                                                <>
                                                    <div onClick={() => {
                                                        const filter = renderReplyActive.filter(obj => obj !== item.id);
                                                        setRenderReplyActive(filter)
                                                        setRepliesData(prev =>
                                                            prev.filter(replyGroup =>
                                                                //@ts-ignore
                                                                !replyGroup.some(reply => reply.parentId === item.id)
                                                            )
                                                        );

                                                    }} className="ml-6  pl-4 mt-2 relative cursor-pointer">
                                                        <h1 className="text-gray-500 font-medium pl-16">Hide Replies</h1>
                                                    </div>
                                                </>
                                            }

                                            {
                                                isTrue &&
                                                <div>
                                                    {renderViewReply(item.id)}
                                                </div>

                                            }


                                        </div>
                                    )
                                })
                            }

                        </>
                }
            </div>

        </div>
    )
}