import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import 'aos/dist/aos.css';
//@ts-ignore
import AOS from 'aos';

interface Profile {
    email: string,
    id: string,
    naem: string,
    picture: string
}

export default function Header() {
    const navigate = useNavigate();
    const [authenticated, setAuthenticate] = useState(false);
    const [user, setUser] = useState<Profile | null>(null);
    const [fullWhite, setFullWhite] = useState(false);
    const [profileDropdown, setProfileDropDown] = useState(false);
    useEffect(() => {
        AOS.init({
            duration: 600,
            easing: 'ease-out-cubic',
            once: true,
        });
    }, []);


    const handleLogout = async () => {
        localStorage.removeItem('token');
        setAuthenticate(false);
        navigate('/');
    }

    const getUser = async () => {
        const token = localStorage.getItem('token');
        if (token) {
            const response = await axios(`https://fixmycampus.movieapi-backend.workers.dev/protected/profile`, {
                method: 'GET',
                headers: {
                    'Authorization': 'Bearer ' + token
                }
            })
            setUser(response.data.user);
        }



    }

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            setAuthenticate(true);
        } else {
            return;
        }
        getUser();
    }, []);


    return (
        <>
            <div className="flex flex-row justify-between px-4 p-4 border-b border-gray-200 ">

                <div className="flex-row flex items-center gap-2 justify-between w-full">
                    <div className="flex flex-row gap-2">
                        <img className="w-7 h-7" src="https://img.icons8.com/?size=100&id=49454&format=png&color=000000"></img>
                        <Link to='/'>
                            <h1 className="font-extrabold sm:text-2xl text-xl text-[#6975DD] ">FixMyCampus</h1>
                        </Link>
                    </div>
                    {
                        fullWhite ?
                            <button onClick={() => { setFullWhite(false) }} className="sm:hidden pt-2 cursor-pointer">
                                <img className="w-8 h-8 " src="https://img.icons8.com/?size=100&id=43980&format=png&color=000000" alt="" />
                            </button>
                            :
                            <button onClick={() => { setFullWhite(true) }} className="sm:hidden pt-2 cursor-pointer">
                                <img className="w-8 h-8 " src="https://img.icons8.com/?size=100&id=44024&format=png&color=000000" alt="" />
                            </button>
                    }



                </div>
                <div className="md:flex  flex-row gap-12 hidden  items-center py-2">
                    <Link to="/features">
                        <button className="hover:bg-purple-400 transition-all duration-300
                           p-2 rounded-xl">
                            <h1 className="hover:text-white text-gray-500">Features</h1>
                        </button>

                    </Link>
                    <button className="hover:bg-purple-400 transition-all duration-300
                       p-2 rounded-xl">
                        <h1 className="hover:text-white text-gray-500">About</h1>
                    </button>


                    <button className="hover:bg-purple-400 transition-all duration-300
                       p-2 rounded-xl">
                        <a className="cursor-pointer" href="https://rishavsanjan-portfolio.netlify.app/">
                            <h1 className="hover:text-white text-gray-500">Contact</h1>
                        </a>
                    </button>


                    {
                        authenticated &&
                        <>
                            {
                                <div  className=" mr-10 group relative">
                                    <div className="rounded-full border-2 border-black" >
                                        <img style={{ width: 40, height: 40 }} src={`${user?.picture || 'https://img.icons8.com/?size=100&id=u4U9G3tGGHu1&format=png&color=000000'}`}></img>
                                    </div>

                                    <div className="w-32 p-4 z-50 rounded-xl bg-gray-200 absolute top-10 right-0
                                         opacity-0 invisible group-hover:opacity-100 group-hover:visible
                                          transition-all transform 
                                          duration-300 ease-in-out items-center justify-center flex flex-col gap-4">
                                        <Link to="/my-profile">
                                            <button><h1>My Profile</h1></button>
                                        </Link>

                                        <button><h1>My Posts</h1></button>
                                        {
                                            authenticated &&
                                            <button onClick={handleLogout} className="bg-red-500 px-3 p-1 rounded-xl text-white cursor-pointer">
                                                Logout
                                            </button>
                                        }
                                    </div>
                                </div>
                            }
                        </>

                    }


                </div>

            </div>
            {
                fullWhite &&
                <div data-aos="slide-left" className="bg-white h-screen  p-4 gap-4 flex flex-col transition-all duration-300 overflow-hidden">
                    <Link to="/">
                        <button className="w-full flex flex-row justify-between items-center" onClick={() => setFullWhite(false)}>
                            <h1 className="p-4 hover:bg-gray-200 transition-all duration-300 text-start">Home</h1>
                            <img className="w-4 h-4" src="https://img.icons8.com/?size=100&id=61&format=png&color=000000" alt="" />
                        </button>

                    </Link>
                    <Link to="/report-upload">
                        <button className="w-full flex flex-row justify-between items-center" onClick={() => setFullWhite(false)}>
                            <h1 className="p-4 hover:bg-gray-200 transition-all duration-300 text-start">Post</h1>
                            <img className="w-4 h-4" src="https://img.icons8.com/?size=100&id=61&format=png&color=000000" alt="" />
                        </button>

                    </Link>
                    <Link to="/posts">
                        <button className="w-full flex flex-row justify-between items-center" onClick={() => setFullWhite(false)}>
                            <h1 className="p-4 hover:bg-gray-200 transition-all duration-300 text-start">Browse</h1>
                            <img className="w-4 h-4" src="https://img.icons8.com/?size=100&id=61&format=png&color=000000" alt="" />
                        </button>

                    </Link>
                    <Link to="/features">
                        <button className="w-full flex flex-row justify-between items-center" onClick={() => setFullWhite(false)}>
                            <h1 className="p-4 hover:bg-gray-200 transition-all duration-300 text-start">Features</h1>
                            <img className="w-4 h-4" src="https://img.icons8.com/?size=100&id=61&format=png&color=000000" alt="" />
                        </button>
                    </Link>
                    <a href="https://rishavsanjan-portfolio.netlify.app/">
                        <button className="w-full flex flex-row justify-between items-center" onClick={() => setFullWhite(false)}>
                            <h1 className="p-4 hover:bg-gray-200 transition-all duration-300 text-start">About</h1>
                            <img className="w-4 h-4" src="https://img.icons8.com/?size=100&id=61&format=png&color=000000" alt="" />
                        </button>
                    </a>
                    {
                        authenticated &&
                        <Link to="/my-profile">
                        <button className="w-full flex flex-row justify-between items-center" onClick={() => setFullWhite(false)}>
                            <h1 className="p-4 hover:bg-gray-200 transition-all duration-300 text-start">My Profile</h1>
                            <img className="w-4 h-4" src="https://img.icons8.com/?size=100&id=61&format=png&color=000000" alt="" />
                        </button>
                    </Link>
                    }
                </div>
            }
        </>


    )
}