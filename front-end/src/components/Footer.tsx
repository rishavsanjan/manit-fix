import { Link } from "react-router-dom";

export default function Footer() {
    return (
        <div className="flex flex-col py-8 bg-[#1A1A1A] p-4 gap-6">
            <div className="flex sm:flex-row flex-col justify-between">
                <div className="flex flex-row items-center gap-2 sm:mb-0 mb-4">
                    <img className="w-7 h-7" src="https://img.icons8.com/?size=100&id=49454&format=png&color=000000"></img>
                    <Link to='/'>
                        <h1 className="font-extrabold sm:text-2xl text-xl text-[#6975DD] ">FixMyCampus</h1>
                    </Link>
                </div>
                <div className="flex sm:flex-row flex-col sm:gap-4 gap-1 text-gray-400">
                    <p>Privacy Policy</p>
                    <p>Terms of Service</p>
                    <p>Support</p>
                    <p>About</p>
                </div>
            </div>
            <div>
                <p className="text-white">© 2025 FixMyCampus. Making campuses better, one report at a time.</p>
                <Link to="/admin"><p>Go To Admin Section</p></Link>
            </div>
        </div>
    )
}