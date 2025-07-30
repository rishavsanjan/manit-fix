
export default function Header() {
    return (
        <div className="flex flex-row justify-between px-4">
            <div className="flex-row flex items-center gap-2">
                <img className="w-7 h-7" src="https://img.icons8.com/?size=100&id=49454&format=png&color=000000"></img>
                <h1 className="font-extrabold text-2xl text-[#6975DD] ">M.A.N.I.T. Fix</h1>
            </div>
            <div className="flex flex-row gap-12 items-center py-2">
                <h1 className="text-gray-500">Features</h1>
                <h1 className="text-gray-500">About</h1>
                <h1 className="text-gray-500">Contact</h1>
                <button className="py-2 px-3 rounded-full bg-[#6975DD] text-white">Get Started</button>
            </div>

        </div>
    )
}