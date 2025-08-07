import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from "jwt-decode";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux'
import {login} from '../store/userSlice'

export default function Login() {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleLogin = async (credentialResponse: any) => {
        const decodedUser: any = jwtDecode(credentialResponse.credential);
        const email = decodedUser.email;
        if (email.endsWith('@stu.manit.ac.in')) {

        } else {
            alert("Access restricted to @stu.manit.ac.in emails only.");
            return;
        }

        const response = await axios.post('https://fixmycampus.movieapi-backend.workers.dev/google', decodedUser, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
        if (response.data.token) {
            dispatch(login());
            localStorage.setItem("token", response.data.token);

            navigate('/');
        } else {
            console.warn("No token received");
        }

    };

    return (
        <div className='bg-[#111827] h-screen justify-center flex'>
            <div className="justify-center self-center p-8 items-center flex flex-col bg-[#1F2937] rounded-xl mx-4 gap-6">
                <h1 className='text-white font-extrabold text-2xl'>FixMyCampus</h1>
                <p className='text-gray-300'>Sign in or sign up to continue</p>
                <p className='text-white text-center'>You can only log in with your NIT Bhopal student Google account.</p>
                <GoogleLogin
                    onSuccess={handleLogin}
                    onError={() => {
                        console.log('Login Failed');
                    }}
                />
            </div>
        </div>
    )
}
