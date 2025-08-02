import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

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

    const handleLogout = async () => {
        localStorage.removeItem('token');
        setAuthenticate(false);
        navigate('/');
    }

    const getUser = async () => {
        const token = localStorage.getItem('token');

        const response = await axios(`http://127.0.0.1:8787/protected/profile`, {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + token
            }
        })
        setUser(response.data.user);

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
        <div className="flex flex-row justify-between px-4 p-4 border-b border-gray-200 ">
            <div className="flex-row flex items-center gap-2">
                <img className="w-7 h-7" src="https://img.icons8.com/?size=100&id=49454&format=png&color=000000"></img>
                <Link to='/'>
                    <h1 className="font-extrabold text-2xl text-[#6975DD] ">FixMyCampus</h1>
                </Link>

            </div>
            <div className="md:flex  flex-row gap-12 hidden  items-center py-2">
                <h1 className="text-gray-500">Features</h1>
                <h1 className="text-gray-500">About</h1>
                <h1 className="text-gray-500">Contact</h1>
                {
                    authenticated &&
                    <>
                        {
                            user?.picture ?
                                <div className="border border-black-2 rounded-full mr-10">
                                    <img className="rounded-full" style={{ width: 40, height: 40 }} src={`${user.picture}`}></img>
                                </div>
                                :
                                <img className="w-3 h-3" src="https://img.icons8.com/?size=100&id=98957&format=png&color=000000" alt="" />
                        }
                    </>

                }
                {
                    authenticated &&
                    <button onClick={handleLogout} className="bg-red-500 px-3 p-1 rounded-xl text-white cursor-pointer">
                        Logout
                    </button>
                }

            </div>

        </div>
    )
}