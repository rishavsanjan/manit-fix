import { Link } from "react-router-dom";

interface LogInProps {
    visible: boolean,
    onClose: React.Dispatch<React.SetStateAction<boolean>>;
}

export const NeedToLogInModal: React.FC<LogInProps> = ({ visible, onClose }) => {
    if (!visible) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex justify-center items-center">
            <div className="bg-white rounded-xl p-6 w-[90%] max-w-sm shadow-xl relative">
                <button onClick={() => { onClose(false) }} className="absolute top-3 right-4 cursor-pointer text-gray-500 text-xl">&times;</button>
                <h2 className="text-lg font-semibold mb-4">Login Required</h2>
                <p className="mb-6 text-sm text-gray-600">You need to log in to continue.</p>
                <Link to="/login">
                    <button

                        className="bg-blue-600  cursor-pointer text-white 
                        px-4 py-2 rounded w-full hover:bg-blue-700 transition-all duration-200"
                    >
                        Login
                    </button>

                </Link>
            </div>
        </div>
    );
}