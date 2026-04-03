import Blogs from "@/components/page/blog/Blogs"
import { geologica, alegreyna } from "@/lib/fonts"
import { Suspense } from "react"

import type { Metadata } from "next"

export const metadata: Metadata = {
    title: "About — Blog",
}

const page = () => {
    return (
        <div className="bg-[#f0f2f4] dark:bg-[#151718] min-h-screen px-4">
            <div className="max-w-xl w-full mx-auto pt-12 flex flex-col gap-8">

                <div className="text-center">
                    <h1 className={`${geologica.className} text-4xl font-bold dark:text-white mb-3`}>
                        Blog
                    </h1>
                    <p className={`${alegreyna.className} text-gray-700 dark:text-gray-300 text-2xl leading-relaxed`}>
                        Helpful tools, thoughtful articles and other findings from the web.
                    </p>
                </div>

                <Suspense fallback={<div className={`text-bg w-[100%] h-[200px] flex items-center justify-center text-2xl ${alegreyna.className}`}>Loading Blogs...</div>}>
                    <Blogs />
                </Suspense>

            </div>
        </div>
    )
}

export default page