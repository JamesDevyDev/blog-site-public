import { geologica, alegreyna } from "@/lib/fonts"

import type { Metadata } from "next"

export const metadata: Metadata = {
    title: "Photos — James",
}

const page = () => {
    return (
        <div className="bg-[#f0f2f4] dark:bg-[#151718] min-h-screen px-4">
            <div className="max-w-xl w-full mx-auto pt-10 flex flex-col gap-8 pb-16">

                <div className="text-center">
                    <h1 className={`${geologica.className} text-4xl font-bold dark:text-white mb-3`}>
                        Photos
                    </h1>
                    <p className={`${alegreyna.className} text-gray-700 dark:text-gray-300 text-2xl leading-relaxed`}>
                        Random Photos about what's happening in my life.
                    </p>
                </div>

            
            </div>
        </div>
    )
}

export default page
