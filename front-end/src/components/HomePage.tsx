import { featuresData } from "../utils/homepageHelpData"
import { Link } from "react-router-dom";
import 'aos/dist/aos.css';
//@ts-ignore
import AOS from 'aos';
import { useEffect, useState } from "react";
import ClipLoader from "react-spinners/ClipLoader";


export default function HomePage() {
    const [authenticate, setAuthenticate] = useState(false);
    const isAuthenticated = () => {
        const token = localStorage.getItem('token');
        if (token) {
            setAuthenticate(true);
        }
    }

    useEffect(() => {
        isAuthenticated();
    }, []);



    useEffect(() => {
        AOS.init({
            duration: 600,
            easing: 'ease-out-cubic',
            once: false,
        });
    }, []);
    return (
        <div data-aos="slide-up" className="">
            <div className="h-[500px] w-full
                bg-[image:var(--gradient-animated)]
                bg-[size:var(--size-400)]
                animate-[animation:var(--animate-gradient)]">
                <div className="flex flex-col h-full items-center justify-center gap-4">
                    <h1 className="text-5xl  text-white font-extrabold text-center">Your Campus, Your Voice</h1>
                    <p className="text-white text-lg font-normal text-center p-4">Report campus issues, track progress,
                        vote on priorities, and hold administration accountable. Join thousands
                        of students making their campus better.
                    </p>

                    <div className="flex gap-4">
                        <Link to='/report-upload'>
                            <button className="bg-white text-purple-400 rounded-full p-3 px-5
                     font-medium hover:-translate-y-1 transition-all duration-300 cursor-pointer">Report an issue</button>
                        </Link>
                        <Link to='/posts'>
                            <button className="bg-transparent rounded-full p-3 px-5 font-medium
                     hover:bg-white hover:text-purple-400 text-white
                     transition-all duration-300 border-white border-2 hover:-translate-y-1 cursor-pointer
                     ">Browse issues
                            </button>
                        </Link>

                    </div>
                </div>

            </div>
            <div className="flex-col mt-12  items-center gap-4 flex ">
                <h1 className="font-extrabold text-4xl text-[#1E293B]">How it Works</h1>
                <p className="text-gray-500 text-lg text-center">Simple, powerful tools to transform your campus experience</p>
            </div>
            <div className="flex sm:flex-row flex-col flex-wrap justify-between sm:mt-20 mt-4 mb-20">
                {
                    featuresData.map((item, index) => {
                        return (
                            <div data-aos="slide-up" key={index} className="flex flex-col m-4 p-4  shadow-xl
                             hover:backdrop-blur-3xl hover:-translate-y-3 transition-all
                              duration-300  rounded-xl gap-4 border border-gray-200  xl:w-96 lg:w-80 sm:w-72  ">
                                <div className="bg-purple-500 p-2 self-start  rounded-lg">
                                    <img className="w-5 h-5 " src={item.icon}></img>
                                </div>
                                <h1 className="text-lg font-bold">{item.title}</h1>
                                <span className="text-gray-500">{item.description}</span>
                            </div>
                        )
                    })
                }
            </div>
            <div className="bg-[#283447]  flex flex-row flex-wrap gap-12 lg:justify-between justify-center px-20 py-20 ">
                <div className="flex-col flex gap-4 items-center justify-center " >
                    <h1 className="font-extrabold text-5xl gap-4 text-[#60A5FA]">2,837</h1>
                    <p className="text-white">Issues reported</p>
                </div>
                <div className="flex-col flex gap-4 items-center justify-center  ">
                    <h1 className="font-extrabold text-5xl gap-4 text-[#60A5FA]">1,923</h1>
                    <p className="text-white">Issues Resolved</p>
                </div>
                <div className="flex-col flex gap-4 items-center justify-center  ">
                    <h1 className="font-extrabold text-5xl gap-4 text-[#60A5FA]">68%</h1>
                    <p className="text-white">Resolution Rate</p>
                </div>
                <div className="flex-col flex gap-4 items-center justify-center  ">
                    <h1 className="font-extrabold text-5xl gap-4 text-[#60A5FA]">5,200</h1>
                    <p className="text-white">Active Students</p>
                </div>
            </div>
            <div className=" w-full
            bg-[image:var(--gradient-animated)]
            bg-[size:var(--size-400)]
            animate-[animation:var(--animate-gradient)] flex items-center py-20 flex-col gap-6">
                <h1 className="text-4xl font-extrabold text-white text-center">Ready to Fix Your Campus?</h1>
                <p className="text-white text-center">Join thousands of students who are already making their voices heard</p>
                <Link to={`${authenticate ? '/report-upload' : '/login'}`}>
                    <button className="text-purple-400 cursor-pointer bg-white px-6 py-2 rounded-full transition-all duration-300 hover:-translate-y-2">{authenticate ? 'Start reporting today' : 'LogIn / SignUp Now'} </button>
                </Link>
            </div>
        </div>

    )
}
