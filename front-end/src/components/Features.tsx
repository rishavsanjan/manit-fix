import { featuresData } from "../utils/homepageHelpData"

export default function Features() {
    return (
        <div className="flex flex-col">
            <h1 className="sm:text-5xl text-4xl  text-[#C27AFF] font-extrabold text-center mt-20 ">Powerful Features for Fix My Campus
            </h1>
            <p className="text-[#6A7282] text-lg font-normal text-center p-4">Everything you need to report, track, and resolve campus issues efficiently

            </p>
            <div className="flex sm:flex-row flex-col flex-wrap justify-between sm:mt-20 mt-4 mb-20">
                {
                    featuresData.map((item, index) => {
                        return (
                            <div data-aos="slide-up" key={index} className="flex flex-col m-4 p-4  shadow-xl
                             hover:backdrop-blur-3xl hover:-translate-y-2 transition-all
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
        </div>

    )
}