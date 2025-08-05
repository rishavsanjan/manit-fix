import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from "jwt-decode";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function Login() {
    const navigate = useNavigate();

    const handleLogin = async (credentialResponse: any) => {
        const decodedUser: any = jwtDecode(credentialResponse.credential);
        console.log("Decoded Google User:", decodedUser);

        const response = await axios.post('http://127.0.0.1:8787/google', decodedUser, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
        console.log('User saved or logged in:', response.data);
        if (response.data.token) {
            localStorage.setItem("token", response.data.token);
            console.log("Token saved!");
            navigate('/');
        } else {
            console.warn("No token received");
        }
        useNavigate

    };

    return (
        <div className='bg-[#111827] h-screen justify-center flex'>
            <div className="justify-center self-center p-8 items-center flex flex-col bg-[#1F2937] rounded-xl px-16 gap-6">
                <h1 className='text-white font-extrabold text-2xl'>MANIT Fix</h1>
                <p className='text-gray-300'>Sign in or sign up to continue</p>
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
