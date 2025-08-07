import axios from "axios";
import { useEffect, useState } from "react"
import { Link } from "react-router-dom";
import { getCroppedImg } from '../utils/cropperImageHelper'; // adjust path accordingly
import Modal from 'react-modal';
import Cropper from 'react-easy-crop';


interface User {
    id: string
    name: string
    picture: string
    email: string
    Posts: Posts[]
    Comment: Comment[]
    Vote: Vote[]
    department: string
}



interface Vote {
    id: string
    post: Posts
}


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
    user: User
}

interface Comment {
    id: string,
    text: string,
    post: Posts
    user: User
    createdAt: string,
    parent: Comment
}

export default function MyProfile() {
    const [user, setUser] = useState<User | null>(null);
    const [isActive, setIsActive] = useState('posts');
    const [posts, setPosts] = useState<Posts[]>([]);
    const [department, setDepartment] = useState('');
    const [picture, setPicture] = useState<File | null>(null);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [imageSrc, setImageSrc] = useState<string | null>(null);
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);
    const [showCropModal, setShowCropModal] = useState(false);


    const getProfile = async () => {
        const token = localStorage.getItem('token');
        if (token) {
            const response = await axios(`http://127.0.0.1:8787/protected/profile`, {
                method: 'GET',
                headers: {
                    'Authorization': 'Bearer ' + token
                }
            })
            setUser(response.data.user);
            setPosts(response.data.user.Posts);
        }
    }

    useEffect(() => {
        getProfile();
    }, []);

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


    const uploadToCloudinary = async (file: File) => {
        const data = new FormData();
        data.append('file', file);
        data.append('upload_preset', 'fixmycampus posts');
        data.append('cloud_name', 'diwmvqto3');

        const response = await fetch('https://api.cloudinary.com/v1_1/diwmvqto3/image/upload', {
            method: 'POST',
            body: data,
        });

        const result = await response.json();
        return result.secure_url;
    }

    const handleUpdateProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('department', department);
        let pictureUrl = '';
        if (picture) {
            pictureUrl = await uploadToCloudinary(picture)
        }
        const token = localStorage.getItem('token');
        const response = await axios(`http://127.0.0.1:8787/protected/update-profile`, {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer ' + token
            },
            data: {
                department, picture: pictureUrl
            }
        })
        setUser(prev => {
            if (prev?.department) {
                return {
                    ...prev, department: department
                }
            }
            return prev;
        }
        )
    }


    return (
        <div className=" w-full
                bg-[image:var(--gradient-animated)]
                bg-[size:var(--size-400)]
                animate-[animation:var(--animate-gradient)] lg:px-48 xl:px-60 md:px-24 ">
            <div className=" w-full
                bg-[image:var(--gradient-animated-profile)]
                bg-[size:var(--size-400)]
                animate-[animation:var(--animate-gradient-profile)] rouned-xl">

                <div className="flex md:flex-row  flex-col items-center justify-start gap-8 p-20 ">
                    <div className="relative">
                        {
                            isActive === 'settings'
                                ?
                                <form onSubmit={handleUpdateProfile} action="">
                                    <div className="relative w-32 h-32">
                                        <img
                                            className="w-full h-full rounded-full object-cover border-2 border-gray-300"
                                            src="https://img.icons8.com/?size=100&id=u4U9G3tGGHu1&format=png&color=000000"
                                            alt="Profile"
                                        />

                                        <input
                                            type="file"
                                            id="fileUpload"
                                            accept="image/*"
                                            className="hidden"
                                            onChange={(e) => {
                                                const file = e.target.files?.[0];
                                                if (file) {
                                                    setSelectedFile(file);
                                                    const reader = new FileReader();
                                                    reader.onloadend = () => {
                                                        setImageSrc(reader.result as string);
                                                        setShowCropModal(true);
                                                    };
                                                    reader.readAsDataURL(file);
                                                }
                                            }}
                                        />
                                        {/* @ts-ignore */}
                                        <label for="fileUpload"
                                            className="absolute bottom-0 right-0 bg-blue-600 text-white w-8 h-8 flex items-center justify-center rounded-full cursor-pointer shadow hover:bg-blue-700 transition">
                                            +
                                        </label>
                                    </div>
                                </form>


                                :
                                <img className="rounded-full  border-black border-2" src={`${user?.picture ||
                                    'https://img.icons8.com/?size=100&id=u4U9G3tGGHu1&format=png&color=000000'
                                    }`} alt="" />
                        }
                    </div>
                    <div>
                        <h1 className="text-white sm:text-3xl text-2xl font-bold mb-1 text-center">{user?.name}</h1>
                        <h1 className="text-gray-700 ">{user?.email}</h1>
                        <h1 className="text-gray-700 mb-5">{user?.department}</h1>
                        <div className="flex flex-row gap-4">
                            <div className="flex flex-col items-center">
                                <h1 className="text-white text-3xl font-bold ">{user?.Posts?.length || 0}</h1>
                                <p className="text-gray-50 font-medium text-sm">Posts</p>
                            </div>
                            <div className="flex flex-col items-center">
                                <h1 className="text-white text-3xl font-bold ">{user?.Comment?.length || 0}</h1>
                                <p className="text-gray-50 font-medium text-sm">Upvotes</p>
                            </div>
                            <div className="flex flex-col items-center">
                                <h1 className="text-white text-3xl font-bold ">{user?.Vote?.length || 0}</h1>
                                <p className="text-gray-50 font-medium text-sm">Comments</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="bg-white flex gap-4 border-b border-gray-300">
                <button onClick={() => { setIsActive('posts') }}
                    className={`${isActive === 'posts' ? 'border-b-2 border-blue bg-gray-200 px-4 p-2 text-blue-400 transition-all duration-300 ' : 'p-2 px-4'}`}>
                    My Posts
                </button>
                <button onClick={() => { setIsActive('liked') }}
                    className={`${isActive === 'liked' ? 'border-b-2 border-blue bg-gray-200 px-4 p-2 text-blue-400 transition-all duration-300 ' : 'p-2 px-4'}`}>
                    Liked Posts
                </button>
                <button onClick={() => { setIsActive('comments') }}
                    className={`${isActive === 'comments' ? 'border-b-2 border-blue bg-gray-200 px-4 p-2 text-blue-400 transition-all duration-300 ' : 'p-2 px-4'}`}>
                    My Comments
                </button>
                <button onClick={() => { setIsActive('settings') }}
                    className={`${isActive === 'settings' ? 'border-b-2 border-blue bg-gray-200 px-4 p-2 text-blue-400 transition-all duration-300 ' : 'p-2 px-4'}`}>
                    Settings
                </button>
            </div>
            {
                isActive === 'posts' &&
                <div className="bg-white">
                    <h1 className="text-black text-xl font-bold p-4">My Posts</h1>
                    <div className=" p-2 gap-8 flex flex-col px-4  ">
                        {
                            posts?.map((item, index) => {
                                return (
                                    <div data-aos="fade-up" key={index} className="flex cursor-pointer flex-col gap-2 mb-4 border border-gray-200  rounded-xl sm:p-4 p-2">
                                        <Link key={index} to={`/posts/${item.id}`}>
                                            <div className="flex flex-col gap-2">
                                                <div className="flex flex-row justify-between items-center">
                                                    <h1 className="text-black text-xl font-medium ">{item.title}</h1>
                                                    <div className="bg-red-200 border border-red-400 rounded-full px-3 p-0.5 items-center">
                                                        <h1 className="text-red-500 font-medium text-sm ">{item.status}</h1>
                                                    </div>
                                                </div>
                                                <div className="flex-row flex items-center gap-4 justify-between">
                                                    <div className="flex-row flex gap-2">
                                                        <div className="bg-green-200 border border-green-400 rounded-full px-3 p-0.5">
                                                            <h1 className="text-green-500 font-medium text-sm">{item.catogery}</h1>
                                                        </div>
                                                        <h1 className="text-gray-500">📍{item.location}</h1>
                                                        <h1 className="text-gray-500">{formatTimeAgo(item.createdAt)}</h1>
                                                    </div>
                                                </div>
                                                <p className="text-gray-500">{item.description}</p>
                                                <img className="w-full " src={item.image}></img>
                                            </div>

                                        </Link>


                                    </div>

                                )
                            })
                        }
                        {
                            posts?.length === 0 &&
                            <div className=" text-center items-center justify-center flex h-[200px]">
                                <h1 className="text-center text-xl text-gray-500 font-bold">You haven't posted any issue yet!</h1>
                            </div>
                        }


                    </div>
                </div>
            }
            {
                isActive === 'liked' &&
                <div className="bg-white">
                    <h1 className="text-black text-xl font-bold p-4">Upvoted</h1>
                    <div className=" p-2 gap-8 flex flex-col xl:px-4 lg:px-32 md:px-24 ">
                        {
                            user?.Vote?.map((item, index) => {
                                return (
                                    <div data-aos="fade-up" key={index} className="flex cursor-pointer flex-col gap-2 mb-4 border border-gray-200  rounded-xl sm:p-4 p-2">
                                        <Link key={index} to={`/posts/${item.id}`}>
                                            <div className="flex flex-col gap-2">
                                                <div className="flex flex-row justify-between items-center">

                                                    <h1 className="text-black text-xl font-medium ">{item.post.title}</h1>
                                                    <div className="bg-red-200 border border-red-400 rounded-full px-3 p-0.5 items-center">

                                                        <h1 className="text-red-500 font-medium text-sm ">{item.post.status}</h1>
                                                    </div>
                                                </div>
                                                <div className="flex-row flex items-center gap-4 justify-between">
                                                    <div className="flex-row flex gap-2">
                                                        <div className="bg-green-200 border border-green-400 rounded-full px-3 p-0.5">

                                                            <h1 className="text-green-500 font-medium text-sm">{item.post.catogery}</h1>
                                                        </div>

                                                        <h1 className="text-gray-500">📍{item.post.location}</h1>

                                                        <h1 className="text-gray-500">{formatTimeAgo(item.post.createdAt)}</h1>
                                                    </div>
                                                </div>

                                                <p className="text-gray-500">{item.post.description}</p>

                                                <img className="w-full " src={item.post.image}></img>
                                            </div>

                                        </Link>


                                    </div>

                                )
                            })
                        }
                        {
                            posts?.length === 0 &&
                            <div className="h-[200px] flex justify-center items-center">
                                <h1 className="text-center text-xl text-gray-500 font-bold">You have not upvoted any posts yet!</h1>
                            </div>
                        }


                    </div>
                </div>
            }
            {
                isActive === 'comments' &&
                <div className="bg-white ">
                    <h1 className="text-black text-xl font-bold p-4">Comments</h1>
                    <div className=" p-2 gap-8 flex flex-col  ">
                        {
                            user?.Comment.map((item) => {
                                return (
                                    <div className="mb-2 bg-white hover:bg-gray-100 p-4 transition-all duration-300 cursor-pointer">
                                        {
                                            item.parent !== null
                                                ?
                                                <div className="flex flex-row justify-between">
                                                    <div className="flex flex-row gap-3 mb-4">
                                                        <img className="rounded-full sm:w-12 sm:h-12 w-6 h-6" src={`${item?.parent?.user?.picture || 'N/A'}`} alt="" />
                                                        <div>
                                                            <h1 className="font-bold sm:text-sm sm:w-full w-36 text-[14px]">{item?.parent?.user?.name || 'N/A'}</h1>
                                                            <h1 className="sm:text-sm text-[10px] text-gray-500 font-semibold">{formatTimeAgo(item?.parent?.createdAt || 'N.A')}</h1>
                                                        </div>
                                                        <div>
                                                            <h1>{item?.parent?.text || 'N/A'}</h1>
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <img className="w-20 " src={`${item.post.image}`} alt="" />
                                                    </div>
                                                </div>
                                                :
                                                <div className="flex flex-row justify-between">
                                                    <div className="flex flex-row gap-3 mb-4">
                                                        <img className="rounded-full w-12 h-12" src={`${item?.post.user.picture || 'N/A'}`} alt="" />
                                                        <div>
                                                            <h1 className="font-bold sm:text-sm sm:w-full w-36 text-[14px]">{item?.post?.user?.name || 'N/A'}</h1>
                                                            <h1 className="sm:text-sm text-[10px] text-gray-500 font-semibold">{formatTimeAgo(item?.post?.createdAt || 'N.A')}</h1>
                                                        </div>
                                                        <div>
                                                            <h1>{item?.post?.title || 'N/A'}</h1>
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <img className="w-20 " src={`${item.post.image}`} alt="" />
                                                    </div>
                                                </div>
                                        }

                                        <div className="ml-8 flex flex-col gap-4">
                                            <div className="flex flex-row items-center gap-2">
                                                <img className="rounded-full w-10 h-10" src={`${user.picture}`} alt="" />
                                                <div>
                                                    <h1 className="font-bold  text-[10px]">{user.name}</h1>
                                                    <h1 className="font-bold text-sm text-gray-500">{formatTimeAgo(item.createdAt)}</h1>

                                                </div>
                                            </div>
                                            <div className="">
                                                <h1 className="">{item.text}</h1>
                                            </div>
                                        </div>
                                    </div>

                                )
                            })
                        }
                        {
                            user?.Comment.length === 0 &&
                            <div className="h-[200px] flex justify-center items-center">
                                <h1 className="text-center text-xl text-gray-500 font-bold">You have not commented on any posts yet!</h1>
                            </div>
                        }
                    </div>

                </div>

            }
            {
                isActive === 'settings' &&
                <div className="bg-white p-4">
                    <h1 className="text-black text-xl font-bold ">Profile Settings</h1>

                    <form onSubmit={handleUpdateProfile} action="">
                        <div className="flex flex-col gap-6">
                            <div className="">
                                <p className=" text-gray-700 font-medium">Display Name</p>
                                <input className="border border-gray-400 rounded-lg w-80 p-1  text-start" type="text" value={user?.name} />
                            </div>
                            <div className="">
                                <p className=" text-gray-700 font-medium">Department</p>
                                <select
                                    defaultValue=""
                                    className="border border-gray-700 rounded-lg p-1.5  self-start text-start items-start" name="" id=""
                                    value={department} onChange={(e) => { setDepartment(e.target.value) }}
                                >
                                    <option value="" disabled >
                                        Select your department
                                    </option>
                                    <option value="Master of Computer Application">Master of Computer Application (MCA)</option>
                                    <option value="Bachelor of Technology">Bachelor of Technology (B.Tech)</option>
                                    <option value="Master of Business Adminstartion">Master of Business Adminstartion (MBA)</option>
                                    <option value="Master of Technology">Master of Technology (M.Tech)</option>
                                    <option value="PhD">Doctor of Philospy (PhD)</option>
                                </select>
                            </div>
                            <div>
                                <button type="submit" className="px-6 p-2 rounded-xl bg-blue-500 text-white bg-gradient-to-r 
                                from-blue-400 to-blue-600 hover:bg-gradient-to-r hover:from-[#6068F1] hover:to-[#8936EA] 
                         transition-colors duration-1000 cursor-pointer
                                ">
                                    Save Changes
                                </button>
                            </div>


                        </div>

                    </form>

                </div>
            }
            <>
                <Modal isOpen={showCropModal} onRequestClose={() => setShowCropModal(false)} className="modal-class">
                    <div className="w-full h-[400px] relative">
                        {imageSrc && (
                            <Cropper
                                image={imageSrc}
                                crop={crop}
                                zoom={zoom}
                                aspect={1}
                                onCropChange={setCrop}
                                onZoomChange={setZoom}
                                //@ts-ignore
                                onCropComplete={(_, croppedAreaPixels) => setCroppedAreaPixels(croppedAreaPixels)}
                            />
                        )}
                    </div>
                    <div className="mt-4 flex justify-between">
                        <button onClick={() => setShowCropModal(false)} className="p-2 bg-red-500 text-white rounded">Cancel</button>
                        <button
                            onClick={async () => {
                                if (!imageSrc || !croppedAreaPixels) return;
                                const croppedBlob = await getCroppedImg(imageSrc, croppedAreaPixels, zoom);
                                const croppedFile = new File([croppedBlob], selectedFile?.name || 'cropped.jpg', { type: 'image/jpeg' });
                                setPicture(croppedFile);
                                setShowCropModal(false);
                            }}
                            className="p-2 bg-blue-500 text-white rounded"
                        >
                            Crop & Save
                        </button>
                    </div>
                </Modal>

            </>
        </div>



    )
}


