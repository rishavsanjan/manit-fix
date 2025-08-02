import axios from "axios";
import { useState } from "react"
import ClipLoader from "react-spinners/ClipLoader";


export default function ReportUpload() {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [catogery, setCatogery] = useState('');
    const [location, setLocation] = useState('');
    const [image, setImage] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);


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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        const formData = new FormData();
        formData.append('title', title);
        formData.append('description', description);
        formData.append('catogery', catogery);
        formData.append('location', location);
        let postPicUrl = '';
        if (image) {
            postPicUrl = await uploadToCloudinary(image)
        }

        console.log(postPicUrl)

        const token = localStorage.getItem('token');
        const response = await axios(`http://127.0.0.1:8787/protected/upload-post`, {
            method: 'post',
            headers: {
                'Authorization': 'Bearer ' + token
            },
            data: {
                title, description, catogery, location, postPicUrl
            }
        })

        console.log(response.data);

        setTitle('');
        setDescription('');
        setCatogery('');
        setLocation('');
        setLoading(false)

    }

    console.log(image)

    return (
        <div className="h-full w-full
                bg-[image:var(--gradient-animated)]
                bg-[size:var(--size-400)]
                animate-[animation:var(--animate-gradient)] items-center ">
            <div className=" pt-20 xl:px-96 lg:px-60 md:px-24 px-4 ">
                <div className=" w-full
                    bg-[image:var(--gradient-animated)]
                    bg-[size:var(--size-400)]
                    animate-[animation:var(--animate-gradient)] items-center  py-12 rounded-t-xl ">
                    <h1 className="text-white font-extrabold text-4xl text-center">Report an Issue</h1>
                    <p className="text-white text-center">Help us make the campus better by reporting any problems you encounter</p>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="bg-white p-8 gap-2 flex-col flex">
                        <h1 className="flex-row flex font-medium text-sm">Issue Title <p className="text-red-500">*</p></h1>
                        <input required type="text" placeholder="Brief description of the issue"
                            className="w-full p-3 border-2 rounded-xl border-gray-300 font-medium focus:border-blue-500
                            outline-none transition-colors duration-300 text-sm bg-gray-100
                            " onChange={e => { setTitle(e.target.value) }} value={title} />
                    </div>
                    <div className="bg-white p-8 gap-2 flex-col flex">
                        <h1 className="flex-row flex font-medium text-sm">Description <p className="text-red-500">*</p></h1>
                        <textarea required placeholder="Provide detailed information about the issue, when you noticed it, and any other relevant details..."
                            className="w-full p-2 border-2 rounded-xl border-gray-300 font-medium focus:border-blue-500
                            outline-none transition-colors duration-300 h-32 bg-gray-100
                            " onChange={e => { setDescription(e.target.value) }} value={description} />
                    </div>
                    <div className="bg-white p-8 gap-2 flex-col flex">
                        <h1 className="flex-row flex font-medium text-sm">Catogery <p className="text-red-500">*</p></h1>
                        <select required
                            className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 outline-none transition-colors duration-300"
                            defaultValue="" onChange={e => { setCatogery(e.target.value) }} value={catogery}
                        >
                            <option value="" disabled>
                                Select an catogery
                            </option>
                            <option value="hostel">Hostel</option>
                            <option value="mess">Mess</option>
                            <option value="wifi">Wifi</option>
                            <option value="academicBlock">Academic Block</option>
                            <option value="library">Library</option>
                            <option value="sportscomplex">Sports Complex</option>
                            <option value="medicalcenter">Medical Center</option>
                            <option value="transport">Transport</option>
                            <option value="other">Other</option>
                        </select>

                    </div>
                    <div className="bg-white p-8 gap-2 flex-col flex">
                        <h1 className="flex-row flex font-medium text-sm">Location <p className="text-red-500">*</p></h1>
                        <input required type="text" placeholder="e.g. Hostel-9, MANIT"
                            className="w-full p-3 border-2 rounded-xl border-gray-300 font-medium focus:border-blue-500
                            outline-none transition-colors duration-300 text-sm bg-gray-100
                            " onChange={e => { setLocation(e.target.value) }} value={location} />
                    </div>
                    <div className="bg-white p-8 gap-2 flex-col flex">
                        <h1 className="flex-row flex font-medium text-sm">Upload Image (Optional) <p className="text-red-500"> *</p></h1>
                        <div className="border border-dashed items-center rounded-xl flex flex-col p-8 gap-4">
                            <span className="text-5xl select-none">📷</span>
                            <p>
                                <input type="file" accept="image/*" placeholder="Click to upload"
                                    className="cursor-pointer text-blue-600 underline text-center
                            "           onChange={e => setImage(e.target.files?.[0] ?? null)}
                                />
                            </p>
                            <p className="text-gray-600 text-sm">PNG, JPG up to 5MB</p>

                        </div>
                    </div>
                    <div className="bg-white p-8 gap-2 flex-col flex cursor-pointer">
                        <button type="submit" className="bg-blue-500 text-white p-2 rounded-2xl bg-gradient-to-r from-blue-400
                         to-blue-600 hover:bg-gradient-to-r hover:from-[#6068F1] hover:to-[#8936EA] 
                         transition-colors duration-1000 cursor-pointer
                         ">  {loading ? <div className="items-center justify-center flex gap-1"><ClipLoader color="#fff" size={20} /> Uploading...</div> : "Submit"}
                        </button>
                    </div>
                </form>


            </div>


        </div>
    )
}