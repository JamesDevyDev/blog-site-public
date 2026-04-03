import { geologica, alegreyna } from "@/lib/fonts"
import type { Metadata } from "next"
import { Skeleton } from "@/components/ui/skeleton"
import { Suspense } from "react"
import PhotosComponent from "@/components/page/photos/PhotosComponent"

export const metadata: Metadata = {
    title: "Photos — James",
}

const page = async () => {
    const res = await fetch('https://api.visitorbadge.io/api/visitors?path=github.com%2Fblog-jamestalamo.com/photos')
    // Site counter sa photos makikita ko kung ilan natingin

    return (
        <div className="bg-[#f0f2f4] dark:bg-[#151718] min-h-screen px-10">
            <div className="max-w-xl w-full mx-auto pt-10 flex flex-col gap-8 pb-16">

                <div className="text-center">
                    <h1 className={`${geologica.className} text-4xl font-bold dark:text-white mb-3`}>
                        Photos
                    </h1>
                    <p className={`${alegreyna.className} text-gray-700 dark:text-gray-300 text-2xl leading-relaxed`}>
                        Random Photos about what's happening in my life.
                    </p>
                </div>

                <Suspense fallback={
                    <div className="columns-2 gap-3">
                        {Array.from({ length: 10 }).map((_, i) => (
                            <div key={i} className="break-inside-avoid mb-3">
                                <Skeleton className="w-full rounded-xl h-[200px]" />
                            </div>
                        ))}
                    </div>
                }>
                    <PhotosComponent />
                </Suspense>

            </div>
        </div>
    )
}

export default page