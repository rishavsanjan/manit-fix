export default function ReportUpload() {
    return (
        <div className="h-full w-full
                bg-[image:var(--gradient-animated)]
                bg-[size:var(--size-400)]
                animate-[animation:var(--animate-gradient)] items-center ">
            <div className=" pt-20 mx-96 ">
                <div className=" w-full
                    bg-[image:var(--gradient-animated)]
                    bg-[size:var(--size-400)]
                    animate-[animation:var(--animate-gradient)] items-center  py-12 rounded-t-xl ">
                    <h1 className="text-white font-extrabold text-4xl text-center">Report an Issue</h1>
                    <p className="text-white text-center">Help us make the campus better by reporting any problems you encounter</p>
                </div>
                <form>
                    <div className="bg-white p-8 gap-2 flex-col flex">
                        <h1 className="flex-row flex font-medium text-sm">Issue Title <p className="text-red-500">*</p></h1>
                        <input type="text" placeholder="Brief description of the issue"
                            className="w-full p-3 border-2 rounded-xl border-gray-300 font-medium focus:border-blue-500
                            outline-none transition-colors duration-300 text-sm bg-gray-100
                            " />
                    </div>
                    <div className="bg-white p-8 gap-2 flex-col flex">
                        <h1 className="flex-row flex font-medium text-sm">Description <p className="text-red-500">*</p></h1>
                        <textarea placeholder="Provide detailed information about the issue, when you noticed it, and any other relevant details..."
                            className="w-full p-2 border-2 rounded-xl border-gray-300 font-medium focus:border-blue-500
                            outline-none transition-colors duration-300 h-32 bg-gray-100
                            " />
                    </div>
                    <div className="bg-white p-8 gap-2 flex-col flex">
                        <h1 className="flex-row flex font-medium text-sm">Catogery <p className="text-red-500">*</p></h1>
                        <select
                            className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 outline-none transition-colors duration-300"
                            defaultValue=""
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
                        <input type="text" placeholder="e.g. Hostel-9, MANIT"
                            className="w-full p-3 border-2 rounded-xl border-gray-300 font-medium focus:border-blue-500
                            outline-none transition-colors duration-300 text-sm bg-gray-100
                            " />
                    </div>
                    <div className="bg-white p-8 gap-2 flex-col flex">
                        <h1 className="flex-row flex font-medium text-sm">Upload Image (Optional) <p className="text-red-500"> *</p></h1>
                        <div className="border border-dashed items-center rounded-xl flex flex-col p-8 gap-4">
                            <span className="text-5xl select-none">📷</span>
                            <p>
                                <input type="file" accept="image/*" placeholder="Click to upload"
                                    className="cursor-pointer text-blue-600 underline text-center
                            " /> 
                            </p>
                            <p className="text-gray-600 text-sm">PNG, JPG up to 5MB</p>

                        </div>

                    </div>
                </form>


            </div>


        </div>
    )
}